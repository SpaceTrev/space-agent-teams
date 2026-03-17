// ============================================================
// GET /api/billing/usage?workspace_id=xxx
// Returns usage events and cost summary for a workspace
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

    // Date range (default: current month)
    const now = new Date()
    const defaultFrom = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const defaultTo = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()

    const from = params.get('from') ?? defaultFrom
    const to = params.get('to') ?? defaultTo

    // Pagination
    const page = parseInt(params.get('page') ?? '1', 10)
    const perPage = Math.min(parseInt(params.get('per_page') ?? '50', 10), 200)
    const offset = (page - 1) * perPage

    // Fetch usage events
    const { data: events, error: eventsError } = await supabase
      .from('usage_events')
      .select('*')
      .eq('workspace_id', workspaceId)
      .gte('recorded_at', from)
      .lte('recorded_at', to)
      .order('recorded_at', { ascending: false })
      .range(offset, offset + perPage - 1)

    if (eventsError) {
      return NextResponse.json({ error: eventsError.message }, { status: 500 })
    }

    // Aggregate totals
    const { data: allEvents } = await supabase
      .from('usage_events')
      .select('event_type, quantity, cost_usd, model, provider')
      .eq('workspace_id', workspaceId)
      .gte('recorded_at', from)
      .lte('recorded_at', to)

    const summary = {
      total_cost_usd: 0,
      total_tokens: 0,
      total_compute_seconds: 0,
      by_event_type: {} as Record<string, { quantity: number; cost_usd: number; count: number }>,
      by_model: {} as Record<string, { quantity: number; cost_usd: number; count: number }>,
      by_provider: {} as Record<string, { quantity: number; cost_usd: number; count: number }>,
    }

    for (const event of allEvents ?? []) {
      const e = event as {
        event_type: string;
        quantity: number;
        cost_usd: number;
        model: string | null;
        provider: string | null;
      }

      summary.total_cost_usd += e.cost_usd ?? 0
      if (e.event_type === 'llm_tokens') summary.total_tokens += e.quantity ?? 0
      if (e.event_type === 'compute_seconds') summary.total_compute_seconds += e.quantity ?? 0

      // By event type
      if (!summary.by_event_type[e.event_type]) {
        summary.by_event_type[e.event_type] = { quantity: 0, cost_usd: 0, count: 0 }
      }
      summary.by_event_type[e.event_type].quantity += e.quantity ?? 0
      summary.by_event_type[e.event_type].cost_usd += e.cost_usd ?? 0
      summary.by_event_type[e.event_type].count += 1

      // By model
      if (e.model) {
        if (!summary.by_model[e.model]) {
          summary.by_model[e.model] = { quantity: 0, cost_usd: 0, count: 0 }
        }
        summary.by_model[e.model].quantity += e.quantity ?? 0
        summary.by_model[e.model].cost_usd += e.cost_usd ?? 0
        summary.by_model[e.model].count += 1
      }

      // By provider
      if (e.provider) {
        if (!summary.by_provider[e.provider]) {
          summary.by_provider[e.provider] = { quantity: 0, cost_usd: 0, count: 0 }
        }
        summary.by_provider[e.provider].quantity += e.quantity ?? 0
        summary.by_provider[e.provider].cost_usd += e.cost_usd ?? 0
        summary.by_provider[e.provider].count += 1
      }
    }

    return NextResponse.json({
      events,
      summary,
      period: { from, to },
      pagination: {
        page,
        per_page: perPage,
        total: allEvents?.length ?? 0,
      },
    })
  } catch (err) {
    const { message, statusCode } = toErrorResponse(err)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}
