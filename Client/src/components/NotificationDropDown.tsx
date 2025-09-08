import { Menu, MenuButton, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { Fragment, useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useNotificationStore } from "../store/notifStore";
import { formatShortTime } from "../utils/time";



const NotificationDropdown = () => {
  const { notifications, loadingMore, hasMore, unreadCount, fetchNotifs, resetNotif, markAllAsRead, fetchUnreadCount } = useNotificationStore();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const prevScrollNodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    resetNotif();
    fetchNotifs();
    fetchUnreadCount();
  }, [resetNotif, fetchNotifs, fetchUnreadCount]);

  const handleScroll = useCallback(async () => {
    const div = scrollRef.current;
    if (!div || loadingMore || !hasMore) return;
    if (div.scrollTop + div.clientHeight + 50 >= div.scrollHeight) {
      await fetchNotifs(true);
    }
  }, [loadingMore, hasMore, fetchNotifs]);

  const setScrollRef = useCallback(
    (node: HTMLDivElement | null) => {
      const prev = prevScrollNodeRef.current;
      if (prev && prev !== node) {
        prev.removeEventListener("scroll", handleScroll);
      }
      if (node) {
        node.addEventListener("scroll", handleScroll);
      }
      prevScrollNodeRef.current = node;
      scrollRef.current = node;
    },
    [handleScroll]
  );

  const handleClick = useCallback(async () => {
    await fetchNotifs();
  }, [fetchNotifs]);


  const handleRead = useCallback(
    async (event: React.FocusEvent<HTMLDivElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget)) {
        if (notifications.some((n) => n.unread)) {
          await markAllAsRead();
        }
      }
    },
    [markAllAsRead, notifications]
  );




  return (
    <Menu
      as="div"
      className="relative"
      onBlur={handleRead}
    >
      {({ open }) => (
        <>
          {/* Bell Button */}
          <MenuButton className="relative flex items-center focus:outline-none focus:ring-0" onClick={handleClick}>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`size-11 transition-colors duration-100  rounded-3xl p-2.5 cursor-pointer ${open ? "bg-[#1877F2]/10 text-[#1877F2]" : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                }`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
            {notifications.some(n => n.unread) && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {unreadCount}
              </span>

            )}

          </MenuButton>

          {/* Dropdown Panel */}
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 scale-95 -translate-y-2"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 -translate-y-2"
          >
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute -right-12 mt-3 w-80 bg-neutral-900 text-white rounded-xl shadow-lg overflow-hidden"
            >
              <div
                ref={setScrollRef}
                className="max-h-[600px] overflow-y-auto custom-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`flex items-start gap-3 px-4 py-3 cursor-pointer 
                                hover:bg-neutral-800/60
                                ${n.unread ? "bg-neutral-800/40" : ""}`}
                    >
                      <Link to={`/profile/${n.senderId}`} className="flex-shrink-0">
                        <img
                          src={n.profilePic
                            ? `${import.meta.env.VITE_API_DOMAIN}/uploads/${n.profilePic}`
                            : `${import.meta.env.VITE_API_DOMAIN}/uploads/user.svg`
                          }
                          alt={n.senderName}
                          className={`w-11 h-11 rounded-full object-cover ${n.profilePic ? ("") : ("border border-neutral-800")}`}
                        />
                      </Link>

                      <div className="flex flex-col flex-1 min-w-0">
                        <span>
                          <Link to={`/profile/${n.senderId}`}>
                            <span className="font-semibold hover:underline">{n.senderName}</span>
                          </Link>
                          <span className="font-thin break-words">
                            {" "}{n.text}
                          </span>
                        </span>
                        <span className="text-xs text-neutral-400">
                          {formatShortTime(new Date(n.createdAt))}
                        </span>
                      </div>

                      {/* Dot */}
                      {!!n.unread && (
                        <div className="ml-auto my-auto flex items-center">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        </div>
                      )}
                    </div>

                  ))) : (
                  <div className="p-4 text-center text-neutral-400">
                    No notifications
                  </div>
                )}
                {loadingMore && (
                  <div className="p-2 text-center text-neutral-400 text-sm">
                    Loading...
                  </div>
                )}
              </div>
            </motion.div>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default NotificationDropdown;
