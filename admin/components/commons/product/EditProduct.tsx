"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { ProductType } from "@/types/productType";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
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
import { Switch } from "@/components/ui/switch";

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
  const [tags, setTags] = useState<string[]>(product?.tags);
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <PencilIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="overflow-y-auto ">
        <SheetHeader>
          <SheetTitle className="text-sm font-normal">
            Edit product data
          </SheetTitle>
          <SheetDescription className="text-xs">
            Make changes to product data here.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-2">
              {/* title */}
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-xs text-muted-foreground "
                >
                  Title
                </Label>
                <Input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-xs focus-visible:ring-0"
                />
              </div>
              {/* price & discount & stock */}
              <div className=" grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="price"
                    className="text-xs text-muted-foreground "
                  >
                    Price
                  </Label>
                  <Input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-xs focus-visible:ring-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="discount"
                    className="text-xs text-muted-foreground "
                  >
                    Discount
                  </Label>
                  <Input
                    type="number"
                    id="discount"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-xs focus-visible:ring-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="stock"
                    className="text-xs text-muted-foreground "
                  >
                    Stock
                  </Label>
                  <Input
                    type="number"
                    id="stock"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-xs focus-visible:ring-0"
                  />
                </div>
              </div>
            </div>
            {/* description */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-xs text-muted-foreground "
              >
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-28 text-xs resize-none focus-visible:ring-0"
              />
            </div>
            {/* tags & featured */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="tags"
                  className="text-xs text-muted-foreground "
                >
                  Tags
                </Label>
                <Input
                  type="text"
                  id="tags"
                  value={tags.join(", ")}
                  onChange={(e) =>
                    setTags(
                      e.target.value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter((tag) => tag !== "")
                    )
                  }
                  className="text-xs focus-visible:ring-0"
                />
              </div>
              <div className="md:mt-4 flex items-center gap-2">
                <Label
                  htmlFor="isFeatured"
                  className="text-sm text-muted-foreground "
                >
                  Featured:
                </Label>
                <Switch
                  id="isFeatured"
                  checked={isFeatured}
                  onCheckedChange={setIsFeatured}
                />
              </div>
            </div>
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">Save Changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default EditProduct;
