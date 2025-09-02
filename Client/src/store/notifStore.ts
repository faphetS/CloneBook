import { create } from "zustand";
import api from "../api/axios";
import type { Notification, NotificationState } from "../types/notification.types";


export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  loading: true,

  fetchNotifs: async () => {
    set({ loading: true });
    try {
      const res = await api.get<Notification[]>("/notifications");
      set({ notifications: res.data });
    } catch (error) {
      console.error("Failed to fetch notifs", error);
    } finally {
      set({ loading: false });
    }
  },

  markAllAsRead: async () => {
    try {
      await api.patch("/notifications/read-all");
      set((state) => ({
        notifications: state.notifications.map((n) => ({
          ...n,
          unread: false,
        })),
      }));
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  },


}));
