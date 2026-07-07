import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import NavBar from "../components/navbar";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppSidebar from "@/components/sidebar";
import { ArrowLeft, Save, Loader as Loader2 } from "lucide-react";

function Edit() {
  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const location = useLocation();
  const state = location.state;
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/edit/${state.postID}`,
          {
            method: "get",
            credentials: "include",
          },
        );

        const data = await res.json();
        setContent(data.post.content);
        setOriginalContent(data.post.content);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchContent();
  }, [state.postID]);

  function handleChange(e) {
    setContent(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!content.trim()) return;

    setIsSaving(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/update/${state.postID}`,
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: content }),
          credentials: "include",
        },
      );
      const data = await res.json();
      if (data.success) {
        navigate("/profile");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  }

  const hasChanges = content !== originalContent && content.trim();

  return (
    <SidebarProvider>
      <AppSidebar loggedIn={state.userID} />
      <SidebarInset>
        <NavBar loggedIn={state.userID} />
        <div className="min-h-screen bg-background">
          <div className="max-w-2xl mx-auto">
            <div className="sticky top-14 z-40 bg-background/80 backdrop-blur-md border-b border-border/40 px-4 py-3 flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => navigate("/profile")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-bold">Edit Post</h1>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-4">
                <div className="bg-card border border-border/50 rounded-xl p-4">
                  <Textarea
                    name="content"
                    value={content}
                    onChange={handleChange}
                    maxLength={90}
                    placeholder="What's on your mind?"
                    className="min-h-[150px] resize-none border-0 bg-transparent focus-visible:ring-0 text-base leading-relaxed"
                  />
                  <div className="flex items-center justify-between pt-3 border-t border-border/30 mt-3">
                    <span
                      className={`text-sm ${
                        content.length >= 80 ? "text-destructive" : "text-muted-foreground"
                      }`}
                    >
                      {content.length}/90
                    </span>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/profile")}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={!hasChanges || isSaving}
                        className="gap-2"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Edit;
