"use client";
import React, { useState } from "react";
import { UserType } from "@/types/userType";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CameraOff, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { serverUrl } from "@/config";
import toast from "react-hot-toast";

interface Props {
  user: UserType;
  onupdate: () => void;
}
const EditUser = ({ user, onupdate }: Props) => {
  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [role, setRole] = useState(user?.role);
  const [avatar, setAvatar] = useState(user?.avatar);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      return null;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("role", role);
      if (!avatar?.url && newImage) {
        formData.append("avatar", newImage);
      }

      const res = await axios.put(
        `${serverUrl}/api/auth/update/${user?._id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const data = res?.data;
      if (data?.success) {
        toast.success(data?.message);
        onupdate();
        setIsOpen(false);
      }
    } catch (error) {
      console.log("user data update error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="w-full text-sm justify-start p-2">
          Edit
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit user data</SheetTitle>
          <SheetDescription>
            {" "}
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-3 px-4">
          <div>
            {!avatar?.url && !preview && (
              <div>
                <Input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  width={50}
                  height={50}
                  onChange={handleImage}
                  className=" hidden"
                  disabled={loading}
                />
                <Label
                  htmlFor="avatar"
                  className="inline-flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:underline"
                >
                  <span className="w-[100px] h-[100px] inline-flex items-center justify-center  rounded-md bg-gray-300 ring-1 ring-purple-500">
                    <CameraOff />
                  </span>
                </Label>
              </div>
            )}
            {preview && !avatar?.url && (
              <div className="relative w-[100px] h-[100px] ">
                <Image
                  src={preview}
                  alt="Preview"
                  width={80}
                  height={80}
                  className="rounded-md w-full h-full object-cover ring-1 ring-purple-500"
                />
                <span
                  onClick={() => setPreview(null)}
                  className="absolute top-0 right-0 bg-red-500/70 w-8 h-8 flex items-center justify-center text-white text-xs px-1 rounded-full cursor-pointer hover:bg-red-500"
                >
                  <Trash2 size={18} />
                </span>
              </div>
            )}
            {avatar?.url && (
              <div className="relative w-[100px] h-[100px]">
                <Image
                  src={avatar.url}
                  alt="avatar"
                  width={80}
                  height={80}
                  className="rounded-md w-full h-full object-cover ring-1 ring-purple-500"
                />
                <span
                  onClick={() => setAvatar({ url: "", public_id: "", _id: "" })}
                  className="absolute top-0 right-0 bg-red-500/70 w-8 h-8 flex items-center justify-center text-white text-xs px-1 rounded-full cursor-pointer hover:bg-red-500"
                >
                  <Trash2 size={18} />
                </span>
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-xs">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className=" focus-visible:ring-1"
              disabled={loading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-xs">
              Email
            </Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className=" focus-visible:ring-1"
              disabled={loading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-xs">
              Email
            </Label>
            <Select
              disabled={loading}
              value={role}
              onValueChange={(value) => setRole(value)}
            >
              <SelectTrigger id="role" className="w-full max-w-sm">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user" className=" cursor-pointer">
                  User
                </SelectItem>
                <SelectItem value="admin" className=" cursor-pointer">
                  Admin
                </SelectItem>
                <SelectItem value="deliveryman" className=" cursor-pointer">
                  Deliveryman
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <SheetFooter className="">
          <Button disabled={loading} type="submit" onClick={handleSubmit}>
            {loading ? (
              <div className="flex items-center gap-x-1">
                <Loader2 className="mt-1 animate-spin" size={14} />
                <p>Processing...</p>
              </div>
            ) : (
              <p> Save changes</p>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default EditUser;
