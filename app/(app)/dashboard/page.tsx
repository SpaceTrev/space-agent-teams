import Link from 'next/link'
import { clsx } from 'clsx'
import { Bot, Zap, DollarSign, Activity, TrendingUp, Plus, ArrowRight } from 'lucide-react'

// Mock data - in production fetched server-side
const workspaces = [
  {
    id: '1',
    name: 'Engineering',
    slug: 'engineering',
    description: 'Backend and infrastructure automation',
    agentCount: 8,
    activeCount: 5,
    currentSprint: 'Sprint 4 — API v2 Migration',
    costThisMonth: 124.5,
    tasksThisMonth: 1240,
    status: 'active' as const,
  },
  {
    id: '2',
    name: 'Marketing',
    slug: 'marketing',
    description: 'Content generation and campaign management',
    agentCount: 4,
    activeCount: 2,
    currentSprint: 'Q1 Content Sprint',
    costThisMonth: 47.2,
    tasksThisMonth: 380,
    status: 'active' as const,
  },
  {
    id: '3',
    name: 'Support',
    slug: 'support',
    description: 'Customer support ticket triage',
    agentCount: 6,
    activeCount: 6,
    currentSprint: null,
    costThisMonth: 89.15,
    tasksThisMonth: 920,
    status: 'active' as const,
  },
  {
    id: '4',
    name: 'Data Science',
    slug: 'data-science',
    description: 'Data analysis and reporting pipelines',
    agentCount: 3,
    activeCount: 0,
    currentSprint: null,
    costThisMonth: 12.4,
    tasksThisMonth: 85,
    status: 'paused' as const,
  },
]

const recentActivity = [
  { id: '1', workspace: 'Engineering', agent: 'Aria', task: 'Refactor authentication middleware', status: 'completed', time: '2m ago', cost: 0.042 },
  { id: '2', workspace: 'Marketing', agent: 'Blake', task: 'Generate Q1 blog post outline', status: 'running', time: '5m ago', cost: 0.018 },
  { id: '3', workspace: 'Support', agent: 'Casey', task: 'Classify 50 support tickets', status: 'completed', time: '8m ago', cost: 0.031 },
  { id: '4', workspace: 'Engineering', agent: 'Dev-1', task: 'Write unit tests for UserService', status: 'completed', time: '12m ago', cost: 0.067 },
  { id: '5', workspace: 'Marketing', agent: 'Blake', task: 'Draft email campaign copy', status: 'needs-review', time: '18m ago', cost: 0.025 },
  { id: '6', workspace: 'Support', agent: 'Casey', task: 'Escalate critical tickets', status: 'failed', time: '22m ago', cost: 0.009 },
]

const totalCost = workspaces.reduce((sum, ws) => sum + ws.costThisMonth, 0)
const totalAgents = workspaces.reduce((sum, ws) => sum + ws.agentCount, 0)
const totalActive = workspaces.reduce((sum, ws) => sum + ws.activeCount, 0)
const totalTasks = workspaces.reduce((sum, ws) => sum + ws.tasksThisMonth, 0)

const statusColors: Record<string, string> = {
  completed: 'text-green-400',
  running: 'text-blue-400',
  'needs-review': 'text-yellow-400',
  failed: 'text-red-400',
}

const statusDots: Record<string, string> = {
  completed: 'bg-green-400',
  running: 'bg-blue-400 animate-pulse',
  'needs-review': 'bg-yellow-400',
  failed: 'bg-red-400',
}

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">All workspaces overview</p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Workspace
        </Link>
      </div>

      {/* Global stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Agents', value: totalAgents, icon: Bot, color: 'text-brand-400', bg: 'bg-brand-500/10' },
          { label: 'Active Now', value: totalActive, icon: Activity, color: 'text-green-400', bg: 'bg-green-500/10', pulse: true },
          { label: 'Tasks This Month', value: totalTasks.toLocaleString(), icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'Cost This Month', value: `$${totalCost.toFixed(2)}`, icon: DollarSign, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center mb-3', stat.bg)}>
                <Icon className={clsx('w-4 h-4', stat.color)} />
              </div>
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Workspace grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Workspaces</h2>
          <span className="text-xs text-gray-600">{workspaces.length} total</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {workspaces.map((ws) => (
            <Link
              key={ws.id}
              href={`/${ws.slug}`}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 hover:bg-gray-900/80 transition-all group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-sm font-bold text-gray-400 group-hover:border-gray-600 transition-colors">
                    {ws.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{ws.name}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[160px]">{ws.description}</p>
                  </div>
                </div>
                <div className={clsx(
                  'flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium',
                  ws.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-gray-700 text-gray-500'
                )}>
                  <span className={clsx('w-1.5 h-1.5 rounded-full', ws.status === 'active' ? 'bg-green-400' : 'bg-gray-500')} />
                  {ws.status.charAt(0).toUpperCase() + ws.status.slice(1)}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-800 rounded-lg p-2.5">
                  <p className="text-xs text-gray-500 mb-0.5">Agents</p>
                  <p className="text-sm font-semibold text-white">
                    {ws.activeCount} <span className="text-gray-500 font-normal">/ {ws.agentCount} active</span>
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-2.5">
                  <p className="text-xs text-gray-500 mb-0.5">Cost this month</p>
                  <p className="text-sm font-semibold text-yellow-400 font-mono">${ws.costThisMonth.toFixed(2)}</p>
                </div>
              </div>

              {/* Sprint */}
              {ws.currentSprint ? (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <TrendingUp className="w-3.5 h-3.5 text-brand-400" />
                  <span className="truncate">{ws.currentSprint}</span>
                </div>
              ) : (
                <p className="text-xs text-gray-700">No active sprint</p>
              )}

              <div className="flex items-center justify-end mt-3">
                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
              </div>
            </Link>
          ))}

          {/* Add workspace card */}
          <Link
            href="/dashboard"
            className="bg-gray-900 border border-dashed border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors flex flex-col items-center justify-center gap-3 min-h-[180px] text-gray-600 hover:text-gray-400"
          >
            <div className="w-10 h-10 rounded-xl border-2 border-dashed border-current flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium">Add workspace</p>
          </Link>
        </div>
      </div>

      {/* Activity feed */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Recent Activity</h2>
          <span className="text-xs text-gray-600">All workspaces</span>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="divide-y divide-gray-800">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-800/50 transition-colors">
                <div className={clsx('w-2 h-2 rounded-full flex-shrink-0', statusDots[item.status])} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200 truncate">{item.task}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.workspace} &middot; {item.agent}
                  </p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0 text-xs">
                  <span className={clsx('font-medium', statusColors[item.status])}>
                    {item.status.replace('-', ' ')}
                  </span>
                  <span className="text-gray-600 font-mono">${item.cost.toFixed(3)}</span>
                  <span className="text-gray-600">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
