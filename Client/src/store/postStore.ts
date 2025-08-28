import { create } from "zustand";
import api from "../api/axios";
import type { CommentState, CommentType } from "../types/comment.types";
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
}));

export const useCommentStore = create<CommentState>((set) => ({
  comments: [],
  loading: true,

  setComments: (comments) => set({ comments }),

  fetchComments: async (postId: number) => {
    set({ loading: true });
    try {
      const res = await api.get(`/content/post/${postId}/comments`);
      const comments: CommentType[] = res.data.map((c: CommentType) => ({
        ...c,
        isLiked: Boolean(c.isLiked),
      }));
      set({ comments });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  addComment: (comment) =>
    set((state) => ({
      comments: [
        {
          ...comment,
          likeCount: comment.likeCount ?? 0,
          isLiked: Boolean(comment.isLiked),
        },
        ...state.comments,
      ],
    })),

  toggleLike: (commentId) =>
    set((state) => ({
      comments: state.comments.map((c) =>
        c.id === commentId
          ? {
            ...c,
            isLiked: !c.isLiked,
            likeCount: c.isLiked ? c.likeCount - 1 : c.likeCount + 1,
          }
          : c
      ),
    })),
}));