-- Migration: 20260815000000_platform_v2_features.sql
-- Description: Adds 5-8 person micro-squads, sub-city/campus clustering, proof verification logs, EXIF tracking, and trust tiers.

-- 1. Alter PROFILES with sub-city, campus, and trust tiers
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS sub_city TEXT,
ADD COLUMN IF NOT EXISTS university_campus TEXT,
ADD COLUMN IF NOT EXISTS active_window TEXT,
ADD COLUMN IF NOT EXISTS trust_tier TEXT DEFAULT 'tier_1_new';

-- 2. Alter COMMUNITIES with sub-city and campus clustering
ALTER TABLE public.communities
ADD COLUMN IF NOT EXISTS sub_city TEXT,
ADD COLUMN IF NOT EXISTS university_campus TEXT;

-- 3. 5-8 PERSON ACCOUNTABILITY MICRO-SQUADS
CREATE TABLE IF NOT EXISTS public.squads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    focus TEXT NOT NULL,
    max_members INT DEFAULT 6, -- 5-8 member limit
    current_members_count INT DEFAULT 1,
    sub_city TEXT,
    university_campus TEXT,
    active_window TEXT NOT NULL,
    leader_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    total_squad_streak INT DEFAULT 0,
    is_private BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.squad_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    squad_id UUID REFERENCES public.squads(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member', -- 'leader', 'member'
    current_streak INT DEFAULT 0,
    checked_in_today BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(squad_id, user_id)
);

-- 4. PROOF VERIFICATIONS & EXIF AUDITING
CREATE TABLE IF NOT EXISTS public.proof_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    checkin_id UUID REFERENCES public.goal_checkins(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    evidence_url TEXT NOT NULL,
    file_size_bytes INT,
    exif_capture_timestamp TIMESTAMPTZ,
    exif_is_valid BOOLEAN DEFAULT TRUE,
    ai_confidence_score NUMERIC(4, 3),
    ai_predicted_category TEXT,
    ai_verdict TEXT DEFAULT 'PASS', -- 'PASS', 'FLAGGED', 'REJECTED'
    privacy_blurred BOOLEAN DEFAULT FALSE,
    vouch_count INT DEFAULT 0,
    required_vouches INT DEFAULT 3,
    status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'flagged'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PEER AUDIT STAKING & VOUCHES
CREATE TABLE IF NOT EXISTS public.proof_vouches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    verification_id UUID REFERENCES public.proof_verifications(id) ON DELETE CASCADE,
    auditor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    decision TEXT NOT NULL, -- 'approved', 'rejected'
    staked_reputation INT DEFAULT 10,
    reward_awarded INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(verification_id, auditor_id)
);

-- Enable RLS
ALTER TABLE public.squads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.squad_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proof_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proof_vouches ENABLE ROW LEVEL SECURITY;

-- Indexes for fast sub-city and active window lookups
CREATE INDEX IF NOT EXISTS idx_profiles_sub_city ON public.profiles(sub_city);
CREATE INDEX IF NOT EXISTS idx_squads_sub_city ON public.squads(sub_city);
CREATE INDEX IF NOT EXISTS idx_squads_active_window ON public.squads(active_window);
CREATE INDEX IF NOT EXISTS idx_proof_verifications_status ON public.proof_verifications(status);
