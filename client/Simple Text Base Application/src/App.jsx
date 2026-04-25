import { Routes,Route } from "react-router-dom"
import Register from "./pages/register"
import Login from "./pages/login"
import Profile from "./pages/profile"
import Edit from "./pages/edit"

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/profile" element={<Profile/>} />
      <Route path="/Edit" element={<Edit/>} />

    </Routes>

  )
}

export default App
