# Moderation & Safety Protocol

## Reporting & Moderation Categories
- **Spam & Scams**: High severity zero-tolerance policy for fake financial return schemes.
- **Harassment**: Safety filters and blocking mechanisms.
- **Misinformation & Impersonation**: Administrative review and community verification badges.

## Moderator Workflow
1. User submits report with reason and description.
2. Report lands in `/admin` moderation queue.
3. Moderator evaluates content -> selects action (`Dismiss`, `Warn User`, `Remove Content`, `Suspend / Ban`).
4. Action is committed to `moderation_actions` audit log.
