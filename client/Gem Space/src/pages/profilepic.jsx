import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import imageCompression from "browser-image-compression";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar";
import NavBar from "../components/navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, Camera, Loader as Loader2, X } from "lucide-react";

function ProfilePic() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  async function handleProfilePic(e) {
    e.preventDefault();

    if (!file) return;

    setIsUploading(true);
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 600,
      });

      const formdata = new FormData();
      formdata.append("img", compressed);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/profilepic`, {
        method: "post",
        body: formdata,
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        navigate("/profile");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  }

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  }

  function handleRemove() {
    setFile(null);
    setPreview(null);
  }

  return (
    <SidebarProvider>
      <AppSidebar loggedIn={state?.userID} />
      <SidebarInset>
        <NavBar loggedIn={state?.userID} />
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
              <h1 className="text-xl font-bold">Edit Profile Picture</h1>
            </div>

            <div className="p-4">
              <div className="bg-card border border-border/50 rounded-xl p-6">
                {!preview ? (
                  <label
                    htmlFor="file-upload"
                    className="block cursor-pointer"
                  >
                    <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 hover:bg-muted/30 transition-colors">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Camera className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-base font-medium text-foreground mb-1">
                        Click to upload
                      </p>
                      <p className="text-sm text-muted-foreground">
                        PNG, JPG up to 2MB
                      </p>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleFileChange}
                    />
                  </label>
                ) : (
                  <div className="space-y-6">
                    <div className="relative inline-block mx-auto">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-48 h-48 rounded-full object-cover mx-auto ring-4 ring-background shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-center text-sm text-muted-foreground">
                      Looking good! Ready to save?
                    </p>

                    <div className="flex justify-center gap-3">
                      <Button
                        variant="outline"
                        onClick={handleRemove}
                        disabled={isUploading}
                      >
                        Choose Different
                      </Button>
                      <Button
                        onClick={handleProfilePic}
                        disabled={isUploading}
                        className="gap-2"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            Save Picture
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-center text-xs text-muted-foreground mt-4">
                Your profile picture will be visible to everyone
              </p>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default ProfilePic;
