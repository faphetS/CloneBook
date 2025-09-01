import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { useCommentStore } from "../../store/commentStore";
import { usePostStore } from "../../store/postStore";
import type { PostType } from "../../types/post.types";
import { formatShortTime } from "../../utils/time";
import CommentInput from "./CommentInput";
import PostComment from "./PostComment";


//  post text only
const Post = ({ id, userId, username, content, profilePic, created_at, likeCount, isLiked, commentCount }: PostType) => {
  const { toggleLike } = usePostStore();

  const { comments, fetchComments, loading } = useCommentStore();
  const [toggleComment, setToggleComment] = useState(false);

  const handleLike = async (): Promise<void> => {
    toggleLike(id);
    try {
      await api.post(`/content/post/${id}`);
    } catch (error) {
      console.error(error);
      toggleLike(id);
    }
  };

  useEffect(() => {
    if (toggleComment) {
      fetchComments(id);
    }
  }, [toggleComment, id, fetchComments]);
  return (
    <div className="bg-neutral-900 w-full flex flex-col items-center rounded-2xl px-3 pt-3 gap-3">

      <div className="w-full min-h-12 flex items-center gap-3">
        <Link to={`/profile/${userId}`}>
          {profilePic ? (
            <div className="min-w-12 min-h-12 flex items-center justify-center">
              <img
                src={`${import.meta.env.VITE_API_DOMAIN}/uploads/${profilePic}`}
                alt={`${username}'s profile`}
                className="w-11 h-11 rounded-full object-cover border-neutral-800"
              />
            </div>

          ) : (
            <div className="min-w-[48px] min-h-[48px] flex items-center justify-center">
              <img
                src={`${import.meta.env.VITE_API_DOMAIN}/uploads/user.svg`}
                alt={`${username}'s profile`}
                className="w-11 h-11 rounded-full object-cover border-2 border-neutral-300"
              />
            </div>
          )}
        </Link>

        <div className="flex flex-col">
          <Link to={`/profile/${userId}`}>
            <p className="font-semibold">{username}</p>
          </Link>
          <p className="text-neutral-400 text-xs">
            {formatShortTime(new Date(created_at))}
          </p>
        </div>
      </div>
      <p className="text-white font-base whitespace-pre-wrap break-words max-w-[640px] w-full">
        {content}
      </p>
      {(likeCount > 0 || commentCount > 0) && (
        <div className="flex justify-between w-full max-w-[640px] text-xs text-neutral-400">
          <div>
            {likeCount > 0 && (
              <div className="flex items-center gap-1">
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
            )}
          </div>

          {commentCount > 0 && (
            <div
              onClick={() => setToggleComment(!toggleComment)}
              className="cursor-pointer hover:underline"
            >
              {commentCount} comments
            </div>
          )}
        </div>
      )}
      <div className={`flex justify-around items-center border-t border-neutral-700 w-full p-1 ${toggleComment ? "border-b" : ""}`}>
        <button onClick={handleLike} className={`hover:bg-neutral-700/50 w-full py-2 rounded-md cursor-pointer  font-semibold transition duration-100  ${isLiked ? "text-[#1877F2]" : "text-neutral-400"
          }`}>
          {isLiked ? "Liked" : "Like"}
        </button>
        <button
          onClick={() => setToggleComment(!toggleComment)} className="hover:bg-neutral-700/50 w-full py-2 rounded-md cursor-pointer text-neutral-400 font-semibold transition duration-100"
        >
          Comment
        </button>
      </div>
      {toggleComment && (
        <div className="w-full max-w-[640px]">
          {loading[id] ? (
            <p className="text-neutral-400 text-sm p-2">Loading comments...</p>
          ) : (
            <>
              {(comments[id] || []).map((c) => (
                <PostComment
                  key={c.id}
                  {...c}
                />
              ))}
              <CommentInput id={id} />
            </>
          )}
        </div>
      )}




    </div>
  )
}

export default Post