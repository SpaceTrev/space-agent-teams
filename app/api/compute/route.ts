// ============================================================
// GET  /api/compute?workspace_id=xxx  — list compute servers
// POST /api/compute                   — provision new server
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/db'
import { requireAuth, requireWorkspaceAccessById, toErrorResponse } from '@/lib/auth'
import { provisionServer, estimateComputeCostPerHour } from '@/lib/compute'
import type { ComputeProvider } from '@/lib/types'

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    const workspaceId = req.nextUrl.searchParams.get('workspace_id')

    if (!workspaceId) {
      return NextResponse.json({ error: 'workspace_id is required' }, { status: 400 })
    }

    await requireWorkspaceAccessById(workspaceId, user.id, 'viewer')

    const supabase = await getSupabaseServerClient()

    const { data: servers, error } = await supabase
      .from('compute_servers')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ servers })
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
      name,
      provider = 'railway',
      region,
      cpu = 1,
      memory_mb = 512,
      disk_gb = 10,
      image,
      env,
    } = body

    if (!workspace_id || !name) {
      return NextResponse.json({ error: 'workspace_id and name are required' }, { status: 400 })
    }

    const validProviders: ComputeProvider[] = ['railway', 'fly', 'custom']
    if (!validProviders.includes(provider)) {
      return NextResponse.json(
        { error: `Invalid provider. Must be one of: ${validProviders.join(', ')}` },
        { status: 400 }
      )
    }

    await requireWorkspaceAccessById(workspace_id, user.id, 'admin')

    const supabase = await getSupabaseServerClient()

    // Provision the server
    const provisionResult = await provisionServer(provider, {
      name,
      workspaceId: workspace_id,
      region,
      cpu,
      memoryMb: memory_mb,
      diskGb: disk_gb,
      image,
      env,
    })

    const costPerHour = estimateComputeCostPerHour(provider, cpu, memory_mb)

    // Record the server in DB
    const { data: server, error } = await supabase
      .from('compute_servers')
      .insert({
        workspace_id,
        name,
        provider,
        status: provisionResult.status,
        provider_server_id: provisionResult.provider_server_id,
        region: provisionResult.region,
        cpu,
        memory_mb,
        disk_gb,
        public_url: provisionResult.public_url,
        internal_url: provisionResult.internal_url,
        provider_metadata: provisionResult.provider_metadata,
        cost_per_hour_usd: costPerHour,
        started_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ server }, { status: 201 })
  } catch (err) {
    const { message, statusCode } = toErrorResponse(err)
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}
