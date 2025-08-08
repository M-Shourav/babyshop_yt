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
import { ListFilter, Loader2, Trash2 } from "lucide-react";
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
import { EmptyProduct } from "@/assets/images";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ProductData = () => {
  const [product, setProduct] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPd, setSearchPd] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productPerPage, setProductPerPage] = useState(10);

  // filter product for search
  const filterProduct = product.filter((product) => {
    const search = searchPd.toLowerCase();
    return product.title?.toLowerCase().includes(search);
  });

  // paginate product per page
  const paginate = filterProduct?.slice(
    (currentPage - 1) * productPerPage,
    currentPage * productPerPage
  );
  // total page
  const totalPage = Math.ceil(filterProduct.length / productPerPage);

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
      {product.length ? (
        <>
          <CardHeader className="flex items-center justify-between gap-4">
            <CardTitle>
              <div className="flex items-center gap-1 max-w-xs">
                <div className="w-20 h-9 hidden md:inline-flex items-center justify-center gap-1 border rounded-sm">
                  <ListFilter size={15} className="font-semibold" />
                  <span className="text-sm font-semibold">Filter</span>
                </div>
                <Input
                  type="text"
                  placeholder="Search product with title..."
                  className=" placeholder:text-sm placeholder:font-normal focus-visible:ring-0 w-[200px]"
                  value={searchPd}
                  onChange={(e) => {
                    setSearchPd(e.target.value);
                  }}
                />
              </div>
            </CardTitle>
            <CardDescription className="hidden md:inline-flex items-center gap-2">
              <p>Product per page</p>
              <Select
                onValueChange={(value) => {
                  setProductPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className=" focus-visible:ring-0">
                  <SelectValue placeholder={productPerPage} />
                </SelectTrigger>
                <SelectContent className="min-w-[20px]">
                  <SelectItem value="20" className=" cursor-pointer">
                    20
                  </SelectItem>
                  <SelectItem value="50" className=" cursor-pointer">
                    50
                  </SelectItem>
                  <SelectItem value="70" className=" cursor-pointer">
                    70
                  </SelectItem>
                  <SelectItem value="100" className=" cursor-pointer">
                    100
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardDescription>
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
                {paginate?.map((product, index) => (
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
                    <TableCell>
                      {product?.description.slice(0, 40)}...
                    </TableCell>
                    <TableCell
                      className={`${
                        product?.stock == 10
                          ? "text-red-600"
                          : "text-purple-700"
                      } `}
                    >
                      <p className="bg-blue-100/40 w-fit p-3 rounded-sm font-semibold">
                        {product?.stock}
                      </p>
                    </TableCell>
                    <TableCell
                      className={`${
                        product?.price == 10
                          ? "text-red-600"
                          : "text-purple-700"
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
                                This action cannot be undone. This will
                                permanently delete product and remove data from
                                servers.
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
                          <EditProduct
                            product={product}
                            onupdate={getProduct}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-10 flex items-center justify-between">
              <p className="text-sm w-full flex items-center font-semibold text-muted-foreground">
                Total Pages:{" "}
                <span className="ml-2 text-red-500"> {totalPage}</span>
              </p>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => {
                        setCurrentPage((prev) => Math.max(prev - 1, 1));
                      }}
                      className={`${
                        currentPage === 1
                          ? " pointer-events-none opacity-50"
                          : " cursor-pointer"
                      }`}
                    />
                  </PaginationItem>
                  {[...Array(totalPage)].map((_, i) => (
                    <PaginationItem key={i}>
                      <Button
                        onClick={() => {
                          setCurrentPage(i + 1);
                        }}
                        className={`px-3 py-1 text-xs border border-gray-600 w-7 h-7 flex items-center justify-center ${
                          currentPage === i + 1
                            ? "bg-black text-white"
                            : "bg-white text-black hover:text-white duration-200"
                        } `}
                        size="icon"
                      >
                        {i + 1}
                      </Button>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => {
                        setCurrentPage((prev) => Math.min(prev + 1, totalPage));
                      }}
                      className={`${
                        currentPage === totalPage
                          ? " pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </>
      ) : (
        <div className="text-center flex flex-col items-center justify-center py-12 px-4 ">
          <Image
            src={EmptyProduct}
            alt="empty-product"
            width={50}
            height={50}
            className=" animate-bounce"
          />
          <h2 className="text-xl font-semibold text-gray-700 mb-2 animate-pulse">
            No Products Found!
          </h2>
          <p className="text-gray-500 mb-4 max-w-md text-center mx-auto">
            You haven &apos;t added any products yet. Click the
            <span className="font-medium text-slate-900"> "Add Product" </span>
            button below to get started and showcase your offerings to your
            customers.
          </p>
          <Button>
            <Link href="/products/create-product">Add Product</Link>
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ProductData;
