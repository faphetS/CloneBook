export type CommentType = {
  id: number;
  userId: number;
  postId: number;
  username: string;
  profilePic: string;
  content: string;
  created_at: string;
  likeCount: number;
  isLiked: boolean;
  postOwnerId?: number;
};

export type CommentState = {
  comments: Record<number, CommentType[]>;
  loading: Record<number, boolean>;
  loadingInput: Record<number, boolean>;
  loadingMore: Record<number, boolean>;
  offsets: Record<number, number>;
  limits: Record<number, number>;
  hasMore: Record<number, boolean>;

  setComments: (
    postId: number,
    newComments: CommentType[],
    offset: number,
    limit: number
  ) => void;
  resetComments: (postId: number) => void;
  fetchComments: (postId: number, loadMore?: boolean) => Promise<void>;
  createComment: (postId: number, comment: string) => Promise<boolean>;
  deleteComment: (postId: number, commentId: number) => Promise<void>;
  toggleLike: (postId: number, commentId: number) => void;
};

export type CommentInputProps = {
  onSubmit: (text: string) => void;
};
