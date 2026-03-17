// ============================================================
// GET  /api/agents?workspace_id=xxx  — list agents
// POST /api/agents                   — create agent
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/db'
import { requireAuth, requireWorkspaceAccessById, toErrorResponse } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    const workspaceId = req.nextUrl.searchParams.get('workspace_id')

    if (!workspaceId) {
      return NextResponse.json({ error: 'workspace_id is required' }, { status: 400 })
    }

    // Verify access
    await requireWorkspaceAccessById(workspaceId, user.id, 'viewer')

    const supabase = await getSupabaseServerClient()

    let query = supabase
      .from('agents')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })

    // Optional filters
    const status = req.nextUrl.searchParams.get('status')
    if (status) query = query.eq('status', status)

    const type = req.nextUrl.searchParams.get('type')
    if (type) query = query.eq('type', type)

    const { data: agents, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ agents })
  } catch (err) {
    const { message, statusCode } = toErrorResponse(err)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    const body = await req.json()

    const { workspace_id, name, description, type, model, system_prompt, tools, config } = body

    if (!workspace_id || !name) {
      return NextResponse.json({ error: 'workspace_id and name are required' }, { status: 400 })
    }

    // Verify access
    await requireWorkspaceAccessById(workspace_id, user.id, 'developer')

    const supabase = await getSupabaseServerClient()

    const { data: agent, error } = await supabase
      .from('agents')
      .insert({
        workspace_id,
        name,
        description: description ?? null,
        type: type ?? 'worker',
        status: 'idle',
        model: model ?? null,
        system_prompt: system_prompt ?? '',
        tools: tools ?? [],
        config: config ?? {
          max_iterations: 5,
          temperature: 0.7,
          max_tokens: 4096,
          retry_on_error: true,
          max_retries: 3,
          retry_delay_seconds: 2,
          enable_memory: false,
          memory_top_k: 5,
          stream_output: false,
          timeout_seconds: 300,
        },
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ agent }, { status: 201 })
  } catch (err) {
    const { message, statusCode } = toErrorResponse(err)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}
