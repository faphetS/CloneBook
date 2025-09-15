import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { Fragment, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuthStore } from "../store/autStore";
import { useUserStore } from "../store/userStore";
import EditProfileModal from "./EditProfileModal";

const ProfileDropDown = () => {
  const { logout, user, updateUser } = useAuthStore();
  const { profile, fetchUserDetails, updateProfile } = useUserStore();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isEditModalOpen && menuButtonRef.current) {
      menuButtonRef.current.click();
    }
  }, [isEditModalOpen]);

  const handleSaveProfile = async (data: { username: string; password: string; profilePic: File | null }) => {
    if (!updateProfile) return;

    try {
      const res = await updateProfile(data);
      updateUser(res.user);

      if (profile?.id) fetchUserDetails(profile.id);
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const TouchMenuItem = ({
    children,
    onClick,
    to,
    className = ""
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    to?: string;
    className?: string;
  }) => {
    const baseClasses = "px-2 py-2 hover:bg-neutral-800/60 cursor-pointer flex items-center gap-2 rounded-xl";

    if (to) {
      return (
        <Link
          to={to}
          className={`${baseClasses} ${className}`}
          onClick={() => {
            // Close the menu when an item is tapped on mobile
            if (menuButtonRef.current) {
              menuButtonRef.current.click();
            }
          }}
        >
          {children}
        </Link>
      );
    }

    return (
      <div
        className={`${baseClasses} ${className}`}
        onClick={() => {
          onClick?.();
          // Close the menu when an item is tapped on mobile
          if (menuButtonRef.current) {
            menuButtonRef.current.click();
          }
        }}
      >
        {children}
      </div>
    );
  };

  return (
    <>
      <Menu as="div" className="relative">
        {({ open }) => (
          <>
            {/* Profile Button with ref for programmatic control */}
            <MenuButton
              ref={menuButtonRef}
              className="relative flex items-center focus:outline-none focus:ring-0 group"
            >
              <div className="relative">
                <img
                  src={profile?.profilePic || `/user.svg`}
                  alt={`${user?.username}'s profile`}
                  className={`w-11 h-11 rounded-full object-cover ${user?.profilePic ? ("") : ("border border-neutral-800")}`}
                />
                {/* Shine Overlay */}
                <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 absolute -bottom-1 right-0 bg-neutral-900 text-neutral-400 rounded-full"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </MenuButton>

            {/* Dropdown Panel */}
            <Transition
              as={Fragment}
              show={open}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 scale-95 -translate-y-2"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 -translate-y-2"
            >
              <MenuItems static>
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute -right-2 mt-3 w-56 bg-neutral-900 text-white rounded-xl shadow-lg overflow-hidden p-2 z-50"
                >
                  <div className="flex flex-col">
                    <MenuItem as={Fragment}>
                      <TouchMenuItem to="/" className="block sm:hidden">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-9 p-1 transition-colors duration-300 bg-neutral-800 text-neutral-400 rounded-full">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                        Home
                      </TouchMenuItem>
                    </MenuItem>

                    <MenuItem as={Fragment}>
                      <TouchMenuItem to={`/profile/${user?.id}`}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-9 p-1 transition-colors duration-300 bg-neutral-800 text-neutral-400 rounded-full">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        Profile
                      </TouchMenuItem>
                    </MenuItem>

                    <MenuItem as={Fragment}>
                      <TouchMenuItem
                        onClick={() => setIsEditModalOpen(true)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-9 p-2 transition-colors duration-300 bg-neutral-800 text-neutral-400 rounded-full">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                        Edit Profile
                      </TouchMenuItem>
                    </MenuItem>

                    <MenuItem as={Fragment}>
                      <TouchMenuItem
                        onClick={handleLogout}
                        className="text-red-400"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-9 p-2 transition-colors duration-300 bg-neutral-800 text-red-400 rounded-full"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                          />
                        </svg>
                        Logout
                      </TouchMenuItem>
                    </MenuItem>
                  </div>
                </motion.div>
              </MenuItems>
            </Transition>
          </>
        )}
      </Menu>

      <EditProfileModal
        isOpen={isEditModalOpen}
        closeModal={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
        currentUsername={user?.username || ""}
        currentProfilePicUrl={user?.profilePic}
      />
    </>
  );
};

export default ProfileDropDown;