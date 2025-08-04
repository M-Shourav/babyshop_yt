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
import { CategoryType } from "@/types/categoryType";
import axios from "axios";
import { Loader2, PencilLine } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
interface Props {
  category: CategoryType;
  onupdate: () => void;
}

const UpdateCategory = ({ category, onupdate }: Props) => {
  const [name, setName] = useState(category?.name);
  const [description, setDes] = useState(category?.description);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await axios.put(
        `${serverUrl}/api/category/updateCate/${category?._id}`,
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
        toast.success(data?.message);
        onupdate();
        setIsOpen(false);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log("Failed to category update:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PencilLine />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Make changes to product category. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className=" space-y-2">
            <Label className="text-xs font-semibold">Brand Name</Label>
            <Input
              type="text"
              className="focus-visible:ring-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className=" space-y-2">
            <Label className="text-xs font-semibold">Brand Description</Label>
            <Textarea
              className="h-24 focus-visible:ring-1 resize-none"
              value={description}
              onChange={(e) => setDes(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-1">
                <Loader2 className="mt-1 animate-spin" />
                <p>updating...</p>
              </div>
            ) : (
              <p>Save changes</p>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCategory;
