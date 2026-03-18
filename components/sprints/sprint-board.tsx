'use client'

import { clsx } from 'clsx'
import { Calendar, CheckCircle2, XCircle, Clock, TrendingUp, DollarSign } from 'lucide-react'
import { Badge } from '../shared/badge'
import { TaskStatusBadge } from '../shared/badge'
import type { SprintStatus, TaskStatus, TaskPriority } from '../../lib/types'
import { formatDistanceToNow, format } from 'date-fns'

interface SprintTask {
  id: string
  title: string
  status: TaskStatus
  priority: TaskPriority
  agentName?: string | null
  costUsd?: number
}

interface SprintBoardProps {
  id: string
  name: string
  description?: string | null
  status: SprintStatus
  goal?: string | null
  startsAt?: string | null
  endsAt?: string | null
  completedAt?: string | null
  tasks?: SprintTask[]
  stats?: {
    totalTasks: number
    completedTasks: number
    failedTasks: number
    inProgressTasks: number
    totalTokensUsed: number
    totalCostUsd: number
    avgTaskDurationSeconds: number
  }
}

const sprintStatusMap: Record<SprintStatus, { variant: 'green' | 'blue' | 'yellow' | 'gray' | 'red'; label: string }> = {
  planning: { variant: 'gray', label: 'Planning' },
  active: { variant: 'green', label: 'Active' },
  paused: { variant: 'yellow', label: 'Paused' },
  completed: { variant: 'blue', label: 'Completed' },
  canceled: { variant: 'red', label: 'Canceled' },
}

export function SprintBoard({
  id,
  name,
  description,
  status,
  goal,
  startsAt,
  endsAt,
  tasks = [],
  stats,
}: SprintBoardProps) {
  const config = sprintStatusMap[status]
  const completedCount = stats?.completedTasks ?? tasks.filter((t) => t.status === 'completed').length
  const totalCount = stats?.totalTasks ?? tasks.length
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="bg-obsidian-800 border border-obsidian-700 rounded-xl overflow-hidden shadow-2xl transition-all hover:border-obsidian-600">
      {/* Header */}
      <div className="px-6 py-5 border-b border-obsidian-700/50">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-serif text-white truncate">{name}</h2>
              <Badge variant={config.variant} dot size="sm">{config.label}</Badge>
            </div>
            {description && <p className="text-sm text-slate-400 font-light max-w-2xl">{description}</p>}
            {goal && (
              <p className="text-xs text-slate-500 font-light mt-2.5">
                <span className="font-mono text-[10px] font-semibold text-champagne-600/70 uppercase tracking-widest mr-2">Goal:</span>
                {goal}
              </p>
            )}
          </div>
          {/* Dates */}
          <div className="flex flex-col items-end gap-1.5 text-xs text-slate-500 flex-shrink-0 font-light mt-1">
            {startsAt && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Started {format(new Date(startsAt), 'MMM d')}</span>
              </div>
            )}
            {endsAt && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Due {formatDistanceToNow(new Date(endsAt), { addSuffix: true })}</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {totalCount > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 font-light">Progress</span>
              <span className="text-xs font-mono text-slate-400">{progress}% — {completedCount}/{totalCount} tasks</span>
            </div>
            <div className="h-1.5 bg-obsidian-900 border border-obsidian-700/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-champagne-500 rounded-full transition-all duration-500 relative shadow-[0_0_10px_rgba(230,194,128,0.5)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Stats row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-obsidian-700/50 border-b border-obsidian-700/50 bg-obsidian-900/30">
          <div className="px-6 py-4 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-light">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/80" />
              Completed
            </div>
            <p className="text-2xl font-serif text-white">{stats.completedTasks}</p>
          </div>
          <div className="px-6 py-4 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-light">
              <XCircle className="w-3.5 h-3.5 text-red-400/80" />
              Failed
            </div>
            <p className="text-2xl font-serif text-white">{stats.failedTasks}</p>
          </div>
          <div className="px-6 py-4 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-light">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400/80" />
              Tokens Used
            </div>
            <p className="text-2xl font-serif tracking-wide text-white">
              {stats.totalTokensUsed >= 1_000_000
                ? `${(stats.totalTokensUsed / 1_000_000).toFixed(1)}M`
                : stats.totalTokensUsed >= 1000
                ? `${(stats.totalTokensUsed / 1000).toFixed(0)}K`
                : stats.totalTokensUsed.toString()}
            </p>
          </div>
          <div className="px-6 py-4 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-light">
              <DollarSign className="w-3.5 h-3.5 text-champagne-400/80" />
              Total Cost
            </div>
            <p className="text-2xl font-serif tracking-wide text-white">${stats.totalCostUsd.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* Task list */}
      <div className="divide-y divide-obsidian-700/50 bg-obsidian-800">
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-sm text-slate-500 font-light italic bg-obsidian-900/20">
            No tasks in this sprint
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-4 px-6 py-4 hover:bg-obsidian-700/50 transition-colors group">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-200 truncate font-medium group-hover:text-white transition-colors">{task.title}</p>
                {task.agentName && (
                  <p className="text-xs text-slate-500 font-light mt-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                    {task.agentName}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                {task.costUsd != null && task.costUsd > 0 && (
                  <span className="text-xs text-slate-500 font-mono">${task.costUsd.toFixed(4)}</span>
                )}
                <TaskStatusBadge status={task.status} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
