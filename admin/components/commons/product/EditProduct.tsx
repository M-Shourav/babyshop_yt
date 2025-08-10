import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { serverUrl } from "@/config";
import { BrandsType } from "@/types/brandType";
import { CategoryOption, CategoryType } from "@/types/categoryType";
import { ProductType } from "@/types/productType";
import axios from "axios";
import { Loader2, PencilIcon, Upload, X } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
const Select = dynamic(() => import("react-select"), { ssr: false });

interface Props {
  product: ProductType;
  onupdate: () => void;
}

interface TagOption {
  value: string;
  label: string;
}

const Tags: TagOption[] = [
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

const EditProduct = ({ product, onupdate }: Props) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(product?.title);
  const [description, setDescription] = useState(product?.description);
  const [price, setPrice] = useState(product?.price);
  const [discount, setDiscount] = useState(product?.discount);
  const [stock, setStock] = useState(product?.stock);
  const [category, setCategory] = useState(product?.category);
  const [brand, setBrand] = useState(product?.brand);
  const [tags, setTags] = useState(product?.tags);
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured);
  const [images, setImages] = useState(product?.images);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // get brand & category list
  const [brandList, setBrandList] = useState<BrandsType[]>([]);
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);

  // category option for Select Option
  const CtOption = categoryList?.map((ct: CategoryType) => ({
    value: ct?._id,
    label: ct?.name,
  }));

  // category value for Select value
  const CtValue = category?.map((cat: CategoryType) => ({
    value: cat?._id,
    label: cat?.name,
  }));

  // Brand option for Select Option
  const brandOption = brandList?.map((b: BrandsType) => ({
    value: b?._id,
    label: b?.name,
  }));

  // brand value for Select value
  const brandValue = brand ? { value: brand?._id, label: brand?.name } : null;

  // Tag value for Select value
  const tagValue =
    tags?.map((tag) => {
      const match = Tags.find((t) => t.value === tag);
      return match ? match : { value: tag, label: tag };
    }) || [];

  // handleImage delete
  const handleImageDelete = (id: string) => {
    setImages((prev) => prev.filter((img) => img._id !== id));
  };

  // image handle to change or update
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length >= 3) {
      toast.error("You can upload maximum 3 images!");
      return;
    }

    const filesToUpload = Array.from(files).slice(0, 3 - images.length);
    const newImages = filesToUpload.map((file) => ({
      _id: Math.random().toString(36),
      url: URL.createObjectURL(file),
      public_id: file.name,
      file: file,
    }));

    setImages((prev) => [...prev, ...newImages]);
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
          setCategoryList(data?.category);
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
          setBrandList(data?.brand);
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

  const handleUpdate = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("discount", discount.toString());
    formData.append("stock", stock);
    formData.append("isFeatured", JSON.stringify(isFeatured));
    tags.forEach((tag) => {
      formData.append("tags", tag);
    });
    category.forEach((cat) => {
      formData.append("category", cat?._id);
    });
    formData.append("brand", brand?._id);
    images.forEach((img) => {
      if (img.file) {
        formData.append("images", img.file);
      }
    });
    try {
      const res = await axios.put(
        `${serverUrl}/api/product/update-product/${product?._id}`,
        formData,
        {
          withCredentials: true,
        }
      );
      console.log(res);

      const data = res?.data;
      if (data?.success) {
        toast.success(data?.message);
        onupdate();
        setOpen(false);
      }
    } catch (error) {
      console.log("Failed to update product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline">
          <PencilIcon />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="min-w-[400px] md:min-w-2xl px-5 py-5 overflow-y-auto "
      >
        <SheetHeader>
          <SheetTitle>Edit Product data</SheetTitle>
          <SheetDescription>des</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* upload image */}
            <div>
              {images.length <= 3 && (
                <Label
                  htmlFor="img"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-28 h-28 border cursor-pointer rounded-md flex flex-col items-center justify-center"
                >
                  <Upload id="img" size={35} />
                  <p className="text-xs font-semibold text-muted-foreground">
                    Upload (Max 3)
                  </p>
                  <Input
                    type="file"
                    id="imageUpload"
                    ref={fileInputRef}
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={loading}
                  />
                </Label>
              )}
            </div>

            {/* preview image */}
            {images?.map((img) => (
              <div
                key={img?._id}
                className=" relative w-28 h-28 border-2 rounded-md flex items-center justify-center overflow-hidden"
              >
                <Image
                  src={img?.url}
                  alt={img?.public_id}
                  width={50}
                  height={50}
                  className="w-full object-cover"
                />

                <Button
                  className="absolute top-1 right-1 w-5 h-5 rounded-full"
                  size="icon"
                  variant="destructive"
                  onClick={() => handleImageDelete(img?._id)}
                >
                  <X />
                </Button>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className=" space-y-2">
              <Label htmlFor="title" className="text-xs">
                Title
              </Label>
              <Input
                type="text"
                id="title"
                className="focus-visible:ring-0"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className=" grid grid-cols-2 gap-4">
              <div className=" space-y-2">
                <Label htmlFor="price" className="text-xs">
                  Price
                </Label>
                <Input
                  type="number"
                  id="price"
                  className="remove-spinner focus-visible:ring-0"
                  value={price === 0 ? "" : price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  onWheel={(e) => e.currentTarget.blur()}
                  disabled={loading}
                />
              </div>
              <div className=" space-y-2">
                <Label htmlFor="discount" className="text-xs">
                  Discount
                </Label>
                <Input
                  type="number"
                  id="discount"
                  className="remove-spinner focus-visible:ring-0"
                  value={discount === 0 ? "" : discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  onWheel={(e) => e.currentTarget.blur()}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
          <div className=" space-y-2">
            <Label htmlFor="des" className="text-xs">
              Description
            </Label>
            <Textarea
              id="des"
              className=" resize-none focus-visible:ring-0 h-28"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* stock & brand */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock" className="text-xs">
                Stock
              </Label>
              <Input
                type="text"
                id="stock"
                className="focus-visible:ring-0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand" className="text-xs">
                Brand
              </Label>
              <Select
                value={brandValue}
                options={brandOption}
                menuPlacement="top"
                onChange={(selected: any) => {
                  if (selected) {
                    const selectedBrand = brandList.find(
                      (b) => b._id === selected.value
                    );
                    if (selectedBrand) setBrand(selectedBrand);
                  }
                }}
                isDisabled={loading}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Multi Select */}
            <div className="space-y-2">
              <Label className="text-xs">Categories</Label>
              <div className="flex items-center gap-2">
                <Select
                  isMulti
                  className="w-full"
                  menuPlacement="top"
                  isDisabled={loading}
                  options={CtOption}
                  value={CtValue}
                  onChange={(selected: any) => {
                    const selectedCategories = selected.map(
                      (sel: CategoryOption) => {
                        return categoryList.find(
                          (cat) => cat._id === sel.value
                        )!;
                      }
                    );
                    setCategory(selectedCategories);
                  }}
                />
              </div>
            </div>
            {/* Tags Multi Select */}
            <div className="space-y-2">
              <Label className="text-xs">Tags</Label>
              <div className="flex items-center gap-2">
                <Select
                  isMulti
                  className="w-full"
                  menuPlacement="top"
                  isDisabled={loading}
                  options={Tags}
                  value={tagValue}
                  onChange={(selected: any) => {
                    const selectedTags = selected.map(
                      (sel: TagOption) => sel.value
                    );
                    setTags(selectedTags);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Label>IsFeatured:</Label>
            <Switch
              checked={isFeatured}
              onCheckedChange={setIsFeatured}
              disabled={loading}
            />
          </div>
        </div>
        <SheetFooter className=" flex flex-row-reverse">
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-1">
                <Loader2 className="mt-1 animate-spin" />
                <p>Processing...</p>
              </div>
            ) : (
              <p>Save Changes</p>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default EditProduct;
