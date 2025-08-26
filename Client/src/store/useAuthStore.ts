import { create } from "zustand";
import type { AuthState, User } from "../types/auth.types";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,


  login: (
    user: User,
    accessToken: string
  ) =>
    set({
      user,
      accessToken
    }),

  logout: () => set({
    user: null,
    accessToken: null
  }),

  setTokens: (
    accessToken: string,
  ) =>
    set({
      accessToken,
    }),
}));
