import Loading from "@/components/commons/Loading";
import React from "react";

const loading = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-white z-10">
      <Loading />
    </div>
  );
};

export default loading;
