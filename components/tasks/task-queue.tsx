'use client'

import { useState } from 'react'
import { clsx } from 'clsx'
import { TaskCard } from './task-card'
import type { TaskStatus, TaskPriority } from '../../lib/types'

interface TaskItem {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  agentName?: string | null
  createdAt: string
  costUsd?: number
}

const FILTER_TABS: { label: string; value: TaskStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Queued', value: 'queued' },
  { label: 'Running', value: 'running' },
  { label: 'Completed', value: 'completed' },
  { label: 'Failed', value: 'failed' },
  { label: 'Pending', value: 'pending' },
]

interface TaskQueueProps {
  tasks: TaskItem[]
  onTaskClick?: (taskId: string) => void
  loading?: boolean
}

export function TaskQueue({ tasks, onTaskClick, loading }: TaskQueueProps) {
  const [activeFilter, setActiveFilter] = useState<TaskStatus | 'all'>('all')

  const filtered =
    activeFilter === 'all' ? tasks : tasks.filter((t) => t.status === activeFilter)

  const countForStatus = (status: TaskStatus | 'all') =>
    status === 'all' ? tasks.length : tasks.filter((t) => t.status === status).length

  return (
    <div className="flex flex-col gap-4">
      {/* Filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-obsidian-700 mb-2 snap-x">
        {FILTER_TABS.map((tab) => {
          const count = countForStatus(tab.value)
          return (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={clsx(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap snap-start',
                activeFilter === tab.value
                  ? 'bg-obsidian-700 text-white shadow-inner'
                  : 'text-slate-400 hover:text-white hover:bg-obsidian-800'
              )}
            >
              <span className={clsx(activeFilter === tab.value ? 'font-semibold' : 'font-light')}>
                {tab.label}
              </span>
              {count > 0 && (
                <span
                  className={clsx(
                    'inline-flex items-center justify-center min-w-[20px] h-[20px] rounded-full text-[10px] font-mono px-1 border',
                    activeFilter === tab.value
                      ? 'bg-obsidian-900 border-obsidian-700 text-slate-300'
                      : 'bg-obsidian-900 border-transparent text-slate-500'
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Task list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-obsidian-800 rounded-xl animate-pulse border border-obsidian-700" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-obsidian-800/50 rounded-xl border border-obsidian-700 border-dashed">
          <p className="text-sm font-medium text-slate-300">No tasks found</p>
          <p className="text-xs text-slate-500 font-light mt-1">
            {activeFilter !== 'all' ? `No ${activeFilter} tasks` : 'Dispatch a task to get started'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((task) => (
            <TaskCard
              key={task.id}
              {...task}
              onClick={onTaskClick ? () => onTaskClick(task.id) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}
