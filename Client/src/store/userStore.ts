import axios from "axios";
import { create } from "zustand";
import api from "../api/axios";
import type { UserSearchType, UserState, UserType } from "../types/user.types";


export const useUserStore = create<UserState>((set) => ({
  profile: null,
  loading: true,
  loadingSearch: false,
  searchResults: [],


  fetchUserDetails: async (userId: number) => {
    set({ loading: true });
    try {
      const res = await api.get<UserType>(`/user/${userId}`);
      set({ profile: res.data });
    } catch (err) {
      console.error("Failed to fetch user", err);
    } finally {
      set({ loading: false });
    }
  },

  searchUsers: async (username: string) => {
    set({ loadingSearch: true })
    try {
      const res = await api.get<UserSearchType[]>("/user/search", {
        params: { username }
      });

      set({
        searchResults: res.data
      });
    } catch (error) {
      console.error("Search failed:", error);
      set({ searchResults: [] });
    } finally {
      set({ loadingSearch: false })
    }
  },

  setLoadingSearch: (val: boolean) => set({ loadingSearch: val }),

  updateProfile: async (data: {
    username?: string;
    password?: string;
    profilePic?: File | null;
  }): Promise<{ message: string, user: UserType }> => {
    set({ loading: true });

    try {
      const formData = new FormData();
      if (data.username) formData.append("username", data.username);
      if (data.password) formData.append("password", data.password);
      if (data.profilePic) formData.append("profilePic", data.profilePic);

      console.log("Sending updateProfile request with FormData:");
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const res = await api.put<{ message: string; user: UserType }>("/user/profile", formData);


      console.log("updateProfile response:", res.data);

      set({
        profile: res.data.user,
      });

      return res.data;
    } catch (err: unknown) {
      console.error("Failed to update profile:", err);

      if (axios.isAxiosError(err)) {
        console.error("Axios error details:");
        console.error("Status:", err.response?.status);
        console.error("Response data:", err.response?.data);
        console.error("Headers:", err.response?.headers);
      }

      throw err;
    } finally {
      set({ loading: false });
    }
  },


}));