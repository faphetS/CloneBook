
export interface PostType {
  id: number;
  userId: number;
  username: string;
  content: string;
  profilePic: string;
  created_at: string;
  likeCount: number;
  isLiked: boolean
  commentCount: number;
};
export interface PostState {
  posts: PostType[];
  loading: boolean;
  offset: number;
  limit: number;
  hasMore: boolean;
  setPosts: (posts: PostType[]) => void;
  resetPosts: () => void;
  fetchPosts: () => Promise<void>;
  fetchUserPosts: (userId: number) => Promise<void>;
  createPost: (content: string) => Promise<boolean>;
  deletePost: (postId: number) => Promise<void>;
  toggleLike: (postId: number) => void;
  updatePost: (postId: number, data: Partial<PostType>) => void;
}
