'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Award, Sparkles, AlertTriangle, Flame, Users, Coins } from 'lucide-react';
import { Card, Badge, Avatar } from './ui/Card';
import { Button } from './ui/Button';

export interface AuditSubmission {
  id: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  routineTitle: string;
  category: string;
  evidenceUrl: string;
  note?: string;
  aiScore: number;
  aiLabels: string[];
  submittedTime: string;
  requiredVouches: number;
  currentVouches: number;
}

const INITIAL_AUDITS: AuditSubmission[] = [
  {
    id: 'aud-1',
    authorName: 'Samuel Alemu',
    authorUsername: 'samuel_b',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    routineTitle: 'Morning 100 Push-ups & Core Workout',
    category: 'Fitness',
    evidenceUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    note: 'Completed 120 push-ups and 5 min plank in Hawassa sports ground at 5:30 AM.',
    aiScore: 0.94,
    aiLabels: ['Sports Environment', 'Fitness Workout Reps', 'High Confidence'],
    submittedTime: '25 mins ago',
    requiredVouches: 3,
    currentVouches: 2,
  },
  {
    id: 'aud-2',
    authorName: 'Hiwot Mengistu',
    authorUsername: 'hiwot_m',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    routineTitle: '1-Hour Full-Stack Coding & Deep Practice',
    category: 'Programming',
    evidenceUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    note: 'Built Next.js 16 server actions and verified IndexedDB offline sync queue.',
    aiScore: 0.98,
    aiLabels: ['VS Code Editor', 'TypeScript Syntax', 'Clean Architecture'],
    submittedTime: '40 mins ago',
    requiredVouches: 3,
    currentVouches: 1,
  },
];

export const ProofAuditSection: React.FC = () => {
  const [audits, setAudits] = useState<AuditSubmission[]>(INITIAL_AUDITS);
  const [userRepScore, setUserRepScore] = useState(420);
  const [auditedMap, setAuditedMap] = useState<Record<string, 'approved' | 'rejected'>>({});
  const [rewardToast, setRewardToast] = useState<string | null>(null);

  const handleAudit = (submissionId: string, decision: 'approved' | 'rejected') => {
    setAuditedMap((prev) => ({ ...prev, [submissionId]: decision }));

    if (decision === 'approved') {
      const reward = 15;
      setUserRepScore((prev) => prev + reward);
      setRewardToast(`🎉 Accurate Audit Consensus! Earned +${reward} Reputation Points.`);
    } else {
      setRewardToast(`🛡️ Fraud flag logged for moderator review.`);
    }

    setTimeout(() => setRewardToast(null), 4000);
  };

  return (
    <Card className="space-y-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Community Proof Audit (Incentivized Vouching)</span>
          </h3>
          <p className="text-xs text-slate-500">
            Stake 10 Rep points to audit peer proofs. Accurate audits earn <strong>+15 Rep</strong>; fake approvals are penalized.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          <Coins className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-200">
            {userRepScore} Reputation Points
          </span>
        </div>
      </div>

      {rewardToast && (
        <div className="p-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold text-center shadow-md animate-fade-in">
          {rewardToast}
        </div>
      )}

      {/* Audits List */}
      <div className="space-y-4">
        {audits.map((item) => {
          const audited = auditedMap[item.id];

          return (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar name={item.authorName} src={item.authorAvatar} size="sm" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                      {item.authorName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      @{item.authorUsername} • {item.submittedTime}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge variant="emerald">{item.category}</Badge>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {item.currentVouches + (audited === 'approved' ? 1 : 0)} / {item.requiredVouches} Vouches
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {item.routineTitle}
                </h4>
                {item.note && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    &ldquo;{item.note}&rdquo;
                  </p>
                )}
              </div>

              {/* Proof Image + AI Pre-Screening Badges */}
              <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-black/40">
                <img
                  src={item.evidenceUrl}
                  alt="Proof submission"
                  className="w-full max-h-56 object-cover"
                />

                <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
                  <span className="bg-slate-950/80 backdrop-blur-xs text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-500/40 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>AI Pre-Screen: {Math.round(item.aiScore * 100)}% Match</span>
                  </span>
                </div>

                <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                  {item.aiLabels.map((lbl, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-900/90 text-slate-200 text-[9px] font-medium px-1.5 py-0.5 rounded"
                    >
                      {lbl}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-500">
                  Stake 10 Rep to certify this proof:
                </span>

                {audited ? (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>You Vouched ({audited.toUpperCase()})</span>
                  </span>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                      onClick={() => handleAudit(item.id, 'rejected')}
                      leftIcon={<XCircle className="w-3.5 h-3.5" />}
                    >
                      Flag Spam
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      className="text-xs"
                      onClick={() => handleAudit(item.id, 'approved')}
                      leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                    >
                      Vouch Proof (+15 Rep)
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
