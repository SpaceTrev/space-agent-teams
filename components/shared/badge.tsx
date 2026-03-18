import { HTMLAttributes } from 'react'
import { clsx } from 'clsx'

export type BadgeVariant = 'green' | 'yellow' | 'red' | 'gray' | 'blue' | 'purple' | 'orange'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  dot?: boolean
  size?: 'sm' | 'md'
}

const variantClasses: Record<BadgeVariant, string> = {
  green: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  yellow: 'bg-champagne-500/10 text-champagne-400 border border-champagne-500/20',
  red: 'bg-red-500/10 text-red-400 border border-red-500/20',
  gray: 'bg-obsidian-800 text-slate-400 border border-obsidian-700 font-light',
  blue: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
  purple: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  orange: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
}

const dotColors: Record<BadgeVariant, string> = {
  green: 'bg-emerald-400',
  yellow: 'bg-champagne-400',
  red: 'bg-red-400',
  gray: 'bg-slate-400',
  blue: 'bg-indigo-400',
  purple: 'bg-purple-400',
  orange: 'bg-orange-400',
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-[10px] tracking-wide font-mono uppercase',
  md: 'px-2.5 py-1 text-xs tracking-wide font-mono uppercase',
}

export function Badge({
  variant = 'gray',
  dot = false,
  size = 'md',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-semibold rounded-md',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={clsx('inline-block w-1.5 h-1.5 rounded-full flex-shrink-0', dotColors[variant])}
        />
      )}
      {children}
    </span>
  )
}

// Convenience status badge for agent/task statuses
type AgentStatusVariant = 'working' | 'idle' | 'blocked' | 'in-session' | 'needs-review' | 'paused' | 'archived'
type TaskStatusVariant = 'pending' | 'queued' | 'running' | 'completed' | 'failed' | 'canceled' | 'retrying'

const agentStatusMap: Record<AgentStatusVariant, { variant: BadgeVariant; label: string }> = {
  working: { variant: 'green', label: 'Working' },
  idle: { variant: 'gray', label: 'Idle' },
  blocked: { variant: 'red', label: 'Blocked' },
  'in-session': { variant: 'blue', label: 'In Session' },
  'needs-review': { variant: 'yellow', label: 'Needs Review' },
  paused: { variant: 'orange', label: 'Paused' },
  archived: { variant: 'gray', label: 'Archived' },
}

const taskStatusMap: Record<TaskStatusVariant, { variant: BadgeVariant; label: string }> = {
  pending: { variant: 'gray', label: 'Pending' },
  queued: { variant: 'blue', label: 'Queued' },
  running: { variant: 'green', label: 'Running' },
  completed: { variant: 'green', label: 'Completed' },
  failed: { variant: 'red', label: 'Failed' },
  canceled: { variant: 'gray', label: 'Canceled' },
  retrying: { variant: 'yellow', label: 'Retrying' },
}

export function AgentStatusBadge({ status }: { status: AgentStatusVariant }) {
  const config = agentStatusMap[status] || { variant: 'gray' as BadgeVariant, label: status }
  return <Badge variant={config.variant} dot>{config.label}</Badge>
}

export function TaskStatusBadge({ status }: { status: TaskStatusVariant }) {
  const config = taskStatusMap[status] || { variant: 'gray' as BadgeVariant, label: status }
  return <Badge variant={config.variant} dot>{config.label}</Badge>
}
