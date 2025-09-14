import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useFriendStore } from "../store/friendStore";
const RightNav = () => {
  const {
    friends,
    fetchFriends,
    resetFriends,
    friendsPagination: { loading }
  } = useFriendStore();

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    resetFriends();
    fetchFriends();
  }, [resetFriends, fetchFriends])

  useEffect(() => {
    const handleScroll = async () => {
      const el = scrollRef.current;
      if (!el) return;

      if (el.scrollTop + el.clientHeight + 1 >= el.scrollHeight) {
        if (!loading) {
          await fetchFriends();
        }
      }
    };

    const el = scrollRef.current;
    el?.addEventListener("scroll", handleScroll);

    return () => {
      el?.removeEventListener("scroll", handleScroll);
    };
  }, [loading, fetchFriends]);

  return (
    <nav
      ref={scrollRef}
      className="hidden md:block w-[360px] border-l border-neutral-900 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar flex p-1 font-medium">
      <div className="pl-3 mt-1">Friends</div>

      {friends.length > 0 ? (
        friends.map((f) => (
          <Link to={`/profile/${f.id}`} key={f.id}>
            <div className="flex flex-row items-center hover:bg-neutral-700/50 cursor-pointer rounded-lg mt-1 px-2 py-2 gap-2">
              <img
                src={
                  f.profilePic
                    ? `${import.meta.env.VITE_API_DOMAIN}/uploads/${f.profilePic}`
                    : `${import.meta.env.VITE_API_DOMAIN}/uploads/user.svg`
                }
                alt={`${f.username}'s profile`}
                className={`w-11 h-11 rounded-full object-cover ${f.profilePic ? "" : "border border-neutral-900"
                  }`}
              />
              {f.username}
            </div>
          </Link>
        ))
      ) : (
        loading ? (
          <div className="mt-2 flex flex-col gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-2 animate-pulse px-2 py-2"
              >
                <div className="w-11 h-11 bg-neutral-700 rounded-full" />
                <div className="h-4 w-24 bg-neutral-700 rounded-md" />
              </div>
            ))}
          </div>
        ) : (
          <div className="pl-3 text-neutral-400 mt-2">No Friends yet</div>
        )

      )}


    </nav>
  )
}

export default RightNav