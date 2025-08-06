"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { serverUrl } from "@/config";
import axios from "axios";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
const Select = dynamic(() => import("react-select"), { ssr: false });

interface CategoryType {
  _id: string;
  name: string;
}
interface BrandType {
  _id: string;
  name: string;
}

const CreateProductPage = () => {
  const [category, setCategory] = useState<CategoryType[]>([]);
  const [brand, setBrand] = useState<BrandType[]>([]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(``);
    } catch (error) {
      console.log("product create error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create product data</CardTitle>
        <CardDescription>product data</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          {/* Image Upload Section */}
          <div className="space-y-2">
            <p>Images section</p>
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
              />
            </div>
            {/* brand & category */}
            <div className="grid grid-cols-2 gap-4">
              <div className=" space-y-2">
                <Label className="text-xs" htmlFor="brand">
                  Brand
                </Label>
                <Select
                  id="brand"
                  placeholder="Select brand"
                  options={option}
                  className=" cursor-pointer"
                />
              </div>
              <div className=" space-y-2">
                <Label htmlFor="categories" className="text-xs">
                  Categories
                </Label>
                <Select
                  id="categories"
                  isMulti
                  options={options}
                  placeholder-="Select Categories"
                  className=" cursor-pointer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock" className="text-xs">
                  Stock
                </Label>
                <Input
                  type="number"
                  id="stock"
                  placeholder="00"
                  className="remove-spinner focus-visible:ring-0"
                  required
                />
              </div>
              <div className=" space-y-2">
                <Label htmlFor="tags" className="text-xs">
                  Tags
                </Label>
                <Select id="tags" isMulti options={Tags} />
              </div>
            </div>
            <div className=" space-y-2">
              <Label htmlFor="isFeatured" className=" cursor-pointer">
                Featured:
              </Label>
              <Switch id="isFeatured" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-row-reverse">
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
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreateProductPage;
