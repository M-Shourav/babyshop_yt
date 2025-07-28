"use client";

import { serverUrl } from "@/config";
import { User } from "@/types/userType";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

const Topbar = () => {
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
  return (
    <div className="h-14 flex items-center justify-between px-4 border-b shadow-sm bg-white">
      <div className="font-semibold text-lg">Admin Dashboard</div>
      <div className=" flex items-center gap-2">
        <p className="text-sm font-semibold">Welcome {user?.name}</p>
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
      </div>
    </div>
  );
};

export default Topbar;
