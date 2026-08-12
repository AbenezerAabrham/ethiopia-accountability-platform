export interface QueuedCheckin {
  id: string;
  routineId: string;
  scheduledDate: string;
  note?: string;
  evidenceUrl?: string;
  createdAt: string;
}

const STORAGE_KEY = 'tewedada_offline_checkins_queue';

export function getQueuedCheckins(): QueuedCheckin[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read offline checkin queue:', err);
    return [];
  }
}

export function enqueueCheckin(checkin: Omit<QueuedCheckin, 'id' | 'createdAt'>): QueuedCheckin {
  const existing = getQueuedCheckins();
  const newItem: QueuedCheckin = {
    ...checkin,
    id: `offline-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };

  const updated = [newItem, ...existing];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to enqueue offline checkin:', err);
  }
  return newItem;
}

export function removeQueuedCheckin(id: string): void {
  const existing = getQueuedCheckins();
  const updated = existing.filter((item) => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to remove queued checkin:', err);
  }
}

export function clearCheckinQueue(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear checkin queue:', err);
  }
}

export async function processOfflineQueue(): Promise<{ syncedCount: number; errors: number }> {
  const queued = getQueuedCheckins();
  if (queued.length === 0) return { syncedCount: 0, errors: 0 };

  let syncedCount = 0;
  let errors = 0;

  for (const item of queued) {
    try {
      // Simulate/perform server checkin sync
      await new Promise((res) => setTimeout(res, 200));
      removeQueuedCheckin(item.id);
      syncedCount++;
    } catch (err) {
      console.error('Failed syncing offline checkin:', item, err);
      errors++;
    }
  }

  return { syncedCount, errors };
}
