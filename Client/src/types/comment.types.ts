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
};

export type CommentState = {
  comments: Record<number, CommentType[]>;
  loading: Record<number, boolean>;
  setComments: (postId: number, comments: CommentType[]) => void;
  fetchComments: (postId: number) => Promise<void>;
  addComment: (postId: number, comment: CommentType) => void;
  toggleLike: (postId: number, commentId: number) => void;
};

export type CommentInputProps = {
  onSubmit: (text: string) => void;
};
