"use client";

import { serverUrl } from "@/config";
import { User } from "@/types/userType";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Command, CommandGroup, CommandItem, CommandList } from "../command";
import Link from "next/link";

const Topbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
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
      <div className=" flex items-center gap-2">
        <p className="text-sm font-semibold">Welcome {user?.name}</p>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            {user?.avatar.url && (
              <Image
                src={user?.avatar.url}
                alt={user?.avatar.public_id}
                width={20}
                height={20}
                loading="lazy"
                className="w-10 h-10 rounded-full object-fill"
              />
            )}
          </PopoverTrigger>
          <PopoverContent className="w-[200px] ">
            <Command>
              <CommandList>
                <CommandGroup>
                  <CommandItem>
                    <Link href={"/user"}>Profile</Link>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Topbar;
