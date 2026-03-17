import { UsageMeter } from '../../../../components/billing/usage-meter'
import { CostBreakdown } from '../../../../components/billing/cost-breakdown'
import { CreditCard, Download, ExternalLink, TrendingUp } from 'lucide-react'

const months = [
  { month: 'March 2026', tasks: 1240, tokens: 4820000, compute: 7.5, cost: 124.5, aiCost: 58.2, margin: 66.3 },
  { month: 'February 2026', tasks: 980, tokens: 3600000, compute: 5.2, cost: 99.0, aiCost: 44.1, margin: 54.9 },
  { month: 'January 2026', tasks: 720, tokens: 2800000, compute: 3.8, cost: 99.0, aiCost: 33.6, margin: 65.4 },
]

const current = months[0]

export default function BillingPage({ params }: { params: { workspace: string } }) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Billing & Usage</h1>
          <p className="text-sm text-gray-500 mt-0.5">March 2026 billing period</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white text-sm rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Download invoice
          </a>
          <a
            href="https://billing.stripe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white text-sm rounded-lg transition-colors"
          >
            <CreditCard className="w-4 h-4" />
            Manage billing
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Current plan callout */}
      <div className="bg-brand-600/10 border border-brand-500/20 rounded-xl p-4 mb-6 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-brand-600/20 flex items-center justify-center flex-shrink-0">
          <CreditCard className="w-5 h-5 text-brand-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">Pro Plan</p>
          <p className="text-xs text-gray-400 mt-0.5">
            20 agents &middot; 2,000 tasks/mo &middot; 10h compute included &middot; Next billing: April 1, 2026
          </p>
        </div>
        <a
          href="/pricing"
          className="text-xs text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1"
        >
          Upgrade plan
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Usage meters */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">This Month&apos;s Usage</h2>
        <UsageMeter
          tasksUsed={current.tasks}
          tasksTotal={2000}
          tokensUsed={current.tokens}
          tokensTotal={null}
          costUsd={current.cost}
          costBudget={200}
          computeHoursUsed={current.compute}
          computeHoursTotal={10}
        />
      </div>

      {/* Cost breakdown */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Cost Breakdown</h2>
        <CostBreakdown
          baseSubscription={99}
          extraTasks={0}
          extraTasksCount={0}
          compute={11.4}
          computeHours={current.compute}
          totalInvoiced={current.cost}
          yourCost={current.aiCost}
          yourMargin={current.margin}
          planName="Pro"
          billingPeriod="March 2026"
        />
      </div>

      {/* Monthly history */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Billing History</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[1fr_80px_80px_80px_100px] text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 border-b border-gray-800">
            <span>Period</span>
            <span>Tasks</span>
            <span>Tokens</span>
            <span>Compute</span>
            <span className="text-right">Total</span>
          </div>
          {months.map((m, i) => (
            <div
              key={m.month}
              className="grid grid-cols-[1fr_80px_80px_80px_100px] items-center px-5 py-3.5 border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-200">{m.month}</span>
                {i === 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-brand-500/10 text-brand-400 rounded font-medium">Current</span>
                )}
              </div>
              <span className="text-xs text-gray-400">{m.tasks.toLocaleString()}</span>
              <span className="text-xs text-gray-400">
                {m.tokens >= 1_000_000 ? `${(m.tokens / 1_000_000).toFixed(1)}M` : `${(m.tokens / 1000).toFixed(0)}K`}
              </span>
              <span className="text-xs text-gray-400">{m.compute.toFixed(1)}h</span>
              <span className="text-sm font-mono text-white text-right">${m.cost.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
