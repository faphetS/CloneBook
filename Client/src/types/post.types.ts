
export interface PostType {
  id: number;
  username: string;
  content: string;
  created_at: string;
  likeCount: number;
  isLiked: number
};
export interface PostProps {
  id: number;
  username: string;
  content: string;
  created_at: string;
  likeCount: number,
  isLiked: boolean
};

// export interface PostState {
//   posts: PostType[];
//   setPosts: (posts: PostType[]) => void;
//   addPost: (post: PostType) => void;
//   toggleLike: (id: number) => Promise<void>;
// }