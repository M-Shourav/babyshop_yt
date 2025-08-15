"use client";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Search, X } from "lucide-react";
import axios from "axios";
import { serverUrl } from "@/config";
import toast from "react-hot-toast";
import { ProductType } from "@/types/productType";
import { Command, CommandEmpty, CommandItem, CommandList } from "./ui/command";
import Link from "next/link";

const SearchProduct = () => {
  const [productData, setProductData] = useState<ProductType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredProducts = productData.filter((p) =>
    p.title.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const getProductData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${serverUrl}/api/product/all-product`, {
          withCredentials: true,
        });
        const data = res?.data;
        if (data?.success && data?.products?.length > 0) {
          setProductData(data.products);
        } else {
          toast.error(data?.message || "No products found from API");
        }
      } catch (error) {
        console.error("Failed to get ProductData", error);
      } finally {
        setLoading(false);
      }
    };

    getProductData();
  }, []);

  return (
    <div className="flex-1 mt-2 relative group">
      <Input
        type="text"
        placeholder="Search product..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="focus-visible:ring-0 h-10"
      />

      {searchTerm ? (
        <span
          className="absolute top-2.5 right-3 cursor-pointer"
          onClick={() => setSearchTerm("")}
        >
          <X size={20} />
        </span>
      ) : (
        <span className="absolute top-2.5 right-3">
          <Search size={20} />
        </span>
      )}

      {searchTerm && (
        <Command className="absolute mt-1 w-full bg-white shadow-lg rounded-md z-10">
          <CommandList className="h-40 overflow-hidden">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item) => (
                <CommandItem key={item._id}>
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={() => setSearchTerm("")}
                    className="flex items-center gap-2"
                  >
                    <Search className=" h-4 w-4 mt-1" />
                    {item.title}
                  </Link>
                </CommandItem>
              ))
            ) : (
              <CommandEmpty className="py-2 text-center text-gray-500">
                No results found.
              </CommandEmpty>
            )}
          </CommandList>
        </Command>
      )}
    </div>
  );
};

export default SearchProduct;
