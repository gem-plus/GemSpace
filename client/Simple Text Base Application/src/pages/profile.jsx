import Post from "../components/profilepost";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar";

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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
        credentials: "include",
      });
      if (res.status === 401) navigate("/auth");
      const data = await res.json();
      setPosts(data.posts);
      setUserID(data.userID);
      setName(data.name);
      setUsername(data.username);
    }
    checkAuth();
  }, [navigate]);


  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/post`, {
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
        <AppSidebar />
        <main>
          <div className="m-10 p-0">
            <h3 className="text-4xl">{greet}</h3>

            <Field className="mt-10">
              <FieldLabel>New Post</FieldLabel>
              <FieldDescription>Enter your message below.</FieldDescription>
              <div className="grid w-1/4 gap-2">
                <form onSubmit={handleSubmit}>
                  <Textarea
                    className="w-1/4"
                    id="textarea-message"
                    name="content"
                    value={form.content}
                    onChange={(e) => handleChange(e)}
                    placeholder="Type your message here."
                  />
                  <Button className="mt-2" type="submit">
                    Create post
                  </Button>
                </form>
              </div>
            </Field>

            <div className="posts mt-15">
              <h3>Your post's</h3>
              <div className="flex flex-wrap gap-5">
                {[...posts].reverse().map((post) => (
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
          </div>
        </main>
      </SidebarProvider>
    </>
  );
}

export default Profile;
