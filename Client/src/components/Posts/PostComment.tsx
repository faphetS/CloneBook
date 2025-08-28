
import type { CommentProp } from "../../types/comment.types";
import { formatShortTime } from "../../utils/time";

const PostComment = ({ username, created_at, content }: CommentProp) => {
  return (
    <>
      <div className=" pb-2 py-2 -mt-3 w-full flex flex-col">
        <div className="w-full min-h-12 flex items-start gap-3">
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
          <div>
            <div className="flex flex-col bg-neutral-800 p-2 rounded-xl max-w-[596px] whitespace-pre-wrap break-words">
              <p className="font-semibold leading-none">{username}</p>
              <p className="text-white text-xs mt-1">
                {content}
              </p>
            </div>

            <div className="flex justify-between text-xs text-neutral-400 pl-1 pr-2">
              <div className="flex gap-3">
                <div >
                  {formatShortTime(new Date(created_at))}
                </div>
                <button >like</button>
              </div>
              <p>1 like</p>
            </div>
          </div>

        </div>
      </div>





    </>

  )
}

export default PostComment