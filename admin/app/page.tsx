import AdminChart from "@/components/commons/AdminChart";
import BrandChart from "@/components/commons/brand/BrandChart";
import ProductChart from "@/components/commons/ProductChart";
import DashboardOverview from "@/components/DashboardOverview";
import React from "react";

const Home = () => {
  return (
    <div className="flex flex-col gap-4">
      <DashboardOverview />
      <div className=" grid grid-cols-1 md:grid-cols-2 gap-5">
        <ProductChart />
        <AdminChart />
      </div>
      <BrandChart />
    </div>
  );
};

export default Home;
