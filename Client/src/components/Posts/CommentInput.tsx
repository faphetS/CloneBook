import { useRef, useState } from "react";
import api from "../../api/axios";
import { useCommentStore } from "../../store/commentStore";
import { usePostStore } from "../../store/postStore";

const CommentInput = ({ id }: { id: number }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState("");
  const { addComment } = useCommentStore();
  const { updatePost, posts } = usePostStore();

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
      const res = await api.post(`/content/post/${id}/comments`, { content });
      addComment(id, res.data);
      const currentPost = posts.find((p) => p.id === id);
      if (currentPost) {
        updatePost(id, { commentCount: (currentPost.commentCount || 0) + 1 });
      }
      setContent("");
    } catch (err) {
      console.error("Failed to post comment", err);

    }
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="pb-2 py-2 -mt-3 w-full flex flex-col"
    >
      <div className="w-full min-h-12 flex items-center gap-3">
        {/* Avatar */}
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

        {/* Input */}
        <div className="relative w-full">
          <textarea
            ref={textareaRef}
            onInput={handleInput}
            rows={1}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
            className="w-full bg-neutral-700/30 rounded-2xl px-3 pr-10 py-3 text-white 
             focus:outline-none focus:ring-1 focus:ring-[#1877F2] 
             placeholder:text-neutral-400 overflow-y-hidden"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 text-neutral-400 rounded-2xl p-1 hover:text-[#1877F2] hover:bg-neutral-700/90 transition duration-100 cursor-pointer"
          >
            ➤
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommentInput;
