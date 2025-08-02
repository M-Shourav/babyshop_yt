"use client";
import React, { useEffect, useState } from "react";
import { serverUrl } from "@/config";
import { UserType } from "@/types/userType";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Image from "next/image";
import { EllipsisVertical, X } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandGroup, CommandItem, CommandList } from "../ui/command";
import EditUser from "@/components/commons/EditUser";
import Loading from "./Loading";
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
} from "../ui/alert-dialog";
import toast from "react-hot-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const UserData = () => {
  const [userData, setUserData] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(4);

  const paginateData = userData?.slice(
    (currentPage - 1) * itemPerPage,
    currentPage * itemPerPage
  );
  const totalPage = Math.ceil(userData.length / itemPerPage);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${serverUrl}/api/auth/profile`, {
        withCredentials: true,
      });
      const data = res?.data;
      if (data?.success) {
        setUserData(data.user);
      }
    } catch (error) {
      console.log("Failed fetching userData:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/delete/${id}`,
        {},
        {
          withCredentials: true,
        }
      );
      const data = res?.data;
      if (data?.success) {
        toast.success(data?.message);
        setUserData((user) => user.filter((u: UserType) => u?._id !== id));
        await fetchData();
      }
    } catch (error) {
      console.log("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <Card>
          <CardContent>
            {/* user per-page filter */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1>filter data</h1>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-muted-foreground">
                  users per page
                </span>
                <Select
                  onValueChange={(value) => {
                    setItemPerPage(Number(value));
                  }}
                >
                  <SelectTrigger className="w-20 py-4 focus-visible:ring-1">
                    <SelectValue placeholder={`${itemPerPage}`} />
                  </SelectTrigger>
                  <SelectContent className="min-w-[20px]">
                    <SelectItem value="4" className=" cursor-pointer">
                      4
                    </SelectItem>
                    <SelectItem value="10" className=" cursor-pointer">
                      10
                    </SelectItem>
                    <SelectItem value="30" className=" cursor-pointer">
                      30
                    </SelectItem>
                    <SelectItem value="50" className=" cursor-pointer">
                      50
                    </SelectItem>
                    <SelectItem value="100" className=" cursor-pointer">
                      100
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Table>
              <TableHeader className="w-full">
                <TableRow>
                  <TableHead className="hidden md:table-cell">List</TableHead>
                  <TableHead>Avatar</TableHead>
                  <TableHead className="hidden md:table-cell">Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden md:table-cell">Role</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginateData?.map((item, index) => (
                  <TableRow key={item?._id}>
                    <TableCell className="hidden md:table-cell">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      {item?.avatar && (
                        <Image
                          src={item?.avatar.url}
                          alt={item?.avatar.public_id}
                          width={50}
                          height={50}
                          className="w-12 h-12 object-fill rounded-xs"
                        />
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {item?.name}
                    </TableCell>
                    <TableCell>{item?.email}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {item?.role}
                    </TableCell>
                    <TableCell>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <EllipsisVertical className="w-4 h-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-52 mr-4 md:mr-0 p-0"
                          side="bottom"
                        >
                          <Command className="w-full">
                            <CommandList>
                              <CommandGroup>
                                <CommandItem className="px-1">
                                  <EditUser user={item} onupdate={fetchData} />
                                </CommandItem>
                                <CommandItem className="px-1">
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        className="w-full text-sm flex items-center justify-between p-2 hover:text-red-500"
                                      >
                                        Delete
                                        <X className="hover:text-red-500" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Are you absolutely sure?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This action cannot be undone. This
                                          will permanently delete your account
                                          and remove your data from our servers.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() =>
                                            handleDelete(item?._id)
                                          }
                                        >
                                          Continue
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </CommandItem>
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* pagination Data */}
            <div className="w-full max-w-screen-sm mt-10 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">
                  Total Pages: {totalPage}
                </p>
              </div>
              <div>
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
                              : " cursor-pointer"
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
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPage)
                            )
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
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserData;
