'use client'

import { clsx } from 'clsx'
import { Bot, Zap, CheckCircle, Clock } from 'lucide-react'
import { Badge } from '../shared/badge'

export type AgentDisplayStatus = 'working' | 'idle' | 'blocked' | 'in-session' | 'needs-review' | 'paused'

interface AgentCardProps {
  id: string
  name: string
  role: string
  status: AgentDisplayStatus
  currentTask?: string | null
  model: string
  tasksCompleted: number
  department?: string
  onClick?: () => void
}

const statusConfig: Record<
  AgentDisplayStatus,
  { dot: string; badge: 'green' | 'gray' | 'red' | 'blue' | 'yellow' | 'orange'; label: string }
> = {
  working: { dot: 'bg-emerald-400 animate-pulse', badge: 'green', label: 'Working' },
  idle: { dot: 'bg-slate-500', badge: 'gray', label: 'Idle' },
  blocked: { dot: 'bg-red-500', badge: 'red', label: 'Blocked' },
  'in-session': { dot: 'bg-indigo-400 animate-pulse', badge: 'blue', label: 'In Session' },
  'needs-review': { dot: 'bg-champagne-400', badge: 'yellow', label: 'Needs Review' },
  paused: { dot: 'bg-orange-400', badge: 'orange', label: 'Paused' },
}

function modelShortName(model: string): string {
  // e.g. "anthropic:claude-3-5-sonnet-20241022" -> "claude-3.5-sonnet"
  const parts = model.split(':')
  const name = parts[parts.length - 1]
  return name.replace(/-\d{8}$/, '').slice(0, 24)
}

export function AgentCard({
  id,
  name,
  role,
  status,
  currentTask,
  model,
  tasksCompleted,
  department,
  onClick,
}: AgentCardProps) {
  const config = statusConfig[status]

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={clsx(
        'bg-obsidian-800 border border-obsidian-700 rounded-xl p-4 flex flex-col gap-3',
        'transition-all duration-200',
        onClick && 'cursor-pointer hover:border-obsidian-600 hover:bg-obsidian-800/80 hover:shadow-xl'
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-lg bg-obsidian-900 border border-obsidian-700 flex items-center justify-center">
              <Bot className="w-5 h-5 text-champagne-500" />
            </div>
            {/* Status dot */}
            <span
              className={clsx(
                'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-obsidian-800',
                config.dot
              )}
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{name}</p>
            <p className="text-xs text-slate-400 font-light truncate">{role}</p>
          </div>
        </div>
        <Badge variant={config.badge} size="sm" dot>
          {config.label}
        </Badge>
      </div>

      {/* Current task */}
      <div className="min-h-[32px] mt-1">
        {currentTask ? (
          <div className="flex items-start gap-2">
            <Zap className="w-3.5 h-3.5 text-champagne-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 font-light line-clamp-2">{currentTask}</p>
          </div>
        ) : (
          <p className="text-xs text-slate-500 font-light italic">No active task</p>
        )}
      </div>

      {/* Footer stats */}
      <div className="flex items-center justify-between pt-3 mt-1 border-t border-obsidian-700/60">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded bg-obsidian-900 border border-obsidian-700 flex items-center justify-center">
            <span className="text-[9px] text-slate-400 font-mono">AI</span>
          </div>
          <span className="text-xs text-slate-500 font-mono truncate max-w-[120px]">
            {modelShortName(model)}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-light">
          <CheckCircle className="w-3.5 h-3.5 text-slate-600" />
          <span>{tasksCompleted} tasks</span>
        </div>
      </div>
    </div>
  )
}
