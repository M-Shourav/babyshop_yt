"use client";
import Link from "next/link";
import { Home, Users, Package } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../command";
import { Button } from "../button";
import axios from "axios";
import { serverUrl } from "@/config";
import toast from "react-hot-toast";

const navItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: <Home className="w-4 h-4" />,
  },
  { label: "Users", href: "user", icon: <Users className="w-4 h-4" /> },
  {
    label: "Products",
    href: "products",
    icon: <Package className="w-4 h-4" />,
  },
];

const Sidebar = () => {
  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/user/logout`,
        {},
        { withCredentials: true }
      );
      const data = res?.data;
      if (data?.success) {
        toast.success(data?.message);
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("failed to logout.");
    }
  };
  return (
    <aside className="w-64 bg-gray-100 h-screen p-2 border-r hidden md:block">
      <Command className="h-full w-full bg-transparent">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            <CommandItem>
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md hover:bg-blue-50 transition isActive"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </CommandItem>
          </CommandGroup>
        </CommandList>
        <Button onClick={handleLogout}>Logout</Button>
      </Command>
    </aside>
  );
};

export default Sidebar;
