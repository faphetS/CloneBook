import { formatDistanceToNow } from "date-fns";
import type { PostProps } from "../../types/post.types";

//  post text only
const Post = ({ username, content, created_at }: PostProps) => {
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
          <p>{username}</p>
          <p className="text-neutral-400 text-xs">
            {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
          </p>
        </div>
      </div>
      <p className="text-white text-base whitespace-pre-wrap break-words max-w-[590px] w-full">
        {content}
      </p>
      <div className="flex justify-around items-center border-t border-neutral-700 w-full py-2">
        <button className="hover:bg-neutral-700/50  hover:text-white w-full py-2 rounded-md cursor-pointer text-neutral-300 font-semimbold transition duration-100">Like</button>
        <button className="hover:bg-neutral-700/50 hover:text-white w-full py-2 rounded-md cursor-pointer text-neutral-300 font-semimbold transition duration-100">Comment</button>
      </div>

    </div>
  )
}

export default Post