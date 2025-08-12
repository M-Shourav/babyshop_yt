"use client";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { serverUrl } from "@/config";
import toast from "react-hot-toast";

interface Props {
  onupdate: () => void;
}

const CreateBanner = ({ onupdate }: Props) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [prevImg, setPrevImg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPrevImg(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    if (image) {
      formData.append("image", image);
    }
    try {
      const res = await axios.post(
        `${serverUrl}/api/banner/create-banner`,
        formData,
        {
          withCredentials: true,
        }
      );
      const data = res?.data;
      if (data?.success) {
        toast.success(data?.message);
        onupdate();
        setOpen(false);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log("Failed to banner creating", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>Create Banner</Button>
      </SheetTrigger>
      <SheetContent className=" overflow-y-auto">
        <SheetHeader className="px-4">
          <SheetTitle>Create Banner</SheetTitle>
          <SheetDescription>
            Make to your banner here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit}>
          <div className=" grid gap-4 px-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">
                Upload banner image
              </Label>
              {/* upload images */}
              <div className="flex flex-col gap-2">
                <div
                  onClick={() => inputRef.current?.click()}
                  className="w-28 h-28 flex flex-col items-center justify-center cursor-pointer border rounded-md"
                >
                  <Upload size={30} />
                  <span className="text-xs font-semibold">Upload image</span>
                  <Input
                    type="file"
                    ref={inputRef}
                    accept="image/*"
                    className=" hidden"
                    onChange={handleImageChange}
                  />
                </div>
                {/* preview image */}
                <div>
                  {prevImg && (
                    <div className=" relative w-full flex items-center justify-center border rounded-md overflow-hidden">
                      <Image
                        src={prevImg}
                        alt="banner-image"
                        width={50}
                        height={50}
                        className="w-full object-cover overflow-hidden"
                      />
                      <Button
                        className=" absolute top-1 right-1 w-6 h-6 rounded-full"
                        variant="destructive"
                        size="icon"
                        onClick={() => setPrevImg(null)}
                      >
                        <X size={15} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className=" space-y-2">
              <Label htmlFor="title" className="text-xs">
                Title
              </Label>
              <Input
                type="text"
                id="title"
                placeholder="Enter Banner title"
                className=" focus-visible:ring-0"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className=" space-y-2">
              <Label htmlFor="subtitle" className="text-xs">
                Subtitle
              </Label>
              <Textarea
                id="subtitle"
                placeholder="Enter Banner subtitle"
                className=" focus-visible:ring-0 resize-none h-24"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>
          <SheetFooter>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-1">
                  <Loader2 className="mt-1 animate-spin" />
                  Processing...
                </div>
              ) : (
                <p>Create banner</p>
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default CreateBanner;
