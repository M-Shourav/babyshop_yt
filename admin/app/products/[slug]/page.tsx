"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { serverUrl } from "@/config";
import axios from "axios";
import { Loader2, Upload } from "lucide-react";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
const Select = dynamic(() => import("react-select"), { ssr: false });

interface CategoryType {
  _id: string;
  name: string;
}
interface BrandType {
  _id: string;
  name: string;
}

type tagOption = {
  value: string;
  label: string;
};
type categoryOption = {
  value: string;
  label: string;
};

const Tags = [
  { value: "new", label: "New" },
  { value: "sale", label: "Sale" },
  { value: "popular", label: "Popular" },
  { value: "featured", label: "Featured" },
  { value: "limited", label: "Limited" },
  { value: "trending", label: "Trending" },
  { value: "exclusive", label: "Exclusive" },
  { value: "bestseller", label: "Bestseller" },
  { value: "eco-friendly", label: "Eco-Friendly" },
  { value: "handmade", label: "Handmade" },
  { value: "luxury", label: "Luxury" },
  { value: "budget", label: "Budget" },
  { value: "fast-delivery", label: "Fast Delivery" },
  { value: "discount", label: "Discount" },
  { value: "limited-stock", label: "Limited Stock" },
];
const CreateProductPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [stock, setStock] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [category, setCategory] = useState<CategoryType[]>([]);
  const [brand, setBrand] = useState<BrandType[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [selectedCategories, setSelectedCategories] = useState<
    categoryOption[]
  >([]);
  const [selectedTags, setSelectedTags] = useState<tagOption[]>([]);

  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) return;

    if (images.length >= 3) {
      toast.error("You can upload maximum 3 images!");
      return;
    }

    const selectedFiles = Array.from(files).slice(0, 3 - images.length); // বাকি কয়টা নেয়া যাবে
    setImages((prevImages) => [...prevImages, ...selectedFiles]);
  };
  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const getCategory = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${serverUrl}/api/category/categories`, {
          withCredentials: true,
        });
        const data = res?.data;
        if (data.success) {
          setCategory(data?.category);
        } else {
          toast.error(data?.message);
        }
      } catch (error) {
        console.log("get category error:", error);
      } finally {
        setLoading(false);
      }
    };
    const getBrand = async () => {
      setLoading(true);
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
        console.log("Brand fetching error:", error);
      } finally {
        setLoading(false);
      }
    };
    getBrand();
    getCategory();
  }, []);

  const options = category?.map((ct: CategoryType) => ({
    value: ct?._id,
    label: ct?.name,
  }));
  const option = brand?.map((bn: BrandType) => ({
    value: bn?._id,
    label: bn?.name,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("discount", discount);
    formData.append("description", description);
    formData.append("brand", selectedBrand.value);
    formData.append("isFeatured", JSON.stringify(isFeatured));
    formData.append("stock", stock);
    selectedTags.forEach((tag) => {
      formData.append("tags", tag?.value);
    });
    selectedCategories.forEach((cat) => {
      formData.append("category", cat.value);
    });
    images.forEach((img) => {
      formData.append("images", img);
    });
    try {
      const res = await axios.post(
        `${serverUrl}/api/product/add-product`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = res.data;
      if (data?.success) {
        toast.success(data?.message);
        router.push("/products");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log("Failed to create product:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create product data</CardTitle>
        <CardDescription>product data</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* Image Upload Section */}
          <div className="flex flex-wrap items-center gap-3">
            {/* upload image */}
            <div>
              {images.length <= 3 && (
                <Label
                  htmlFor="img"
                  onClick={() => imageInputRef.current?.click()}
                  className="w-28 h-28 border cursor-pointer rounded-md flex flex-col items-center justify-center"
                >
                  <Upload id="img" size={35} />
                  <p className="text-xs font-semibold text-muted-foreground">
                    Upload (Max 3)
                  </p>
                  <Input
                    type="file"
                    id="imageUpload"
                    ref={imageInputRef}
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </Label>
              )}
            </div>

            {/* preview image */}
            {images?.map((img, index) => (
              <div
                key={index}
                className=" relative w-28 h-28 border-2 rounded-md flex items-center justify-center overflow-hidden"
              >
                <Image
                  src={URL.createObjectURL(img)}
                  alt={`preview-${index}`}
                  width={50}
                  height={50}
                  className="w-full object-cover"
                />

                <Button
                  className="absolute top-1 right-1 w-5 h-5 rounded-full"
                  size="icon"
                  variant="destructive"
                  onClick={() => removeImage(index)}
                >
                  <X />
                </Button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* product title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs">
                Title
              </Label>
              <Input
                type="text"
                id="title"
                placeholder="Enter product title"
                className=" focus-visible:ring-0"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            {/* price & discount */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-xs">
                  Price
                </Label>
                <Input
                  type="number"
                  id="price"
                  placeholder="100"
                  className="remove-spinner focus-visible:ring-0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  onWheel={(e) => e.currentTarget.blur()}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount" className="text-xs">
                  Discount
                </Label>
                <Input
                  type="number"
                  id="discount"
                  placeholder="10%"
                  className="remove-spinner focus-visible:ring-0"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  onWheel={(e) => e.currentTarget.blur()}
                  required
                />
              </div>
            </div>
          </div>
          {/* description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="product description"
                className="focus-visible:ring-0 resize-none h-28 text-xs md:text-xs"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            {/* brand & category */}
            <div className="grid grid-cols-2 gap-4">
              <div className=" space-y-2">
                <Label htmlFor="categories" className="text-xs">
                  Categories
                </Label>
                <Select
                  id="categories"
                  isMulti
                  options={options}
                  value={selectedCategories}
                  menuPlacement="top"
                  onChange={(value) =>
                    setSelectedCategories(value as categoryOption[])
                  }
                  placeholder-="Select Categories"
                  className=" cursor-pointer"
                />
              </div>
              <div className=" space-y-2">
                <Label htmlFor="tags" className="text-xs">
                  Tags
                </Label>
                <Select
                  id="tags"
                  isMulti
                  options={Tags}
                  value={selectedTags}
                  menuPlacement="top"
                  onChange={(value) => setSelectedTags(value as tagOption[])}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock" className="text-xs">
                  Stock
                </Label>
                <Input
                  type="text"
                  id="stock"
                  placeholder="00"
                  className="focus-visible:ring-0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
              </div>
              <div className=" space-y-2">
                <Label className="text-xs" htmlFor="brand">
                  Brand
                </Label>
                <Select
                  id="brand"
                  placeholder="Select brand"
                  menuPlacement="top"
                  options={option}
                  value={selectedBrand}
                  onChange={(val) => setSelectedBrand(val)}
                  className=" cursor-pointer"
                />
              </div>
            </div>
            <div className=" space-y-2">
              <Label htmlFor="isFeatured" className=" cursor-pointer">
                Featured:
              </Label>
              <Switch
                checked={isFeatured}
                onCheckedChange={setIsFeatured}
                id="isFeatured"
              />
            </div>
          </div>
          <div className="flex flex-row-reverse">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-1">
                  <Loader2 className="mt-1 animate-spin" />
                  <p>Processing...</p>
                </div>
              ) : (
                <p>Create product</p>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateProductPage;
