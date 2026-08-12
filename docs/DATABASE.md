# Database Schema & Connection Pooling — Ethiopia Accountability Platform

## 1. Connection Pooling & High Concurrency Architecture (Port 6543)

The platform is designed to handle **1,000+ concurrent active users** without database connection bottlenecks:

1. **HTTPS REST API (`@supabase/ssr`)**:
   - Web requests via `@supabase/ssr` (in `src/lib/supabase/client.ts` and `server.ts`) communicate over HTTPS with Supabase's auto-pooled PostgREST layer.

2. **Supavisor Transaction Pooler (Port 6543)**:
   - For direct database drivers or ORMs (Prisma / Drizzle), connections use **Supavisor Transaction Mode** on port `6543`.
   - **Transaction Mode** allows 200+ concurrent user requests to share ~15 active PostgreSQL connections with sub-10ms query execution times.

```env
DATABASE_URL="postgres://postgres.[project-id]:[password]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

---

## 2. Core Tables & Relationships

### `profiles`
Stores user profile information, display name, username, region, role (`user`, `moderator`, `admin`), and reputation score.

### `goals` & `goal_routines` & `goal_checkins`
- `goals`: Long term objective, category, target dates, target quantity, visibility (`public`, `partners`, `private`).
- `goal_routines`: Individual recurring schedules (daily, weekly, weekdays) belonging to a goal.
- `goal_checkins`: Checked-in sessions containing scheduled date, completion timestamp, note, and evidence URL. Idempotency enforced via `UNIQUE(routine_id, scheduled_date)`.

### `communities` & `community_members` & `posts` & `comments`
- `communities`: Interest group, category, member counts, verified badge, description.
- `posts`: Community posts with title, body, optional media attachment, and announcement flag.
- `comments`: Direct parent-child comments under posts.

### `conversations` & `messages`
- Direct messaging store enforcing membership authorization checks.

### `reports` & `moderation_actions` & `audit_logs`
- System moderation tracking for reports (spam, scam, harassment, misinformation) and moderator audit history.
