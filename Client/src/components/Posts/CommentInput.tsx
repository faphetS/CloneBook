import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { useAuthStore } from "../../store/autStore";
import { useCommentStore } from "../../store/commentStore";
import { usePostStore } from "../../store/postStore";

const MAX_LENGTH = 500;

const CommentInput = ({ id }: { id: number }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState("");
  const { user } = useAuthStore();
  const { addComment } = useCommentStore();
  const { updatePost, posts } = usePostStore();

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
      className="pb-1 pt-4 -mt-3 w-full flex flex-col"
    >
      <div className="w-full min-h-12 flex items-center gap-3">
        <Link to={`/profile/${user?.id}`}>
          {user?.profilePic ? (
            <div className="min-w-12 min-h-12 flex items-center justify-center">
              <img
                src={`${import.meta.env.VITE_API_DOMAIN}/uploads/${user.profilePic}`}
                alt={`${user.username}'s profile`}
                className="w-11 h-11 rounded-full object-cover"
              />
            </div>

          ) : (
            <div className="min-w-12 min-h-12 flex items-center justify-center justify-center">
              <img
                src={`${import.meta.env.VITE_API_DOMAIN}/uploads/user.svg`}
                alt={`${user?.username}'s profile`}
                className="w-11 h-11 rounded-full object-cover border-2 border-neutral-800"
              />
            </div>
          )}
        </Link>

        {/* Input */}
        <div className="relative w-full flex items-center">
          <textarea
            ref={textareaRef}
            value={content}
            onInput={handleInput}
            onChange={handleChange}
            rows={1}
            placeholder="Write a comment..."
            className="w-full bg-neutral-700/30 rounded-2xl px-3 pr-9 py-2.5 text-white 
     focus:outline-none focus:ring-1 focus:ring-[#1877F2] 
     placeholder:text-neutral-400 overflow-y-hidden leading-tight resize-none"
          />
          {content.length >= 200 && (
            <span className="absolute bottom-1 right-3 text-xs text-neutral-400">
              {content.length}/{MAX_LENGTH}
            </span>
          )}
          <button
            type="submit"
            className="absolute right-1 w-8 h-8 flex items-center justify-center 
     text-neutral-400 rounded-2xl hover:text-[#1877F2] hover:bg-neutral-700/90 
     transition duration-100 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </button>
        </div>

      </div>
    </form>
  );
};

export default CommentInput;
