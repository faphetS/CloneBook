import { Route, Routes } from "react-router-dom"
import RequireAuth from "./components/routeCheck/RequireAuth"
import HomePage from "./pages/HomePage/HomePage"
import Login from "./pages/Login"
import ProfilePage from "./pages/ProfilePage"
import Signup from "./pages/Signup"

const App = () => {
  return (
    <div className="bg-neutral-800 font-montserrat text-white text-sm min-h-screen">
      <Routes>

        {/* Public Routes */}
        <Route
          path="/login"
          element={<Login />} />
        <Route
          path="/signup"
          element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <HomePage />
            </RequireAuth>
          } />
        <Route
          path="/profile"
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