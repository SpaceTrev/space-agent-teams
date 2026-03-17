// ============================================================
// GET /api/tasks/[id]/logs — SSE stream of task logs
// ============================================================

import { NextRequest } from 'next/server'
import { getSupabaseServerClient, getSupabaseAdminClient } from '@/lib/db'
import { requireAuth, toErrorResponse } from '@/lib/auth'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const encoder = new TextEncoder()
  const { id: taskId } = await params

  // Verify authentication
  let userId: string
  try {
    const user = await requireAuth(req)
    userId = user.id
  } catch (err) {
    const { message, statusCode } = toErrorResponse(err)
    return new Response(JSON.stringify({ error: message }), {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Verify task exists and user has access
  try {
    const supabase = await getSupabaseServerClient()
    const { data: task, error } = await supabase
      .from('tasks')
      .select('workspace_id')
      .eq('id', taskId)
      .single()

    if (error || !task) {
      return new Response(JSON.stringify({ error: 'Task not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  } catch {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Set up SSE stream
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()

  const sendEvent = async (event: string, data: unknown) => {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
    await writer.write(encoder.encode(payload))
  }

  const sendHeartbeat = async () => {
    await writer.write(encoder.encode(': heartbeat\n\n'))
  }

  // Start polling in the background
  ;(async () => {
    const adminSupabase = getSupabaseAdminClient()
    let lastLogId: string | null = null
    let pollCount = 0
    const MAX_POLLS = 600 // ~5 minutes at 500ms intervals
    const POLL_INTERVAL_MS = 500

    try {
      // Send initial existing logs
      const { data: existingLogs } = await adminSupabase
        .from('task_logs')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: true })

      if (existingLogs && existingLogs.length > 0) {
        for (const log of existingLogs) {
          await sendEvent('log', log)
          lastLogId = (log as { id: string }).id
        }
      }

      // Send current task status
      const { data: task } = await adminSupabase
        .from('tasks')
        .select('status, output, error_message')
        .eq('id', taskId)
        .single()

      if (task) {
        await sendEvent('status', task)

        // If task is already terminal, close the stream
        const terminalStatuses = ['completed', 'failed', 'canceled']
        if (terminalStatuses.includes((task as { status: string }).status)) {
          await sendEvent('done', { task_id: taskId, status: (task as { status: string }).status })
          await writer.close()
          return
        }
      }

      // Poll for new logs
      while (pollCount < MAX_POLLS) {
        await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS))
        pollCount++

        // Send heartbeat every 10 polls
        if (pollCount % 10 === 0) {
          await sendHeartbeat()
        }

        // Fetch new logs since last seen
        let logsQuery = adminSupabase
          .from('task_logs')
          .select('*')
          .eq('task_id', taskId)
          .order('created_at', { ascending: true })

        if (lastLogId) {
          // Fetch logs created after the last log's created_at
          const { data: lastLog } = await adminSupabase
            .from('task_logs')
            .select('created_at')
            .eq('id', lastLogId)
            .single()

          if (lastLog) {
            logsQuery = logsQuery.gt('created_at', (lastLog as { created_at: string }).created_at)
          }
        }

        const { data: newLogs } = await logsQuery

        if (newLogs && newLogs.length > 0) {
          for (const log of newLogs) {
            await sendEvent('log', log)
            lastLogId = (log as { id: string }).id
          }
        }

        // Check task status
        const { data: currentTask } = await adminSupabase
          .from('tasks')
          .select('status, output, error_message')
          .eq('id', taskId)
          .single()

        if (currentTask) {
          await sendEvent('status', currentTask)

          const terminalStatuses = ['completed', 'failed', 'canceled']
          if (terminalStatuses.includes((currentTask as { status: string }).status)) {
            await sendEvent('done', {
              task_id: taskId,
              status: (currentTask as { status: string }).status,
            })
            break
          }
        }
      }

      // Timeout reached
      if (pollCount >= MAX_POLLS) {
        await sendEvent('timeout', { task_id: taskId, message: 'Log stream timed out' })
      }
    } catch (err) {
      try {
        await sendEvent('error', {
          message: err instanceof Error ? err.message : 'Stream error',
        })
      } catch {
        // Writer may be closed
      }
    } finally {
      try {
        await writer.close()
      } catch {
        // Already closed
      }
    }
  })()

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
