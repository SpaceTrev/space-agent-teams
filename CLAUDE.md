# Agent OS

Multi-tenant AI agent orchestration platform. Run agent teams for your own projects, client projects, or license to clients as SaaS.

## What it is
- Multi-tenant workspaces (one per project/client)
- Agent teams with departments, roles, and skill files
- Sprint management: planning, standups, refinement, retro, strategy sessions
- Model-agnostic: Anthropic-first but any provider works
- Client billing with usage metering and margin tracking
- Compute provisioning for persistent agent execution (Railway/Fly.io)

## Stack
- **Frontend**: Next.js 15 (App Router)
- **Auth + DB**: Supabase (Postgres + Auth + RLS + Realtime)
- **Styling**: Tailwind CSS
- **Background Jobs**: In-process queue (upgrade to Trigger.dev for production)
- **Billing**: Stripe (subscriptions + usage-based metering)
- **Compute**: Railway API + Fly.io API

## Model priority (free-first)
1. Gemini 2.0 Flash — free, fast, capable
2. Groq Llama 3.1 70B — free, very fast
3. Mistral Small — free, good quality
4. Perplexity Sonar — free, has web search (use for research agents)
5. Claude Sonnet — paid, highest quality

## Key architectural decisions
- Multi-tenancy via workspace_id on every table
- Row Level Security (RLS) in Supabase for data isolation
- API keys stored encrypted per workspace (AES-256)
- Usage events written on every task completion for billing
- Free tier detection happens in model registry, not in components
- Compute servers tracked with hourly cost for client billing

## Adding a new model provider
1. Add provider to lib/models/registry.ts PROVIDERS object
2. Create lib/models/[provider].ts with callModel implementation
3. Add env var to .env.example
No other changes needed.

## Project structure
- app/ — Next.js App Router pages and API routes
- components/ — Reusable UI components
- lib/ — Core business logic
- skills/ — Default skill file templates
- supabase/ — DB migrations and config

## Running locally
1. Copy .env.example to .env.local and fill in values
2. Run: npm install
3. Run: npm run dev
4. Visit: http://localhost:3000

## Current state
- [x] Stack decision documented
- [x] DB schema with RLS
- [x] Model registry (all 7 providers)
- [x] Task runner with SSE log streaming
- [x] Global dashboard
- [x] Workspace fleet view
- [x] Model provider config UI
- [x] Billing UI
- [x] Compute provisioning UI
- [ ] Stripe integration (needs STRIPE_SECRET_KEY)
- [ ] Discord bot (needs DISCORD_BOT_TOKEN)
