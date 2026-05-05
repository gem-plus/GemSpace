import Post from "../components/profilepost";
import NavBar from "../components/navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [form, setForm] = useState({ content: "" });
  const [userID, setUserID] = useState("");

  const greet = name ? `Hello, ${name}` : "Hello, User";

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("http://localhost:3000/profile", {
        credentials: "include",
      });
      if (res.status === 401) navigate("/login");
      const data = await res.json();
      setPosts(data.posts);
      setUserID(data.userID);
      setName(data.name);
      setUsername(data.username);
    }
    checkAuth();
  }, [navigate]);

  async function handleLogout() {
    try {
      const res = await fetch("http://localhost:3000/logout", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("logout failed");
      navigate("/login");
    } catch (err) {
      if (err.message === "logout failed") navigate("/profile");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/post", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) => [data.post, ...prev]);
        setForm({ content: "" });
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleLike(postID) {
    try {
      const res = await fetch(`http://localhost:3000/like/${postID}`, {
        method: "post",
        credentials: "include",
      });
      const data = await res.json();
      return data;
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <NavBar />

      <div className="logout">
        <button className="item " onClick={handleLogout} value="logout">
          logout
        </button>
      </div>

      <h3 className="post-header">{greet}</h3>

      <h5 className="post-text">Create new posts</h5>
      <form className="post-form" onSubmit={handleSubmit}>
        <textarea
          className="post-textarea"
          name="content"
          value={form.content}
          onChange={(e) => handleChange(e)}
          placeholder="What's on your mind ?"
        ></textarea>
        <input className="post-submit" type="submit" value="Create new post" />
      </form>

      <div className="posts">
        <h3>Your post's</h3>
        <div className="post">
          {posts.map((post) => (
            <Post
              onLike={handleLike}
              userID={userID}
              likes={post.likes}
              key={post._id}
              postID={post._id}
              username={username}
              content={post.content}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Profile;
