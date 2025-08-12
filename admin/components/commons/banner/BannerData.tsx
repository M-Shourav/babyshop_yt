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
import { ListFilter, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import UpdateBanner from "./UpdateBanner";
import CreateBanner from "./CreateBanner";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BannerData = () => {
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState<BannerType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);

  const filterBanner = banner.filter((banner) => {
    const sc = searchTerm.toLowerCase();
    return banner.title.toLowerCase().includes(sc);
  });

  const paginateBanner = filterBanner.slice(
    (currentPage - 1) * itemPerPage,
    currentPage * itemPerPage
  );

  const totalPage = Math.ceil(banner.length / itemPerPage);

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
        <CardTitle>
          <div className="flex items-center gap-1 max-w-xs">
            <div className="w-20 h-9 hidden md:inline-flex items-center justify-center gap-1 border rounded-sm">
              <ListFilter size={15} className="font-semibold" />
              <span className="text-sm font-semibold">Filter</span>
            </div>
            <Input
              type="text"
              placeholder="Filter banner name..."
              className=" placeholder:text-sm placeholder:font-normal focus-visible:ring-0 w-[150px]"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); //reset pagination
              }}
            />
          </div>
        </CardTitle>
        <CardDescription className="hidden md:inline-flex items-center gap-2">
          <p className="text-sm font-semibold">Banner per page</p>
          <Select
            onValueChange={(value) => {
              setItemPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={itemPerPage} />
            </SelectTrigger>
            <SelectContent className="min-w-[20px]">
              <SelectItem value="10" className=" cursor-pointer">
                10
              </SelectItem>
              <SelectItem value="30" className=" cursor-pointer">
                30
              </SelectItem>
              <SelectItem value="50" className=" cursor-pointer">
                50
              </SelectItem>
              <SelectItem value="75" className=" cursor-pointer">
                75
              </SelectItem>
              <SelectItem value="100" className=" cursor-pointer">
                100
              </SelectItem>
            </SelectContent>
          </Select>
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
              {paginateBanner?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {(currentPage - 1) * itemPerPage + index + 1}
                  </TableCell>
                  <TableCell>
                    <Image
                      src={item?.image?.url}
                      alt="brand-image"
                      width={50}
                      height={50}
                      className="w-16 h-16 object-fill"
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
                              disabled={loading}
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
        {/* pagination */}
        <div className="max-w-3xl flex items-center justify-between mt-10">
          <p className="text-sm w-full flex items-center font-semibold text-muted-foreground">
            Total Pages: <span className="ml-2 text-red-500"> {totalPage}</span>
          </p>
          {totalPage > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={`${
                      currentPage === 1
                        ? " pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }`}
                  />
                </PaginationItem>
                {[...Array(totalPage)].map((_, i) => (
                  <PaginationItem key={i}>
                    <Button
                      size="icon"
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 text-xs border border-gray-600 w-7 h-7 flex items-center justify-center ${
                        currentPage === i + 1
                          ? "bg-black text-white"
                          : "bg-white text-black hover:text-white duration-200"
                      } `}
                    >
                      {i + 1}
                    </Button>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPage))
                    }
                    className={`${
                      currentPage === totalPage
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BannerData;
