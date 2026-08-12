'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Flame, CheckCircle2, Trophy, Users, Upload, Calendar, ShieldCheck, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, Badge, Avatar } from '@/components/ui/Card';
import { ProgressRing, ProgressBar } from '@/components/ui/Progress';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { INITIAL_GOALS, INITIAL_ROUTINES, INITIAL_CHECKINS, calculateStreak, GoalCheckin } from '@/lib/store';
import confetti from 'canvas-confetti';

export default function GoalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const goalId = params.id as string;

  const goal = INITIAL_GOALS.find(g => g.id === goalId) || INITIAL_GOALS[0];
  const routine = INITIAL_ROUTINES.find(r => r.goal_id === goal.id) || INITIAL_ROUTINES[0];

  const [checkins, setCheckins] = useState<GoalCheckin[]>(INITIAL_CHECKINS);
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [partnerUsername, setPartnerUsername] = useState('meron_t');
  const [partnerSuccess, setPartnerSuccess] = useState(false);

  const streak = calculateStreak(checkins, routine.id);

  const handleInvitePartner = () => {
    setPartnerSuccess(true);
    setTimeout(() => {
      setPartnerSuccess(false);
      setPartnerModalOpen(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation Back */}
      <div className="flex items-center justify-between">
        <Link href="/goals">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Goals
          </Button>
        </Link>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setPartnerModalOpen(true)} leftIcon={<Users className="w-4 h-4 text-blue-500" />}>
            Invite Partner
          </Button>
          <Button variant="primary" size="sm">
            Edit Goal
          </Button>
        </div>
      </div>

      {/* Goal Header Hero */}
      <Card className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border-emerald-900/60 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <Badge variant="emerald">{goal.category}</Badge>
              <Badge variant="amber" className="capitalize">{goal.visibility} Goal</Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">{goal.title}</h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">{goal.description}</p>
          </div>

          <div className="flex items-center space-x-4 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
            <ProgressRing value={streak.completionRate} size={70} label="Completion Rate" />
            <div className="space-y-1">
              <div className="flex items-center space-x-1 text-amber-400 font-black text-lg">
                <Flame className="w-5 h-5 fill-amber-500" />
                <span>{streak.currentStreak} Days</span>
              </div>
              <p className="text-[11px] text-slate-400">Longest Streak: {streak.longestStreak} days</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Grid: Routine breakdown & Check-in History */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Routine & Partner Info */}
        <div className="space-y-6">
          <Card className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Routine Schedule</span>
            </h3>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{routine.title}</p>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Frequency: <strong className="capitalize text-slate-700 dark:text-slate-300">{routine.frequency}</strong></span>
                <span>{routine.target_minutes} mins / session</span>
              </div>
            </div>
          </Card>

          <Card className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span>Accountability Partner</span>
            </h3>
            <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <Avatar name="Meron Tadesse" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80" size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">Meron Tadesse</p>
                <p className="text-[11px] text-emerald-600 font-semibold">Active Accountability Partner</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Verified Check-in History & Evidence */}
        <div className="md:col-span-2 space-y-4">
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Check-in History</span>
              </h3>
              <span className="text-xs text-slate-400">{checkins.length} verified sessions</span>
            </div>

            <div className="space-y-3">
              {checkins.map((chk) => (
                <div key={chk.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{chk.scheduled_date}</span>
                    </div>
                    <Badge variant="emerald">Completed</Badge>
                  </div>
                  {chk.note && <p className="text-xs text-slate-600 dark:text-slate-400 pl-6">{chk.note}</p>}
                  {chk.evidence_url && (
                    <div className="pl-6 pt-1">
                      <img src={chk.evidence_url} alt="Proof evidence" className="w-32 h-20 object-cover rounded-lg border border-slate-300 dark:border-slate-700" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Invite Partner Dialog */}
      <Dialog isOpen={partnerModalOpen} onClose={() => setPartnerModalOpen(false)} title="Invite Accountability Partner">
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Accountability partners can view your daily check-in status, send encouragement, and help keep you on track.
          </p>

          <Input
            label="Search User by Username"
            placeholder="e.g. meron_t"
            value={partnerUsername}
            onChange={(e) => setPartnerUsername(e.target.value)}
          />

          {partnerSuccess ? (
            <div className="p-3 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-xl text-center text-xs font-bold">
              ✅ Partner invitation sent to @{partnerUsername}!
            </div>
          ) : (
            <div className="flex justify-end space-x-3 pt-3">
              <Button variant="outline" onClick={() => setPartnerModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleInvitePartner}>
                Send Invitation
              </Button>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
}
