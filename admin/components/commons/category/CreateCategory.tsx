"use client";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { serverUrl } from "@/config";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  onupdate: () => void;
}

const CreateCategory = ({ onupdate }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleCategory = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/category/createCate`,
        {
          name,
          description,
        },
        {
          withCredentials: true,
        }
      );
      const data = res.data;
      if (data?.success) {
        setIsOpen(false);
        toast.success(data?.message);
        onupdate();
        setName("");
        setDescription("");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log("Category create failed:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create category</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create product category</DialogTitle>
          <DialogDescription>Create category</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className=" space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              type="text"
              name="name"
              placeholder="Enter category name"
              className=" focus-visible:ring-0"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
              required
              disabled={loading}
            />
          </div>
          <div className=" space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              name="description"
              id="description"
              placeholder="Enter category description"
              className="h-24 focus-visible:ring-0 resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" onClick={handleCategory} disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-1 ">
                <Loader2 className="mt-1 animate-spin" />
                <p>Processing...</p>
              </div>
            ) : (
              <p>Create category</p>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategory;
