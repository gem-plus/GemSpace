import HomePost from "../components/homepost";
import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import  AppSidebar  from "@/components/sidebar"

function Home() {
  const [post, setpost] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const postRes = await fetch(`${import.meta.env.VITE_API_URL}/`, {});

      const postdata = await postRes.json();
      if (postdata.success) setpost(postdata.post);

      const userRes = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
        credentials: "include",
      });

      if (userRes.ok) {
        const userdata = await userRes.json();

        if (userdata.success) {
          setCurrentUser(userdata.id);
        }
      }
    }
    fetchData();
  }, []);

  async function handleLike(postID) {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/like/${postID}`, {
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
      <SidebarProvider>
        <AppSidebar />
        <main>
          {[...post].reverse().map((post) => (
            <HomePost
              key={post._id}
              onLike={handleLike}
              userID={currentUser}
              postID={post._id}
              likes={post.likes}
              username={post.user.username}
              content={post.content}
            />
          ))}
        </main>
      </SidebarProvider>

    </>
  );
}

export default Home;
