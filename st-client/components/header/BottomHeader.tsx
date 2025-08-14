import React from "react";
import Container from "../Container";
import Link from "next/link";
import { projectLogo } from "@/public/images";
import Image from "next/image";
import SearchProduct from "../SearchProduct";
import { ShoppingBag, User } from "lucide-react";

const BottomHeader = () => {
  return (
    <div className="h-20 border border-b">
      <Container className="h-full flex items-center justify-between gap-6">
        <div>
          <Link href={"/"}>
            <Image
              src={projectLogo}
              alt="project-logo"
              width={70}
              height={70}
              className="w-full object-cover"
              priority
            />
          </Link>
        </div>
        <div className="hidden md:inline-flex flex-1">
          <SearchProduct />
        </div>
        <div className="flex items-center justify-between gap-6">
          <Link
            href={"/auth/signin"}
            className="flex items-center gap-2 hover duration-200"
          >
            <User size={30} />
            <div className="flex flex-col items-start">
              <p className="text-xs font-semibold">Welcome</p>
              <p className="text-sm font-semibold">Sign in/Register</p>
            </div>
          </Link>
          <Link href={"/cart"} className="relative hover">
            <ShoppingBag />
            <span className=" absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center rounded-full bg-[#0ABEB3] p-2 text-white text-xs">
              0
            </span>
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default BottomHeader;
