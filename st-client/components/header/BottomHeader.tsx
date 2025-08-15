"use client";
import React, { useEffect, useState } from "react";
import Container from "../Container";
import Link from "next/link";
import { projectLogo } from "@/public/images";
import Image from "next/image";
import SearchProduct from "../SearchProduct";
import { Heart, LogOut, ShoppingBag, ShoppingCart, User } from "lucide-react";
import { UserType } from "@/types/userType";
import axios from "axios";
import { serverUrl } from "@/config";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import toast from "react-hot-toast";

const BottomHeader = () => {
  const [userData, setUserData] = useState<UserType | null>(null);
  const [open, setOpen] = useState(false);
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
        window.location.href = "/";
        setOpen(false);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log("user logout error:", error);
    }
  };

  useEffect(() => {
    const getSingleUser = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/auth/singleProfile`, {
          withCredentials: true,
        });
        const data = res?.data;
        if (data?.success) {
          setUserData(data?.user);
        }
      } catch (error) {
        console.error("single user error:", error);
      }
    };
    getSingleUser();
  }, []);
  return (
    <div className="h-20 border border-b">
      <Container className="h-full flex items-center justify-between gap-6">
        <div>
          <Link href={"/"}>
            <Image
              src={projectLogo}
              alt="project-logo"
              width={70}
              height={70}
              className="w-full object-cover"
              priority
            />
          </Link>
        </div>
        <div className="hidden md:inline-flex flex-1">
          <SearchProduct />
        </div>
        <div className="flex items-center justify-between gap-6">
          {userData ? (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger>
                {userData?.avatar.url && (
                  <Image
                    src={userData?.avatar.url}
                    alt={userData?.avatar.public_id}
                    width={20}
                    height={20}
                    loading="lazy"
                    className="w-10 h-10 rounded-full object-fill cursor-pointer"
                  />
                )}
              </PopoverTrigger>
              <PopoverContent className="w-[180px] mr-2 flex flex-col gap-y-1 p-1">
                <Link
                  href={"/profile"}
                  className="w-full flex items-center justify-between hover:bg-gray-100 px-1 rounded-sm py-1"
                >
                  Profile
                  <User size={18} />
                </Link>
                <Link
                  href={"/profile"}
                  className="w-full flex items-center justify-between hover:bg-gray-100 px-1 rounded-sm py-1"
                >
                  Cart
                  <ShoppingCart size={18} />
                </Link>{" "}
                <Link
                  href={"/profile"}
                  className="w-full flex items-center justify-between hover:bg-gray-100 px-1 rounded-sm py-1"
                >
                  Wishlist
                  <Heart size={18} />
                </Link>
                <p
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between hover:bg-gray-100 px-1 rounded-sm py-1 cursor-pointer"
                >
                  Logout
                  <LogOut size={18} />
                </p>
              </PopoverContent>
            </Popover>
          ) : (
            <Link
              href={"/auth/signin"}
              className="flex items-center gap-2 hover duration-200"
            >
              <User size={30} />
              <div className="flex flex-col items-start">
                <p className="text-xs font-semibold">Welcome</p>
                <p className="text-sm font-semibold">Sign in/Register</p>
              </div>
            </Link>
          )}
          <Link href={"/cart"} className="relative hover">
            <ShoppingBag />
            <span className=" absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center rounded-full bg-[#0ABEB3] p-2 text-white text-xs">
              0
            </span>
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default BottomHeader;
