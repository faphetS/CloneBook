import { create } from "zustand";
import api from "../api/axios";
import type { PostState, PostType } from "../types/post.types";


export const usePostStore = create<PostState>((set) => ({
  posts: [],
  loading: true,
  setPosts: (posts) => set({ posts }),

  fetchPosts: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/content");
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


