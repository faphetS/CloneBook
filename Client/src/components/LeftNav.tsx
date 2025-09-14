import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import AccountSettings from "./AccountSettings";
const LeftNav = () => {
  const { user } = useAuthStore();


  const isHome = location.pathname === "/";
  const isProfile =
    location.pathname === `/profile/${user?.id}`

  return (
    <nav className="hidden lg:block w-[360px] border-r border-neutral-900 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-1 font-medium">

      <Link to={'/'}>
        <div className={`flex items-center px-4 h-12 cursor-pointer rounded-lg mt-1 w-full text-left gap-4 ${isHome ? "bg-neutral-700/40" : "hover:bg-neutral-700/50"}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={`size-7 transition-colors duration-300 ${isHome ? "text-[#1877F2]" : "text-neutral-400"
              }`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          <p className={`${isHome ? "text-[#1877F2]" : "text-white"
            }`}>Home</p>
        </div>
      </Link>

      <Link to={`/profile/${user?.id}`}>
        <div className={`flex items-center px-4 h-12 cursor-pointer rounded-lg mt-1 w-full text-left gap-4 ${isProfile ? "bg-neutral-700/40" : "hover:bg-neutral-700/50"}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={`size-7 transition-colors duration-300 ${isProfile ? "text-[#1877F2]" : "text-neutral-400"
              }`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          <p className={`${isProfile ? "text-[#1877F2]" : "text-white"
            }`}>Profile</p>
        </div>
      </Link>

      <AccountSettings />
    </nav>
  )
}

export default LeftNav