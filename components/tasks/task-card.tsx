'use client'

import { clsx } from 'clsx'
import { Clock, DollarSign, User, Zap } from 'lucide-react'
import { TaskStatusBadge } from '../shared/badge'
import type { TaskStatus, TaskPriority } from '../../lib/types'
import { formatDistanceToNow } from 'date-fns'

interface TaskCardProps {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  agentName?: string | null
  createdAt: string
  costUsd?: number
  onClick?: () => void
}

const priorityConfig: Record<TaskPriority, { color: string; bg: string; label: string }> = {
  low: { color: 'text-slate-400', bg: 'bg-slate-500/10', label: 'Low' },
  normal: { color: 'text-indigo-400', bg: 'bg-indigo-500/10', label: 'Normal' },
  high: { color: 'text-champagne-400', bg: 'bg-champagne-500/10', label: 'High' },
  critical: { color: 'text-red-400', bg: 'bg-red-500/10', label: 'Critical' },
}

export function TaskCard({
  id,
  title,
  description,
  status,
  priority,
  agentName,
  createdAt,
  costUsd,
  onClick,
}: TaskCardProps) {
  const pConfig = priorityConfig[priority]
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true })

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={clsx(
        'bg-obsidian-800 border border-obsidian-700 rounded-xl p-4 flex flex-col gap-3',
        'transition-all duration-200 group',
        onClick && 'cursor-pointer hover:border-obsidian-600 hover:bg-obsidian-800/80 hover:shadow-lg'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white line-clamp-2">{title}</p>
          {description && (
            <p className="text-xs text-slate-400 font-light mt-1.5 line-clamp-1">{description}</p>
          )}
        </div>
        <TaskStatusBadge status={status} />
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 font-light">
        {agentName && (
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate max-w-[120px] text-white">{agentName}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Clock className="w-3h h-3 text-slate-400" />
          <span>{timeAgo}</span>
        </div>
        {costUsd != null && costUsd > 0 && (
          <div className="flex items-center gap-1.5 ml-auto text-champagne-500/80">
            <DollarSign className="w-3.5 h-3.5" />
            <span className="font-mono">${costUsd.toFixed(4)}</span>
          </div>
        )}
      </div>

      {/* Priority indicator */}
      <div className="flex items-center gap-1.5 pt-3 mt-1 border-t border-obsidian-700/60">
        <div className={clsx('w-5 h-5 rounded flex items-center justify-center', pConfig.bg)}>
          <Zap className={clsx('w-3 h-3', pConfig.color)} />
        </div>
        <span className={clsx('text-xs font-mono tracking-wide uppercase', pConfig.color)}>{pConfig.label} priority</span>
      </div>
    </div>
  )
}
