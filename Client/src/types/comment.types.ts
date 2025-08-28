export type CommentType = {
  id: number;
  postId: number;
  userId: number;
  username: string;
  content: string;
  created_at: string;
  likeCount: number;
  isLiked: boolean;
};

export type CommentState = {
  comments: CommentType[];
  loading: boolean;
  setComments: (comments: CommentType[]) => void;
  fetchComments: (postId: number) => Promise<void>;
  addComment: (comment: CommentType) => void;
  toggleLike: (commentId: number) => void;
};

export type CommentProp = {
  username: string;
  created_at: string;
  content: string;
}

export type CommentInputProps = {
  onSubmit: (text: string) => void;
};
