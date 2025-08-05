export interface ProductType {
  _id: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  slug: string;
  isFeatured: boolean;
  brand: string;
  category: string;
  tags: string[];
  images: {
    _id: string;
    url: string;
    public_id: string;
  }[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
