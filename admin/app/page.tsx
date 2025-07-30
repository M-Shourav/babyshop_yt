import AdminChart from "@/components/ui/commons/AdminChart";
import CategoryChart from "@/components/ui/commons/CategoryChart";
import React from "react";

const Home = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className=" grid grid-cols-1 md:grid-cols-2 gap-5">
        <CategoryChart />
        <AdminChart />
      </div>
    </div>
  );
};

export default Home;
