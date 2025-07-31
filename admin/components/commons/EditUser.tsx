"use client";
import React, { useState } from "react";
import { UserType } from "@/types/userType";
import {
  Sheet,
  SheetClose,
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
  const [loading, setLoading] = useState(false);
  return (
    <Sheet>
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
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-xs">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className=" focus-visible:ring-1"
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
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-xs">
              Email
            </Label>
            <Select value={role} onValueChange={(value) => setRole(value)}>
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
          <Button type="submit">Save changes</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default EditUser;
