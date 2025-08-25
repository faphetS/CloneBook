import { create } from "zustand";
import type { AuthState, User } from "../types/auth.types";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,

  login: (user: User, accessToken: string, refreshToken: string) =>
    set({ user, accessToken, refreshToken }),

  logout: () => set({ user: null, accessToken: null, refreshToken: null }),

  setTokens: (accessToken: string, refreshToken: string) =>
    set({ accessToken, refreshToken }),
}));
