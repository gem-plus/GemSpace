import { Routes, Route } from "react-router-dom";
import Profile from "./pages/profile";
import Edit from "./pages/edit";
import Home from "./pages/home";
import Auth from "./pages/auth";
import ProfilePic from "./pages/profilepic";
import Following from "./pages/following"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth/>}/>
      <Route path="/profile" element={<Profile />} />
      <Route path="/profilepic" element={<ProfilePic />} />
      <Route path="/edit" element={<Edit />} />
      <Route path="/following" element={<Following />} />
    </Routes>
  );
}

export default App;
