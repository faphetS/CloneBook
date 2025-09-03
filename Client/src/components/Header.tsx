import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuthStore } from '../store/AuthStore';
import FriendReq from './FriendReq';
import NotificationDropdown from './NotificationDropDown';




const Header: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-neutral-900 px-4 flex justify-between items-center text-base">

      <div className="flex items-center gap-4 min-w-[250px] flex-shrink-0">
        <Link to="/">
          <div className="font-bold cursor-pointer">CloneBook</div>
        </Link>
        {/* Search Input */}
        <div className="relative w-[240px]">
          <input
            type="text"
            placeholder="Search CloneBook"
            className="w-full bg-neutral-800 text-sm text-white rounded-full pl-10 pr-4 py-2 focus:outline-none"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 5.25 
                 5.25a7.5 7.5 0 0 0 11.5 11.5z"
            />
          </svg>
        </div>
      </div>


      <div className=" justify-end flex gap-2 items-center relative flex-shrink-0 ">

        <FriendReq />
        <NotificationDropdown />

        <div className="relative w-11 h-11 group">
          {/* Profile Picture */}
          {user?.profilePic ? (
            <img
              src={`${import.meta.env.VITE_API_DOMAIN}/uploads/${user.profilePic}`}
              alt={`${user.username}'s profile`}
              className="w-11 h-11 rounded-full object-cover"
            />
          ) : (
            <img
              src={`${import.meta.env.VITE_API_DOMAIN}/uploads/user.svg`}
              alt={`${user?.username}'s profile`}
              className="w-11 h-11 rounded-full object-cover border-2 border-neutral-300"
            />
          )}

          {/* Logout overlay button */}
          <div
            className="absolute inset-0 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={handleLogout}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
              />
            </svg>

            {/* Tooltip */}
            <span className="absolute top-full mt-1 px-2 py-1 text-xs text-white bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Logout
            </span>
          </div>
        </div>


      </div>
    </header>
  );
};

export default Header;
