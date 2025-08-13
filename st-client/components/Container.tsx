import { cn } from "@/lib/utils";
import React from "react";
interface Props {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className }: Props) => {
  return (
    <div className={cn("max-w-screen mx-auto px-6 py-2", className)}>
      {children}
    </div>
  );
};

export default Container;
