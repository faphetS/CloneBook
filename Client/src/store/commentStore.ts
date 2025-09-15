import { create } from "zustand";
import api from "../api/axios";
import type { CommentState, CommentType } from "../types/comment.types";

export const useCommentStore = create<CommentState>((set, get) => ({
  comments: {},
  loading: {},
  loadingInput: {},
  loadingMore: {},
  offsets: {},
  limits: {},
  hasMore: {},

  setComments: (
    postId: number,
    newComments: CommentType[],
    offset: number,
    limit: number
  ) => {
    set((state) => ({
      comments: {
        ...state.comments,
        [postId]: [...(state.comments[postId] || []), ...newComments],
      },
      offsets: {
        ...state.offsets,
        [postId]: offset + newComments.length,
      },
      hasMore: {
        ...state.hasMore,
        [postId]: newComments.length === limit,
      },
    }));
  },

  resetComments: (postId: number) => {
    set((state) => ({
      comments: { ...state.comments, [postId]: [] },
      offsets: { ...state.offsets, [postId]: 0 },
      hasMore: { ...state.hasMore, [postId]: true },
    }));
  },

  fetchComments: async (postId: number, loadMore = false) => {
    const { offsets, hasMore, limits } = get();
    const offset = offsets[postId] ?? 0;
    const limit = limits[postId] ?? 5;

    if (hasMore[postId] === false) return;

    if (loadMore) {
      set((state) => ({
        loadingMore: { ...state.loadingMore, [postId]: true },
      }));
    } else {
      set((state) => ({
        loading: { ...state.loading, [postId]: true },
      }));
    }

    try {
      const res = await api.get(`/content/post/${postId}/comments?offset=${offset}&limit=${limit}`);
      const newComments: CommentType[] = res.data.map((c: CommentType) => ({
        ...c,
        isLiked: Boolean(c.isLiked),
        likeCount: c.likeCount ?? 0,
      }));
      get().setComments(postId, newComments, offset, limit);
    } catch (err) {
      console.error(err);
    } finally {
      if (loadMore) {
        set((state) => ({
          loadingMore: { ...state.loadingMore, [postId]: false },
        }));
      } else {
        set((state) => ({
          loading: { ...state.loading, [postId]: false },
        }));
      }
    }
  },

  createComment: async (postId: number, content: string): Promise<boolean> => {
    if (!content.trim()) return false;

    set((state) => ({
      loadingInput: { ...state.loadingInput, [postId]: true },
    }));

    try {
      const res = await api.post(`/content/post/${postId}/comments`, { content });
      const comment: CommentType = res.data;

      const formatted: CommentType = {
        ...comment,
        likeCount: comment.likeCount ?? 0,
        isLiked: Boolean(comment.isLiked),
      };

      set((state) => ({
        comments: {
          ...state.comments,
          [postId]: [formatted, ...(state.comments[postId] ?? [])],
        },
      }));

      return true;
    } catch (err) {
      console.error("Add comment failed", err);
      return false;
    } finally {
      set((state) => ({
        loadingInput: { ...state.loadingInput, [postId]: false },
      }));
    }
  },

  deleteComment: async (postId: number, commentId: number) => {
    try {
      await api.delete(`/content/comment/${commentId}`);
      set((state) => ({
        comments: {
          ...state.comments,
          [postId]: (state.comments[postId] || []).filter(
            (c) => c.id !== commentId
          ),
        },
      }));
    } catch (err) {
      console.error(err);
    }
  },

  toggleLike: (postId: number, commentId: number) => {
    set((state) => ({
      comments: {
        ...state.comments,
        [postId]: (state.comments[postId] || []).map((c) => {
          if (c.id !== commentId) return c;
          const nextLiked = !c.isLiked;
          return {
            ...c,
            isLiked: nextLiked,
            likeCount: nextLiked ? c.likeCount + 1 : c.likeCount - 1,
          };
        }),
      },
    }));
  },


}));