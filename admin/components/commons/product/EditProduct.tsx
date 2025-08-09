import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { serverUrl } from "@/config";
import { cn } from "@/lib/utils";
import { BrandsType } from "@/types/brandType";
import { CategoryType } from "@/types/categoryType";
import { ProductType } from "@/types/productType";
import axios from "axios";
import { Check, PencilIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  product: ProductType;
  onupdate: () => void;
}

interface CatType {
  _id: string;
  name: string;
}

const EditProduct = ({ product, onupdate }: Props) => {
  const [title, setTitle] = useState(product?.title);
  const [description, setDescription] = useState(product?.description);
  const [price, setPrice] = useState(product?.price);
  const [discount, setDiscount] = useState(product?.discount);
  const [stock, setStock] = useState(product?.stock);
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured);
  const [category, setCategory] = useState(product?.category);
  const [brand, setBrand] = useState(product?.brand);
  const [images, setImages] = useState(product?.images);
  const [brandList, setBrandList] = useState<BrandsType[]>([]);
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="overflow-y-auto">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline">
            <PencilIcon />
          </Button>
        </SheetTrigger>
        <SheetContent className="min-w-[400px] md:min-w-2xl px-5">
          <SheetHeader>
            <SheetTitle>Edit Product data</SheetTitle>
          </SheetHeader>
          <form className="grid gap-4">
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
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </div>{" "}
                <div className=" space-y-2">
                  <Label htmlFor="discount" className="text-xs">
                    Discount
                  </Label>
                  <Input
                    type="number"
                    id="discount"
                    className="remove-spinner focus-visible:ring-0"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand" className="text-xs">
                  Brand
                </Label>
                <Select
                  onValueChange={(value) => {
                    const selectBrand = brandList.find((b) => b._id === value);
                    if (selectBrand) setBrand(selectBrand);
                  }}
                >
                  <SelectTrigger className="w-full max-w-[200px]">
                    <SelectValue placeholder={brand?.name} />
                  </SelectTrigger>
                  <SelectContent className=" overflow-y-auto">
                    {brandList?.map((brandItem) => (
                      <SelectItem
                        className="cursor-pointer"
                        key={brandItem?._id}
                        value={brandItem?._id}
                      >
                        {brandItem?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Category Multi Select */}
              <div className="space-y-2">
                <Label className="text-xs">Categories</Label>
              </div>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default EditProduct;
