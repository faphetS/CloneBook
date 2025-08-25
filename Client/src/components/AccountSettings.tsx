import { Menu, MenuButton, MenuItem } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
const AccountSettings = () => {
  return (

    <Menu as="nav" className="relative">
      {({ open }) => (
        <>
          <MenuButton className="flex items-center px-4 h-12 hover:bg-neutral-700/50 cursor-pointer rounded-lg mt-1 w-full text-left focus:outline-none">
            <motion.svg
              animate={{ rotate: open ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-neutral-400 mr-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </motion.svg>
            Account Settings
          </MenuButton>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 min-w-full rounded-md bg-neutral-800 focus:outline-none z-10"
              >
                <MenuItem>
                  <div>
                    {['Edit Profile Details', 'Change Profile Photo', 'Change Password'].map((label) => (
                      <MenuItem
                        key={label}
                        as="div"
                        className="cursor-pointer flex items-center pl-[54px] h-12 rounded-md text-neutral-200 hover:bg-neutral-700/50"
                      >
                        {label}
                      </MenuItem>
                    ))}
                  </div>
                </MenuItem>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </Menu>
  )
}

export default AccountSettings