import { Link } from 'react-router-dom';
import FriendReq from './FriendReq';
import NotificationDropdown from './NotificationDropDown';
import ProfileDropDown from './ProfileDropDown';
import SearchInput from './SearchInput';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-neutral-900 px-4 flex justify-between items-center text-base">

      <div className="flex items-center gap-4 min-w-0">
        <Link to="/" className="hidden sm:block">
          <div className="font-bold cursor-pointer">CloneBook</div>
        </Link>
        <div className="flex-1 min-w-[370px]">
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
