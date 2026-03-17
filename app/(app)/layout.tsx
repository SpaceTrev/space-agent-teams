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
  Layers,
  User,
} from 'lucide-react'

// Mock data — in production this would come from server components / context
const mockWorkspaces = [
  { id: '1', name: 'Engineering', slug: 'engineering', agentCount: 8, activeCount: 5 },
  { id: '2', name: 'Marketing', slug: 'marketing', agentCount: 4, activeCount: 2 },
  { id: '3', name: 'Support', slug: 'support', agentCount: 6, activeCount: 6 },
]

const mockOrg = { name: 'Acme Corp', plan: 'Pro' }
const mockUser = { name: 'Alex Johnson', email: 'alex@acme.com' }

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [workspacesExpanded, setWorkspacesExpanded] = useState(true)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col bg-gray-900 border-r border-gray-800">
        {/* Logo / Org */}
        <div className="px-4 py-4 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{mockOrg.name}</p>
              <p className="text-[10px] text-gray-500">{mockOrg.plan} Plan</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {/* Dashboard */}
          <Link
            href="/dashboard"
            className={clsx(
              'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
              pathname === '/dashboard'
                ? 'bg-gray-800 text-white font-medium'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            )}
          >
            <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
            Dashboard
          </Link>

          {/* Workspaces section */}
          <div className="pt-4">
            <button
              onClick={() => setWorkspacesExpanded((v) => !v)}
              className="w-full flex items-center justify-between px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-400 transition-colors"
            >
              Workspaces
              {workspacesExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>

            {workspacesExpanded && (
              <div className="mt-1 space-y-0.5">
                {mockWorkspaces.map((ws) => (
                  <Link
                    key={ws.id}
                    href={`/${ws.slug}`}
                    className={clsx(
                      'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors group',
                      pathname.startsWith(`/${ws.slug}`)
                        ? 'bg-gray-800 text-white font-medium'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    )}
                  >
                    <div className="w-5 h-5 rounded bg-gray-700 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-600 text-[10px] font-bold text-gray-300">
                      {ws.name[0]}
                    </div>
                    <span className="flex-1 truncate">{ws.name}</span>
                    {ws.activeCount > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                    )}
                  </Link>
                ))}

                <Link
                  href="/dashboard"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-400 hover:bg-gray-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New workspace
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* User menu */}
        <div className="px-2 py-3 border-t border-gray-800">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen((v) => !v)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-white">
                  {mockUser.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-medium text-gray-200 truncate">{mockUser.name}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
            </button>

            {userMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="px-3 py-2 border-b border-gray-700">
                  <p className="text-xs text-gray-400 truncate">{mockUser.email}</p>
                </div>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-gray-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-12 flex items-center px-6 border-b border-gray-800 bg-gray-900 flex-shrink-0">
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">{mockOrg.name}</span>
            <div className="w-px h-4 bg-gray-700" />
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <User className="w-3.5 h-3.5" />
              {mockUser.name}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-950">
          {children}
        </main>
      </div>
    </div>
  )
}
