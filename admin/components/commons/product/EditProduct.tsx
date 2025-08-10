import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { serverUrl } from "@/config";
import { BrandOption, BrandsType } from "@/types/brandType";
import { CategoryOption, CategoryType } from "@/types/categoryType";
import { ProductType } from "@/types/productType";
import axios from "axios";
import { PencilIcon, X } from "lucide-react";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MultiValue, SingleValue } from "react-select";
const Select = dynamic(() => import("react-select"), { ssr: false });

interface Props {
  product: ProductType;
  onupdate: () => void;
}

const EditProduct = ({ product, onupdate }: Props) => {
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
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline">
          <PencilIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-[400px] md:min-w-2xl px-5 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Product data</SheetTitle>
          <SheetDescription>des</SheetDescription>
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
                value={brandValue}
                options={brandOption}
                onChange={(selected: SingleValue<BrandOption>) => {
                  if (selected) {
                    const selectedBrand = brandList.find(
                      (b) => b._id === selected.value
                    );
                    if (selectedBrand) setBrand(selectedBrand);
                  }
                }}
              />
            </div>
            {/* Category Multi Select */}
            <div className="space-y-2">
              <Label className="text-xs">Categories</Label>
              <div className="flex items-center gap-2">
                <Select
                  isMulti
                  className="w-full"
                  options={CtOption}
                  value={CtValue}
                  onChange={(selected: MultiValue<CategoryOption>) => {
                    const selectedCategories = selected.map((sel) => {
                      return categoryList.find((cat) => cat._id === sel.value)!;
                    });
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
                  options={CtOption}
                  value={CtValue}
                  onChange={(selected: MultiValue<CategoryOption>) => {
                    const selectedCategories = selected.map((sel) => {
                      return categoryList.find((cat) => cat._id === sel.value)!;
                    });
                    setCategory(selectedCategories);
                  }}
                />
              </div>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default EditProduct;
