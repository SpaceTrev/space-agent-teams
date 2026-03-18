import Link from 'next/link'
import { clsx } from 'clsx'
import { Plus, Bot, CheckCircle, Clock } from 'lucide-react'
import { Badge } from '../../../../components/shared/badge'

const agents = [
  { id: '1', name: 'Aria', role: 'Senior Backend Engineer', type: 'worker', status: 'running', department: 'Engineering', model: 'anthropic:claude-3-5-sonnet-20241022', tasksCompleted: 142, createdAt: '2025-11-01' },
  { id: '2', name: 'Dev-1', role: 'Backend Developer', type: 'worker', status: 'idle', department: 'Engineering', model: 'anthropic:claude-3-haiku-20240307', tasksCompleted: 89, createdAt: '2025-11-05' },
  { id: '3', name: 'Dev-2', role: 'API Specialist', type: 'specialist', status: 'running', department: 'Engineering', model: 'groq:llama-3.1-70b-versatile', tasksCompleted: 64, createdAt: '2025-11-10' },
  { id: '4', name: 'QA-Bot', role: 'QA Automation', type: 'specialist', status: 'running', department: 'Engineering', model: 'gemini:gemini-1.5-pro', tasksCompleted: 211, createdAt: '2025-11-12' },
  { id: '5', name: 'Blake', role: 'Content Writer', type: 'worker', status: 'running', department: 'Marketing', model: 'anthropic:claude-3-5-sonnet-20241022', tasksCompleted: 78, createdAt: '2025-12-01' },
  { id: '6', name: 'Scout', role: 'Market Research', type: 'specialist', status: 'paused', department: 'Marketing', model: 'perplexity:llama-3.1-sonar-large-128k-online', tasksCompleted: 45, createdAt: '2025-12-10' },
  { id: '7', name: 'Casey', role: 'Support Specialist', type: 'worker', status: 'running', department: 'Support', model: 'groq:llama-3.1-8b-instant', tasksCompleted: 512, createdAt: '2025-10-15' },
  { id: '8', name: 'Orchestrator', role: 'Task Orchestrator', type: 'orchestrator', status: 'idle', department: 'Engineering', model: 'anthropic:claude-3-5-sonnet-20241022', tasksCompleted: 28, createdAt: '2025-12-20' },
]

const statusMap: Record<string, { variant: 'green' | 'gray' | 'yellow' | 'blue' | 'red' | 'orange'; label: string }> = {
  running: { variant: 'green', label: 'Running' },
  idle: { variant: 'gray', label: 'Idle' },
  paused: { variant: 'orange', label: 'Paused' },
  error: { variant: 'red', label: 'Error' },
  archived: { variant: 'gray', label: 'Archived' },
}

const typeColors: Record<string, string> = {
  worker: 'text-blue-400 bg-blue-500/10 border border-blue-500/20',
  orchestrator: 'text-purple-400 bg-purple-500/10 border border-purple-500/20',
  specialist: 'text-champagne-500 bg-champagne-500/10 border border-champagne-500/20',
  reviewer: 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20',
}

function modelShortName(model: string): string {
  const parts = model.split(':')
  const name = parts[parts.length - 1]
  return name.replace(/-\d{8}$/, '').slice(0, 28)
}

export default async function AgentsPage({ params }: { params: Promise<{ workspace: string }> }) {
  const { workspace } = await params

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-white">Agents</h1>
          <p className="text-sm text-slate-400 font-light mt-1">{agents.length} agents in this workspace</p>
        </div>
        <Link
          href={`/${workspace}/agents/new`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-champagne-500 hover:bg-champagne-400 text-obsidian-900 text-sm font-semibold rounded-lg transition-colors shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Create Agent
        </Link>
      </div>

      {/* Agents table */}
      <div className="bg-obsidian-800 border border-obsidian-700 rounded-xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-[1fr_140px_140px_100px_100px] text-xs font-mono font-semibold text-champagne-600/70 uppercase tracking-widest px-5 py-3 border-b border-obsidian-700 bg-obsidian-900/50">
          <span>Agent</span>
          <span>Type</span>
          <span>Model</span>
          <span>Tasks</span>
          <span>Status</span>
        </div>
        <div className="divide-y divide-obsidian-700/50">
          {agents.map((agent) => {
            const statusConfig = statusMap[agent.status] || { variant: 'gray' as const, label: agent.status }
            return (
              <Link
                key={agent.id}
                href={`/${workspace}/agents/${agent.id}`}
                className="grid grid-cols-[1fr_140px_140px_100px_100px] items-center px-5 py-4 hover:bg-obsidian-700 transition-colors group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-obsidian-900 border border-obsidian-700 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-champagne-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{agent.name}</p>
                    <p className="text-xs text-slate-400 font-light truncate">{agent.role}</p>
                  </div>
                </div>
                <span className={clsx('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium w-fit', typeColors[agent.type])}>
                  {agent.type}
                </span>
                <span className="text-xs text-slate-400 font-mono truncate">{modelShortName(agent.model)}</span>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-light">
                  <CheckCircle className="w-3.5 h-3.5 text-slate-600" />
                  {agent.tasksCompleted}
                </div>
                <Badge variant={statusConfig.variant} dot size="sm">
                  {statusConfig.label}
                </Badge>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
