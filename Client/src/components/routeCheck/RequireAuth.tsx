import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuthStore } from '../../store/useAuthStore';
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


  if (checking) return <div>Loading...</div>

  return <>{children}</>
}

export default RequireAuth