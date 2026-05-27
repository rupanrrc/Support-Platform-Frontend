import { create } from "zustand";
import type { Notification } from "@/types/notification";

interface NotificationState {
  unreadCount: number;
  notifications: Notification[];
  setUnreadCount: (count: number) => void;
  setNotifications: (items: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 0,
  notifications: [],

  setUnreadCount: (count) => set({ unreadCount: count }),

  setNotifications: (notifications) => set({ notifications }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: notification.isRead ? state.unreadCount : state.unreadCount + 1
    })),

  markRead: (id) =>
    set((state) => {
      const target = state.notifications.find((n) => n._id === id);
      const wasUnread = target && !target.isRead;
      return {
        notifications: state.notifications.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
      };
    }),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0
    })),

  removeNotification: (id) =>
    set((state) => {
      const target = state.notifications.find((n) => n._id === id);
      return {
        notifications: state.notifications.filter((n) => n._id !== id),
        unreadCount:
          target && !target.isRead
            ? Math.max(0, state.unreadCount - 1)
            : state.unreadCount
      };
    })
}));
