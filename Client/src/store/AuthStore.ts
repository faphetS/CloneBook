import { AxiosError } from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../api/axios";
import type { AuthState, User } from "../types/auth.types";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,

      login: (user: User, accessToken: string) =>
        set({
          user,
          accessToken,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
        }),

      setTokens: (accessToken: string) =>
        set({
          accessToken,
        }),

      updateUser: (updatedUser: User) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : updatedUser,
        })),

      verifyEmail: async (token: string) => {
        try {
          const encodedToken = encodeURIComponent(token);
          const res = await api.get<{ success: boolean; message: string }>(
            `/auth/verify?token=${encodedToken}`
          );
          return res.data;
        } catch (err: unknown) {
          let message = "Verification failed.";

          if (err instanceof AxiosError) {
            message = err.response?.data?.message || message;
          }

          return { success: false, message };
        }
      },


    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),

    }
  )
);
