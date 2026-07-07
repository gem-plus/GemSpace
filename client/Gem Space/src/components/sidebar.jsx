import { useNavigate, useLocation } from "react-router-dom";
import { Hop as Home, Users, Bell, User, MoveHorizontal as MoreHorizontal, LogOut, ExternalLink } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle, CompactColorPicker } from "@/components/theme-toggle";

function AppSidebar({ loggedIn }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

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

  const navItems = [
    { label: "Home", icon: Home, path: "/" },
    { label: "Following", icon: Users, path: "/following" },
    { label: "Notifications", icon: Bell, path: null, badge: "Soon" },
    { label: "Profile", icon: User, path: "/profile" },
  ];

  return (
    <Sidebar className="border-r border-border/40">
      <SidebarHeader className="p-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <span className="text-xl font-bold tracking-tight">
            Gem<span className="text-primary">Space</span>
          </span>
        </button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-2">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  onClick={() => item.path && navigate(item.path)}
                  isActive={item.path && isActive(item.path)}
                  className={`w-full justify-start gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
                    item.path && isActive(item.path)
                      ? "bg-primary/10 text-primary font-medium"
                      : item.path
                      ? "hover:bg-accent text-foreground"
                      : "text-muted-foreground cursor-not-allowed"
                  }`}
                  tooltip={item.label}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="flex items-center gap-2">
                    {item.label}
                    {item.badge && (
                      <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-normal">
                        {item.badge}
                      </span>
                    )}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t border-border/40">
        <div className="flex items-center justify-between px-2 py-2">
          <ThemeToggle />
          <CompactColorPicker />
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full justify-start gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors">
                  <MoreHorizontal className="h-5 w-5" />
                  <span>More</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56 mb-2">
                {loggedIn && (
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="gap-2 text-destructive focus:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => window.open("https://github.com/gem-plus", "_blank")}
                  className="gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Contact Us
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
