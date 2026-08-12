export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'streak' | 'announcement' | 'partner' | 'system';
  read: boolean;
  createdAt: string;
  link?: string;
}

const NOTIFICATIONS_STORAGE_KEY = 'tewedada_notifications_v1';

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: '🔥 3-Day Coding Streak!',
    message: 'Awesome work! You completed your 1 Hour Coding Routine 3 days in a row.',
    type: 'streak',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    link: '/goals'
  },
  {
    id: 'notif-2',
    title: '📢 Community Announcement',
    message: 'Addis Tech Community posted a new monthly hackathon challenge.',
    type: 'announcement',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    link: '/communities/addis-tech'
  },
  {
    id: 'notif-3',
    title: '⏰ Daily Check-in Reminder',
    message: 'Don\'t forget to complete your Forex Trade Journaling before 9:00 PM.',
    type: 'reminder',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    link: '/home'
  }
];

export function getNotifications(): NotificationItem[] {
  if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS;
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading notifications:', err);
    return INITIAL_NOTIFICATIONS;
  }
}

export function markNotificationAsRead(id: string): NotificationItem[] {
  const current = getNotifications();
  const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error updating notification:', err);
  }
  return updated;
}

export function markAllNotificationsAsRead(): NotificationItem[] {
  const current = getNotifications();
  const updated = current.map((n) => ({ ...n, read: true }));
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error updating all notifications:', err);
  }
  return updated;
}

export function addNotification(item: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>): NotificationItem[] {
  const current = getNotifications();
  const newNotif: NotificationItem = {
    ...item,
    id: `notif-${Date.now()}`,
    read: false,
    createdAt: new Date().toISOString(),
  };
  const updated = [newNotif, ...current];
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error adding notification:', err);
  }
  return updated;
}
