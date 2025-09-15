import { Dialog, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { Fragment, useEffect, useState } from "react";

interface EditProfileModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onSave: (data: { username: string; password: string; profilePic: File | null }) => void | Promise<void>;
  currentUsername: string;
  currentProfilePicUrl?: string;
}

const EditProfileModal = ({ isOpen, closeModal, onSave, currentUsername, currentProfilePicUrl }: EditProfileModalProps) => {
  const [username, setUsername] = useState(currentUsername);
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentProfilePicUrl);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUsername(currentUsername);
    setPreviewUrl(currentProfilePicUrl);
    setError("");
  }, [currentUsername, currentProfilePicUrl, isOpen]);

  const handlePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return setPreviewUrl(currentProfilePicUrl);

    if (file.size > 1 * 1024 * 1024) {
      setError("Profile picture must be under 1MB");
      setProfilePic(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      setProfilePic(null);
      return;
    }

    setError("");
    setProfilePic(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleCancel = () => {
    setPreviewUrl(currentProfilePicUrl);
    setProfilePic(null);
    closeModal();
  };

  const handleSave = async () => {
    if (error) return;
    setLoading(true);
    try {
      await onSave({ username, password, profilePic });
      closeModal();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }} className="bg-neutral-900 rounded-2xl w-full max-w-md p-6 space-y-6">

            {error ?
              (<div className="bg-red-500/20 border border-red-500/50 text-red-200 px-2 py-2 rounded-md text-sm text-center">{error}</div>)
              :
              (
                <h2 className="text-xl font-semibold text-white text-center">Edit Profile</h2>
              )}


            <div className="flex flex-col items-center gap-4">
              <img
                src={previewUrl || `/user.svg`}
                alt="Profile Preview"
                className="w-[200px] h-[200px] rounded-full object-cover border-2 border-neutral-800"
              />
              <label className="cursor-pointer px-4 py-2 bg-[#1877F2] hover:bg-[#3a8cff] text-white rounded-md transition">
                Change Photo
                <input type="file" accept="image/*" onChange={handlePicChange} className="hidden" />
              </label>
            </div>

            <div className="space-y-3">
              <h3 className="text-neutral-300 font-semibold">Account Details</h3>
              <div>
                <label className="block text-neutral-400 mb-1">Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-neutral-800 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-[#1877F2]" />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">New Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-neutral-800 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-[#1877F2]" />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={handleCancel} className="px-4 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600 text-white transition">Cancel</button>
              <button onClick={handleSave} disabled={!!error || loading} className="px-4 py-2 rounded-md bg-[#1877F2] disabled:bg-[#3a8cff]/50 hover:bg-[#3a8cff] text-white transition">
                {loading ?
                  (
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                  )
                  :
                  ("Save")}
              </button>
            </div>
          </motion.div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditProfileModal;
