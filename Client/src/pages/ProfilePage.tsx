import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import EditProfileModal from "../components/EditProfileModal";
import Header from "../components/Header";
import LeftNav from "../components/LeftNav";
import Post from "../components/Posts/Post";
import Poster from "../components/Posts/Poster";
import RightNav from "../components/RightNav";
import { useAuthStore } from "../store/AuthStore";
import { useFriendStore } from "../store/friendStore";
import { usePostStore } from "../store/postStore";
import { useUserStore } from "../store/userStore";

const ProfilePage = () => {
  const {
    profile,
    fetchUserDetails,
    updateProfile
  } = useUserStore();
  const {
    posts,
    loading,
    hasMore,
    fetchUserPosts,
    resetPosts
  } = usePostStore();
  const {
    friendStatus,
    friendCount,
    fetchFriendStatus,
    fetchFriendCount,
    sendRequest,
    acceptRequest,
    declineRequest,
    cancelRequest,
    unfriend
  } = useFriendStore();
  const { user: me, updateUser } = useAuthStore();
  const { id } = useParams();
  const isOwnProfile = useMemo(() => me && String(me.id) === id, [me, id]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);


  useEffect(() => {
    if (id) {
      resetPosts();
      fetchUserPosts(Number(id));
      fetchUserDetails(Number(id));
      fetchFriendStatus(Number(id));
      fetchFriendCount(Number(id));
    }
  }, [id, resetPosts, fetchUserPosts, fetchUserDetails, fetchFriendStatus, fetchFriendCount]);

  useEffect(() => {
    const handleScroll = async () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight
      ) {
        if (!loading) {
          await fetchUserPosts(Number(id));
        }
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [id, loading, fetchUserPosts]);

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
  return (
    <>
      <Header />

      <main className="flex justify-center sm:justify-between pt-16">
        <LeftNav />
        <div className="w-[680px] mx-[clamp(0px,3vw,80px)] min-w-min-w-[300px] flex flex-col pt-4 items-center gap-4 pb-12">

          <div className="border-b-2 border-neutral-900 w-full flex flex-col sm:flex-row items-center gap-3 mb-2">
            <div className="min-w-[200px] min-h-[200px] flex items-center justify-center">
              {loading ? (
                <div className="w-[162px] h-[162px] rounded-full bg-neutral-700 animate-pulse" />
              ) : (
                <img
                  src={
                    profile?.profilePic
                      ? `${import.meta.env.VITE_API_DOMAIN}/uploads/${profile.profilePic}`
                      : `${import.meta.env.VITE_API_DOMAIN}/uploads/user.svg`
                  }
                  alt={`${profile?.username}'s profile`}
                  className="w-[162px] h-[162px] rounded-full object-cover border-2 border-neutral-900"
                />
              )}
            </div>

            <div className="flex flex-col sm:flex-row w-full items-center justify-between pr-0 pb-3 gap-3 sm:pr-8 sm:gap-0 sm:pb-0">
              <div className="flex flex-col">
                {loading ? (
                  <>
                    <div className="h-6 w-40 bg-neutral-700 rounded-md animate-pulse mb-2" />
                    <div className="h-4 w-28 bg-neutral-700 rounded-md animate-pulse" />
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-semibold whitespace-pre-wrap break-all">{profile?.username}</p>
                    {friendCount > 0 ? (
                      <p className="text-neutral-400 sm:text-start text-center">
                        {friendCount} &#183; Friend{friendCount > 1 ? "s" : ""}
                      </p>
                    ) : (
                      <p className="text-neutral-400 sm:text-start text-center">
                        No friends yet
                      </p>
                    )}
                  </>
                )}


              </div>
              {isOwnProfile ? (
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="bg-neutral-600/50 hover:bg-neutral-600 rounded-md px-3 py-2 flex items-center gap-1 font-semibold"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>

                  Edit Profile
                </button>
              ) : (
                <>
                  {friendStatus === "friends" && (
                    <button
                      onClick={() => unfriend(Number(id))}
                      className="group bg-neutral-700 transition-colors hover:bg-red-600 hover:text-xs hover:py-2.5 rounded-md px-3 py-2 flex gap-1 items-center font-semibold relative">

                      <span className="flex gap-1 items-center group-hover:hidden">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 640 640"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-4 fill-white"
                        >
                          <path d="M96 192C96 130.1 146.1 80 208 80C269.9 80 320 130.1 320 192C320 253.9 269.9 304 208 304C146.1 304 96 253.9 96 192zM32 528C32 430.8 110.8 352 208 352C305.2 352 384 430.8 384 528L384 534C384 557.2 365.2 576 342 576L74 576C50.8 576 32 557.2 32 534L32 528zM464 128C517 128 560 171 560 224C560 277 517 320 464 320C411 320 368 277 368 224C368 171 411 128 464 128zM464 368C543.5 368 608 432.5 608 512L608 534.4C608 557.4 589.4 576 566.4 576L421.6 576C428.2 563.5 432 549.2 432 534L432 528C432 476.5 414.6 429.1 385.5 391.3C408.1 376.6 435.1 368 464 368z" />
                        </svg>
                        Friends
                      </span>

                      <span
                        className="flex gap-1 items-center hidden group-hover:flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                          />
                        </svg>
                        Unfriend
                      </span>
                    </button>
                  )}

                  {friendStatus === "pending_incoming" && profile && (
                    <div className="flex gap-2 font-semibold">
                      <button
                        onClick={() => acceptRequest({
                          id: profile.id,
                          username: profile.username,
                          profilePic: profile.profilePic,
                        })}
                        className="bg-[#1877F2] hover:bg-[#3a8cff] rounded-md px-3 py-2"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => declineRequest(Number(id))}
                        className="bg-neutral-700 hover:bg-neutral-600 rounded-md px-3 py-2"
                      >
                        Decline
                      </button>
                    </div>
                  )}

                  {friendStatus === "pending_outgoing" && (
                    <button
                      onClick={() => cancelRequest(Number(id))} // cancel = decline
                      className="bg-neutral-700 hover:bg-neutral-600 rounded-md px-3 py-2 font-semibold"
                    >
                      Cancel Request
                    </button>
                  )}

                  {friendStatus === "none" && (
                    <button
                      onClick={() => sendRequest(Number(id))}
                      className="bg-[#1877F2] hover:bg-[#3a8cff] rounded-md px-3 py-2 flex gap-1 items-center font-semibold"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                      </svg>

                      Add Friend
                    </button>
                  )}
                </>
              )}

            </div>
          </div>
          <div className="w-full text-neutral-900 flex items-center justify-center -mt-5 -mb-2 font-bold">POSTS</div>

          {isOwnProfile && (
            <Poster />
          )}

          {posts.map((p) => <Post key={p.id} {...p} />)}

          {!loading && !posts.length && (
            <div className="text-neutral-400 py-6">Nothing to see here... yet!</div>
          )}

          {!loading && posts.length > 0 && !hasMore && (
            <div className="text-neutral-500 py-6">You’ve reached the end!</div>
          )}

          {loading && (
            <div className="bg-neutral-900 flex items-center justify-center w-full h-[125px] rounded-2xl">
              <div className="bg-transparent w-12 h-12 rounded-full border-[8px] border-gray-400 border-t-white animate-spin"></div>
            </div>
          )}


        </div>
        <RightNav />
      </main>

      <EditProfileModal
        isOpen={isEditModalOpen}
        closeModal={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
        currentUsername={profile?.username || ""}
        currentProfilePicUrl={profile?.profilePic}
      />
    </>
  );

}

export default ProfilePage