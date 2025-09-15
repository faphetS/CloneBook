import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuthStore } from "../../store/autStore";
import { useCommentStore } from "../../store/commentStore";
import { usePostStore } from "../../store/postStore";
import type { PostType } from "../../types/post.types";
import { formatShortTime } from "../../utils/time";
import CommentInput from "./CommentInput";
import PostComment from "./PostComment";


//  post text only
const Post = ({ id, userId, username, content, profilePic, created_at, likeCount, isLiked, commentCount }: PostType) => {
  const { toggleLike, deletePost } = usePostStore();

  const { comments, fetchComments, resetComments, loading, loadingMore, hasMore } = useCommentStore();
  const [toggleComment, setToggleComment] = useState(false);
  const { user } = useAuthStore();

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
      resetComments(id);
      fetchComments(id);
    }
  }, [toggleComment, id, resetComments, fetchComments]);
  return (
    <div className="bg-neutral-900 w-full flex flex-col items-center rounded-2xl px-3 pt-3 gap-3 relative group">

      <div className="w-full min-h-12 flex items-center gap-3">

        <Link to={`/profile/${userId}`}>
          <div className="min-w-12 min-h-12 flex items-center justify-center">
            <img
              src={profilePic || "/user.svg"}
              alt={`${username}'s profile`}
              className={`w-11 h-11 rounded-full object-cover ${profilePic ? ("") : ("border-2 border-neutral-800")}`}
            />
          </div>
        </Link>

        <div className="flex flex-col">
          <Link to={`/profile/${userId}`}>
            <p className="font-semibold hover:underline">{username}</p>
          </Link>
          <p className="text-neutral-400 text-xs">
            {formatShortTime(new Date(created_at))}
          </p>
        </div>

      </div>

      {user?.id === userId && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none" viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          onClick={() => deletePost(id)}
          className="size-9 p-2 absolute right-3 top-3 opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-600 hover:bg-neutral-700/90 cursor-pointer rounded-full">
          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
      )}


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
        <div className="w-full">
          {loading[id] ? (
            <p className="text-neutral-400 text-sm p-2">Loading comments...</p>
          ) : (
            <>
              <div className="max-h-[400px] overflow-y-auto overflow-x-hidden pt-1 pr-2 custom-scrollbar">
                {(comments[id] || []).map((c) => (
                  <PostComment
                    key={c.id}
                    {...c}
                    postOwnerId={userId}
                  />
                ))}
                {hasMore[id] && (
                  <button
                    onClick={() => fetchComments(id, true)}
                    disabled={loadingMore[id]}
                    className="ml-2 mb-1 text-neutral-400 hover:underline disabled:opacity-50"
                  >
                    {loadingMore[id] ? "Loading..." : "Load more comments"}
                  </button>
                )}
              </div>


              <CommentInput id={id} />
            </>
          )}
        </div>
      )}


    </div>
  )
}

export default Post