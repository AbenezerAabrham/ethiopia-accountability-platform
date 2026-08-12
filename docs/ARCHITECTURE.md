# Architecture Specification — Ethiopia Accountability Platform

## Overview
The platform connects Ethiopian youth, students, professionals, and learners into peer-accountability networks focused on measurable personal growth, skill building, fitness, trading discipline, and language acquisition.

## Component Layout Architecture

```
AppShell
├── DesktopSidebar (Visible on md+ displays)
├── TopBar (Header with Search, Theme Switcher, Data Saver Toggle, Profile)
├── MainContent (Page route renderer)
├── GlobalNotificationLayer (Toast alerts, modal popups)
└── MobileBottomNavigation (Fixed bottom nav bar for mobile < 768px)
```

## State & Data Flow
1. **Supabase / Local Mock Data Provider**: `src/lib/store.ts` manages unified state for profiles, goals, routines, checkins, posts, communities, messages, and moderation reports.
2. **Persistence**: Synchronizes with browser LocalStorage for offline queueing, syncing back automatically when reconnected.
3. **Calculations**: Dynamic calculations for routine streaks, completion rates, and community recommendations.
