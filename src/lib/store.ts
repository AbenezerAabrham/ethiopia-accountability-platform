export * from './types';
import { Profile, Community, Post, Goal, Routine, GoalCheckin, Challenge, Message, Report, NotificationItem, Comment } from './types';

// Default mock Ethiopian users
export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'usr-1',
    username: 'abebe_k',
    display_name: 'Abebe Kebede',
    bio: 'Software engineer in Addis Ababa building open-source & learning Rust.',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    location_region: 'Addis Ababa',
    experience_summary: 'Experienced Full-Stack Dev',
    role: 'admin',
    reputation_score: 420,
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
  },
  {
    id: 'usr-2',
    username: 'meron_t',
    display_name: 'Meron Tadesse',
    bio: 'Forex trader & accounting enthusiast. Focus on risk management.',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    location_region: 'Bahr Dar',
    experience_summary: 'Intermediate Trader',
    role: 'moderator',
    reputation_score: 280,
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  {
    id: 'usr-3',
    username: 'samuel_b',
    display_name: 'Samuel Alemu',
    bio: 'Calisthenics & fitness athlete. 5am workout routine.',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    location_region: 'Hawassa',
    experience_summary: 'Calisthenics Coach',
    role: 'user',
    reputation_score: 190,
    created_at: new Date(Date.now() - 40 * 86400000).toISOString(),
  },
  {
    id: 'usr-4',
    username: 'hiwot_m',
    display_name: 'Hiwot Mengistu',
    bio: 'Cybersecurity learner & Bible study leader.',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    location_region: 'Adama',
    experience_summary: 'Security Enthusiast',
    role: 'user',
    reputation_score: 150,
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
  }
];

export const INITIAL_COMMUNITIES: Community[] = [
  {
    id: 'com-1',
    name: 'Python & Next.js Ethiopia',
    slug: 'python-nextjs-ethiopia',
    description: 'Community of Ethiopian developers practicing full-stack web engineering & accountability.',
    category: 'Programming',
    banner_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    is_verified: true,
    is_private: false,
    creator_id: 'usr-1',
    member_count: 342,
    created_at: new Date(Date.now() - 100 * 86400000).toISOString()
  },
  {
    id: 'com-2',
    name: 'Ethiopia Calisthenics & Fitness',
    slug: 'ethiopia-fitness',
    description: 'Daily bodyweight workouts, nutrition tips, and streak check-ins across Ethiopian cities.',
    category: 'Fitness',
    banner_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    is_verified: true,
    is_private: false,
    creator_id: 'usr-3',
    member_count: 512,
    created_at: new Date(Date.now() - 80 * 86400000).toISOString()
  },
  {
    id: 'com-3',
    name: 'Forex Journaling & Risk ET',
    slug: 'forex-journaling-et',
    description: 'Strict trade logging, risk management rules, and educational accountability. No fake hype.',
    category: 'Forex',
    banner_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    is_verified: false,
    is_private: false,
    creator_id: 'usr-2',
    member_count: 218,
    created_at: new Date(Date.now() - 45 * 86400000).toISOString()
  },
  {
    id: 'com-4',
    name: 'Addis Tech Founders & Innovators',
    slug: 'addis-tech-founders',
    description: 'Building sustainable products for local and global problems from Ethiopia.',
    category: 'Business',
    banner_url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
    is_verified: true,
    is_private: false,
    creator_id: 'usr-1',
    member_count: 189,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString()
  }
];

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal-1',
    user_id: 'usr-1',
    title: 'Master Next.js 15 & Supabase Architecture',
    description: 'Build production-ready applications with robust typescript and server actions.',
    category: 'Programming',
    start_date: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0],
    target_date: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
    status: 'active',
    visibility: 'public',
    target_value: 60,
    current_value: 24,
    unit: 'hours studied',
    created_at: new Date(Date.now() - 14 * 86400000).toISOString()
  },
  {
    id: 'goal-2',
    user_id: 'usr-1',
    title: '5am Morning Calisthenics Routine',
    description: 'Build chest, core strength and daily habit discipline.',
    category: 'Fitness',
    start_date: new Date(Date.now() - 20 * 86400000).toISOString().split('T')[0],
    target_date: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
    status: 'active',
    visibility: 'public',
    target_value: 30,
    current_value: 16,
    unit: 'days completed',
    created_at: new Date(Date.now() - 20 * 86400000).toISOString()
  }
];

export const INITIAL_ROUTINES: Routine[] = [
  {
    id: 'rout-1',
    goal_id: 'goal-1',
    user_id: 'usr-1',
    title: '1 Hour Full-Stack Coding & Deep Practice',
    frequency: 'daily',
    target_minutes: 60,
    created_at: new Date().toISOString()
  },
  {
    id: 'rout-2',
    goal_id: 'goal-2',
    user_id: 'usr-1',
    title: 'Morning Push-ups & Core Workout',
    frequency: 'daily',
    target_minutes: 30,
    created_at: new Date().toISOString()
  }
];

// Helper to seed recent consecutive checkins for streak demonstration
const todayStr = new Date().toISOString().split('T')[0];
const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const twoDaysAgoStr = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];

export const INITIAL_CHECKINS: GoalCheckin[] = [
  {
    id: 'chk-1',
    goal_id: 'goal-1',
    routine_id: 'rout-1',
    user_id: 'usr-1',
    scheduled_date: yesterdayStr,
    completed_at: new Date(Date.now() - 86400000).toISOString(),
    status: 'completed',
    note: 'Completed database migration module and Supabase RLS security policies.',
    evidence_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'chk-2',
    goal_id: 'goal-1',
    routine_id: 'rout-1',
    user_id: 'usr-1',
    scheduled_date: twoDaysAgoStr,
    completed_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    status: 'completed',
    note: 'Practiced React server actions and optimistic updates.'
  },
  {
    id: 'chk-3',
    goal_id: 'goal-2',
    routine_id: 'rout-2',
    user_id: 'usr-1',
    scheduled_date: yesterdayStr,
    completed_at: new Date(Date.now() - 86400000).toISOString(),
    status: 'completed',
    note: '100 pushups and 5 min plank.'
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    community_id: 'com-1',
    author_id: 'usr-1',
    author: INITIAL_PROFILES[0],
    title: '📢 Weekly Developer Accountability Sprint Announcement',
    body: 'Greetings developers! This week we are focusing on clean architecture, dynamic UI feedback, and error handling. Share your daily study goals in the comments below!',
    is_announcement: true,
    likes_count: 34,
    comments_count: 12,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'post-2',
    community_id: 'com-2',
    author_id: 'usr-3',
    author: INITIAL_PROFILES[2],
    title: 'Day 16 of Morning Calisthenics Challenge',
    body: 'Woke up at 5:15 AM today in Hawassa. Completed 120 pushups, pull-ups and leg raises. Consistency is key when motivation drops.',
    media_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    is_announcement: false,
    likes_count: 45,
    comments_count: 8,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString()
  }
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'chg-1',
    community_id: 'com-1',
    community_name: 'Python & Next.js Ethiopia',
    creator_id: 'usr-1',
    title: '30 Days of Code & Build Ethiopia',
    description: 'Commit to coding for at least 1 hour every day for 30 consecutive days. Share daily progress and GitHub commits.',
    start_date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
    end_date: new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0],
    participants_count: 84,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    id: 'chg-2',
    community_id: 'com-2',
    community_name: 'Ethiopia Calisthenics & Fitness',
    creator_id: 'usr-3',
    title: '10,000 Pushups August Streak',
    description: 'Perform 300+ bodyweight reps daily to hit 10,000 total reps this month.',
    start_date: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0],
    end_date: new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0],
    participants_count: 142,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString()
  }
];

export const INITIAL_REPORTS: Report[] = [
  {
    id: 'rep-1',
    reporter_id: 'usr-2',
    reporter_name: 'Meron Tadesse',
    target_id: 'post-99',
    target_type: 'post',
    reason: 'Scam',
    description: 'Promoting unverified automated trading bot promises 500% daily returns.',
    status: 'pending',
    created_at: new Date(Date.now() - 3600000).toISOString()
  }
];

// Calculation utility: Calculate streak from checkins
export function calculateStreak(checkins: GoalCheckin[], routineId: string): { currentStreak: number; longestStreak: number; completionRate: number } {
  const routineCheckins = checkins
    .filter(c => c.routine_id === routineId && c.status === 'completed')
    .map(c => c.scheduled_date)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (routineCheckins.length === 0) {
    return { currentStreak: 0, longestStreak: 0, completionRate: 0 };
  }

  const uniqueDates = Array.from(new Set(routineCheckins));
  
  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if today or yesterday is completed
  const checkDate = new Date(today);
  let dateStr = checkDate.toISOString().split('T')[0];
  
  if (!uniqueDates.includes(dateStr)) {
    // try yesterday
    checkDate.setDate(checkDate.getDate() - 1);
    dateStr = checkDate.toISOString().split('T')[0];
  }

  while (uniqueDates.includes(dateStr)) {
    currentStreak++;
    checkDate.setDate(checkDate.getDate() - 1);
    dateStr = checkDate.toISOString().split('T')[0];
  }

  // Calculate longest streak
  let longestStreak = currentStreak;
  let tempStreak = 0;
  const sortedAsc = [...uniqueDates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  
  for (let i = 0; i < sortedAsc.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prev = new Date(sortedAsc[i - 1]);
      const curr = new Date(sortedAsc[i]);
      const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) longestStreak = tempStreak;
  }

  const completionRate = Math.min(100, Math.round((uniqueDates.length / 30) * 100));

  return { currentStreak, longestStreak, completionRate };
}
