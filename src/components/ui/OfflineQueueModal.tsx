'use client';

import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, CheckCircle2, AlertCircle, Trash2, CloudUpload, Clock, FileImage, ShieldCheck } from 'lucide-react';
import { Dialog } from './Dialog';
import { Button } from './Button';
import { Badge } from './Card';
import { QueuedCheckin, getQueuedCheckins, removeQueuedCheckin, clearQueuedCheckins, processOfflineQueue, subscribeQueueChanges } from '@/lib/offline-queue';

interface OfflineQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  isOnline: boolean;
  onSyncComplete?: (count: number) => void;
}

export const OfflineQueueModal: React.FC<OfflineQueueModalProps> = ({
  isOpen,
  onClose,
  isOnline,
  onSyncComplete,
}) => {
  const [items, setItems] = useState<QueuedCheckin[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeQueueChanges((queued) => {
      setItems(queued);
    });
    return () => unsubscribe();
  }, []);

  const handleManualSync = async () => {
    if (!isOnline) {
      setSyncStatusMsg('⚠️ Device is offline. Reconnect to internet to sync.');
      return;
    }

    setIsSyncing(true);
    setSyncStatusMsg('Syncing check-ins to server...');
    const res = await processOfflineQueue();
    setIsSyncing(false);

    if (res.syncedCount > 0) {
      setSyncStatusMsg(`✅ Successfully synced ${res.syncedCount} check-in(s)!`);
      if (onSyncComplete) onSyncComplete(res.syncedCount);
      setTimeout(() => setSyncStatusMsg(null), 3000);
    } else {
      setSyncStatusMsg('No pending items to sync.');
      setTimeout(() => setSyncStatusMsg(null), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    await removeQueuedCheckin(id);
  };

  const handleClearAll = async () => {
    if (confirm('Are you sure you want to clear all offline check-ins?')) {
      await clearQueuedCheckins();
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Offline Sync & Proof Queue">
      <div className="space-y-4">
        {/* Status Header */}
        <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {isOnline ? 'Network Connected' : 'Offline / Poor Connection'}
              </p>
              <p className="text-[11px] text-slate-500">
                {items.length === 0
                  ? 'All habit proofs are synced in database'
                  : `${items.length} proof submission(s) pending sync`}
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="primary"
            disabled={isSyncing || items.length === 0 || !isOnline}
            onClick={handleManualSync}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />}
          >
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </Button>
        </div>

        {syncStatusMsg && (
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-xs font-medium text-center">
            {syncStatusMsg}
          </div>
        )}

        {/* Queued Items List */}
        {items.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Queue is completely clear!</p>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
              When network coverage drops, your daily check-in proofs will safely queue here in IndexedDB until restored.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                      {item.routineTitle}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center space-x-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>•</span>
                      <span>Date: {item.scheduledDate}</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge variant="amber">Pending Sync</Badge>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                      title="Discard item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {item.note && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg">
                    {item.note}
                  </p>
                )}

                {item.evidenceUrl && (
                  <div className="flex items-center space-x-3 text-[11px] text-slate-500 pt-1">
                    <div className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <FileImage className="w-3.5 h-3.5" />
                      <span>Compressed Proof ({item.evidenceSizeFormatted || '<150 KB'})</span>
                    </div>
                    {item.aiScore !== undefined && (
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                        AI Score: {Math.round(item.aiScore * 100)}%
                      </span>
                    )}
                    {item.privacyBlurred && (
                      <span className="text-[10px] bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded">
                        Face Blurred
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
          {items.length > 0 ? (
            <button
              onClick={handleClearAll}
              className="text-red-500 hover:underline text-xs font-semibold"
            >
              Clear Queue
            </button>
          ) : <div />}

          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
