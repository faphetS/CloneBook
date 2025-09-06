
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuthStore } from "../../store/authStore";
import { useCommentStore } from "../../store/commentStore";
import { usePostStore } from "../../store/postStore";
import type { CommentType } from "../../types/comment.types";
import { formatShortTime } from "../../utils/time";

const PostComment = ({ id, postId, userId, username, profilePic, created_at, content, likeCount, isLiked, postOwnerId }: CommentType) => {
  const { toggleLike, deleteComment } = useCommentStore();
  const { user } = useAuthStore();
  const { updatePost, posts } = usePostStore();
  const handleLike = async () => {
    toggleLike(postId, id);
    try {
      await api.post(`/content/comment/${id}/like`);
    } catch (error) {
      console.error(error);
      toggleLike(postId, id);
    }
  }

  const handleDelete = () => {
    deleteComment(postId, id);
    const currentPost = posts.find((p) => p.id === postId);
    if (currentPost) {
      updatePost(postId, { commentCount: Math.max((currentPost.commentCount || 0) - 1, 0) });
    }
  };

  return (
    <>
      <div className=" pb-2 py-2 -mt-3 w-full flex flex-col">
        <div className="w-full min-h-12 flex items-start gap-3">
          <Link to={`/profile/${userId}`}>
            {profilePic ? (
              <div className="min-w-12 min-h-12 flex items-center justify-center">
                <img
                  src={`${import.meta.env.VITE_API_DOMAIN}/uploads/${profilePic}`}
                  alt={`${username}'s profile`}
                  className="w-11 h-11 rounded-full object-cover"
                />
              </div>

            ) : (
              <div className="min-w-12 min-h-12 flex items-center justify-center justify-center">
                <img
                  src={`${import.meta.env.VITE_API_DOMAIN}/uploads/user.svg`}
                  alt={`${username}'s profile`}
                  className="w-11 h-11 rounded-full object-cover border-2 border-neutral-300"
                />
              </div>
            )}
          </Link>
          <div>
            <div className="flex flex-col bg-neutral-800 p-2 rounded-xl max-w-[555px] min-w-[100px] whitespace-pre-wrap break-words relative group/comment">
              <Link to={`/profile/${userId}`}>
                <p className="font-semibold leading-none hover:underline">{username}</p>
              </Link>
              <p className="text-white text-xs mt-1 break-all">
                {content}
              </p>
              {(user?.id === userId || user?.id === postOwnerId) && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none" viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  onClick={handleDelete}
                  className="size-9 p-2 absolute top-1/2 -translate-y-1/2 -right-10 opacity-0 group-hover/comment:opacity-100 text-neutral-400 hover:text-red-600 hover:bg-neutral-700/90 cursor-pointer rounded-full">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              )}

            </div>

            <div className="flex justify-between text-xs text-neutral-400 pl-1 pr-2">
              <div className="flex gap-3">
                <div >
                  {formatShortTime(new Date(created_at))}
                </div>
                <button onClick={handleLike} className={isLiked ? "text-[#1877F2]" : ""}>
                  {isLiked ? "Liked" : "Like"}
                </button>
              </div>
              {likeCount > 0 ? (
                <div className="flex items-center">
                  <span>{likeCount}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-4 text-[#1877F2]"
                  >
                    <path d="M6.633 10.25c.806 0 1.533-.446 
            2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 
            1.35-.956 1.653-1.715a4.498 4.498 0 0 0 
            .322-1.672V2.75a.75.75 0 0 1 
            .75-.75 2.25 2.25 0 0 1 2.25 
            2.25c0 1.152-.26 2.243-.723 
            3.218-.266.558.107 1.282.725 
            1.282h3.126c1.026 0 1.945.694 
            2.054 1.715.045.422.068.85.068 
            1.285a11.95 11.95 0 0 
            1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 
            0-.964-.078-1.423-.23l-3.114-1.04a4.501 
            4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 
            18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 
            0-1.713-.518-1.972-1.368a12 12 0 0 
            1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 
            9.953 4.167 9.5 5 9.5h1.053c.472 
            0 .745.556.5.96a8.958 8.958 0 0 
            0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                  </svg>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>


        </div>
      </div>





    </>

  )
}

export default PostComment