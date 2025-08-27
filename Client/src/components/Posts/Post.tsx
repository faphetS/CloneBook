import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import api from "../../api/axios";
import type { PostProps } from "../../types/post.types";

//  post text only
const Post = ({ id, username, content, created_at, likeCount: initialLikeCount, isLiked }: PostProps) => {

  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);


  const handleLike = async (): Promise<void> => {
    try {
      const res = await api.post(`/content/post/${id}`);
      setLiked(Boolean(res.data.liked));
      setLikeCount((prev) => (res.data.liked ? prev + 1 : prev - 1));
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="bg-neutral-900 w-full flex flex-col items-center rounded-2xl px-3 pt-3 gap-3">

      <div className="w-full min-h-12 flex items-center gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-12 h-12 text-neutral-400 shrink-0"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 
                7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 
                0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 
                0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 
                3 3 0 0 1 6 0Z"
          />
        </svg>
        <div className="flex flex-col">
          <p className="font-semibold">{username}</p>
          <p className="text-neutral-400 text-xs">
            {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
          </p>
        </div>
      </div>
      <p className="text-white font-base whitespace-pre-wrap break-words max-w-[640px] w-full">
        {content}
      </p>
      <div className="flex justify-between w-full  max-w-[640px] text-xs text-neutral-400">
        <div>{likeCount > 0
          ? `${likeCount} like${likeCount > 1 ? "s" : ""}`
          : ""}
        </div>
        <div>5 comments</div>
      </div>
      <div className="flex justify-around items-center border-t border-neutral-700 w-full py-2">
        <button onClick={handleLike} className={`hover:bg-neutral-700/50 w-full py-2 rounded-md cursor-pointer  font-semibold transition duration-100 ${liked ? "text-[#1877F2]" : "text-neutral-400"}`}>
          {liked ? "Liked" : "Like"}
        </button>
        <button className="hover:bg-neutral-700/50 w-full py-2 rounded-md cursor-pointer text-neutral-400 font-semibold transition duration-100">Comment</button>
      </div>

    </div>
  )
}

export default Post