"use client";
import React, { useState } from "react";
import { serverUrl } from "@/config";
import axios from "axios";
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
import { Button } from "@/components/ui/button";
import { Loader2, PencilLine } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BrandsType } from "@/types/brandType";
import toast from "react-hot-toast";

interface Props {
  item: BrandsType;
  onupdate: () => void;
}

const UpdateBrand = ({ item, onupdate }: Props) => {
  const [name, setName] = useState(item?.name);
  const [description, setDes] = useState(item?.description);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await axios.put(
        `${serverUrl}/api/brand/updateBrand/${item?._id}`,
        {
          name,
          description,
        },
        {
          withCredentials: true,
        }
      );
      const data = res?.data;
      if (data?.success) {
        toast.success(data?.message);
        onupdate();
        setIsOpen(false);
      }
    } catch (error) {
      console.log("Failed to update brand:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <PencilLine />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Brand data</DialogTitle>
          <DialogDescription>
            Make changes to Brand data here. Click save when you&apos;re done.
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
          <Button type="button" onClick={handleUpdate} disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-1">
                <Loader2 className="mt-1 animate-spin" />
                <p>update...</p>
              </div>
            ) : (
              <p> Save changes</p>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateBrand;
