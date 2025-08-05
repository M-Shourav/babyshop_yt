"use client";
import React from "react";
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

interface Props {
  product: ProductType;
  onupdate: () => void;
}

const EditProduct = ({ product, onupdate }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <PencilIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you&apos;re done.
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default EditProduct;
