import Link from 'next/link'
import { ArrowRight, Bot, Layers, Zap, BarChart3, Shield, Globe, ChevronRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">Agent OS</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="#" className="hover:text-white transition-colors">Docs</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="px-4 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium mb-6">
            <Zap className="w-3 h-3" />
            Now in public beta
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            Agent OS —{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-blue-400">
              The operating system
            </span>
            <br />
            for AI-powered teams
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Deploy, orchestrate, and monitor AI agent teams across your organization.
            Multi-tenant workspaces, any model, sprint management, and real-time observability.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-brand-900/50"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-white font-semibold rounded-xl transition-all"
            >
              View Demo
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Social proof */}
          <p className="text-xs text-gray-600 mt-8">
            No credit card required &middot; Free tier available &middot; Deploys in minutes
          </p>
        </div>

        {/* Hero dashboard mockup */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-800 border-b border-gray-700">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="ml-3 text-xs text-gray-500 font-mono">app.agentos.io/dashboard</span>
            </div>
            <div className="p-6 grid grid-cols-3 gap-4">
              {[
                { name: 'Engineering', agents: 8, active: 5, cost: '$124.50' },
                { name: 'Marketing', agents: 4, active: 2, cost: '$47.20' },
                { name: 'Support', agents: 6, active: 6, cost: '$89.15' },
              ].map((ws) => (
                <div key={ws.name} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-white">{ws.name}</span>
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  </div>
                  <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>Agents</span>
                      <span className="text-gray-300">{ws.agents} total</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active now</span>
                      <span className="text-green-400 font-medium">{ws.active} running</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cost this month</span>
                      <span className="text-yellow-400 font-mono">{ws.cost}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Everything you need to run AI teams at scale
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Agent OS handles the infrastructure so your agents can focus on the work that matters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Layers,
                title: 'Multi-tenant Workspaces',
                description: 'Isolate agent teams by project, department, or client. Each workspace has its own models, tasks, and billing.',
                color: 'text-brand-400',
                bg: 'bg-brand-500/10',
              },
              {
                icon: Bot,
                title: 'Model-agnostic',
                description: 'Connect any provider — Claude, GPT, Gemini, Mistral, Groq, or local Ollama models. Switch without rewriting agents.',
                color: 'text-purple-400',
                bg: 'bg-purple-500/10',
              },
              {
                icon: BarChart3,
                title: 'Sprint Management',
                description: 'Organize tasks into sprints with goals, timelines, and progress tracking. Ship batches of AI work reliably.',
                color: 'text-green-400',
                bg: 'bg-green-500/10',
              },
              {
                icon: Zap,
                title: 'Real-time Monitoring',
                description: 'Live log streams, token usage, cost tracking, and agent status — all in one place.',
                color: 'text-yellow-400',
                bg: 'bg-yellow-500/10',
              },
              {
                icon: Shield,
                title: 'Approval Workflows',
                description: 'Set tasks to require human approval before completion. Stay in control of what your agents do.',
                color: 'text-red-400',
                bg: 'bg-red-500/10',
              },
              {
                icon: Globe,
                title: 'Compute Management',
                description: 'Provision dedicated compute servers for your agents. Scale up or down as your workload changes.',
                color: 'text-orange-400',
                bg: 'bg-orange-500/10',
              },
            ].map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 ${feature.color}`} />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-24 border-t border-gray-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Simple, transparent pricing</h2>
          <p className="text-gray-400 mb-8">
            Start free. Scale as your team grows. No hidden fees.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl transition-all"
            >
              Start for free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-semibold rounded-xl transition-all"
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-brand-500" />
            <span>Agent OS &copy; 2026</span>
          </div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-gray-400 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-gray-400 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-gray-400 transition-colors">Status</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
