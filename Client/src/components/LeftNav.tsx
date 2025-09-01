import { Link } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";
import AccountSettings from "./AccountSettings";
const LeftNav = () => {
  const { user } = useAuthStore();
  return (
    <nav className="hidden lg:block w-[360px] border-r border-neutral-900 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-1 font-medium">

      <Link to={`/profile/${user?.id}`}>
        <div className="flex items-center hover:bg-neutral-700/50 cursor-pointer rounded-lg my-1 px-1">
          {user?.profilePic ? (
            <div className="min-w-12 min-h-12 flex items-center justify-center mr-1">
              <img
                src={`${import.meta.env.VITE_API_DOMAIN}/uploads/${user.profilePic}`}
                alt={`${user.username}'s profile`}
                className="w-11 h-11 rounded-full object-cover"
              />
            </div>

          ) : (
            <div className="min-w-12 min-h-12 flex items-center justify-center mr-1">
              <img
                src={`${import.meta.env.VITE_API_DOMAIN}/uploads/user.svg`}
                alt={`${user?.username}'s profile`}
                className="w-11 h-11 rounded-full object-cover border-2 border-neutral-300"
              />
            </div>
          )}
          {user?.username}
        </div>
      </Link>
      <AccountSettings />
    </nav>
  )
}

export default LeftNav