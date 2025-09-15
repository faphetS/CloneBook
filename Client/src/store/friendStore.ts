import { create } from "zustand";
import api from "../api/axios";
import type { Friend, FriendStatus, FriendStore } from "../types/friend.types";

export const useFriendStore = create<FriendStore>((set, get) => ({
  friends: [],
  friendsPagination: {
    offset: 0,
    limit: 11,
    hasMore: true,
    loading: false,
  },

  pendingRequests: [],
  pendingPagination: {
    offset: 0,
    limit: 7,
    hasMore: true,
    loading: false,
    loadingMore: false,
  },

  outgoingRequests: [],
  friendStatus: "none",
  friendCount: 0,
  pendingCount: 0,


  fetchFriends: async () => {
    const { friendsPagination, friends } = get();
    const { offset, limit, hasMore } = friendsPagination;
    if (!hasMore) return;

    set({
      friendsPagination: {
        ...friendsPagination,
        loading: true,
      },
    });
    try {
      const res = await api.get(`/friends?offset=${offset}&limit=${limit}`);
      const data = res.data

      set({
        friends: [...friends, ...data],
        friendsPagination: {
          offset: offset + data.length,
          limit,
          hasMore: data.length === limit,
          loading: false,
        },
      });
    } catch (err) {
      console.error(err);
      set({
        friendsPagination: {
          ...friendsPagination,
          loading: false,
        },
      });
    }
  },

  fetchFriendCount: async (userId: number) => {
    try {
      const res = await api.get(`/friends/count/${userId}`);
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

  resetPendingReq: () => set({
    friends: [],
    friendsPagination: {
      offset: 0,
      limit: 11,
      hasMore: true,
      loading: false,
    },
  }),

  resetFriends: () => set({
    pendingRequests: [],
    pendingPagination: {
      offset: 0,
      limit: 7,
      hasMore: true,
      loading: false,
      loadingMore: false,
    },
  }),

  fetchPendingCount: async () => {
    try {
      const res = await api.get("/friends/count/pending");
      set({ pendingCount: res.data.count });
    } catch (error) {
      console.error("Failed to fetch pending count", error);
    }
  },

  fetchPendingRequests: async (loadMore = false) => {
    const { pendingPagination, pendingRequests } = get();
    const { offset, limit, hasMore } = pendingPagination;
    if (loadMore && !hasMore) return;

    set({
      pendingPagination: {
        ...pendingPagination,
        loading: !loadMore,
        loadingMore: loadMore,
      },
    });

    try {
      const res = await api.get(`/friends/requests?offset=${loadMore ? offset : 0}&limit=${limit}`);
      const data = res.data;
      set({
        pendingRequests: loadMore ? [...pendingRequests, ...data] : data,
        pendingPagination: {
          offset: loadMore ? offset + data.length : data.length,
          limit,
          hasMore: data.length === limit,
          loading: false,
          loadingMore: false,
        },
      });
    } catch (err) {
      console.error(err);
      set({
        pendingPagination: {
          ...pendingPagination,
          loading: false,
          loadingMore: false,
        },
      });
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

  acceptRequest: async (friend: Friend) => {
    const { pendingRequests, pendingCount, friends } = get();

    const prevPending = [...pendingRequests];
    const prevCount = pendingCount;
    const prevFriends = [...friends];
    set({
      pendingRequests: prevPending.filter((req) => req.senderId !== friend.id),
      pendingCount: Math.max(prevCount - 1, 0),
      friends: [...friends, friend],
      friendStatus: "friends",
    });
    try {
      await api.post("/friends/request/accept", { sender_id: friend.id });
    } catch (err) {
      console.error(err);
      set({
        pendingRequests: prevPending,
        pendingCount: prevCount,
        friends: prevFriends,
        friendStatus: "pending_incoming"
      });
    }
  },

  declineRequest: async (senderId: number) => {
    const prevPending = get().pendingRequests;
    const prevCount = get().pendingCount;
    set({
      pendingRequests: prevPending.filter((req) => req.senderId !== senderId),
      pendingCount: Math.max(prevCount - 1, 0),
      friendStatus: "none",
    });
    try {
      await api.post("/friends/request/decline", { sender_id: senderId });
    } catch (err) {
      console.error(err);
      set({
        pendingRequests: prevPending,
        pendingCount: prevCount,
        friendStatus: "pending_incoming"
      });
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
    const prevFriends = get().friends;
    const prevCount = get().friendCount;
    set({
      friends: prevFriends.filter((f) => f.id !== friendId),
      friendCount: Math.max(prevCount - 1, 0),
      friendStatus: "none",
    });

    try {
      await api.delete(`/friends/${friendId}`);
    } catch (err) {
      console.error(err);
      set({
        friends: prevFriends,
        friendCount: prevCount,
        friendStatus: "friends",
      });
    }
  },

}));