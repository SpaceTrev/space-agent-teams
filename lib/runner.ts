// ============================================================
// Agent OS — Task Runner
// Executes agent tasks: loads task + agent, calls model,
// streams logs, records usage, updates stats.
// ============================================================

import { getSupabaseAdminClient } from '@/lib/db'
import { callModel, estimateCost, parseModelString, selectBestFreeModel } from '@/lib/models/registry'
import { getAgentSkills, buildSkillPrompt } from '@/lib/skills'
import { safeDecryptApiKey } from '@/lib/encryption'
import type { Agent, Task, ModelMessage, ModelCallOptions, ModelProviderType } from '@/lib/types'

// ============================================================
// Helper: write a task log entry
// ============================================================

async function writeTaskLog(
  taskId: string,
  agentId: string | null,
  level: 'debug' | 'info' | 'warn' | 'error',
  type: 'system' | 'llm_call' | 'tool_call' | 'tool_result' | 'agent_thought' | 'agent_action' | 'retry' | 'error',
  message: string,
  data?: Record<string, unknown>
): Promise<void> {
  const supabase = getSupabaseAdminClient()
  await supabase.from('task_logs').insert({
    task_id: taskId,
    agent_id: agentId,
    level,
    type,
    message,
    data: data ?? null,
    created_at: new Date().toISOString(),
  })
}

// ============================================================
// Helper: resolve the API key for a provider from workspace config
// ============================================================

async function resolveApiKey(
  workspaceId: string,
  provider: ModelProviderType
): Promise<string | undefined> {
  const supabase = getSupabaseAdminClient()

  // Check workspace-level model_providers table first
  const { data: providerRow } = await supabase
    .from('model_providers')
    .select('encrypted_api_key, iv')
    .eq('workspace_id', workspaceId)
    .eq('provider_type', provider)
    .eq('is_active', true)
    .single()

  if (providerRow?.encrypted_api_key && providerRow?.iv) {
    const decrypted = safeDecryptApiKey(providerRow.encrypted_api_key, providerRow.iv)
    if (decrypted) return decrypted
  }

  // Fall back to environment variables
  const envMap: Record<string, string | undefined> = {
    anthropic: process.env.ANTHROPIC_API_KEY,
    gemini: process.env.GEMINI_API_KEY,
    groq: process.env.GROQ_API_KEY,
    mistral: process.env.MISTRAL_API_KEY,
    perplexity: process.env.PERPLEXITY_API_KEY,
    openrouter: process.env.OPENROUTER_API_KEY,
    ollama: undefined,
  }

  return envMap[provider]
}

// ============================================================
// runTask — main entry point called by the queue
// ============================================================

export async function runTask(taskId: string): Promise<void> {
  const supabase = getSupabaseAdminClient()

  // --------------------------------------------------------
  // 1. Load the task
  // --------------------------------------------------------

  const { data: task, error: taskError } = await supabase
    .from('tasks')
    .select('*, agent:agents(*), workspace:workspaces(*)')
    .eq('id', taskId)
    .single()

  if (taskError || !task) {
    throw new Error(`Task not found: ${taskId}`)
  }

  const agent = task.agent as Agent | null
  const workspaceId = task.workspace_id as string

  // --------------------------------------------------------
  // 2. Mark task as running
  // --------------------------------------------------------

  await supabase
    .from('tasks')
    .update({
      status: 'running',
      started_at: new Date().toISOString(),
    })
    .eq('id', taskId)

  // Update agent status
  if (agent?.id) {
    await supabase
      .from('agents')
      .update({ status: 'running', current_task_id: taskId })
      .eq('id', agent.id)
  }

  await writeTaskLog(taskId, agent?.id ?? null, 'info', 'system', `Task started: ${task.title}`)

  const startTime = Date.now()

  try {
    // --------------------------------------------------------
    // 3. Determine model to use
    // --------------------------------------------------------

    let provider: ModelProviderType
    let modelId: string

    const agentModel = agent?.model ?? null

    if (agentModel && agentModel.includes(':')) {
      const parsed = parseModelString(agentModel)
      provider = parsed.provider
      modelId = parsed.model
    } else {
      // Use workspace default or best free model
      const best = selectBestFreeModel()
      provider = best.provider
      modelId = best.model
    }

    await writeTaskLog(taskId, agent?.id ?? null, 'info', 'system', `Using model: ${provider}:${modelId}`)

    // --------------------------------------------------------
    // 4. Resolve API key
    // --------------------------------------------------------

    const apiKey = await resolveApiKey(workspaceId, provider)

    // --------------------------------------------------------
    // 5. Build system prompt
    // --------------------------------------------------------

    let systemPrompt = agent?.system_prompt ?? ''

    // Append skill files
    if (agent) {
      try {
        const skills = await getAgentSkills(agent as Agent)
        const skillPrompt = buildSkillPrompt(skills)
        if (skillPrompt) {
          systemPrompt += skillPrompt
          await writeTaskLog(
            taskId,
            agent.id,
            'debug',
            'system',
            `Loaded ${skills.length} skill file(s): ${skills.map((s) => s.filename).join(', ')}`
          )
        }
      } catch (skillErr) {
        await writeTaskLog(taskId, agent?.id ?? null, 'warn', 'system', `Could not load skill files: ${skillErr}`)
      }
    }

    // --------------------------------------------------------
    // 6. Build messages
    // --------------------------------------------------------

    const messages: ModelMessage[] = []

    // Include task description as the user message
    const userContent = [
      `# Task: ${task.title}`,
      '',
      task.description ?? '',
      '',
      task.input && Object.keys(task.input).length > 0
        ? `## Additional Context\n\`\`\`json\n${JSON.stringify(task.input, null, 2)}\n\`\`\``
        : '',
    ]
      .filter((line) => line !== null)
      .join('\n')
      .trim()

    messages.push({ role: 'user', content: userContent })

    // --------------------------------------------------------
    // 7. Call the model
    // --------------------------------------------------------

    const agentConfig = (agent as Agent | null)?.config ?? {
      temperature: 0.7,
      max_tokens: 4096,
      stream_output: false,
      max_iterations: 1,
      retry_on_error: true,
      max_retries: 3,
      retry_delay_seconds: 2,
      enable_memory: false,
      memory_top_k: 5,
      timeout_seconds: 300,
    }

    const callOptions: ModelCallOptions = {
      provider,
      model: modelId,
      messages,
      system: systemPrompt || undefined,
      temperature: agentConfig.temperature,
      max_tokens: agentConfig.max_tokens,
      stream: false,
      api_key: apiKey,
    }

    await writeTaskLog(taskId, agent?.id ?? null, 'info', 'llm_call', `Calling ${provider}:${modelId}`, {
      prompt_length: systemPrompt.length,
      message_count: messages.length,
    })

    const llmCallStart = Date.now()
    const result = await callModel(callOptions)
    const llmDurationMs = Date.now() - llmCallStart

    await writeTaskLog(
      taskId,
      agent?.id ?? null,
      'info',
      'llm_call',
      `Model responded (${result.tokens_input} in / ${result.tokens_output} out)`,
      {
        tokens_input: result.tokens_input,
        tokens_output: result.tokens_output,
        duration_ms: llmDurationMs,
        finish_reason: result.finish_reason,
      }
    )

    // --------------------------------------------------------
    // 8. Calculate cost
    // --------------------------------------------------------

    const costUsd = estimateCost(provider, modelId, result.tokens_input, result.tokens_output)

    // --------------------------------------------------------
    // 9. Determine final task status
    // --------------------------------------------------------

    const requiresApproval = (task.metadata as Record<string, unknown>)?.requires_approval === true
    const finalStatus = requiresApproval ? 'needs_review' : 'completed'

    // --------------------------------------------------------
    // 10. Update task with result
    // --------------------------------------------------------

    const actualDurationSeconds = Math.round((Date.now() - startTime) / 1000)

    await supabase
      .from('tasks')
      .update({
        status: finalStatus,
        output: {
          content: result.content,
          tool_calls: result.tool_calls ?? [],
          finish_reason: result.finish_reason,
        },
        model_used: `${provider}:${modelId}`,
        tokens_input: result.tokens_input,
        tokens_output: result.tokens_output,
        cost_usd: costUsd,
        completed_at: new Date().toISOString(),
        actual_duration_seconds: actualDurationSeconds,
      })
      .eq('id', taskId)

    await writeTaskLog(
      taskId,
      agent?.id ?? null,
      'info',
      'system',
      `Task ${finalStatus}. Duration: ${actualDurationSeconds}s. Cost: $${costUsd.toFixed(6)}`
    )

    // --------------------------------------------------------
    // 11. Record usage event
    // --------------------------------------------------------

    const workspaceData = task.workspace as { organization_id?: string } | null

    await supabase.from('usage_events').insert({
      organization_id: workspaceData?.organization_id ?? null,
      workspace_id: workspaceId,
      agent_id: agent?.id ?? null,
      task_id: taskId,
      session_id: null,
      event_type: 'llm_tokens',
      quantity: result.tokens_input + result.tokens_output,
      cost_usd: costUsd,
      model: `${provider}:${modelId}`,
      provider,
      metadata: {
        tokens_input: result.tokens_input,
        tokens_output: result.tokens_output,
        duration_ms: llmDurationMs,
      },
      recorded_at: new Date().toISOString(),
    })

    // --------------------------------------------------------
    // 12. Update agent stats
    // --------------------------------------------------------

    if (agent?.id) {
      const { data: currentAgent } = await supabase
        .from('agents')
        .select('total_tasks_completed, total_tokens_used, total_cost')
        .eq('id', agent.id)
        .single()

      if (currentAgent) {
        await supabase
          .from('agents')
          .update({
            status: 'idle',
            current_task_id: null,
            total_tasks_completed: ((currentAgent as { total_tasks_completed?: number }).total_tasks_completed ?? 0) + 1,
            total_tokens_used:
              ((currentAgent as { total_tokens_used?: number }).total_tokens_used ?? 0) +
              result.tokens_input +
              result.tokens_output,
            total_cost:
              ((currentAgent as { total_cost?: number }).total_cost ?? 0) + costUsd,
          })
          .eq('id', agent.id)
      } else {
        await supabase
          .from('agents')
          .update({ status: 'idle', current_task_id: null })
          .eq('id', agent.id)
      }
    }

    // --------------------------------------------------------
    // 13. Update workspace api_cost_this_month
    // --------------------------------------------------------

    const { data: workspaceRow } = await supabase
      .from('workspaces')
      .select('api_cost_this_month')
      .eq('id', workspaceId)
      .single()

    if (workspaceRow) {
      await supabase
        .from('workspaces')
        .update({
          api_cost_this_month:
            ((workspaceRow as { api_cost_this_month?: number }).api_cost_this_month ?? 0) + costUsd,
        })
        .eq('id', workspaceId)
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    const actualDurationSeconds = Math.round((Date.now() - startTime) / 1000)

    await writeTaskLog(taskId, agent?.id ?? null, 'error', 'error', `Task failed: ${errorMessage}`, {
      error: errorMessage,
    })

    // Mark task as failed
    await supabase
      .from('tasks')
      .update({
        status: 'failed',
        error_message: errorMessage,
        completed_at: new Date().toISOString(),
        actual_duration_seconds: actualDurationSeconds,
      })
      .eq('id', taskId)

    // Reset agent status
    if (agent?.id) {
      await supabase
        .from('agents')
        .update({ status: 'idle', current_task_id: null })
        .eq('id', agent.id)
    }

    throw err
  }
}
