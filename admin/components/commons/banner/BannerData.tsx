"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { serverUrl } from "@/config";
import { BannerType } from "@/types/bannerType";
import axios from "axios";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import UpdateBanner from "./UpdateBanner";
import CreateBanner from "./CreateBanner";

const BannerData = () => {
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState<BannerType[]>([]);

  const getBanner = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${serverUrl}/api/banner/all-banner`, {
        withCredentials: true,
      });
      const data = res?.data;
      if (data?.success) {
        setBanner(data?.banner);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log("Failed to get banner:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/banner/delete-banner/${id}`,
        {},
        {
          withCredentials: true,
        }
      );
      const data = res?.data;
      if (data?.success) {
        toast.success(data?.message);
        setBanner((prev) => prev.filter((b: BannerType) => b._id !== id));
        await getBanner();
      }
    } catch (error) {
      console.log("Failed delete brand:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getBanner();
  }, []);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-4">
        <CardTitle>BannerData</CardTitle>
        <CardDescription className="hidden md:inline-flex">
          per page
        </CardDescription>
        <CardAction>
          <CreateBanner onupdate={getBanner} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="max-w-3xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>List</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className=" hidden md:table-cell">
                  Description
                </TableHead>
                <TableHead className="text-red-500 text-center">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banner?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Image
                      src={item?.image?.url}
                      alt="brand-image"
                      width={50}
                      height={50}
                    />
                  </TableCell>
                  <TableCell>{item?.title}</TableCell>
                  <TableCell className=" hidden md:table-cell">
                    {item?.subtitle ? (
                      <>{item?.subtitle.slice(0, 40)}...</>
                    ) : (
                      "No Subtitle"
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-3">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:text-red-500"
                          >
                            <Trash2 />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolute sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your banner and remove your
                              data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="hover:text-red-500"
                              onClick={() => handleDelete(item?._id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <UpdateBanner item={item} onupdate={getBanner} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default BannerData;
