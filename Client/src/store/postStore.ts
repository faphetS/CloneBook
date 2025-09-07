import { create } from "zustand";
import api from "../api/axios";
import type { PostState, PostType } from "../types/post.types";


export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  loading: true,
  offset: 0,
  limit: 10,

  setPosts: (posts) => set({ posts }),
  resetPosts: () => set({ posts: [], offset: 0 }),

  fetchPosts: async () => {
    const { offset, limit, posts } = get();
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
      });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  fetchUserPosts: async (userId: number) => {
    set({ loading: true });
    try {
      const res = await api.get(`/content/${userId}`);
      const posts: PostType[] = res.data.map((p: PostType) => ({
        ...p,
        isLiked: Boolean(p.isLiked),
      }));
      set({ posts });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  addPost: (post) =>
    set((state) => ({
      posts: [{
        ...post,
        likeCount: post.likeCount ?? 0,
        isLiked: Boolean(post.isLiked)
      },
      ...state.posts],
    })),

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


