import { create } from "zustand";
import api from "../api/axios";
import type { Notification, NotificationState } from "../types/notification.types";


export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  loading: false,
  loadingMore: false,
  offset: 0,
  limit: 10,
  hasMore: true,
  unreadCount: 0,

  resetNotif: () => set({
    notifications: [],
    loading: false,
    loadingMore: false,
    offset: 0,
    limit: 10,
    hasMore: true,
    unreadCount: 0
  }),

  fetchUnreadCount: async () => {
    try {
      const res = await api.get<{ count: number }>("/notifications/count");
      set({ unreadCount: res.data.count });
    } catch (error) {
      console.error("Failed to fetch unread count", error);
    }
  },

  fetchNotifs: async (loadMore = false) => {
    const { offset, limit, hasMore } = get();
    if (loadMore && !hasMore) return;

    if (loadMore) {
      set({ loadingMore: true });
    } else {
      set({ loading: true });
    }
    try {
      const res = await api.get<Notification[]>(`/notifications?offset=${loadMore ? offset : 0}&limit=${limit}`);

      const data = res.data;

      set((state) => ({
        notifications: loadMore
          ? [...state.notifications, ...data]
          : data,
        offset: loadMore ? state.offset + data.length : data.length,
        hasMore: data.length === limit,
      }));
    } catch (error) {
      console.error("Failed to fetch notifs", error);
    } finally {
      set({ loading: false, loadingMore: false });
    }
  },

  markAllAsRead: async () => {
    try {

      set({ unreadCount: 0 });

      await api.patch("/notifications/read-all");
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  },


}));
