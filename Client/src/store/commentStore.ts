import { create } from "zustand";
import api from "../api/axios";
import type { CommentState, CommentType } from "../types/comment.types";

export const useCommentStore = create<CommentState>((set, get) => ({
  comments: {},
  loading: {},

  setComments: (postId: number, comments: CommentType[]) => {
    set((state) => ({
      comments: {
        ...state.comments,
        [postId]: comments,
      },
    }));
  },


  fetchComments: async (postId: number) => {
    if (get().loading[postId]) return; // prevent duplicate requests
    set((state) => ({
      loading: { ...state.loading, [postId]: true },
    }));

    try {
      const res = await api.get(`/content/post/${postId}/comments`);
      const comments: CommentType[] = res.data.map((c: CommentType) => ({
        ...c,
        isLiked: Boolean(c.isLiked),
        likeCount: c.likeCount ?? 0,
      }));
      get().setComments(postId, comments);
    } catch (err) {
      console.error(err);
    } finally {
      set((state) => ({
        loading: { ...state.loading, [postId]: false },
      }));
    }
  },

  addComment: (postId: number, comment: CommentType) => {
    const formatted: CommentType = {
      ...comment,
      likeCount: comment.likeCount ?? 0,
      isLiked: Boolean(comment.isLiked),
    };

    set((state) => ({
      comments: {
        ...state.comments,
        [postId]: [...(state.comments[postId] ?? []), formatted],
      },
    }));
  },

  toggleLike: (postId: number, commentId: number) => {
    set((state) => ({
      comments: {
        ...state.comments,
        [postId]: (state.comments[postId] || []).map((c) =>
          c.id === commentId
            ? {
              ...c,
              isLiked: !c.isLiked,
              likeCount: c.isLiked ? c.likeCount - 1 : c.likeCount + 1,
            }
            : c
        ),
      },
    }));
  }


}));