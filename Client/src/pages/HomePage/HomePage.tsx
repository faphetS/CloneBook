import { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import Header from "../../components/Header";
import Post from "../../components/Posts/Post";
import { usePostStore } from "../../store/postStore";
import LeftNav from "./LeftNav";
import RightNav from "./RightNav";


const HomePage = () => {

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState("");
  const { posts, loading, fetchPosts, addPost } = usePostStore();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleInput = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.post('/content/post', { content });
      addPost(res.data);
      setContent("");
    } catch (err) {
      console.error("Post failed", err);
      setContent("");
    }
  };



  return (
    <>
      <Header />
      <main className="flex justify-center sm:justify-between pt-16">
        <LeftNav />
        <div className="w-[680px] mx-[clamp(0px,3vw,80px)] min-w-[485px] flex flex-col pt-4 items-center gap-4 pb-12">

          {/* whats on your mind */}
          <form onSubmit={handleSubmit} className="bg-neutral-900 w-full flex flex-col items-center rounded-2xl px-3 pt-3 gap-3">
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
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind, Justin?"
                className="w-full bg-neutral-700/30 rounded-2xl px-3 py-3 text-white focus:outline-none focus:ring-1 focus:ring-[#1877F2] placeholder:text-neutral-400 overflow-y-hidden"
              />
            </div>
            <div className="flex justify-around items-center border-t border-neutral-700 w-full p-1">
              <button className="hover:bg-green-500 hover:text-white w-full py-2 rounded-md cursor-pointer text-neutral-400 font-semimbold transition duration-100">Photo</button>
              <button type="submit" className="hover:bg-[#1877F2] hover:text-white w-full py-2 rounded-md cursor-pointer text-neutral-400 font-semimbold transition duration-100">Post</button>
            </div>
          </form>

          {loading ? (
            // loading
            <div className="bg-neutral-900 flex items-center justify-center w-full h-[125px] rounded-2xl">
              <div className="bg-transparent w-12 h-12 rounded-full border-[8px] border-gray-400 border-t-white animate-spin"></div>
            </div>
          ) : (
            posts.map((p) => <Post key={p.id} {...p} />)
          )}



        </div>
        <RightNav />
      </main>
    </>
  )
}

export default HomePage