import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/autStore";
import { usePostStore } from "../../store/postStore";

const MAX_LENGTH = 500;

const Poster = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuthStore();
  const { createPost, loading } = usePostStore();
  const [content, setContent] = useState("");

  const handleInput = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_LENGTH) {
      setContent(e.target.value);
    } else {
      setContent(e.target.value.slice(0, MAX_LENGTH));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const success = await createPost(content);
      if (success) {
        setContent("");
      }
    } catch (err) {
      console.error("Post failed", err);
      setContent("");
    }
  };
  return (
    < form onSubmit={handleSubmit} className="bg-neutral-900 w-full flex flex-col items-center rounded-2xl px-3 pt-3 gap-3" >
      <div className="w-full min-h-12 flex items-center gap-3 relative">

        <Link to={`/profile/${user?.id}`}>
          <div className="min-w-12 min-h-12 flex items-center justify-center">
            <img
              src={user?.profilePic || `/user.svg`}
              alt={`${user?.username}'s profile`}
              className={`w-11 h-11 rounded-full object-cover ${user?.profilePic ? ("") : ("border-2 border-neutral-800")}`}
            />
          </div>
        </Link>

        <textarea
          ref={textareaRef}
          value={content}
          onInput={handleInput}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (!loading) {
                handleSubmit(e as unknown as React.FormEvent);
              }
            }
          }}
          rows={1}
          placeholder={`What's on your mind, ${user?.username}?`}
          className="w-full bg-neutral-700/30 rounded-2xl px-3 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-[#1877F2] placeholder:text-neutral-400 overflow-y-hidden leading-tight resize-none whitespace-pre-wrap break-all"
        />
        {content.length >= 200 && (
          <span className="absolute bottom-1 right-3 text-xs text-neutral-400">
            {content.length}/{MAX_LENGTH}
          </span>
        )}
      </div>
      <div className="flex justify-around items-center border-t border-neutral-700 w-full p-1">
        <button onClick={() => setContent("")} className="hover:bg-neutral-700/50 hover:text-red-600 w-full py-2 rounded-md cursor-pointer text-neutral-400 font-semimbold transition duration-100">Clear</button>
        <button
          type="submit"
          disabled={loading}
          className={`hover:bg-[#1877F2] hover:text-white w-full py-2 rounded-md cursor-pointer text-neutral-400 font-semimbold transition duration-100 ${loading ? ("hover:bg-[#1877F2]/50") : ("")}`}>
          {loading ? ("Posting...") : ("Post")}
        </button>
      </div>
    </form >
  )
}

export default Poster