// Types for Ethiopia Accountability Platform

export type UserRole = 'user' | 'moderator' | 'admin';

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  location_region?: string;
  experience_summary?: string;
  role: UserRole;
  reputation_score: number;
  created_at: string;
}

export interface Interest {
  id: string;
  name: string;
  category: string;
  icon?: string;
}

export interface UserInterest {
  id: string;
  user_id: string;
  interest_id: string;
  experience_level: 'Beginner' | 'Learning' | 'Intermediate' | 'Advanced' | 'Experienced';
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  banner_url?: string;
  is_verified: boolean;
  is_private: boolean;
  creator_id: string;
  member_count: number;
  created_at: string;
}

export interface CommunityMember {
  id: string;
  community_id: string;
  user_id: string;
  role: 'member' | 'moderator' | 'admin' | 'owner';
  joined_at: string;
}

export interface Post {
  id: string;
  community_id: string;
  author_id: string;
  author?: Profile;
  title: string;
  body: string;
  media_url?: string;
  is_announcement: boolean;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  author?: Profile;
  body: string;
  created_at: string;
}

export interface Reaction {
  id: string;
  target_id: string;
  target_type: 'post' | 'comment';
  user_id: string;
  type: 'like' | 'helpful' | 'support';
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  start_date: string;
  target_date?: string;
  status: 'active' | 'paused' | 'completed' | 'archived';
  visibility: 'public' | 'partners' | 'private';
  target_value?: number;
  current_value?: number;
  unit?: string;
  created_at: string;
  routines?: Routine[];
}

export interface Routine {
  id: string;
  goal_id: string;
  user_id: string;
  title: string;
  frequency: 'daily' | 'weekly' | 'weekdays' | 'custom';
  target_minutes?: number;
  created_at: string;
}

export interface GoalCheckin {
  id: string;
  goal_id: string;
  routine_id: string;
  user_id: string;
  scheduled_date: string;
  completed_at: string;
  status: 'completed' | 'skipped' | 'missed';
  note?: string;
  evidence_url?: string;
}

export interface Challenge {
  id: string;
  community_id: string;
  community_name?: string;
  creator_id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  participants_count: number;
  created_at: string;
}

export interface ChallengeParticipant {
  id: string;
  challenge_id: string;
  user_id: string;
  progress: number;
  completed: boolean;
  joined_at: string;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  participant: Profile;
  last_message?: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  read_at?: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  reporter_name?: string;
  target_id: string;
  target_type: 'user' | 'post' | 'comment' | 'message';
  reason: string;
  description?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  type: 'reminder' | 'partner' | 'community' | 'reaction' | 'message';
  title: string;
  content: string;
  is_read: boolean;
  link_url?: string;
  created_at: string;
}
