import Post from "../components/profilepost";
import NavBar from "../components/navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar";
import { Camera, Send, Loader as Loader2 } from "lucide-react";

function Profile() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [username, setUsername] = useState("");
  const [totalFollowing, setTotalFollowing] = useState("0");
  const [form, setForm] = useState({ content: "" });
  const [userID, setUserID] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      setIsLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
          credentials: "include",
        });
        if (res.status === 401) {
          navigate("/auth");
          return;
        }
        const data = await res.json();
        setPosts(data.posts);
        setUserID(data.userID);
        setName(data.name);
        setProfilePic(data.profilePic);
        setUsername(data.username);
        setTotalFollowing(data.totalfollowing);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, [navigate]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.content.trim()) return;

    setIsPosting(true);
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
    } finally {
      setIsPosting(false);
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

  function handleDelete(postID) {
    setPosts((prev) => prev.filter((p) => p._id !== postID));
  }

  const charCount = form.content.length;
  const maxChars = 90;

  return (
    <SidebarProvider>
      <AppSidebar loggedIn={userID} />
      <SidebarInset>
        <NavBar loggedIn={userID} />
        <div className="min-h-screen bg-background">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-b border-border/40">
                <div className="max-w-4xl mx-auto px-4 py-8">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative group">
                      <button
                        onClick={() => navigate("/profilepic", { state: { userID } })}
                        className="relative block"
                      >
                        {profilePic ? (
                          <img
                            src={profilePic}
                            alt="Profile"
                            className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover ring-4 ring-background shadow-lg"
                          />
                        ) : (
                          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-muted flex items-center justify-center ring-4 ring-background shadow-lg">
                            <span className="text-4xl font-bold text-muted-foreground">
                              {username?.[0]?.toUpperCase() || "?"}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Camera className="w-6 h-6 text-white" />
                        </div>
                      </button>
                    </div>

                    <div className="text-center md:text-left flex-1">
                      <h1 className="text-2xl font-bold text-foreground">
                        {name || "User"}
                      </h1>
                      <p className="text-muted-foreground">@{username}</p>

                      <div className="flex items-center justify-center md:justify-start gap-8 mt-4">
                        <div className="text-center">
                          <div className="text-xl font-bold text-foreground">
                            {posts.length}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Posts
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-foreground">
                            0
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Followers
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-foreground">
                            {totalFollowing}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Following
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="max-w-2xl mx-auto px-4 py-6">
                <div className="bg-card border border-border/50 rounded-xl p-4 mb-6">
                  <form onSubmit={handleSubmit}>
                    <Textarea
                      name="content"
                      value={form.content}
                      onChange={handleChange}
                      maxLength={maxChars}
                      placeholder="What's on your mind?"
                      className="min-h-[100px] resize-none border-0 bg-transparent focus-visible:ring-0 text-base"
                    />
                    <div className="flex items-center justify-between pt-3 border-t border-border/30 mt-3">
                      <span
                        className={`text-sm ${
                          charCount >= maxChars - 10
                            ? "text-destructive"
                            : "text-muted-foreground"
                        }`}
                      >
                        {charCount}/{maxChars}
                      </span>
                      <Button
                        type="submit"
                        disabled={!form.content.trim() || isPosting}
                        className="gap-2"
                      >
                        {isPosting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Posting...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Post
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-4">Your Posts</h2>
                  {posts.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>You haven&apos;t posted anything yet.</p>
                      <p className="text-sm mt-1">Share your thoughts above!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {[...posts].reverse().map((post) => (
                        <Post
                          onLike={handleLike}
                          onDelete={handleDelete}
                          userID={userID}
                          likes={post.likes}
                          key={post._id}
                          postID={post._id}
                          username={username}
                          content={post.content}
                          date={post.date}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Profile;
