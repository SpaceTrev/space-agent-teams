'use client'

import { useState, use } from 'react'
import { ProviderConfig } from '../../../../components/models/provider-config'
import { ModelPicker } from '../../../../components/models/model-picker'
import { Brain, Plus, GitMerge, ArrowRight } from 'lucide-react'
import { clsx } from 'clsx'
import type { ModelProviderType } from '../../../../lib/types'

const configuredProviders = [
  {
    providerId: 'p1',
    providerType: 'anthropic' as ModelProviderType,
    displayName: 'Anthropic',
    logoChar: 'A',
    isActive: true,
    isVerified: true,
    hasApiKey: true,
    defaultModel: 'claude-3-5-sonnet-20241022',
    availableModels: [
      { id: 'anthropic:claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', isFree: false },
      { id: 'anthropic:claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', isFree: false },
      { id: 'anthropic:claude-3-haiku-20240307', name: 'Claude 3 Haiku', isFree: false },
      { id: 'anthropic:claude-3-opus-20240229', name: 'Claude 3 Opus', isFree: false },
    ],
    docsUrl: 'https://console.anthropic.com/api-keys',
  },
  {
    providerId: 'p2',
    providerType: 'groq' as ModelProviderType,
    displayName: 'Groq',
    logoChar: 'G',
    isActive: true,
    isVerified: true,
    hasApiKey: true,
    defaultModel: 'llama-3.1-70b-versatile',
    availableModels: [
      { id: 'groq:llama-3.1-70b-versatile', name: 'Llama 3.1 70B', isFree: false },
      { id: 'groq:llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant', isFree: false },
      { id: 'groq:mixtral-8x7b-32768', name: 'Mixtral 8x7B', isFree: false },
    ],
    docsUrl: 'https://console.groq.com/keys',
  },
  {
    providerId: 'p3',
    providerType: 'gemini' as ModelProviderType,
    displayName: 'Google Gemini',
    logoChar: 'G',
    isActive: false,
    isVerified: false,
    hasApiKey: false,
    availableModels: [
      { id: 'gemini:gemini-1.5-pro', name: 'Gemini 1.5 Pro', isFree: false },
      { id: 'gemini:gemini-1.5-flash', name: 'Gemini 1.5 Flash', isFree: false },
      { id: 'gemini:gemini-1.0-pro', name: 'Gemini 1.0 Pro', isFree: false },
    ],
    docsUrl: 'https://aistudio.google.com/app/apikey',
  },
  {
    providerId: 'p4',
    providerType: 'mistral' as ModelProviderType,
    displayName: 'Mistral AI',
    logoChar: 'M',
    isActive: false,
    isVerified: false,
    hasApiKey: false,
    availableModels: [
      { id: 'mistral:mistral-large-latest', name: 'Mistral Large', isFree: false },
      { id: 'mistral:mistral-small-latest', name: 'Mistral Small', isFree: false },
    ],
    docsUrl: 'https://console.mistral.ai/api-keys/',
  },
  {
    providerId: 'p5',
    providerType: 'ollama' as ModelProviderType,
    displayName: 'Ollama (Local)',
    logoChar: 'O',
    isActive: false,
    isVerified: false,
    hasApiKey: false,
    availableModels: [
      { id: 'ollama:llama3.2', name: 'Llama 3.2', isFree: true },
      { id: 'ollama:qwen2.5', name: 'Qwen 2.5', isFree: true },
      { id: 'ollama:phi4', name: 'Phi-4', isFree: true },
    ],
  },
  {
    providerId: 'p6',
    providerType: 'openrouter' as ModelProviderType,
    displayName: 'OpenRouter',
    logoChar: 'R',
    isActive: false,
    isVerified: false,
    hasApiKey: false,
    availableModels: [
      { id: 'openrouter:meta-llama/llama-3.1-405b-instruct:free', name: 'Llama 3.1 405B (Free)', isFree: true },
      { id: 'openrouter:google/gemini-pro-1.5', name: 'Gemini Pro 1.5', isFree: false },
    ],
    docsUrl: 'https://openrouter.ai/keys',
  },
]

const allModels = configuredProviders.flatMap((p) =>
  p.availableModels.map((m) => ({
    ...m,
    provider: p.providerType,
    providerName: p.displayName,
    contextWindow: 128000,
    inputCostPerMillion: m.isFree ? 0 : 1.5,
  }))
)

const mockRoutingRules = [
  { id: '1', name: 'High Priority Tasks', condition: 'Priority == Critical', model: 'anthropic:claude-3-5-sonnet-20241022', isActive: true },
  { id: '2', name: 'Data Analysis', condition: 'Category == Analysis', model: 'groq:llama-3.1-70b-versatile', isActive: true },
  { id: '3', name: 'Web Research', condition: 'Requires Internet == True', model: 'perplexity:llama-3.1-sonar-large-128k-online', isActive: true },
  { id: '4', name: 'Nightly Batch Jobs', condition: 'Cost Sensitivity == High', model: 'groq:llama-3.1-8b-instant', isActive: false },
]

export default function ModelsPage({ params }: { params: Promise<{ workspace: string }> }) {
  const { workspace } = use(params)
  const [defaultModel, setDefaultModel] = useState('anthropic:claude-3-5-sonnet-20241022')

  const handleSaveProvider = async (providerId: string, data: { apiKey?: string; defaultModel?: string; isActive: boolean }) => {
    await new Promise((r) => setTimeout(r, 800))
    console.log('Save provider:', providerId, data)
  }

  const verifiedCount = configuredProviders.filter((p) => p.isVerified).length

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center">
          <Brain className="w-5 h-5 text-brand-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Model Providers</h1>
          <p className="text-sm text-gray-500">
            {verifiedCount} of {configuredProviders.length} providers connected
          </p>
        </div>
      </div>

      {/* Workspace default model */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-white mb-1">Workspace Default Model</h2>
        <p className="text-xs text-gray-500 mb-4">
          Used when an agent doesn&apos;t have a specific model configured.
        </p>
        <ModelPicker
          models={allModels}
          value={defaultModel}
          onChange={setDefaultModel}
        />
      </div>

      {/* Routing Rules Engine */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-white mb-1">Routing Rules Engine</h2>
            <p className="text-xs text-gray-500">
              Dynamically route tasks to different active models based on context.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-600/10 text-brand-400 hover:bg-brand-600/20 text-xs font-medium rounded transition-colors">
            <Plus className="w-3.5 h-3.5" />
            Add Rule
          </button>
        </div>

        <div className="space-y-3">
          {mockRoutingRules.map(rule => (
            <div key={rule.id} className={clsx("flex items-center gap-4 px-4 py-3 border rounded-lg", rule.isActive ? "border-brand-500/30 bg-gray-800/50" : "border-gray-800 bg-gray-900 opacity-60")}>
              <GitMerge className={clsx("w-4 h-4", rule.isActive ? "text-brand-400" : "text-gray-600")} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-200">{rule.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono text-gray-500 bg-gray-900 px-1.5 py-0.5 rounded border border-gray-800">{rule.condition}</span>
                  <ArrowRight className="w-3 h-3 text-gray-600" />
                  <span className="text-xs font-mono text-brand-400/80">{rule.model.split(':').pop()}</span>
                </div>
              </div>
              <div className={clsx("text-xs font-medium px-2 py-1 rounded-md", rule.isActive ? "bg-green-500/10 text-green-400" : "bg-gray-800 text-gray-500")}>
                {rule.isActive ? 'Active' : 'Disabled'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Provider configs */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Configured Providers</h2>
        {configuredProviders.map((provider) => (
          <ProviderConfig
            key={provider.providerId}
            {...provider}
            onSave={(data) => handleSaveProvider(provider.providerId!, data)}
          />
        ))}
      </div>
    </div>
  )
}
