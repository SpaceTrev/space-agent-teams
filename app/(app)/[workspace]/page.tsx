import { FleetGrid } from '../../../components/fleet/fleet-grid'
import { UsageMeter } from '../../../components/billing/usage-meter'
import { Server, Cpu, Activity, Plus } from 'lucide-react'
import { clsx } from 'clsx'
import Link from 'next/link'

// Mock data — in production fetched via server components
const mockAgents = [
  { id: '1', name: 'Aria', role: 'Senior Backend Engineer', status: 'working' as const, currentTask: 'Refactoring auth middleware to support OAuth 2.0 flows', model: 'anthropic:claude-3-5-sonnet-20241022', tasksCompleted: 142, department: 'Engineering' },
  { id: '2', name: 'Dev-1', role: 'Backend Developer', status: 'idle' as const, currentTask: null, model: 'anthropic:claude-3-haiku-20240307', tasksCompleted: 89, department: 'Engineering' },
  { id: '3', name: 'Dev-2', role: 'API Specialist', status: 'working' as const, currentTask: 'Writing OpenAPI spec for payment service', model: 'groq:llama-3.1-70b-versatile', tasksCompleted: 64, department: 'Engineering' },
  { id: '4', name: 'QA-Bot', role: 'QA Automation', status: 'in-session' as const, currentTask: 'Running integration test suite', model: 'gemini:gemini-1.5-pro', tasksCompleted: 211, department: 'Engineering' },
  { id: '5', name: 'Blake', role: 'Content Writer', status: 'working' as const, currentTask: 'Drafting Q1 marketing email campaign', model: 'anthropic:claude-3-5-sonnet-20241022', tasksCompleted: 78, department: 'Marketing' },
  { id: '6', name: 'Scout', role: 'Market Research', status: 'needs-review' as const, currentTask: 'Competitor analysis report pending approval', model: 'perplexity:llama-3.1-sonar-large-128k-online', tasksCompleted: 45, department: 'Marketing' },
  { id: '7', name: 'Casey', role: 'Support Specialist', status: 'working' as const, currentTask: 'Triaging 23 new support tickets', model: 'groq:llama-3.1-8b-instant', tasksCompleted: 512, department: 'Support' },
  { id: '8', name: 'Triage-1', role: 'Ticket Router', status: 'working' as const, currentTask: 'Routing tickets to appropriate queues', model: 'groq:llama-3.1-8b-instant', tasksCompleted: 389, department: 'Support' },
]

const mockServers = [
  { id: '1', name: 'compute-01', provider: 'Railway', status: 'running', cpu: 4, memoryMb: 8192, costPerHour: 0.12, region: 'us-east-1' },
  { id: '2', name: 'compute-02', provider: 'Railway', status: 'running', cpu: 2, memoryMb: 4096, costPerHour: 0.06, region: 'us-east-1' },
]

const statusDotColor: Record<string, string> = {
  running: 'bg-green-400 animate-pulse',
  stopped: 'bg-gray-500',
  provisioning: 'bg-yellow-400 animate-pulse',
  error: 'bg-red-400',
}

export default async function WorkspacePage({ params }: { params: Promise<{ workspace: string }> }) {
  const { workspace } = await params
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white capitalize">
            {workspace.replace(/-/g, ' ')} Fleet
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {mockAgents.filter((a) => a.status === 'working' || a.status === 'in-session').length} agents active
          </p>
        </div>
        <Link
          href={`/${workspace}/agents/new`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Agent
        </Link>
      </div>

      {/* Agent fleet */}
      <div className="mb-10">
        <FleetGrid
          agents={mockAgents}
          onAgentClick={(id) => console.log('Agent clicked:', id)}
        />
      </div>

      {/* Compute servers */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Compute Servers</h2>
          <Link href={`/${workspace}/compute`} className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
            Manage
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockServers.map((server) => (
            <div key={server.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <Server className="w-5 h-5 text-gray-500" />
                    <span className={clsx(
                      'absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-gray-900',
                      statusDotColor[server.status]
                    )} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{server.name}</p>
                    <p className="text-xs text-gray-500">{server.provider} &middot; {server.region}</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-yellow-400">${server.costPerHour}/hr</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  {server.cpu} vCPU
                </div>
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  {(server.memoryMb / 1024).toFixed(0)} GB RAM
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Usage meters */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Usage This Month</h2>
          <Link href={`/${workspace}/billing`} className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
            View billing
          </Link>
        </div>
        <UsageMeter
          tasksUsed={1240}
          tasksTotal={2000}
          tokensUsed={4_820_000}
          tokensTotal={null}
          costUsd={124.5}
          costBudget={200}
          computeHoursUsed={7.5}
          computeHoursTotal={10}
        />
      </div>
    </div>
  )
}
