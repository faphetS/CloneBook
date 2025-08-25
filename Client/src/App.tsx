import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage/HomePage"
import Login from "./pages/Login"
import ProfilePage from "./pages/ProfilePage"
import Signup from "./pages/Signup"

const App = () => {
  return (
    <div className="bg-neutral-800 font-montserrat text-white text-sm min-h-screen">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  )
}

export default App