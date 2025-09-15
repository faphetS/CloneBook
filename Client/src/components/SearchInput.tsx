import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "../store/userStore";

const SearchInput = () => {
  const { searchUsers, searchResults, loadingSearch, setLoadingSearch } = useUserStore();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setIsOpen(false);
      setLoadingSearch(false);
      return;
    }
    setLoadingSearch(true);

    const delay = setTimeout(() => {
      searchUsers(query);
      setIsOpen(true);
    }, 500);

    return () => clearTimeout(delay);
  }, [query, searchUsers, setLoadingSearch]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-[180px] md:w-[300px] sm:w-[250px] min-w-0" ref={wrapperRef}>
      {/* Input */}
      <input
        type="text"
        placeholder="Search CloneBook"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.trim() && setIsOpen(true)}
        className="relative z-10 w-full bg-neutral-800 text-sm text-white rounded-full pl-10 pr-4 py-2 focus:outline-none"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 z-10"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 5.25 
             5.25a7.5 7.5 0 0 0 11.5 11.5z"
        />
      </svg>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute -top-1 -left-2 w-[250px] sm:-left-2 sm:w-[316px] z-0">
          <div className="pt-12 p-1 bg-neutral-900 rounded-lg shadow-lg text-white">
            {loadingSearch ? (
              <div className="space-y-2 p-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2 p-2 animate-pulse">
                    <div className="w-11 h-11 bg-neutral-700 rounded-full"></div>
                    <div className="h-4 w-32 bg-neutral-700 rounded"></div>
                  </div>
                ))}
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.map((user) => (
                <Link to={`/profile/${user.id}`} key={user.id}>
                  <div className="flex items-center gap-2 p-2 hover:bg-neutral-800/60 rounded-lg cursor-pointer">
                    <img
                      src={
                        user?.profilePic
                          ? `${import.meta.env.VITE_API_DOMAIN}/uploads/${user.profilePic}`
                          : `/user.svg`
                      }
                      alt={`${user?.username}'s profile`}
                      className={`w-11 h-11 rounded-full object-cover ${user?.profilePic ? "" : "border border-neutral-800"
                        }`}
                    />
                    <span className="whitespace-pre-wrap break-all">{user.username}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-3 text-neutral-400">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
