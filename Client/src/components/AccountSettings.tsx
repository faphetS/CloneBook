import { Menu, MenuButton, MenuItem } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuthStore } from '../store/authStore'
import { useUserStore } from '../store/userStore'
import EditProfileModal from './EditProfileModal'

const AccountSettings = () => {
  const { logout, user, updateUser } = useAuthStore()
  const { profile, fetchUserDetails, updateProfile } = useUserStore()
  const navigate = useNavigate()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleSaveProfile = async (data: { username: string; password: string; profilePic: File | null }) => {
    if (!updateProfile) return
    try {
      const res = await updateProfile(data)
      updateUser(res.user)
      if (profile?.id) fetchUserDetails(profile.id)
      setIsEditModalOpen(false)
    } catch (err) {
      console.error("Failed to update profile", err)
    }
  }

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
      logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <>
      <Menu as="nav" className="relative">
        {({ open }) => (
          <>
            <MenuButton className="flex items-center pl-[19px] h-12 hover:bg-neutral-700/50 cursor-pointer rounded-lg mt-1 w-full text-left focus:outline-none z-10">
              <motion.svg
                animate={{ rotate: open ? 90 : 0 }}
                transition={{ duration: 0.2 }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-neutral-400 mr-[17px]"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </motion.svg>
              Settings
            </MenuButton>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 min-w-full rounded-md bg-neutral-800 focus:outline-none -z-10"
                >
                  {/* Edit Profile Item */}
                  <MenuItem
                    as="div"
                    onClick={() => setIsEditModalOpen(true)}
                    className="px-5 cursor-pointer flex items-center h-12 rounded-md text-neutral-200 hover:bg-neutral-700/50 gap-4"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Z"
                      />
                    </svg>
                    Edit Profile Details
                  </MenuItem>

                  {/* Logout Item */}
                  <MenuItem
                    as="div"
                    onClick={handleLogout}
                    className="px-5 cursor-pointer flex items-center h-12 rounded-md text-red-400 hover:bg-neutral-700/50 gap-4"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                      />
                    </svg>
                    Logout
                  </MenuItem>
                </motion.div>
              )}
            </AnimatePresence>
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
  )
}

export default AccountSettings
