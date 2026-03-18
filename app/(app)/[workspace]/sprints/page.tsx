'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import { Plus, GitBranch } from 'lucide-react'
import { SprintBoard } from '../../../../components/sprints/sprint-board'
import { Modal } from '../../../../components/shared/modal'
import { Button } from '../../../../components/shared/button'
import { Input, Textarea } from '../../../../components/shared/input'
import { Badge } from '../../../../components/shared/badge'
import type { SprintStatus, TaskStatus, TaskPriority } from '../../../../lib/types'

const mockSprints = [
  {
    id: 's1',
    name: 'Sprint 4 — API v2 Migration',
    description: 'Migrate all public-facing endpoints to v2 API with OAuth 2.0 support',
    status: 'active' as SprintStatus,
    goal: 'Complete OAuth 2.0 implementation and migrate 100% of endpoints by March 31',
    startsAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    stats: {
      totalTasks: 18,
      completedTasks: 11,
      failedTasks: 1,
      inProgressTasks: 3,
      totalTokensUsed: 4_820_000,
      totalCostUsd: 67.4,
      avgTaskDurationSeconds: 420,
    },
    tasks: [
      { id: 't1', title: 'Refactor auth middleware for OAuth 2.0', status: 'completed' as TaskStatus, priority: 'high' as TaskPriority, agentName: 'Aria', costUsd: 0.042 },
      { id: 't2', title: 'Write OpenAPI spec for payment service', status: 'running' as TaskStatus, priority: 'normal' as TaskPriority, agentName: 'Dev-2', costUsd: 0.018 },
      { id: 't3', title: 'Generate unit tests for UserService', status: 'completed' as TaskStatus, priority: 'normal' as TaskPriority, agentName: 'Dev-1', costUsd: 0.067 },
      { id: 't4', title: 'Migrate user endpoints to v2', status: 'completed' as TaskStatus, priority: 'high' as TaskPriority, agentName: 'Aria', costUsd: 0.095 },
      { id: 't5', title: 'Analyze DB query performance', status: 'failed' as TaskStatus, priority: 'critical' as TaskPriority, agentName: 'Dev-2', costUsd: 0.012 },
      { id: 't6', title: 'Review PR #248 — Rate limiting', status: 'queued' as TaskStatus, priority: 'high' as TaskPriority, agentName: 'QA-Bot', costUsd: 0 },
    ],
  },
  {
    id: 's2',
    name: 'Sprint 3 — Database Optimization',
    description: 'Performance improvements across the data layer',
    status: 'completed' as SprintStatus,
    goal: 'Reduce average query time by 40%',
    startsAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString(),
    endsAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    stats: {
      totalTasks: 12,
      completedTasks: 12,
      failedTasks: 0,
      inProgressTasks: 0,
      totalTokensUsed: 2_100_000,
      totalCostUsd: 28.9,
      avgTaskDurationSeconds: 310,
    },
    tasks: [],
  },
  {
    id: 's3',
    name: 'Sprint 5 — Performance & Observability',
    description: 'Add distributed tracing, metrics, and performance improvements',
    status: 'planning' as SprintStatus,
    goal: 'Ship OpenTelemetry integration with full trace coverage',
    startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21).toISOString(),
    stats: {
      totalTasks: 0,
      completedTasks: 0,
      failedTasks: 0,
      inProgressTasks: 0,
      totalTokensUsed: 0,
      totalCostUsd: 0,
      avgTaskDurationSeconds: 0,
    },
    tasks: [],
  },
]

export default function SprintsPage({ params }: { params: Promise<{ workspace: string }> }) {
  const { workspace } = use(params)
  const [newSprintOpen, setNewSprintOpen] = useState(false)
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    setLoading(false)
    setNewSprintOpen(false)
    setName('')
    setGoal('')
  }

  const activeSprint = mockSprints.find((s) => s.status === 'active')
  const otherSprints = mockSprints.filter((s) => s.status !== 'active')

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Sprints</h1>
          <p className="text-sm text-gray-500 mt-0.5">{mockSprints.length} sprints total</p>
        </div>
        <Button variant="primary" onClick={() => setNewSprintOpen(true)}>
          <Plus className="w-4 h-4" />
          New Sprint
        </Button>
      </div>

      {/* Active sprint */}
      {activeSprint && (
        <div className="mb-8 group">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Sprint</span>
          </div>
          <Link href={`/${workspace}/sprints/${activeSprint.id}`} className="block transition-transform group-hover:-translate-y-1 duration-300">
            <SprintBoard {...activeSprint} />
          </Link>
        </div>
      )}

      {/* Other sprints */}
      {otherSprints.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">All Sprints</h2>
          <div className="space-y-4">
            {otherSprints.map((sprint) => (
              <Link key={sprint.id} href={`/${workspace}/sprints/${sprint.id}`} className="block transition-transform hover:-translate-y-1 duration-300">
                <SprintBoard {...sprint} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* New sprint modal */}
      <Modal
        open={newSprintOpen}
        onClose={() => setNewSprintOpen(false)}
        title="Create Sprint"
        description="Organize tasks into a focused sprint"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setNewSprintOpen(false)}>Cancel</Button>
            <Button variant="primary" loading={loading} onClick={handleCreate}>
              <GitBranch className="w-4 h-4" />
              Create Sprint
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Sprint Name"
            placeholder="Sprint 5 — Performance"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Textarea
            label="Goal (optional)"
            placeholder="What does success look like for this sprint?"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            rows={3}
          />
        </form>
      </Modal>
    </div>
  )
}
