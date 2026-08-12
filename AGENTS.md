# AGENTS.md — Engineering Guidelines for AI Coding Agents

## Project Overview
You are working on **Ethiopia Accountability, Learning & Community Platform** — a high-impact, restrained, mobile-first social accountability platform for Ethiopia.

## Tech Stack
- **Framework**: Next.js 15+ (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + Vanilla CSS Variables (Light & Dark theme support)
- **Backend / Database**: Supabase (PostgreSQL, Row Level Security)
- **Icons**: Lucide React

## Core Constraints & Principles
1. **Never Hardcode Secrets**: Store keys in `.env.local` and reference `process.env`.
2. **Never Trust the Browser**: Always enforce server-side validation and database RLS.
3. **Mobile Priority**: Always verify UI at 360px+ viewport before desktop layouts. Core functionality must NOT depend on hover states.
4. **Minimal & Restrained Design**: Clean typography, low visual noise, no neon gradients, elegant slate hues with Ethiopian emerald & amber accents.
5. **Zero Blank States**: Ensure intentional empty states, skeleton loaders, and interactive retry blocks for all data feeds.
6. **Streak Integrity**: Streaks must be dynamically computed from verified `goal_checkins` records with idempotency enforcement.
7. **Offline Queue & Low Bandwidth**: Respect connection status with local queue synchronization and Data Saver image optimizations.

## Data & Database Rules
- Schema changes MUST be reflected in `supabase/migrations/`.
- Never execute raw SQL without corresponding migration files and documentation updates in `docs/DATABASE.md`.

## Workflow & Status Updates
After modifying features or schema:
1. Validate client & mobile responsiveness.
2. Update `docs/PROJECT_STATUS.md` with completed features, migration status, and known bugs.
