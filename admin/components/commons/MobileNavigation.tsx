"use client";

import { serverUrl } from "@/config";
import { UserType } from "@/types/userType";
import axios from "axios";
import {
  BellRing,
  ChevronsLeftRight,
  CreditCard,
  Database,
  Layers,
  LayoutGrid,
  LogOut,
  Settings,
  ShoppingBag,
  Tag,
  User,
  Users,
  Wand,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "../ui/command";

const NavItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: <LayoutGrid className="w-4 h-4" />,
  },
  {
    label: "Account",
    href: "/profile",
    icon: <User className="w-4 h-4" />,
  },
  {
    label: "Users",
    href: "/user",
    icon: <Users className="w-4 h-4" />,
  },
  {
    label: "Orders",
    href: "/orders",
    icon: <Database className="w-4 h-4" />,
  },
  {
    label: "Banners",
    href: "/banner",
    icon: <Layers className="w-4 h-4" />,
  },
  {
    label: "Products",
    href: "/products",
    icon: <ShoppingBag className="w-4 h-4" />,
  },
  {
    label: "Categories",
    href: "/category",
    icon: <Tag className="w-4 h-4" />,
  },
  {
    label: "Brands",
    href: "/brand",
    icon: <Wand className="w-4 h-4" />,
  },
];

const MobileNavigation = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [open, setOpen] = useState(false);
  const pathName = usePathname();
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
        {
          withCredentials: true,
        }
      );
      const data = res?.data;
      if (data?.success) {
        toast.success(data?.message);
        window.location.href = "/login";
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log("user logout error:", error);
    }
  };
  return (
    <>
      <div className="flex-1 px-4">
        <div className="flex flex-col gap-y-2">
          {NavItems?.map((item, index) => {
            const isActive = pathName === item?.href;
            return (
              <Link
                key={index}
                href={item?.href}
                className={`flex items-center gap-x-2 text-sm font-semibold rounded-md shadow py-2 px-2 ${
                  isActive
                    ? "ring-1 ring-purple-600"
                    : "hover:ring-1 hover:ring-cyan-500"
                }`}
              >
                {item?.icon}
                <span>{item?.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="p-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="flex items-center gap-x-2 mb-4 p-2 hover:ring-1 hover:ring-cyan-400 rounded-md cursor-pointer">
              {user?.avatar && (
                <Image
                  src={user?.avatar.url}
                  alt={user?.avatar.public_id}
                  width={50}
                  height={50}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div className="w-full flex items-center justify-between">
                <div className="flex flex-col items-start">
                  <h3 className="text-[10px] font-semibold">{user?.name}</h3>
                  <p className="text-xs font-semibold">{user?.role}</p>
                </div>
                <ChevronsLeftRight size={15} />
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent side="top" align="start">
            <Command>
              <CommandList>
                <CommandGroup>
                  <div className="flex items-center gap-x-2">
                    {user?.avatar && (
                      <Image
                        src={user?.avatar.url}
                        alt={user?.avatar.public_id}
                        width={50}
                        height={50}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div className="flex flex-col items-start">
                      <h3 className="text-[10px] font-semibold">
                        {user?.name}
                      </h3>
                      <p className="text-xs font-semibold">{user?.email}</p>
                    </div>
                  </div>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="setting">
                  <CommandItem className=" cursor-pointer">
                    <Link
                      href={"/profile"}
                      className="flex items-center space-x-1 w-full"
                    >
                      <User size={24} />
                      <span>Profile</span>
                      <CommandShortcut>⌘P</CommandShortcut>
                    </Link>
                  </CommandItem>
                  <CommandItem className=" cursor-pointer">
                    <CreditCard size={24} />
                    <span>Billing</span>
                    <CommandShortcut>⌘B</CommandShortcut>
                  </CommandItem>
                  <CommandItem className=" cursor-pointer">
                    <BellRing size={24} />
                    <span>Notifications</span>
                    <CommandShortcut>⌘N</CommandShortcut>
                  </CommandItem>
                  <CommandItem className=" cursor-pointer">
                    <Settings size={24} />
                    <span>Setting</span>
                    <CommandShortcut>⌘S</CommandShortcut>
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup className="mt-2">
                  <CommandItem className=" cursor-pointer">
                    <p
                      onClick={handleLogout}
                      className="flex items-center space-x-1 w-full"
                    >
                      <LogOut size={24} />
                      <span className="text-sm font-semibold">Logout</span>
                    </p>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

export default MobileNavigation;
