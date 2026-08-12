'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, Users, Target, MessageSquare, AlertTriangle, CheckCircle2, XCircle, Shield, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, Badge } from '@/components/ui/Card';
import { INITIAL_REPORTS, Report } from '@/lib/store';

export default function AdminPage() {
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [auditLogs, setAuditLogs] = useState<Array<{ id: string; action: string; target: string; time: string }>>([
    { id: 'log-1', action: 'Approved community request', target: 'Python & Next.js Ethiopia', time: '2 hours ago' },
    { id: 'log-2', action: 'Dismissed report #41', target: 'Post #99', time: '1 day ago' }
  ]);

  const handleResolve = (id: string, action: string) => {
    setReports(reports.filter(r => r.id !== id));
    setAuditLogs([
      { id: `log-${Date.now()}`, action: `Moderator action: ${action}`, target: `Report #${id}`, time: 'Just now' },
      ...auditLogs
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-amber-500" />
            <span>Platform Moderation & Safety Admin</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Enforce community rules, review safety reports, and inspect audit logs.
          </p>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Users</span>
          <p className="text-xl font-bold text-slate-900 dark:text-slate-100">1,248</p>
        </Card>

        <Card className="space-y-1">
          <span className="text-xs text-slate-400 font-medium">Active Goals</span>
          <p className="text-xl font-bold text-emerald-600">3,410</p>
        </Card>

        <Card className="space-y-1">
          <span className="text-xs text-slate-400 font-medium">Verified Check-ins</span>
          <p className="text-xl font-bold text-blue-500">18,920</p>
        </Card>

        <Card className="space-y-1">
          <span className="text-xs text-slate-400 font-medium">Pending Reports</span>
          <p className="text-xl font-bold text-amber-500">{reports.length}</p>
        </Card>
      </div>

      {/* Reports Queue */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Pending Safety & Moderation Reports Queue</span>
          </h3>
        </div>

        {reports.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 font-medium">
            ✅ All reports resolved. System is clean!
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((rep) => (
              <div key={rep.id} className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-2">
                    <Badge variant="amber">{rep.reason}</Badge>
                    <span className="text-slate-500">Target: {rep.target_type} ({rep.target_id})</span>
                  </div>
                  <span className="text-slate-400">Reported by {rep.reporter_name}</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{rep.description}</p>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleResolve(rep.id, 'Dismissed')}>
                    Dismiss
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleResolve(rep.id, 'Removed content & issued warning')}>
                    Remove Content & Warn User
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Audit Logs */}
      <Card className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <FileText className="w-4 h-4 text-slate-500" />
          <span>Moderator Audit Logs</span>
        </h3>

        <div className="space-y-2">
          {auditLogs.map((log) => (
            <div key={log.id} className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200">{log.action} ({log.target})</span>
              <span className="text-[10px] text-slate-400">{log.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
