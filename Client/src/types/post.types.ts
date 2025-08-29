
export interface PostType {
  id: number;
  username: string;
  content: string;
  created_at: string;
  likeCount: number;
  isLiked: boolean
  commentCount: number;
};
export interface PostState {
  posts: PostType[];
  loading: boolean;
  setPosts: (posts: PostType[]) => void;
  fetchPosts: () => Promise<void>;
  addPost: (post: PostType) => void;
  toggleLike: (postId: number) => void;
  updatePost: (postId: number, data: Partial<PostType>) => void;
}
