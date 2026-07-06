import Posts from "../components/posts";
import NavBar from "../components/navbar";
import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar";
import { useNavigate } from "react-router-dom";

function Following() {
  const [posts, setposts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function followingPost() {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/getpost`, {
        method: "GET",
        credentials: "include",
      });
      if (res.status === 401) return navigate("/auth");
      const data = await res.json();
      if (data.success) {
        setposts(data.post);
        setCurrentUser(data.currentUser);
      }
    }
    followingPost();
  }, []);

  async function handleLike(postID) {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/like/${postID}`,
        {
          method: "post",
          credentials: "include",
        },
      );
      const data = await res.json();
      return data;
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <SidebarProvider>
        <AppSidebar loggedIn={currentUser} />
        <main className="w-full">
          <NavBar loggedIn={currentUser} />
          {[...posts].map((post) => (
            <Posts
              key={post._id}
              page="following"
              onLike={handleLike}
              userID={currentUser}
              postID={post._id}
              likes={post.likes}
              username={post.user.username}
              postOwner={post.user._id}
              avatarURL={post.avatarURL}
              content={post.content}
              date={post.date}
            />
          ))}
        </main>
      </SidebarProvider>
    </>
  );
}

export default Following;
