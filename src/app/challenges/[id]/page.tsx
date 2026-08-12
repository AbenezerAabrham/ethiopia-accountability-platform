'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Trophy, Users, Calendar, Flame, CheckCircle2, Award } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, Badge, Avatar } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/Progress';
import { INITIAL_CHALLENGES, INITIAL_PROFILES } from '@/lib/store';

export default function ChallengeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const challenge = INITIAL_CHALLENGES.find(c => c.id === id) || INITIAL_CHALLENGES[0];

  const [joined, setJoined] = useState(true);

  const leaderboard = [
    { rank: 1, profile: INITIAL_PROFILES[0], progress: 14, target: 30 },
    { rank: 2, profile: INITIAL_PROFILES[2], progress: 12, target: 30 },
    { rank: 3, profile: INITIAL_PROFILES[1], progress: 9, target: 30 },
  ];

  return (
    <div className="space-y-6">
      <Link href="/challenges">
        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back to Challenges
        </Button>
      </Link>

      <Card className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-900 border-amber-900/60 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <Badge variant="amber">Community Sprint</Badge>
            <h1 className="text-xl sm:text-2xl font-black text-white">{challenge.title}</h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">{challenge.description}</p>
          </div>

          <Button variant={joined ? 'outline' : 'primary'} onClick={() => setJoined(!joined)}>
            {joined ? 'You are Participating' : 'Join Challenge'}
          </Button>
        </div>
      </Card>

      {/* Leaderboard Table */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Leaderboard & Daily Standings</span>
          </h3>
        </div>

        <div className="space-y-3">
          {leaderboard.map((item) => (
            <div key={item.rank} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                  item.rank === 1 ? 'bg-amber-500 text-slate-950' : item.rank === 2 ? 'bg-slate-300 text-slate-950' : 'bg-amber-700 text-white'
                }`}>
                  {item.rank}
                </span>
                <Avatar name={item.profile.display_name} src={item.profile.avatar_url} size="sm" />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">{item.profile.display_name}</span>
                  <span className="text-[10px] text-slate-400">@{item.profile.username}</span>
                </div>
              </div>

              <div className="w-36 space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  <span>Progress</span>
                  <span className="text-emerald-600">{item.progress}/{item.target} days</span>
                </div>
                <ProgressBar value={item.progress} max={item.target} showPercentage={false} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
