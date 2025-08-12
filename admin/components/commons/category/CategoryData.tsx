"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { serverUrl } from "@/config";
import toast from "react-hot-toast";
import { CategoryType } from "@/types/categoryType";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ListFilter, Trash2 } from "lucide-react";
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
import UpdateCategory from "./UpdateCategory";
import CreateCategory from "./CreateCategory";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CategoryData = () => {
  const [category, setCategory] = useState<CategoryType[]>([]);
  const [search, setSearch] = useState("");
  const [curPage, setCurPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  // filtered category
  const filterData = category.filter((ct) => {
    const sc = search.toLowerCase();
    return ct.name?.toLowerCase().includes(sc);
  });

  const paginateData = filterData?.slice(
    (curPage - 1) * perPage,
    curPage * perPage
  );

  const totalPage = Math.ceil(filterData.length / perPage);

  const getCategoryData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${serverUrl}/api/category/categories`, {
        withCredentials: true,
      });
      const data = res?.data;
      if (data?.success) {
        setCategory(data?.category);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log("Failed to fetch Category list:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/category/deleteCate/${id}`,
        {},
        {
          withCredentials: true,
        }
      );

      const data = res?.data;
      if (data?.success) {
        toast.success(data?.message);
        setCategory((prev) =>
          prev.filter((ct: CategoryType) => ct?._id !== id)
        );
        await getCategoryData();
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log("Failed to category delete.", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getCategoryData();
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-1 max-w-xs">
            <div className="w-20 h-9 hidden md:inline-flex items-center justify-center gap-1 border rounded-sm">
              <ListFilter size={15} className="font-semibold" />
              <span className="text-sm font-semibold">Filter</span>
            </div>
            <Input
              type="text"
              placeholder="Enter category name..."
              className=" placeholder:text-sm placeholder:font-normal focus-visible:ring-0 w-[180px]"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurPage(1); //reset pagination
              }}
            />
          </div>
          <div className="hidden md:inline-flex items-center gap-2 mr-20">
            <p className="text-xs">Category per page</p>
            <Select
              onValueChange={(value) => {
                setPerPage(Number(value));
                setCurPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={perPage} />
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
          </div>
        </CardTitle>
        <CardAction>
          <CreateCategory onupdate={getCategoryData} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="max-w-3xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>List</TableHead>
                <TableHead>Category Name</TableHead>
                <TableHead className=" hidden md:table-cell">
                  Category Description
                </TableHead>
                <TableHead className="text-red-600">Action</TableHead>
                <TableHead>Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginateData?.map((cat, index) => (
                <TableRow key={index}>
                  <TableCell>{(curPage - 1) * perPage + index + 1}</TableCell>
                  <TableCell>{cat?.name}</TableCell>
                  <TableCell className=" hidden md:table-cell">
                    {cat?.description ? (
                      <>{cat?.description.slice(0, 40)}...</>
                    ) : (
                      "No description of category"
                    )}
                  </TableCell>
                  <TableCell>
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
                            This action cannot be undone. This will permanently
                            delete your category and remove your data from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            disabled={loading}
                            className="hover:text-red-500"
                            onClick={() => handleDelete(cat?._id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                  <TableCell>
                    <UpdateCategory category={cat} onupdate={getCategoryData} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="max-w-3xl flex items-center justify-between mt-10">
          <p className="text-sm w-full flex items-center font-semibold text-muted-foreground">
            Total Pages: <span className="ml-2 text-red-500"> {totalPage}</span>
          </p>
          {totalPage > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => {
                      setCurPage((prev) => Math.max(prev - 1, 1));
                    }}
                    className={`${
                      curPage === 1
                        ? " pointer-events-none opacity-50"
                        : " cursor-pointer"
                    }`}
                  />
                </PaginationItem>
                {[...Array(totalPage)].map((_, i) => (
                  <PaginationItem key={i}>
                    <Button
                      onClick={() => setCurPage(i + 1)}
                      className={`px-3 py-1 text-xs border border-gray-600 w-7 h-7 flex items-center justify-center ${
                        curPage === i + 1
                          ? "bg-black text-white"
                          : "bg-white text-black hover:text-white duration-200"
                      } `}
                      size="icon"
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
                    onClick={() => {
                      setCurPage((prev) => Math.min(prev + 1, totalPage));
                    }}
                    className={`${
                      curPage === totalPage
                        ? " pointer-events-none opacity-50"
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

export default CategoryData;
