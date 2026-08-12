'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Flame,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  Upload,
  Calendar,
  Sparkles,
  Users,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, Badge, Avatar } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/Progress';
import { Dialog } from '@/components/ui/Dialog';
import { Input, Textarea } from '@/components/ui/Input';
import {
  INITIAL_GOALS,
  INITIAL_ROUTINES,
  INITIAL_CHECKINS,
  INITIAL_POSTS,
  calculateStreak,
  GoalCheckin
} from '@/lib/store';
import confetti from 'canvas-confetti';

export default function HomePage() {
  const [checkins, setCheckins] = useState<GoalCheckin[]>(INITIAL_CHECKINS);
  const [selectedRoutine, setSelectedRoutine] = useState<{ goalId: string; routineId: string; title: string } | null>(null);
  const [checkinNote, setCheckinNote] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  // Helper to test if a routine is checked in today
  const isCheckedInToday = (routineId: string) => {
    return checkins.some(c => c.routine_id === routineId && c.scheduled_date === todayStr && c.status === 'completed');
  };

  const handleOpenCheckinModal = (goalId: string, routineId: string, title: string) => {
    setSelectedRoutine({ goalId, routineId, title });
    setCheckinNote('');
    setEvidenceUrl('');
  };

  const handleCompleteCheckin = () => {
    if (!selectedRoutine) return;

    const newCheckin: GoalCheckin = {
      id: `chk-${Date.now()}`,
      goal_id: selectedRoutine.goalId,
      routine_id: selectedRoutine.routineId,
      user_id: 'usr-1',
      scheduled_date: todayStr,
      completed_at: new Date().toISOString(),
      status: 'completed',
      note: checkinNote || 'Completed daily routine on time.',
      evidence_url: evidenceUrl || undefined
    };

    setCheckins([newCheckin, ...checkins]);
    setSelectedRoutine(null);

    // Trigger celebration micro-animation!
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Selam, Abebe 🇪🇹
            </h1>
            <Badge variant="emerald">Habit Level 4</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Here is your accountability command center for today, {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}.
          </p>
        </div>

        <Link href="/goals">
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            New Goal
          </Button>
        </Link>
      </div>

      {/* Priority 1: TODAY'S ACCOUNTABILITY ROUTINES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Today&apos;s Accountability Routines
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
              Priority 1
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {checkins.filter(c => c.scheduled_date === todayStr).length} of {INITIAL_ROUTINES.length} completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INITIAL_ROUTINES.map((routine) => {
            const checkedIn = isCheckedInToday(routine.id);
            const streak = calculateStreak(checkins, routine.id);

            return (
              <Card
                key={routine.id}
                className={`transition-all ${
                  checkedIn
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-900/50'
                    : 'hover:border-emerald-500/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5 flex-1 pr-3">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{routine.title}</h3>
                      {checkedIn && <Badge variant="emerald">Completed</Badge>}
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-slate-500">
                      <span className="flex items-center space-x-1 text-amber-600 dark:text-amber-400 font-bold">
                        <Flame className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{streak.currentStreak} day streak</span>
                      </span>
                      <span>•</span>
                      <span>Target: {routine.target_minutes} mins</span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={checkedIn ? 'outline' : 'primary'}
                    disabled={checkedIn}
                    onClick={() => handleOpenCheckinModal(routine.goal_id, routine.id, routine.title)}
                    leftIcon={<CheckCircle2 className="w-4 h-4" />}
                  >
                    {checkedIn ? 'Done' : 'Check In'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Priority 2: GOAL SUMMARY & STREAKS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Active Goals Progress</span>
            </h3>
            <Link href="/goals" className="text-xs text-emerald-600 font-semibold hover:underline">
              View All Goals
            </Link>
          </div>

          <div className="space-y-4">
            {INITIAL_GOALS.map((goal) => {
              const currentVal = goal.current_value || 0;
              const targetVal = goal.target_value || 100;
              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{goal.title}</span>
                    <span className="text-slate-500">
                      {currentVal} / {targetVal} {goal.unit}
                    </span>
                  </div>
                  <ProgressBar value={currentVal} max={targetVal} />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Partner Activity Widget */}
        <Card className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Users className="w-4 h-4 text-blue-500" />
            <span>Accountability Partner</span>
          </h3>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2">
            <div className="flex items-center space-x-2.5">
              <Avatar name="Meron Tadesse" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80" size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold truncate">Meron Tadesse</p>
                <p className="text-[11px] text-slate-500">Bahr Dar • Forex Trading</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Meron checked in 3 hours ago for <span className="font-semibold text-emerald-600">Forex Journaling</span> (12-day streak 🔥)
            </p>
            <Button size="sm" variant="ghost" className="w-full text-xs text-emerald-600">
              Send Encouragement 👏
            </Button>
          </div>
        </Card>
      </div>

      {/* Priority 3: COMMUNITY ANNOUNCEMENTS & UPDATES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Recent Community Updates
          </span>
          <Link href="/discover" className="text-xs text-emerald-600 font-semibold hover:underline">
            Explore Communities
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INITIAL_POSTS.map((post) => (
            <Card key={post.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar name={post.author?.display_name || 'User'} src={post.author?.avatar_url} size="sm" />
                  <div>
                    <span className="text-xs font-bold block">{post.author?.display_name}</span>
                    <span className="text-[10px] text-slate-400">Python & Next.js Ethiopia</span>
                  </div>
                </div>
                {post.is_announcement && <Badge variant="amber">Announcement</Badge>}
              </div>

              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{post.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{post.body}</p>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>{post.likes_count} likes</span>
                <span>{post.comments_count} comments</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Interactive Check-In Modal */}
      <Dialog
        isOpen={!!selectedRoutine}
        onClose={() => setSelectedRoutine(null)}
        title={`Check In: ${selectedRoutine?.title || ''}`}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Log your completion for today. You can optionally add notes or proof evidence URL.
          </p>

          <Textarea
            label="Completion Note (Optional)"
            placeholder="What did you accomplish during this session?"
            value={checkinNote}
            onChange={(e) => setCheckinNote(e.target.value)}
          />

          <Input
            label="Evidence URL / Screenshot Link (Optional)"
            placeholder="https://..."
            value={evidenceUrl}
            onChange={(e) => setEvidenceUrl(e.target.value)}
            leftIcon={<Upload className="w-4 h-4" />}
          />

          <div className="flex justify-end space-x-3 pt-3">
            <Button variant="outline" onClick={() => setSelectedRoutine(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCompleteCheckin} leftIcon={<CheckCircle2 className="w-4 h-4" />}>
              Confirm Check-in
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
