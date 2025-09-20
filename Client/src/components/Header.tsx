import { Link, useLocation } from 'react-router-dom';
import { usePostStore } from '../store/postStore';
import FriendReq from './FriendReq';
import NotificationDropdown from './NotificationDropDown';
import ProfileDropDown from './ProfileDropDown';
import SearchInput from './SearchInput';

const Header: React.FC = () => {
  const { fetchPosts, resetPosts } = usePostStore();
  const location = useLocation();

  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === "/") {
      e.preventDefault();
      resetPosts();
      fetchPosts();
    }
  };
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-neutral-900 px-4 flex justify-between items-center text-base">

      <div className="flex  items-center gap-4 min-w-[200px]">
        <Link to="/" onClick={handleLogoClick} className="hidden sm:block">
          <div className="font-bold cursor-pointer">CloneBook</div>
        </Link>
        <div className="flex-1 min-w-0">
          <SearchInput />
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
