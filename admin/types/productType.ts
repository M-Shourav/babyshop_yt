import { BrandsType } from "./brandType";
import { CategoryType } from "./categoryType";

export interface ProductType {
  _id: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  stock: string;
  slug: string;
  isFeatured: boolean;
  brand: BrandsType;
  category: CategoryType[];
  tags: string[];
  images: {
    _id: string;
    url: string;
    public_id: string;
    file?: File;
  }[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
