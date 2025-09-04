import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useFriendStore } from "../store/friendStore";
const RightNav = () => {
  const { friends, fetchFriends } = useFriendStore();

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends])

  return (
    <nav className="hidden md:block w-[360px] border-l border-neutral-900 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto flex p-1 font-medium">
      <div className="pl-3 mt-1">Friends</div>

      {friends.length > 0 ? (
        friends.map((f) => (
          <Link to={`/profile/${f.id}`}>
            <div
              key={f.id}
              className="flex flex-row items-center hover:bg-neutral-700/50 cursor-pointer rounded-lg mt-1 px-2 py-2 gap-2">
              {f.profilePic ? (
                <img
                  src={`${import.meta.env.VITE_API_DOMAIN}/uploads/${f.profilePic}`}
                  alt={f.username}
                  className="w-11 h-11 rounded-full object-cover"
                />
              ) : (
                <img
                  src={`${import.meta.env.VITE_API_DOMAIN}/uploads/user.svg`}
                  alt={f.username}
                  className="w-11 h-11 rounded-full object-cover mr-1"
                />
              )}
              {f.username}
            </div>
          </Link>
        ))
      ) :
        (
          <div className="pl-3 text-neutral-400 mt-2">
            No Friends yet
          </div>
        )}

    </nav>
  )
}

export default RightNav