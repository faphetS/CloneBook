import { create } from "zustand";
import api from "../api/axios";
import type { FriendStatus, FriendStore } from "../types/friend.types";

export const useFriendStore = create<FriendStore>((set, get) => ({
  friends: [],
  friendStatus: "none",
  friendCount: 0,
  pendingRequests: [],
  outgoingRequests: [],
  loading: false,

  fetchFriends: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/friends");
      set({ friends: res.data, loading: false });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  fetchFriendCount: async (userId: number) => {
    try {
      const res = await api.get(`/friends/count/${userId}`); // GET /friends/count/:userId
      set({ friendCount: res.data.friendCount });
    } catch (err) {
      console.error(err);
    }
  },

  fetchFriendStatus: async (userId: number) => {
    try {
      const res = await api.get(`/friends/status/${userId}`);
      set({ friendStatus: res.data.status as FriendStatus });
    } catch (err) {
      console.error(err);
      set({ friendStatus: "none" });
    }
  },

  fetchPendingRequests: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/friends/requests");
      set({ pendingRequests: res.data, loading: false });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  sendRequest: async (receiverId: number) => {

    set((state) => ({
      outgoingRequests: [...state.outgoingRequests, receiverId],
      friendStatus: "pending_outgoing",
    }));

    try {
      await api.post("/friends/request", { receiver_id: receiverId });
    } catch (err) {
      console.error(err);
      set((state) => ({
        outgoingRequests: state.outgoingRequests.filter((id) => id !== receiverId),
        friendStatus: "none",
      }));
    }
  },

  acceptRequest: async (senderId: number) => {
    const prevPending = get().pendingRequests;
    set({
      pendingRequests: prevPending.filter((req) => req.senderId !== senderId),
      friendStatus: "friends",
    });
    try {
      await api.post("/friends/request/accept", { sender_id: senderId });
      // optional: refresh friends list
      await get().fetchFriends();
    } catch (err) {
      console.error(err);
      set({ pendingRequests: prevPending, friendStatus: "pending_incoming" });
    }
  },

  declineRequest: async (senderId: number) => {
    const prevPending = get().pendingRequests;
    set({
      pendingRequests: prevPending.filter((req) => req.senderId !== senderId),
      friendStatus: "none",
    });
    try {
      await api.post("/friends/request/decline", { sender_id: senderId });
    } catch (err) {
      console.error(err);
      set({ pendingRequests: prevPending, friendStatus: "pending_incoming" });
    }
  },

  cancelRequest: async (receiverId: number) => {
    const prevOutgoing = get().outgoingRequests;
    set({
      outgoingRequests: prevOutgoing.filter((id) => id !== receiverId),
      friendStatus: "none",
    });
    try {
      await api.post("/friends/request/cancel", { receiver_id: receiverId });
    } catch (err) {
      console.error(err);
      set({ outgoingRequests: prevOutgoing, friendStatus: "pending_outgoing" });
    }
  },

  unfriend: async (friendId: number) => {
    set({ friendStatus: "none" });

    try {
      await api.delete(`/friends/${friendId}`);
      await get().fetchFriends();
      await get().fetchFriendCount(friendId);
    } catch (err) {
      console.error(err);
      set({ friendStatus: "friends" });
    }
  },

}));