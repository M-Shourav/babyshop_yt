"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ProductType } from "@/types/productType";
import axios from "axios";
import { serverUrl } from "@/config";
import toast from "react-hot-toast";
import Loading from "./Loading";

const ProductChart = () => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<{ name: string; count: number }[]>(
    []
  );

  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7f50",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8dd1e1",
    "#a4de6c",
    "#d0ed57",
  ];

  useEffect(() => {
    const getProduct = async () => {
      try {
        const { data } = await axios.get(
          `${serverUrl}/api/product/all-product`,
          {
            withCredentials: true,
          }
        );

        if (!data?.success) {
          toast.error(data?.message);
          return;
        }

        const categoryCount: Record<string, number> = {};

        // for...of দিয়ে category গোনা
        for (const product of data.products as ProductType[]) {
          for (const cat of product.category) {
            categoryCount[cat.name] = (categoryCount[cat.name] || 0) + 1;
          }
        }

        // chart data ফরম্যাট করা
        setChartData(
          Object.entries(categoryCount).map(([name, count]) => ({
            name,
            count,
          }))
        );
      } catch (error) {
        console.error("Failed to get product:", error);
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, []);

  return (
    <Card>
      <CardHeader>
        <p className="text-sm font-semibold">Categories Distribution</p>
      </CardHeader>
      <CardContent className="h-72">
        {loading ? (
          <Loading />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="name"
                className="text-xs md:text-sm font-semibold"
              />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count">
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-center">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-[#954C2E] inline-flex" />
          <p className="text-sm font-semibold">Products</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductChart;
