"use client";

import { serverUrl } from "@/config";
import { UserType } from "@/types/userType";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import MobileNavigation from "./MobileNavigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";

const Topbar = () => {
  const [user, setUser] = useState<UserType | null>(null);
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
  return (
    <div className="h-14 flex items-center justify-between px-4 border-b shadow-sm bg-white">
      <div className="font-semibold text-lg">Admin Dashboard</div>
      <div>
        <div className=" hidden md:flex items-center gap-2">
          <p className="text-xs font-semibold">Welcome {user?.name}</p>
          {user?.avatar.url && (
            <Image
              src={user?.avatar.url}
              alt={user?.avatar.public_id}
              width={20}
              height={20}
              loading="lazy"
              className="w-10 h-10 rounded-full object-fill cursor-pointer"
            />
          )}
        </div>
        <div className="inline-flex md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Admin Dashboard</SheetTitle>
              </SheetHeader>
              <MobileNavigation />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
