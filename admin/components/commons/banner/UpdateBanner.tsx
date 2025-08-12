"use client";
import React, { useRef, useState } from "react";
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
import { Loader2, PencilLine, Trash2, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import Image from "next/image";
import { BannerType } from "@/types/bannerType";

interface Props {
  item: BannerType;
  onupdate: () => void;
}

const UpdateBanner = ({ item, onupdate }: Props) => {
  const [title, setTitle] = useState(item?.title);
  const [subtitle, setSubtitle] = useState(item?.subtitle);
  const [image, setImage] = useState(item?.image);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const handleUpdate = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    if (newImage) {
      formData.append("image", newImage);
    }
    try {
      const res = await axios.put(
        `${serverUrl}/api/banner/update-banner/${item?._id}`,
        formData,
        {
          withCredentials: true,
        }
      );
      const data = res?.data;
      if (data?.success) {
        toast.success(data?.message);
        onupdate();
        setIsOpen(false);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log("Failed to update brand:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      setPreviewImg(URL.createObjectURL(file));
    } else {
      return null;
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
          <DialogTitle>Edit Banner data</DialogTitle>
          <DialogDescription>
            Make changes to Banner data here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div>
            {!image.url && !previewImg && (
              <div
                onClick={() => inputFileRef.current?.click()}
                className="w-24 h-24 border rounded-md cursor-pointer flex items-center justify-center "
              >
                <Input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  ref={inputFileRef}
                  width={50}
                  height={50}
                  onChange={handleImageChange}
                  className=" hidden"
                  disabled={loading}
                />
                <Upload size={30} />
              </div>
            )}

            {previewImg && !image.url && (
              <div className=" relative w-32 h-32 flex items-center justify-center border rounded-md overflow-hidden">
                <Image
                  src={previewImg}
                  alt="Preview"
                  width={50}
                  height={50}
                  className="w-full object-cover overflow-hidden"
                />
                <span
                  onClick={() => setPreviewImg(null)}
                  className="absolute top-0 right-0 bg-red-500/70 w-8 h-8 flex items-center justify-center text-white text-xs px-1 rounded-full cursor-pointer hover:bg-red-500"
                >
                  <Trash2 size={18} />
                </span>
              </div>
            )}
            {image.url && (
              <div className="relative w-24 h-24 flex items-center justify-center">
                <Image
                  src={image.url}
                  alt="brand-image"
                  width={80}
                  height={80}
                  className="rounded-md w-full p-2 object-cover ring-1 ring-purple-500"
                />
                <span
                  onClick={() => setImage({ url: "", public_id: "" })}
                  className="absolute top-0 right-0 bg-red-500/70 w-6 h-6 flex items-center justify-center text-white text-xs px-1 rounded-full cursor-pointer hover:bg-red-500"
                >
                  <Trash2 size={15} />
                </span>
              </div>
            )}
          </div>

          <div className=" space-y-2">
            <Label className="text-xs font-semibold">Banner Title</Label>
            <Input
              type="text"
              className="focus-visible:ring-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className=" space-y-2">
            <Label className="text-xs font-semibold">Banner subtitle</Label>
            <Textarea
              className="h-24 focus-visible:ring-1 resize-none"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
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

export default UpdateBanner;
