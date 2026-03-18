// ============================================================
// Agent OS — Root Layout
// ============================================================

import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

// ============================================================
// Metadata
// ============================================================

export const metadata: Metadata = {
  title: {
    default: 'Agent OS',
    template: '%s | Agent OS',
  },
  description:
    'Multi-tenant AI agent orchestration platform. Build, deploy, and monitor autonomous AI agents at scale.',
  keywords: ['AI agents', 'orchestration', 'automation', 'LLM', 'multi-tenant'],
  authors: [{ name: 'Agent OS' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Agent OS',
    description: 'Multi-tenant AI agent orchestration platform',
    siteName: 'Agent OS',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agent OS',
    description: 'Multi-tenant AI agent orchestration platform',
  },
}

export const viewport: Viewport = {
  themeColor: '#0ea5e9',
  width: 'device-width',
  initialScale: 1,
}

// ============================================================
// Root Layout Component
// ============================================================

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans min-h-screen antialiased bg-[#09090B] text-white overflow-x-hidden`}>
        {children}
      </body>
    </html>
  )
}
