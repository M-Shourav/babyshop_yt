"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import axios from "axios";
import { serverUrl } from "@/config";

const customLabel = ({ name, percent }: any) => {
  const label = `${(percent * 100).toFixed(0)}% ${name}`;
  return label;
};

const AdminChart = () => {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/auth/profile`, {
          withCredentials: true,
        });
        const users = res.data.user;

        const adminCount = users.filter(
          (user: any) => user.role === "admin"
        ).length;

        const userCount = users.filter(
          (user: any) => user.role === "user"
        ).length;
        const deliveryCount = users.filter(
          (user: any) => user.role === "deliveryman"
        ).length;
        const chartData = [];
        if (adminCount > 0)
          chartData.push({ name: "Admin", value: adminCount });
        if (userCount > 0) chartData.push({ name: "user", value: userCount });
        if (deliveryCount > 0)
          chartData.push({ name: "deliveryman", value: deliveryCount });
        setData(chartData);
      } catch (error) {
        console.log("Failed to fetch usersList:", error);
      }
    };

    getUser();
  }, []);

  const colors = ["#1A2A80", "#954C2E", "#00809D"];

  return (
    <Card>
      <CardHeader>
        <p className="text-sm font-semibold">User Roles Distribution</p>
      </CardHeader>
      <CardContent className="w-[100%] h-[300px]">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              label={customLabel}
              outerRadius={100}
            >
              {data.map((_, index) => (
                <Cell
                  type="monotone"
                  key={index}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-x-2">
          <span className="w-4 h-4 bg-[#954C2E] inline-flex" />
          <p>User</p>
        </div>
        <div className="flex items-center gap-x-2">
          <span className="w-4 h-4 bg-[#1A2A80] inline-flex" />
          <p>Admin</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AdminChart;
