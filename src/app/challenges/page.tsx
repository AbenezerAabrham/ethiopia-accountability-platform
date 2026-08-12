'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Trophy, Calendar, Users, ArrowRight, Flame, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, Badge } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/Progress';
import { INITIAL_CHALLENGES, Challenge } from '@/lib/store';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [joinedMap, setJoinedMap] = useState<Record<string, boolean>>({ 'chg-1': true });

  const toggleJoin = (id: string) => {
    setJoinedMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center space-x-2">
          <Trophy className="w-6 h-6 text-amber-500" />
          <span>Community Challenges</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Compete constructively with peers in timed habit sprints across Ethiopia.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((chg) => {
          const isJoined = joinedMap[chg.id];
          return (
            <Card key={chg.id} className="space-y-4 flex flex-col justify-between hover:border-amber-500/40 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="amber">{chg.community_name || 'Ethiopian Challenge'}</Badge>
                  <span className="text-xs text-slate-400 flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{chg.participants_count + (isJoined ? 1 : 0)} Participants</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{chg.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{chg.description}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Duration: {chg.start_date} to {chg.end_date}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <Link href={`/challenges/${chg.id}`}>
                    <Button variant="ghost" size="sm" className="text-emerald-600 font-semibold" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Leaderboard & Details
                    </Button>
                  </Link>

                  <Button
                    size="sm"
                    variant={isJoined ? 'outline' : 'primary'}
                    onClick={() => toggleJoin(chg.id)}
                  >
                    {isJoined ? 'Joined' : 'Join Challenge'}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
