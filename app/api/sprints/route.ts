// ============================================================
// GET  /api/sprints?workspace_id=xxx  — list sprints
// POST /api/sprints                   — create sprint
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/db'
import { requireAuth, requireWorkspaceAccessById, toErrorResponse } from '@/lib/auth'

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
      .from('sprints')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })

    const status = params.get('status')
    if (status) query = query.eq('status', status)

    const { data: sprints, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Attach task stats for each sprint
    const sprintIds = (sprints ?? []).map((s: { id: string }) => s.id)

    let sprintStats: Record<string, unknown> = {}
    if (sprintIds.length > 0) {
      const { data: tasks } = await supabase
        .from('tasks')
        .select('sprint_id, status, tokens_input, tokens_output, cost_usd, actual_duration_seconds')
        .in('sprint_id', sprintIds)

      if (tasks) {
        for (const sprintId of sprintIds) {
          const sprintTasks = tasks.filter((t: { sprint_id: string }) => t.sprint_id === sprintId)
          sprintStats[sprintId] = {
            total_tasks: sprintTasks.length,
            completed_tasks: sprintTasks.filter((t: { status: string }) => t.status === 'completed').length,
            failed_tasks: sprintTasks.filter((t: { status: string }) => t.status === 'failed').length,
            in_progress_tasks: sprintTasks.filter((t: { status: string }) => t.status === 'running').length,
            total_tokens_used: sprintTasks.reduce(
              (sum: number, t: { tokens_input: number; tokens_output: number }) =>
                sum + (t.tokens_input ?? 0) + (t.tokens_output ?? 0),
              0
            ),
            total_cost_usd: sprintTasks.reduce(
              (sum: number, t: { cost_usd: number }) => sum + (t.cost_usd ?? 0),
              0
            ),
            avg_task_duration_seconds:
              sprintTasks.filter((t: { actual_duration_seconds: number | null }) => t.actual_duration_seconds).length > 0
                ? sprintTasks.reduce(
                    (sum: number, t: { actual_duration_seconds: number | null }) =>
                      sum + (t.actual_duration_seconds ?? 0),
                    0
                  ) /
                  sprintTasks.filter((t: { actual_duration_seconds: number | null }) => t.actual_duration_seconds)
                    .length
                : 0,
          }
        }
      }
    }

    const sprintsWithStats = (sprints ?? []).map((sprint: { id: string }) => ({
      ...sprint,
      stats: sprintStats[sprint.id] ?? null,
    }))

    return NextResponse.json({ sprints: sprintsWithStats })
  } catch (err) {
    const { message, statusCode } = toErrorResponse(err)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    const body = await req.json()

    const { workspace_id, name, description, goal, starts_at, ends_at } = body

    if (!workspace_id || !name) {
      return NextResponse.json({ error: 'workspace_id and name are required' }, { status: 400 })
    }

    await requireWorkspaceAccessById(workspace_id, user.id, 'developer')

    const supabase = await getSupabaseServerClient()

    const { data: sprint, error } = await supabase
      .from('sprints')
      .insert({
        workspace_id,
        name,
        description: description ?? null,
        status: 'planning',
        goal: goal ?? null,
        starts_at: starts_at ?? null,
        ends_at: ends_at ?? null,
        completed_at: null,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ sprint }, { status: 201 })
  } catch (err) {
    const { message, statusCode } = toErrorResponse(err)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}
