import { Menu, MenuButton, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useFriendStore } from "../store/friendStore";
import type { FriendRequest } from "../types/friend.types";
import { formatShortTime } from "../utils/time";



const FriendReq = () => {
  const {
    pendingRequests,
    pendingPagination: { loading, loadingMore, hasMore },
    pendingCount,
    resetPendingReq,
    fetchPendingCount,
    fetchPendingRequests,
    acceptRequest,
    declineRequest
  } = useFriendStore();

  const [localStatus, setLocalStatus] = useState<Record<number, string>>({});
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const prevScrollNodeRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    resetPendingReq();
    fetchPendingCount();

    // since its just for a portfolio i made it simpler instead of 
    // using technologies like socket.io or native WebSocket
    const interval = setInterval(() => {
      fetchPendingCount();
    }, 10000);

    return () => clearInterval(interval);
  }, [resetPendingReq, fetchPendingCount]);


  const handleScroll = useCallback(async () => {
    const div = scrollRef.current;
    if (!div || loadingMore || !hasMore) return;
    if (div.scrollTop + div.clientHeight + 50 >= div.scrollHeight) {
      await fetchPendingRequests(true);
    }
  }, [loadingMore, hasMore, fetchPendingRequests]);

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
    await fetchPendingRequests();
  }, [fetchPendingRequests]);

  const handleAccept = async (req: FriendRequest) => {
    setLocalStatus((prev) => ({ ...prev, [req.senderId]: "accepted" }));

    await acceptRequest({
      id: req.senderId,
      username: req.senderName,
      profilePic: req.senderProfilePic,
    });
  };

  const handleDecline = async (senderId: number) => {
    setLocalStatus((prev) => ({ ...prev, [senderId]: "declined" }));
    await declineRequest(senderId);
  };

  return (
    <Menu
      as="div"
      className="relative"
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
                }`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            {!!pendingCount && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {pendingCount}
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
              className="absolute -right-[112px] mt-3 w-80 bg-neutral-900 text-white rounded-xl shadow-lg overflow-hidden"
            >
              <div
                ref={setScrollRef}
                className="max-h-[600px] overflow-y-auto custom-scrollbar">

                {loading && !pendingRequests.length ? (
                  <div className="p-3 flex flex-col gap-3">
                    <div
                      className="flex items-start gap-3 animate-pulse"
                    >
                      {/* Avatar */}
                      <div className="w-11 h-11 rounded-full bg-neutral-700" />

                      <div className="flex flex-col flex-1 gap-2">
                        {/* Name + message */}
                        <div className="w-32 h-4 rounded bg-neutral-700" />
                        <div className="w-44 h-3 rounded bg-neutral-800" />

                        {/* Buttons */}
                        <div className="flex gap-2 mt-2">
                          <div className="h-8 w-16 bg-neutral-700 rounded" />
                          <div className="h-8 w-16 bg-neutral-800 rounded" />
                        </div>
                      </div>
                    </div>

                  </div>
                ) : pendingRequests.length > 0 ? (
                  pendingRequests.map((req) => {
                    const status = localStatus[req.senderId];

                    return (

                      <div
                        key={req.id}
                        className="flex items-top gap-3 px-4 py-3 cursor-pointer hover:bg-neutral-800/60"
                      >
                        <Link to={`/profile/${req.senderId}`} className="flex-shrink-0">
                          {req.senderProfilePic ? (
                            <img
                              src={`${import.meta.env.VITE_API_DOMAIN}/uploads/${req.senderProfilePic}`}
                              alt={req.senderName}
                              className="w-11 h-11 rounded-full object-cover"
                            />
                          ) : (
                            <img
                              src={`user.svg`}
                              alt={req.senderName}
                              className={`w-11 h-11 rounded-full object-cover ${req.senderProfilePic ? ("") : ("border border-neutral-800")}`}
                            />
                          )}
                        </Link>

                        <div className="flex flex-col flex-1 min-w-0">
                          <span>
                            <Link to={`/profile/${req.senderId}`}>
                              <span className="font-semibold hover:underline">
                                {req.senderName}
                              </span>
                            </Link>{" "}
                            <span className="font-thin break-words">
                              {status === "accepted"
                                ? "You are now friends."
                                : status === "declined"
                                  ? "Friend request declined."
                                  : "sent you a friend request."}
                            </span>
                          </span>
                          <span className="text-xs text-neutral-400">
                            {formatShortTime(new Date(req.createdAt))}
                          </span>

                          {status ? null : (
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => handleAccept(req)}
                                className="px-3 py-1 font-semibold bg-[#1877F2] hover:bg-[#3a8cff] rounded"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleDecline(req.senderId)}
                                className="px-3 py-1 font-semibold bg-neutral-700 rounded hover:bg-neutral-600"
                              >
                                Decline
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-12 text-center text-neutral-400">
                    No friend requests
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

export default FriendReq;
