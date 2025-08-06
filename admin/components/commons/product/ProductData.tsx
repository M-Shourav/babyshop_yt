"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import axios from "axios";
import { serverUrl } from "@/config";
import { ProductType } from "@/types/productType";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Loader2, PencilIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import EditProduct from "./EditProduct";

const ProductData = () => {
  const [product, setProduct] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const getProduct = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/product/all-product`, {
        withCredentials: true,
      });

      const data = res?.data;
      if (data?.success) {
        setProduct(data?.products);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log("Failed to get product:", error);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/product/delete-product/${id}`,
        {},
        {
          withCredentials: true,
        }
      );

      const data = res.data;
      if (data?.success) {
        toast.success(data?.message);
        setProduct((prev) => prev.filter((p: ProductType) => p._id !== id));
        await getProduct();
      }
    } catch (error) {
      console.log("Failed to delete product:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product page</CardTitle>
        <CardDescription>All products</CardDescription>
        <CardAction>
          <Button>
            <Link href={"/products/create-product"}>Add product</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden md:table-cell">List</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {product?.map((product, index) => (
              <TableRow key={product?._id}>
                <TableCell className="hidden md:table-cell">
                  {index + 1}
                </TableCell>
                <TableCell>
                  {product?.images && product.images.length > 0 && (
                    <Image
                      src={product.images[0].url}
                      alt={product.images[0].public_id}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-fill rounded-sm"
                    />
                  )}
                </TableCell>
                <TableCell>{product?.title}</TableCell>
                <TableCell>{product?.description.slice(0, 40)}</TableCell>
                <TableCell
                  className={`${
                    product?.stock == 10 ? "text-red-600" : "text-purple-700"
                  } `}
                >
                  <p className="bg-blue-100/40 w-fit p-3 rounded-sm font-semibold">
                    {product?.stock}
                  </p>
                </TableCell>
                <TableCell
                  className={`${
                    product?.price == 10 ? "text-red-600" : "text-purple-700"
                  } `}
                >
                  <p className="bg-blue-100/40 w-fit p-3 rounded-sm font-semibold">
                    {product?.price}
                  </p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-3">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Trash2 />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete product and remove data from servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(product?._id)}
                            disabled={loading}
                          >
                            {loading ? (
                              <div className="flex items-center gap-1">
                                <Loader2 className="mt-1 animate-spin" />
                                <p>Deleting...</p>
                              </div>
                            ) : (
                              <p>Continue</p>
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <div>
                      <EditProduct product={product} onupdate={getProduct} />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProductData;
