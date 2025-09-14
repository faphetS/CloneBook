import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuthStore } from '../../store/autStore';
import type { RequireAuthProps } from '../../types/requireAuth.types';

const RequireAuth = ({ children }: RequireAuthProps) => {

  const navigate = useNavigate();
  const { accessToken, logout } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {

    const checkAuth = async () => {
      if (!accessToken) {
        try {
          await api("/protected/me");
        } catch {
          logout();
          navigate("/login");
        }
      }
      setChecking(false);
    }

    checkAuth();
  }, [accessToken, logout, navigate]);


  if (checking)
    return (
      <div className="flex justify-center items-center w-full h-[100vh]">
        <div className="bg-transparent w-12 h-12 rounded-full border-[8px] border-gray-400 border-t-white animate-spin"></div>
      </div>
    );

  return <>{children}</>
}

export default RequireAuth