import {
  Disclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function NavBar({ loggedIn }) {
  const navigate = useNavigate();
  const [avatarURL,setAvatarURL] = useState(null)

  useEffect(()=>{
    async function getpfp(){
        const res = await fetch(`${import.meta.env.VITE_API_URL}/getpfp`,{
            credentials: "include"
        })
        const data = await res.json();
        if(data.success){
            setAvatarURL(data.avatarURL);
        }
    }getpfp();
  },[])

  async function handleLogout() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("logout failed"); // when server rejects req
      navigate("/auth");
    } catch (err) {
      if (err.message === "logout failed") navigate("/profile"); //if fetch fails
    }
  }
  const SigninBtn = (
    <button
      className="rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white shadow-md transition-all duration-200 hover:bg-indigo-500 hover:shadow-lg active:scale-95"
      onClick={() => {
        navigate("/auth");
      }}
    >
      Sign In
    </button>
  );
  const AlreadySigned = (
    <Menu as="div" className="relative ml-3">
      <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
        <span className="absolute -inset-1.5" />
        <span className="sr-only">Open user menu</span>
        <img
          alt="Profile Picture"
          src={avatarURL}
          className="size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
        />
      </MenuButton>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-gray-800 py-1 outline -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        <MenuItem>
          <button
            onClick={() => {
              navigate("/profile");
            }}
            className="block  px-2 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden"
          >
            Your profile
          </button>
        </MenuItem>

        <MenuItem>
          <button
            onClick={handleLogout}
            className="block px-2 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden"
          >
            Sign out
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );

  return (
    <Disclosure
      as="nav"
      className="relative bg-gray-800/50 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10"
    >
      <div className="mx-auto w-full px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <Link to="/" className="font-bold">
                Gem Space
              </Link>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Profile dropdown */}
            {loggedIn ? AlreadySigned : SigninBtn}
          </div>
        </div>
      </div>
    </Disclosure>
  );
}
export default NavBar;
