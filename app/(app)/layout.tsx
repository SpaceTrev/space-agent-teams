'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import {
  Bot,
  LayoutDashboard,
  ChevronDown,
  ChevronRight,
  Settings,
  LogOut,
  Plus,
  User,
} from 'lucide-react'

// Mock data — in production this would come from server components / context
const mockWorkspaces = [
  { id: '1', name: 'Engineering', slug: 'engineering', agentCount: 8, activeCount: 5 },
  { id: '2', name: 'Marketing', slug: 'marketing', agentCount: 4, activeCount: 2 },
  { id: '3', name: 'Support', slug: 'support', agentCount: 6, activeCount: 6 },
]

const mockOrg = { name: 'Acme Corp', plan: 'Enterprise' }
const mockUser = { name: 'Alex Johnson', email: 'alex@acme.com' }

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [workspacesExpanded, setWorkspacesExpanded] = useState(true)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <div className="flex h-screen bg-obsidian-900 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col bg-obsidian-800 border-r border-obsidian-700">
        {/* Logo / Org */}
        <div className="px-5 py-5 border-b border-obsidian-700 bg-obsidian-900/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-champagne-500 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(230,194,128,0.2)]">
              <Bot className="w-5 h-5 text-obsidian-900" />
            </div>
            <div className="min-w-0">
              <p className="text-base font-serif font-semibold text-white truncate tracking-wide">{mockOrg.name}</p>
              <p className="text-[10px] text-champagne-600/70 uppercase tracking-widest font-mono">{mockOrg.plan} EDITION</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {/* Dashboard */}
          <Link
            href="/dashboard"
            className={clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group',
              pathname === '/dashboard'
                ? 'bg-champagne-500/10 text-champagne-500 font-medium border border-champagne-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                : 'text-slate-400 hover:text-white hover:bg-obsidian-700 border border-transparent'
            )}
          >
            <LayoutDashboard className={clsx("w-4 h-4 flex-shrink-0", pathname === '/dashboard' ? 'text-champagne-500' : 'text-slate-500 group-hover:text-slate-300')} />
            Dashboard
          </Link>

          {/* Workspaces section */}
          <div className="pt-6">
            <button
              onClick={() => setWorkspacesExpanded((v) => !v)}
              className="w-full flex items-center justify-between px-3 py-1 mb-2 text-xs font-mono font-semibold text-champagne-600/50 uppercase tracking-widest hover:text-champagne-500/80 transition-colors"
            >
              Workspaces
              {workspacesExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>

            {workspacesExpanded && (
              <div className="space-y-1">
                {mockWorkspaces.map((ws) => (
                  <Link
                    key={ws.id}
                    href={`/${ws.slug}`}
                    className={clsx(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group border',
                      pathname.startsWith(`/${ws.slug}`)
                        ? 'bg-obsidian-700 border-obsidian-700 text-white font-medium shadow-sm'
                        : 'border-transparent text-slate-400 hover:text-white hover:bg-obsidian-700/50'
                    )}
                  >
                    <div className={clsx(
                      "w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 text-[10px] font-bold transition-colors",
                      pathname.startsWith(`/${ws.slug}`)
                        ? 'bg-champagne-500 text-obsidian-900 shadow-[0_0_10px_rgba(230,194,128,0.2)]'
                        : 'bg-obsidian-900 border border-obsidian-700 text-slate-400 group-hover:border-slate-700 group-hover:text-slate-200'
                    )}>
                      {ws.name[0]}
                    </div>
                    <span className="flex-1 truncate tracking-tight">{ws.name}</span>
                    {ws.activeCount > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.5)] flex-shrink-0" />
                    )}
                  </Link>
                ))}

                <Link
                  href="/dashboard"
                  className="mt-2 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-slate-300 hover:bg-obsidian-700/50 border border-transparent border-dashed hover:border-obsidian-700 transition-all font-light"
                >
                  <div className="w-6 h-6 flex items-center justify-center border border-dashed border-slate-700 rounded-md text-slate-500">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                  New workspace
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* User menu */}
        <div className="px-3 py-4 border-t border-obsidian-700 bg-obsidian-900/30">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen((v) => !v)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-transparent hover:bg-obsidian-700 hover:border-obsidian-700 transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-champagne-500 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-obsidian-900">
                  {mockUser.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-medium text-slate-200 truncate">{mockUser.name}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-600 flex-shrink-0" />
            </button>

            {userMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-obsidian-800 border border-obsidian-700 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-obsidian-700 bg-obsidian-900/50">
                  <p className="text-xs font-mono text-champagne-600/70 truncate">{mockUser.email}</p>
                </div>
                <div className="p-1">
                  <Link
                    href="/settings"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-obsidian-700 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-500" />
                    Settings
                  </Link>
                  <Link
                    href="/login"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-red-500/70" />
                    Sign out
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-obsidian-900 relative">
        {/* Subtle noise and gradient in the background */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]">
           <svg className="w-full h-full">
            <filter id="dashboardNoise"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" /></filter>
            <rect width="100%" height="100%" filter="url(#dashboardNoise)" />
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-champagne-500/5 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />

        {/* Top bar */}
        <header className="h-14 flex items-center px-8 flex-shrink-0 relative z-10">
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-500 font-serif italic tracking-wide">{mockOrg.name} Dashboard</span>
            <div className="w-px h-4 bg-obsidian-700" />
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <div className="w-5 h-5 rounded-full bg-obsidian-800 border border-obsidian-700 flex items-center justify-center">
                <User className="w-3 h-3 text-champagne-500" />
              </div>
              {mockUser.name}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto relative z-10">
          <div className="max-w-7xl mx-auto p-8 lg:p-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
