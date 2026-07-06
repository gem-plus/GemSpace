import Posts from "../components/posts";
import NavBar from "../components/navbar"
import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar";

function Home() {
  const [posts, setposts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  async function loadPosts() {
    try {
      if (loading || !hasMore) return new Error("no more posts");

      setLoading(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/?page=${page}`);
      const data = await res.json();
      if (data.post.length === 0) {
        setHasMore(false);
        return new Error("no more posts");
      }
      if (data.success) {
        setposts((prev) => {
          const newPosts = data.post.filter(
            (p) => !prev.some((existing) => existing._id === p._id),
          );
          return [...prev, ...newPosts];
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function fetchUser() {
      const userRes = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
        credentials: "include",
      });
      if (userRes.ok) {
        const userdata = await userRes.json();
        if (userdata.success) setCurrentUser(userdata.id);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    loadPosts();
  }, [page]);

  useEffect(() => {
    function handleScroll() {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        hasMore &&
        !loading
      ) {
        setPage((prev) => prev + 1);
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, hasMore]);

  async function handleFollowing(postOwner) {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/following`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ postOwner }),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  }

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
        <NavBar loggedIn={currentUser}/>
          {[...posts].map((post) => (
            <Posts
              key={post._id}
              page="home"
              onLike={handleLike}
              onFollowing={handleFollowing}
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

export default Home;
