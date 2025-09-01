
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { useCommentStore } from "../../store/commentStore";
import type { CommentType } from "../../types/comment.types";
import { formatShortTime } from "../../utils/time";

const PostComment = ({ id, postId, userId, username, profilePic, created_at, content, likeCount, isLiked }: CommentType) => {

  const { toggleLike } = useCommentStore();

  const handleLike = async () => {
    toggleLike(postId, id);
    try {
      await api.post(`/content/comment/${id}/like`);
    } catch (error) {
      console.error(error);
      toggleLike(postId, id);
    }
  }
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
            <div className="flex flex-col bg-neutral-800 p-2 rounded-xl max-w-[596px] min-w-[100px] whitespace-pre-wrap break-words">
              <Link to={`/profile/${userId}`}>
                <p className="font-semibold leading-none">{username}</p>
              </Link>
              <p className="text-white text-xs mt-1 break-all">
                {content}
              </p>
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