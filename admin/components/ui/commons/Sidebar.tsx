"use client";
import Link from "next/link";
import { Users, Package, House, ListOrdered } from "lucide-react";
import axios from "axios";
import { serverUrl } from "@/config";
import toast from "react-hot-toast";
import Image from "next/image";
import { useEffect, useState } from "react";
import { User } from "@/types/userType";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: <House className="w-4 h-4" />,
  },
  { label: "Users", href: "user", icon: <Users className="w-4 h-4" /> },
  {
    label: "Products",
    href: "products",
    icon: <Package className="w-4 h-4" />,
  },
  {
    label: "Orders",
    href: "orders",
    icon: <ListOrdered className="w-4 h-4" />,
  },
];

const Sidebar = () => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const getSingleUser = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/auth/singleProfile`, {
          withCredentials: true,
        });
        const data = res?.data;
        if (data?.success) {
          setUser(data?.user);
        }
      } catch (error) {
        console.error("single user error:", error);
      }
    };
    getSingleUser();
  }, []);
  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/logout`,
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
    <aside className="w-36 bg-gray-100 h-screen p-2 border-r hidden md:block">
      <h2 className="text-xl font-bold mb-6">logo</h2>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 px-2  rounded-md hover:bg-blue-50 transition"
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-20 ml-4 w-8 h-8 flex items-center justify-center ring-1 rounded-full">
        {user?.avatar && (
          <Image
            src={user?.avatar.url}
            alt={user?.avatar.public_id}
            width={20}
            height={20}
            className="w-7 h-7 rounded-full flex items-center justify-center"
          />
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
