// ============================================================
// GET  /api/sessions?workspace_id=xxx  — list sessions
// POST /api/sessions                   — create and run a session
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/db'
import { requireAuth, requireWorkspaceAccessById, toErrorResponse } from '@/lib/auth'
import { runSession } from '@/lib/sessions'
import type { AgentSessionType } from '@/lib/sessions'

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
      .from('sessions')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })

    const sessionType = params.get('session_type')
    if (sessionType) query = query.eq('session_type', sessionType)

    const sprintId = params.get('sprint_id')
    if (sprintId) query = query.eq('sprint_id', sprintId)

    // Pagination
    const page = parseInt(params.get('page') ?? '1', 10)
    const perPage = Math.min(parseInt(params.get('per_page') ?? '25', 10), 100)
    const from = (page - 1) * perPage
    query = query.range(from, from + perPage - 1)

    const { data: sessions, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ sessions })
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
      session_type,
      participants,
      context,
      sprint_id,
    } = body

    if (!workspace_id || !session_type || !participants?.length) {
      return NextResponse.json(
        { error: 'workspace_id, session_type, and participants are required' },
        { status: 400 }
      )
    }

    const validTypes: AgentSessionType[] = ['standup', 'planning', 'refinement', 'retro', 'strategy']
    if (!validTypes.includes(session_type)) {
      return NextResponse.json(
        { error: `Invalid session_type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    await requireWorkspaceAccessById(workspace_id, user.id, 'developer')

    // Run the session (this may take a while, models are called)
    const result = await runSession({
      workspaceId: workspace_id,
      sessionType: session_type as AgentSessionType,
      participants,
      context: context ?? {},
      sprintId: sprint_id ?? undefined,
      createdBy: user.id,
    })

    return NextResponse.json({ session: result }, { status: 201 })
  } catch (err) {
    const { message, statusCode } = toErrorResponse(err)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}
