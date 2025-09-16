import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuthStore } from '../../store/autStore';
import type { RequireAuthProps } from '../../types/requireAuth.types';

const RequireAuth = ({ children }: RequireAuthProps) => {

  const navigate = useNavigate();
  const { accessToken, logout, loading } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {

    const checkAuth = async () => {
      if (!accessToken) {
        setChecking(false);
        return;
      }

      try {
        await api.get("/protected/me");
        console.log("Token is valid");
      } catch (err: unknown) {
        if (err && typeof err === "object" && "response" in err) {
          const axiosErr = err as { response?: { status?: number } };
          if (axiosErr.response?.status === 401) {
            console.log("Token invalid");
            logout();
            navigate("/login");
          } else {
            console.error("Auth check failed due to server error:", err);
          }
        } else {
          console.error("Unexpected error:", err);
        }
      } finally {
        setChecking(false);
      }
    };

    if (!loading) {
      checkAuth();
    }
  }, [accessToken, logout, navigate, loading]);


  if (loading || checking)
    return (
      <div className="flex justify-center items-center w-full h-[100vh]">
        <div className="bg-transparent w-12 h-12 rounded-full border-[8px] border-gray-400 border-t-white animate-spin"></div>
      </div>
    );

  return <>{children}</>
}

export default RequireAuth