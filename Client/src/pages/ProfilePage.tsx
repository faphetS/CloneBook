import { useRef } from "react";
import Header from "../components/Header";
const ProfilePage = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  };
  return (
    <>
      <Header />
      <main className="flex flex-col items-center pt-16 pb-[1000px]">

        <div className="border-b-2 border-neutral-900 max-w-[808px] w-full flex  flex-col sm:flex-row items-center gap-3 mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-[200px] h-[200px] text-neutral-400 shrink-0"
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
          <div className="flex flex-col sm:flex-row w-full items-center justify-between pr-0 pb-3 gap-3 sm:pr-8 sm:gap-0 sm:pb-0 ">
            <div className="flex flex-col">
              <p className="text-2xl font-semibold">Justin Garcia</p>
              <p className="text-neutral-400 sm:text-start text-center">10 &#183; Friends</p>
            </div>
            <button className="bg-neutral-600/50 hover:bg-neutral-600 rounded-md px-4 py-1">
              Edit
            </button>
          </div>
        </div>

        <div className="max-w-[808px] w-full text-center">Posts</div>

        <div className="max-w-[680px] w-full flex flex-col pt-4 items-center gap-4 pb-12">

          {/* whats on your mind */}
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
              <textarea
                ref={textareaRef}
                onInput={handleInput}
                rows={1}
                placeholder="What's on your mind, Justin?"
                className="w-full bg-neutral-700/30 rounded-2xl px-3 py-3 text-white focus:outline-none focus:ring-1 focus:ring-[#1877F2] placeholder:text-neutral-400 overflow-y-hidden"
              />
            </div>
            <div className="flex justify-around items-center border-t border-neutral-700 w-full py-2">
              <button className="hover:bg-green-500  hover:text-white px-12 py-2 rounded-xl cursor-pointer text-neutral-300 font-semimbold transition duration-100">Photo</button>
              <button className="hover:bg-[#1877F2] hover:text-white px-12 py-2 rounded-xl cursor-pointer text-neutral-300 font-semimbold transition duration-100">Post</button>
            </div>

          </div>
          {/* image-posting */}
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
              <textarea
                ref={textareaRef}
                onInput={handleInput}
                rows={1}
                placeholder="What's on your mind, Justin?"
                className="w-full bg-neutral-700/30 rounded-2xl px-3 py-3 text-white focus:outline-none focus:ring-1 focus:ring-[#1877F2] placeholder:text-neutral-400 overflow-y-hidden"
              />
            </div>
            <button className="w-[590px] h-[100px] bg-neutral-800 flex items-center justify-center text-neutral-300 hover:bg-neutral-700 hover:text-white transition duration-100">
              Add Photo
            </button>
            <div className="flex justify-around items-center border-t border-neutral-700 w-full py-2">
              <button className="hover:bg-red-500  hover:text-white px-12 py-2 rounded-xl cursor-pointer text-neutral-300 font-semimbold transition duration-100">Cancel</button>
              <button className="hover:bg-[#1877F2] hover:text-white px-12 py-2 rounded-xl cursor-pointer text-neutral-300 font-semimbold transition duration-100">Post</button>
            </div>

          </div>
          {/* post w/image*/}
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
                <p>Justin Garcia</p>
                <p className="text-neutral-400 text-xs">1h</p>
              </div>
            </div>
            <div className="w-[590px] h-[590px] bg-neutral-800 flex items-center justify-center">
              asd
            </div>
            <div className="flex justify-around items-center border-t border-neutral-700 w-full py-2">
              <button className="hover:bg-neutral-700/50  hover:text-white w-full py-2 rounded-md cursor-pointer text-neutral-300 font-semimbold transition duration-100">Like</button>
              <button className="hover:bg-neutral-700/50 hover:text-white w-full py-2 rounded-md cursor-pointer text-neutral-300 font-semimbold transition duration-100">Comment</button>
            </div>

          </div>
          {/* post text only*/}
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
                <p>Justin Garcia</p>
                <p className="text-neutral-400 text-xs">1h</p>
              </div>
            </div>
            <p className="text-white text-base whitespace-pre-wrap break-words w-[590px]">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus tenetur cum libero molestias quo ut deleniti odio dignissimos, vel ab nulla eligendi dolor eius voluptatibus omnis earum ducimus optio consequuntur.
            </p>
            <div className="flex justify-around items-center border-t border-neutral-700 w-full py-2">
              <button className="hover:bg-neutral-700/50  hover:text-white w-full py-2 rounded-md cursor-pointer text-neutral-300 font-semimbold transition duration-100">Like</button>
              <button className="hover:bg-neutral-700/50 hover:text-white w-full py-2 rounded-md cursor-pointer text-neutral-300 font-semimbold transition duration-100">Comment</button>
            </div>

          </div>
          {/* Loading */}
          <div className="bg-neutral-900 flex items-center justify-center w-full h-[125px] rounded-2xl">
            <div className="bg-transparent w-12 h-12 rounded-full border-[8px] border-gray-400 border-t-white animate-spin"></div>
          </div>

        </div>
      </main>
    </>
  )
}

export default ProfilePage