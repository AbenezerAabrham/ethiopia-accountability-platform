# Security Architecture — Ethiopia Accountability Platform

## Security Model
1. **Row Level Security (RLS)**: Enforced on all Supabase/PostgreSQL tables.
2. **Direct Messaging Isolation**: Users can only access messages from conversations where their user ID is a verified member in `conversation_members`.
3. **Audit Logging**: Every administrative action (warning, content removal, user suspension/ban) creates an immutable `moderation_actions` audit record.
4. **Input Sanitization & Rate Limiting**: Shared validation layer on client and server to prevent spam, duplicate check-ins, or injection attacks.
