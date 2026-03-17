// ============================================================
// GET  /api/tasks?workspace_id=xxx  — list tasks with filters
// POST /api/tasks                   — create task and queue it
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/db'
import { requireAuth, requireWorkspaceAccessById, toErrorResponse } from '@/lib/auth'
import { addTask } from '@/lib/queue'

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    const params = req.nextUrl.searchParams

    const workspaceId = params.get('workspace_id')
    if (!workspaceId) {
      return NextResponse.json({ error: 'workspace_id is required' }, { status: 400 })
    }

    await requireWorkspaceAccessById(workspaceId, user.id, 'viewer')

    const supabase = await getSupabaseServerClient()

    let query = supabase
      .from('tasks')
      .select('*, agent:agents(id, name, type), sprint:sprints(id, name)')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })

    // Optional filters
    const status = params.get('status')
    if (status) query = query.eq('status', status)

    const agentId = params.get('agent_id')
    if (agentId) query = query.eq('agent_id', agentId)

    const sprintId = params.get('sprint_id')
    if (sprintId) query = query.eq('sprint_id', sprintId)

    const priority = params.get('priority')
    if (priority) query = query.eq('priority', priority)

    // Pagination
    const page = parseInt(params.get('page') ?? '1', 10)
    const perPage = Math.min(parseInt(params.get('per_page') ?? '25', 10), 100)
    const from = (page - 1) * perPage
    query = query.range(from, from + perPage - 1)

    const { data: tasks, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      tasks,
      pagination: {
        page,
        per_page: perPage,
        total: count ?? tasks?.length ?? 0,
      },
    })
  } catch (err) {
    const { message, statusCode } = toErrorResponse(err)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    const body = await req.json()

    const {
      workspace_id,
      title,
      description,
      agent_id,
      sprint_id,
      priority,
      input,
      depends_on,
      tags,
      metadata,
      estimated_duration_seconds,
      auto_run,
    } = body

    if (!workspace_id || !title) {
      return NextResponse.json({ error: 'workspace_id and title are required' }, { status: 400 })
    }

    await requireWorkspaceAccessById(workspace_id, user.id, 'developer')

    const supabase = await getSupabaseServerClient()

    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        workspace_id,
        title,
        description: description ?? '',
        agent_id: agent_id ?? null,
        sprint_id: sprint_id ?? null,
        status: 'pending',
        priority: priority ?? 'normal',
        input: input ?? {},
        output: null,
        error_message: null,
        retry_count: 0,
        tokens_input: 0,
        tokens_output: 0,
        cost_usd: 0,
        depends_on: depends_on ?? [],
        tags: tags ?? [],
        metadata: metadata ?? {},
        estimated_duration_seconds: estimated_duration_seconds ?? null,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const taskId = (task as { id: string }).id

    // Add to queue if auto_run is not explicitly false
    if (auto_run !== false && agent_id) {
      await supabase
        .from('tasks')
        .update({
          status: 'queued',
          queued_at: new Date().toISOString(),
        })
        .eq('id', taskId)

      addTask(taskId)
    }

    return NextResponse.json({ task }, { status: 201 })
  } catch (err) {
    const { message, statusCode } = toErrorResponse(err)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}
