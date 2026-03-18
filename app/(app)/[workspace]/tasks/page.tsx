'use client'

import { useState, use } from 'react'
import { TaskQueue } from '../../../../components/tasks/task-queue'
import { DispatchForm } from '../../../../components/tasks/dispatch-form'
import { Modal } from '../../../../components/shared/modal'
import { Button } from '../../../../components/shared/button'
import { Send } from 'lucide-react'
import type { TaskStatus, TaskPriority } from '../../../../lib/types'

const mockTasks = [
  { id: '1', title: 'Refactor authentication middleware to support OAuth 2.0', status: 'completed' as TaskStatus, priority: 'high' as TaskPriority, agentName: 'Aria', createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), costUsd: 0.042 },
  { id: '2', title: 'Write OpenAPI spec for payment service v3', status: 'running' as TaskStatus, priority: 'normal' as TaskPriority, agentName: 'Dev-2', createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), costUsd: 0.018 },
  { id: '3', title: 'Generate unit tests for UserService class', status: 'completed' as TaskStatus, priority: 'normal' as TaskPriority, agentName: 'Dev-1', createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), costUsd: 0.067 },
  { id: '4', title: 'Code review: PR #248 — Add rate limiting to API gateway', status: 'queued' as TaskStatus, priority: 'high' as TaskPriority, agentName: 'QA-Bot', createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), costUsd: 0 },
  { id: '5', title: 'Analyze database query performance bottlenecks', status: 'failed' as TaskStatus, priority: 'critical' as TaskPriority, agentName: 'Aria', createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(), costUsd: 0.012 },
  { id: '6', title: 'Create database migration for user preferences table', status: 'pending' as TaskStatus, priority: 'low' as TaskPriority, agentName: null, createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(), costUsd: 0 },
  { id: '7', title: 'Document REST endpoints for the notification service', status: 'completed' as TaskStatus, priority: 'normal' as TaskPriority, agentName: 'Dev-2', createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), costUsd: 0.031 },
  { id: '8', title: 'Review and merge PR #251 — Fix auth token expiry bug', status: 'running' as TaskStatus, priority: 'critical' as TaskPriority, agentName: 'Aria', createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(), costUsd: 0.028 },
]

const mockAgents = [
  { id: '1', name: 'Aria', role: 'Senior Backend Engineer', status: 'running' },
  { id: '2', name: 'Dev-1', role: 'Backend Developer', status: 'idle' },
  { id: '3', name: 'Dev-2', role: 'API Specialist', status: 'running' },
  { id: '4', name: 'QA-Bot', role: 'QA Automation', status: 'running' },
]

const mockSprints = [
  { id: 's1', name: 'Sprint 4 — API v2 Migration' },
  { id: 's2', name: 'Sprint 5 — Performance' },
]

export default function TasksPage({ params }: { params: Promise<{ workspace: string }> }) {
  const { workspace } = use(params)
  const [tasks, setTasks] = useState(mockTasks)
  const [dispatchOpen, setDispatchOpen] = useState(false)

  const handleDispatch = async (data: {
    agentId: string
    prompt: string
    sprintId?: string
    priority: TaskPriority
    requiresApproval: boolean
  }) => {
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800))
    const agent = mockAgents.find((a) => a.id === data.agentId)
    const newTask = {
      id: String(Date.now()),
      title: data.prompt.length > 80 ? data.prompt.slice(0, 80) + '...' : data.prompt,
      status: 'queued' as TaskStatus,
      priority: data.priority,
      agentName: agent?.name || null,
      createdAt: new Date().toISOString(),
      costUsd: 0,
    }
    setTasks((prev) => [newTask, ...prev])
    setDispatchOpen(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Tasks</h1>
          <p className="text-sm text-gray-500 mt-0.5">{tasks.length} total tasks</p>
        </div>
        <Button variant="primary" onClick={() => setDispatchOpen(true)}>
          <Send className="w-4 h-4" />
          Dispatch Task
        </Button>
      </div>

      {/* Task queue */}
      <TaskQueue
        tasks={tasks}
        onTaskClick={(id) => {
          window.location.href = `/${workspace}/tasks/${id}`
        }}
      />

      {/* Dispatch modal */}
      <Modal
        open={dispatchOpen}
        onClose={() => setDispatchOpen(false)}
        title="Dispatch New Task"
        description="Assign a task to an agent in this workspace"
        size="lg"
      >
        <DispatchForm
          agents={mockAgents}
          sprints={mockSprints}
          onDispatch={handleDispatch}
          onCancel={() => setDispatchOpen(false)}
        />
      </Modal>
    </div>
  )
}
