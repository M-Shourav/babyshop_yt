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
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { serverUrl } from "@/config";
import axios from "axios";
import { Loader2, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
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

const BrandData = () => {
  const [brand, setBrand] = useState<BrandsType[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const getBrand = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/brand/brands`, {
        withCredentials: true,
      });
      const data = res?.data;
      if (data?.success) {
        setBrand(data?.brand);
      }
    } catch (error) {
      console.log("Get brands error:", error);
    }
  };

  const createBrand = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/brand/createBrand`,
        { name, description },
        {
          withCredentials: true,
        }
      );
      const data = res?.data;
      if (data?.success) {
        toast.success(data?.message);
        await getBrand();
        setIsOpen(false);
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
      }
    } catch (error) {
      console.log("Failed delete brand:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBrand();
  }, []);

  console.log(name);
  console.log(description);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <p>Brand Page</p>
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
                <TableHead>Name</TableHead>
                <TableHead className=" hidden md:table-cell">
                  Description
                </TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brand?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item?.name}</TableCell>
                  <TableCell className=" hidden md:table-cell">
                    {item?.description ? (
                      <>{item?.description}</>
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
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6}>Total:</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandData;
