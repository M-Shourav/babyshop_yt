type BrandType = {
  _id: string;
  name: string;
};

type CategoryType = {
  _id: string;
  name: string;
};

type ImageType = {
  url: string;
  public_id: string;
  _id: string;
};

export type ProductType = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  discount: number;
  stock: string;
  isFeatured: boolean;
  tags: string[];
  brand: BrandType;
  category: CategoryType[];
  images: ImageType[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
};
