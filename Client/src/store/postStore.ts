import { create } from "zustand";
import api from "../api/axios";
import type { PostState, PostType } from "../types/post.types";


export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  loading: true,
  posting: false,
  offset: 0,
  limit: 10,
  hasMore: true,

  setPosts: (posts) => set({ posts }),
  resetPosts: () => set({ posts: [], offset: 0, hasMore: true }),

  fetchPosts: async () => {
    const { offset, limit, posts, hasMore } = get();
    if (!hasMore) return;
    set({ loading: true });

    try {
      const res = await api.get(`/content?offset=${offset}&limit=${limit}`);
      const newPosts: PostType[] = res.data.map((p: PostType) => ({
        ...p,
        isLiked: Boolean(p.isLiked),
      }));

      set({
        posts: [...posts, ...newPosts],
        offset: offset + newPosts.length,
        hasMore: newPosts.length === limit,
      });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  fetchUserPosts: async (userId: number) => {
    const { offset, limit, posts, hasMore } = get();
    if (!hasMore) return;
    set({ loading: true });
    try {
      const res = await api.get(`/content/${userId}?offset=${offset}&limit=${limit}`);
      const newPosts: PostType[] = res.data.map((p: PostType) => ({
        ...p,
        isLiked: Boolean(p.isLiked),
      }));
      set({
        posts: [...posts, ...newPosts],
        offset: offset + newPosts.length,
        hasMore: newPosts.length === limit,
      });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  createPost: async (content: string) => {
    if (!content.trim()) return false;
    set({ posting: true });

    try {
      const res = await api.post("/content/post", { content });
      const post = res.data;

      set((state) => ({
        posts: [
          {
            ...post,
            likeCount: post.likeCount ?? 0,
            isLiked: Boolean(post.isLiked),
          },
          ...state.posts,
        ],
      }));

      return true;
    } catch (err) {
      console.error("Post failed", err);
      return false;
    } finally {
      set({ posting: false });
    }
  },

  deletePost: async (postId: number) => {
    try {
      await api.delete(`/content/post/${postId}`);
      set((state) => ({
        posts: state.posts.filter((p) => p.id !== postId),
      }));
    } catch (err) {
      console.error(err);
    }
  },

  toggleLike: (postId) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId
          ? {
            ...p,
            isLiked: !p.isLiked,
            likeCount: p.isLiked ? p.likeCount - 1 : p.likeCount + 1,
          }
          : p
      ),
    })),

  updatePost: (postId, data) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, ...data } : p
      ),
    })),

}));


