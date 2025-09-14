import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("Verifying...");
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();
  const { verifyEmail } = useAuthStore();

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setMessage("Invalid verification link.");
        setLoading(false);
        return;
      }

      if (verified) {
        return;
      }

      const result = await verifyEmail(token);
      setMessage(result.message);
      setLoading(false)
      setVerified(true);
    };

    verify();
  }, [token, verifyEmail, verified]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white space-y-6">
      {loading ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-[8px] border-gray-400 border-t-white animate-spin"></div>
          <p>{message}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <h1>{message}</h1>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-[#1877F2] hover:bg-[#3a8cff] rounded-lg transition"
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
