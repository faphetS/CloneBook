import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import EditProfileModal from "../components/EditProfileModal";
import Header from "../components/Header";
import LeftNav from "../components/LeftNav";
import Post from "../components/Posts/Post";
import Poster from "../components/Posts/Poster";
import RightNav from "../components/RightNav";
import { useAuthStore } from "../store/AuthStore";
import { useFriendStore } from "../store/frienStore";
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
    fetchUserPosts
  } = usePostStore();
  const {
    friendStatus,
    fetchFriendStatus,
    sendRequest,
    acceptRequest,
    declineRequest,
    cancelRequest
  } = useFriendStore();
  const { user: me, updateUser } = useAuthStore();
  const { id } = useParams();
  const isOwnProfile = useMemo(() => me && String(me.id) === id, [me, id]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchUserPosts(Number(id));
      fetchUserDetails(Number(id));
      fetchFriendStatus(Number(id));
    }
  }, [id, fetchUserPosts, fetchUserDetails, fetchFriendStatus]);

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
        <div className="w-[680px] mx-[clamp(0px,3vw,80px)] min-w-[485px] flex flex-col pt-4 items-center gap-4 pb-12">

          <div className="border-b-2 border-neutral-900 w-full flex flex-col sm:flex-row items-center gap-3 mb-2">
            {profile?.profilePic ? (
              <div className="min-w-[200px] min-h-[200px] flex items-center justify-center">
                <img
                  src={`${import.meta.env.VITE_API_DOMAIN}/uploads/${profile.profilePic}`}
                  alt={`${profile.username}'s profile`}
                  className="w-[162px] h-[162px] rounded-full object-cover border-2 border-neutral-900"
                />
              </div>

            ) : (
              <div className="min-w-[200px] min-h-[200px] flex items-center justify-center">
                <img
                  src={`${import.meta.env.VITE_API_DOMAIN}/uploads/user.svg`}
                  alt={`${profile?.username}'s profile`}
                  className="w-[162px] h-[162px] rounded-full object-cover border-2 border-neutral-300"
                />
              </div>
            )}
            <div className="flex flex-col sm:flex-row w-full items-center justify-between pr-0 pb-3 gap-3 sm:pr-8 sm:gap-0 sm:pb-0">
              <div className="flex flex-col">
                <p className="text-2xl font-semibold">{profile?.username}</p>
                <p className="text-neutral-400 sm:text-start text-center">10 &#183; Friends</p>
              </div>
              {isOwnProfile ? (
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="bg-neutral-600/50 hover:bg-neutral-600 rounded-md px-3 py-2 flex items-center gap-1"
                >
                  {/* Edit icon */}
                  Edit
                </button>
              ) : (
                <>
                  {friendStatus === "friends" && (
                    <button className="bg-neutral-700 rounded-md px-3 py-2">Friends</button>
                  )}

                  {friendStatus === "pending_incoming" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => acceptRequest(Number(id))}
                        className="bg-blue-600 hover:bg-blue-700 rounded-md px-3 py-2"
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
                      className="bg-neutral-700 hover:bg-neutral-600 rounded-md px-3 py-2"
                    >
                      Cancel Request
                    </button>
                  )}

                  {friendStatus === "none" && (
                    <button
                      onClick={() => sendRequest(Number(id))}
                      className="bg-[#1877F2] hover:bg-[#3a8cff] rounded-md px-3 py-2"
                    >
                      Add Friend
                    </button>
                  )}
                </>
              )}

            </div>
          </div>

          {isOwnProfile && (
            <Poster />
          )}

          {loading ? (
            <div className="bg-neutral-900 flex items-center justify-center w-full h-[125px] rounded-2xl">
              <div className="bg-transparent w-12 h-12 rounded-full border-[8px] border-gray-400 border-t-white animate-spin"></div>
            </div>
          ) : (
            posts.map((p) => <Post key={p.id} {...p} />)
          )}

        </div>
        <RightNav />
      </main>

      {/* Edit Profile Modal */}
      {isOwnProfile && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          closeModal={() => setIsEditModalOpen(false)}
          onSave={handleSaveProfile}
          currentUsername={profile?.username || ""}
          currentProfilePicUrl={profile?.profilePic}
        />
      )}
    </>
  );

}

export default ProfilePage


// {/* image-posting */ }
// <div className="bg-neutral-900 w-full flex flex-col items-center rounded-2xl px-3 pt-3 gap-3">
//   <div className="w-full min-h-12 flex items-center gap-3">
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       fill="none"
//       viewBox="0 0 24 24"
//       strokeWidth={1.5}
//       stroke="currentColor"
//       className="w-12 h-12 text-neutral-400 shrink-0"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488
//                 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963
//                 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966
//                 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0
//                 3 3 0 0 1 6 0Z"
//       />
//     </svg>
//     <textarea
//       ref={textareaRef}
//       onInput={handleInput}
//       rows={1}
//       placeholder="What's on your mind, Justin?"
//       className="w-full bg-neutral-700/30 rounded-2xl px-3 py-3 text-white focus:outline-none focus:ring-1 focus:ring-[#1877F2] placeholder:text-neutral-400 overflow-y-hidden"
//     />
//   </div>
//   <button className="max-w-[590px] w-full h-[100px] bg-neutral-800 flex items-center justify-center text-neutral-300 hover:bg-neutral-700 hover:text-white transition duration-100">
//     Add Photo
//   </button>
//   <div className="flex justify-around items-center border-t border-neutral-700 w-full py-2">
//     <button className="hover:bg-red-500  hover:text-white px-12 py-2 rounded-xl cursor-pointer text-neutral-300 font-semimbold transition duration-100">Cancel</button>
//     <button className="hover:bg-[#1877F2] hover:text-white px-12 py-2 rounded-xl cursor-pointer text-neutral-300 font-semimbold transition duration-100">Post</button>
//   </div>

// </div>
// {/* post w/image*/ }
// <div className="bg-neutral-900 w-full flex flex-col items-center rounded-2xl px-3 pt-3 gap-3">
//   <div className="w-full min-h-12 flex items-center gap-3">
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       fill="none"
//       viewBox="0 0 24 24"
//       strokeWidth={1.5}
//       stroke="currentColor"
//       className="w-12 h-12 text-neutral-400 shrink-0"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488
//                 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963
//                 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966
//                 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0
//                 3 3 0 0 1 6 0Z"
//       />
//     </svg>
//     <div className="flex flex-col">
//       <p>Justin Garcia</p>
//       <p className="text-neutral-400 text-xs">1h</p>
//     </div>
//   </div>
//   <div className="max-w-[590px] w-full h-[590px] bg-neutral-800 flex items-center justify-center">
//     asd
//   </div>
//   <div className="flex justify-around items-center border-t border-neutral-700 w-full py-2">
//     <button className="hover:bg-neutral-700/50  hover:text-white w-full py-2 rounded-md cursor-pointer text-neutral-300 font-semimbold transition duration-100">Like</button>
//     <button className="hover:bg-neutral-700/50 hover:text-white w-full py-2 rounded-md cursor-pointer text-neutral-300 font-semimbold transition duration-100">Comment</button>
//   </div>

// </div>
// {/* post text only*/ }
// <div className="bg-neutral-900 w-full flex flex-col items-center rounded-2xl px-3 pt-3 gap-3">
//   <div className="w-full min-h-12 flex items-center gap-3">
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       fill="none"
//       viewBox="0 0 24 24"
//       strokeWidth={1.5}
//       stroke="currentColor"
//       className="w-12 h-12 text-neutral-400 shrink-0"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488
//                 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963
//                 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966
//                 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0
//                 3 3 0 0 1 6 0Z"
//       />
//     </svg>
//     <div className="flex flex-col">
//       <p>Justin Garcia</p>
//       <p className="text-neutral-400 text-xs">1h</p>
//     </div>
//   </div>
//   <p className="text-white text-base whitespace-pre-wrap break-words max-w-[590px] w-full">
//     Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus tenetur cum libero molestias quo ut deleniti odio dignissimos, vel ab nulla eligendi dolor eius voluptatibus omnis earum ducimus optio consequuntur.
//   </p>
//   <div className="flex justify-around items-center border-t border-neutral-700 w-full py-2">
//     <button className="hover:bg-neutral-700/50  hover:text-white w-full py-2 rounded-md cursor-pointer text-neutral-300 font-semimbold transition duration-100">Like</button>
//     <button className="hover:bg-neutral-700/50 hover:text-white w-full py-2 rounded-md cursor-pointer text-neutral-300 font-semimbold transition duration-100">Comment</button>
//   </div>

// </div>
// {/* Loading */ }
// <div className="bg-neutral-900 flex items-center justify-center w-full h-[125px] rounded-2xl">
//   <div className="bg-transparent w-12 h-12 rounded-full border-[8px] border-gray-400 border-t-white animate-spin"></div>
// </div>