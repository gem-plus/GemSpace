import Posts from "../components/posts";
import NavBar from "../components/navbar";
import { useEffect, useState, useCallback, useRef } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader as Loader2 } from "lucide-react";

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

function Home() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const loadPosts = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/?page=${page}`);
      const data = await res.json();
      if (data.post.length === 0) {
        setHasMore(false);
        return;
      }
      if (data.success) {
        setPosts((prev) => {
          const newPosts = data.post.filter(
            (p) => !prev.some((existing) => existing._id === p._id),
          );
          return [...prev, ...newPosts];
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      loadingRef.current = false;
      setLoading(false);
      setInitialLoading(false);
    }
  }, [page, hasMore]);

  useEffect(() => {
    async function fetchUser() {
      try {
        const userRes = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
          credentials: "include",
        });
        if (userRes.ok) {
          const userdata = await userRes.json();
          if (userdata.success) setCurrentUser(userdata.id);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;

      const reachedBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 300;

      if (reachedBottom) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

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
    <SidebarProvider>
      <AppSidebar loggedIn={currentUser} />
      <SidebarInset>
        <NavBar loggedIn={currentUser} />
        <div className="min-h-screen bg-background">
          <div className="max-w-2xl mx-auto">
            <div className="sticky top-14 z-40 bg-background/80 backdrop-blur-md border-b border-border/40 px-4 py-3">
              <h1 className="text-xl font-bold">Home</h1>
            </div>

            <div className="divide-y divide-border/50">
              {initialLoading ? (
                <>
                  <FeedSkeleton />
                  <FeedSkeleton />
                  <FeedSkeleton />
                  <FeedSkeleton />
                </>
              ) : posts.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">
                    No posts yet. Be the first to share!
                  </p>
                </div>
              ) : (
                posts.map((post) => (
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
                ))
              )}
            </div>

            {loading && !initialLoading && (
              <div className="flex justify-center py-6">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            )}

            {!hasMore && posts.length > 0 && (
              <div className="p-6 text-center text-muted-foreground text-sm">
                You&apos;ve reached the end
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Home;
