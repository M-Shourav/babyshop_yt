import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

const CreateProductPage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create product data</CardTitle>
        <CardDescription>product data</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* product title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs">
                Title
              </Label>
              <Input
                type="text"
                id="title"
                placeholder="Enter product title"
                className=" focus-visible:ring-0"
                required
              />
            </div>
            {/* price & discount */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-xs">
                  Price
                </Label>
                <Input
                  type="number"
                  id="price"
                  placeholder="Enter product price"
                  className="remove-spinner focus-visible:ring-0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount" className="text-xs">
                  Discount
                </Label>
                <Input
                  type="number"
                  id="discount"
                  placeholder="Enter product discount"
                  className="remove-spinner focus-visible:ring-0"
                  required
                />
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateProductPage;
