import { useEffect } from "react"
import { Route, Routes } from "react-router-dom"
import RequireAuth from "./components/routeCheck/RequireAuth"
import HomePage from "./pages/HomePage"
import Login from "./pages/Login"
import ProfilePage from "./pages/ProfilePage"
import Signup from "./pages/Signup"
import VerifyEmail from "./pages/VerifyEmail"
import { useAuthStore } from "./store/autStore"

const App = () => {

  const { refresh, loading } = useAuthStore();

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700">
        <div className="bg-transparent w-12 h-12 rounded-full border-[8px] border-gray-400 border-t-white animate-spin"></div>
      </div>
    );

  return (
    <div className="bg-neutral-800 font-montserrat text-white text-sm min-h-screen">
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<VerifyEmail />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <HomePage />
            </RequireAuth>
          } />
        <Route
          path="/profile/:id"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          } />

      </Routes>
    </div >
  )
}

export default App