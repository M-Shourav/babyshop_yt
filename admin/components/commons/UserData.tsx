"use client";

import { serverUrl } from "@/config";
import { UserType } from "@/types/userType";
import axios from "axios";
import { useEffect, useState } from "react";

const UserData = () => {
  const [pageSize, setPageSize] = useState(15);
  const [userData, setUserData] = useState<UserType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/auth/profile`, {
          withCredentials: true,
        });
        const data = res?.data;
        if (data?.success) {
          setUserData(data?.user);
        }
      } catch (error) {
        console.log("Failed fetching to userData:", error);
      }
    };
    fetchData();
  }, []);

  const totalPage = Math.ceil(userData.length / pageSize);
  return <div>DataTable</div>;
};

export default UserData;
