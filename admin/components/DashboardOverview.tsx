"use client";
import { serverUrl } from "@/config";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Layers2, ShoppingBag, Tag, User, Users } from "lucide-react";

const DashboardOverview = () => {
  const [totalUser, setTotalUser] = useState<number | null>(null);
  const [totalBrand, setTotalBrand] = useState<number | null>(null);
  const [totalCt, setTotalCt] = useState<number | null>(null);
  const [totalPd, setTotalPd] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${serverUrl}/api/auth/profile`, {
          withCredentials: true,
        });
        if (res?.data.success) {
          setTotalUser(res.data?.total);
        } else {
          toast.error(res.data?.message);
        }
      } catch (error) {
        console.log("Failed to get userData", error);
      } finally {
        setLoading(false);
      }
    };
    const getBrandData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${serverUrl}/api/brand/brands`, {
          withCredentials: true,
        });
        if (res?.data.success) {
          setTotalBrand(res.data?.total);
        } else {
          toast.error(res.data?.message);
        }
      } catch (error) {
        console.log("Failed to get BrandData", error);
      } finally {
        setLoading(false);
      }
    };
    const getCtData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${serverUrl}/api/category/categories`, {
          withCredentials: true,
        });
        if (res?.data.success) {
          setTotalCt(res.data?.total);
        } else {
          toast.error(res.data?.message);
        }
      } catch (error) {
        console.log("Failed to get CategoryData", error);
      } finally {
        setLoading(false);
      }
    };
    const getProductData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${serverUrl}/api/product/all-product`, {
          withCredentials: true,
        });
        if (res?.data.success) {
          setTotalPd(res.data?.total);
        } else {
          toast.error(res.data?.message);
        }
      } catch (error) {
        console.log("Failed to get ProductData", error);
      } finally {
        setLoading(false);
      }
    };
    getUserData();
    getBrandData();
    getCtData();
    getProductData();
  }, []);

  return (
    <div className=" space-y-4">
      <h1 className="text-xl md:text-2xl font-semibold">Dashboard Overview</h1>
      <div className=" grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex flex-col gap-y-4">
              <p>Total Users</p>
              <span className="text-xl">{totalUser}</span>
            </CardTitle>
            <CardDescription>
              <Users />
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex flex-col gap-y-4">
              <p>Total Products</p>
              <span className="text-xl">{totalPd}</span>
            </CardTitle>
            <CardDescription>
              <ShoppingBag />
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex flex-col gap-y-4">
              <p>Categories</p>
              <span className="text-xl">{totalCt}</span>
            </CardTitle>
            <CardDescription>
              <Tag />
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex flex-col gap-y-4">
              <p>Brands</p>
              <span className="text-xl">{totalBrand}</span>
            </CardTitle>
            <CardDescription>
              <Layers2 />
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
