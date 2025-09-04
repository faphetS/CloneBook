import { Link } from 'react-router-dom';

import FriendReq from './FriendReq';
import NotificationDropdown from './NotificationDropDown';
import ProfileDropDown from './ProfileDropDown';




const Header: React.FC = () => {
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
        <ProfileDropDown />
      </div>
    </header>
  );
};

export default Header;
