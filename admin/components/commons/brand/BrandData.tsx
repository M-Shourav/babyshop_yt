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
import axios from "axios";
import { ListFilter, Loader2, Trash2, Upload, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import UpdateBrand from "./UpdateBrand";
import { BrandsType } from "@/types/brandType";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import Image from "next/image";

const BrandData = () => {
  const [brand, setBrand] = useState<BrandsType[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [prevImg, setPreviewImg] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const filterBrand = brand.filter((brand) => {
    const sc = searchTerm.toLowerCase();
    return brand.name?.toLowerCase().includes(sc);
  });

  const paginateBrand = filterBrand?.slice(
    (currentPage - 1) * itemPerPage,
    currentPage * itemPerPage
  );

  const totalPage = Math.ceil(brand.length / itemPerPage);
  const getBrand = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/brand/brands`, {
        withCredentials: true,
      });
      const data = res?.data;
      if (data?.success) {
        setBrand(data?.brand);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log("Get brands error:", error);
    }
  };

  const createBrand = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (image) {
      formData.append("images", image);
    }

    try {
      const res = await axios.post(
        `${serverUrl}/api/brand/createBrand`,
        formData,
        {
          withCredentials: true,
        }
      );
      const data = res?.data;
      console.log(data);

      if (data?.success) {
        toast.success(data?.message);
        await getBrand();
        setIsOpen(false);
        setName("");
        setDescription("");
        setImage(null);
      }
    } catch (error) {
      console.log("Failed to create brand:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/brand/deleteBrand/${id}`,
        {},
        {
          withCredentials: true,
        }
      );
      const data = res?.data;
      if (data?.success) {
        toast.success(data?.message);
        setBrand((prev) => prev.filter((b: BrandsType) => b._id !== id));
        await getBrand();
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log("Failed delete brand:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewImg(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    getBrand();
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
              placeholder="Filter Brand name..."
              className=" placeholder:text-sm placeholder:font-normal focus-visible:ring-0 w-[150px]"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); //reset pagination
              }}
            />
          </div>
          <div className="hidden md:inline-flex items-center gap-2 mr-20">
            <p className="text-xs">Brand per page</p>
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
          </div>
        </CardTitle>
        <CardAction>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Add Brand</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Brand</DialogTitle>
                <DialogDescription>Create product Brand</DialogDescription>
              </DialogHeader>
              <div className=" grid gap-4">
                <div className=" space-y-2">
                  <Label className="text-xs">
                    {image && prevImg ? (
                      <p>Change image</p>
                    ) : (
                      <p>Upload Brand image</p>
                    )}
                  </Label>
                  {image && prevImg ? (
                    <div className=" relative w-28 h-28 border border-red-400 rounded-sm">
                      <Image
                        src={prevImg}
                        alt="prev-img"
                        width={50}
                        height={50}
                        className="w-full object-cover rounded-sm"
                      />

                      <Button
                        className="absolute top-1 right-1 w-6 h-6 rounded-full"
                        variant="destructive"
                        onClick={() => setPreviewImg(null)}
                      >
                        <X />
                      </Button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-28 h-28 flex flex-col items-center justify-center border rounded-md cursor-pointer"
                    >
                      <Input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className=" hidden"
                        onChange={handleImage}
                      />

                      <Upload size={30} />
                    </div>
                  )}
                </div>
                <div className=" space-y-2">
                  <Label htmlFor="name" className="text-xs font-semibold">
                    Brand Name
                  </Label>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="focus-visible:ring-1"
                    disabled={loading}
                    required
                    autoComplete="off"
                  />
                </div>
                <div className=" space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-xs font-semibold"
                  >
                    Brand Description
                  </Label>
                  <Textarea
                    name="description"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="h-24 focus-visible:ring-1 resize-none"
                    disabled={loading}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="button" disabled={loading} onClick={createBrand}>
                  {loading ? (
                    <div className="flex items-center gap-1">
                      <Loader2 className="mt-1 animate-spin" />
                      <p>Processing...</p>
                    </div>
                  ) : (
                    <p> Create brand</p>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                <TableHead className="text-red-500">Action</TableHead>
                <TableHead>Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginateBrand?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {(currentPage - 1) * itemPerPage + index + 1}
                  </TableCell>
                  <TableCell>
                    {/* <Image
                      src={item?.images}
                      alt="brand-image"
                      width={50}
                      height={50}
                    /> */}
                  </TableCell>
                  <TableCell>{item?.name}</TableCell>
                  <TableCell className=" hidden md:table-cell">
                    {item?.description ? (
                      <>{item?.description.slice(0, 40)}...</>
                    ) : (
                      "No description"
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
                            delete your brand and remove your data from our
                            servers.
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
                  </TableCell>
                  <TableCell>
                    <UpdateBrand item={item} onupdate={getBrand} />
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

export default BrandData;
