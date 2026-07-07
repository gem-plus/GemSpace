import Posts from "../components/posts";
import NavBar from "../components/navbar";
import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader as Loader2, Users } from "lucide-react";

function FeedSkeleton() {
  return (
    <div className="border-b border-border/50 p-4">
      <div className="flex gap-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex gap-6 pt-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Following() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function followingPost() {
      setIsLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/getpost`, {
          method: "GET",
          credentials: "include",
        });
        if (res.status === 401) {
          navigate("/auth");
          return;
        }
        const data = await res.json();
        if (data.success) {
          setPosts(data.post);
          setCurrentUser(data.currentUser);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    followingPost();
  }, [navigate]);

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
    <SidebarProvider>
      <AppSidebar loggedIn={currentUser} />
      <SidebarInset>
        <NavBar loggedIn={currentUser} />
        <div className="min-h-screen bg-background">
          <div className="max-w-2xl mx-auto">
            <div className="sticky top-14 z-40 bg-background/80 backdrop-blur-md border-b border-border/40 px-4 py-3">
              <h1 className="text-xl font-bold">Following</h1>
              <p className="text-sm text-muted-foreground">
                Posts from people you follow
              </p>
            </div>

            {isLoading ? (
              <div className="divide-y divide-border/50">
                <FeedSkeleton />
                <FeedSkeleton />
                <FeedSkeleton />
                <FeedSkeleton />
              </div>
            ) : posts.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">
                  When you follow people, their posts will show up here. Start exploring to find people to follow!
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate("/")}
                >
                  Explore Home Feed
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {posts.map((post) => (
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
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Following;
