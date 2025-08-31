import { create } from "zustand";
import { persist } from "zustand/middleware";
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

      updateUser: () =>
        set({
          //update userr
        }),

    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),

    }
  )
);
