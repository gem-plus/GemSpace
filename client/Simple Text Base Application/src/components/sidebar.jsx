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

import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

function AppSidebar() {
  const navigate = useNavigate();

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
    <Sidebar>
      <SidebarHeader>
        <img src={logo} alt="logo" className="max-w-15 h-auto pl-4" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => {
                navigate("/");
              }}
              className="py-6 pl-6 my-1"
            >
              Home
            </SidebarMenuButton>
            <SidebarMenuButton className="py-6 pl-6 my-1">
              Following
            </SidebarMenuButton>
            <SidebarMenuButton className="py-6 pl-6 my-1">
              Notification
            </SidebarMenuButton>
            <SidebarMenuButton
              onClick={() => {
                navigate("/profile");
              }}
              className="py-6 pl-6 my-1"
            >
              Profile
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarGroup />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="py-6 pl-6">
                  More
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuItem onClick={handleLogout} className=" pl-6 ">
                  Logout
                </DropdownMenuItem>
                <DropdownMenuItem onClick={()=>{window.open("https://github.com/gem-plus","_blank")}} className="mt-2 pl-6">
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
