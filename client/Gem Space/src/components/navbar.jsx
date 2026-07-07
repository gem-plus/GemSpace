import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, Settings, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle, CompactColorPicker } from "@/components/theme-toggle";

function NavBar({ loggedIn }) {
  const navigate = useNavigate();
  const [avatarURL, setAvatarURL] = useState(null);

  useEffect(() => {
    async function getpfp() {
      if (!loggedIn) return;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/getpfp`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setAvatarURL(data.avatarURL);
        }
      } catch (err) {
        console.error(err);
      }
    }
    getpfp();
  }, [loggedIn]);

  async function handleLogout() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("logout failed");
      navigate("/auth");
    } catch (err) {
      if (err.message === "logout failed") navigate("/profile");
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight">
            Gem<span className="text-primary">Space</span>
          </span>
        </Link>

        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              className="w-full h-9 pl-9 pr-4 rounded-full border border-border bg-muted/50 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <CompactColorPicker />

          {loggedIn ? (
            <Menu as="div" className="relative ml-2">
              <MenuButton className="relative flex rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <img
                  alt="Profile"
                  src={avatarURL}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-transparent hover:ring-primary/30 transition-all"
                />
              </MenuButton>

              <MenuItems className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl bg-popover p-1 shadow-lg ring-1 ring-border/50 transition-all data-[closed]:scale-95 data-[closed]:opacity-0">
                <div className="px-2 py-2 border-b border-border/50 mb-1">
                  <p className="text-sm font-medium">Your account</p>
                </div>

                <MenuItem>
                  <button
                    onClick={() => navigate("/profile")}
                    className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent ui-active:bg-accent"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                </MenuItem>

                <MenuItem>
                  <button className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent cursor-not-allowed">
                    <Settings className="h-4 w-4" />
                    Settings
                    <span className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">Soon</span>
                  </button>
                </MenuItem>

                <div className="my-1 border-t border-border/50" />

                <MenuItem>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          ) : (
            <Button onClick={() => navigate("/auth")} className="ml-2">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export default NavBar;
