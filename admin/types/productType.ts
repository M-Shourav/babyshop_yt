export interface ProductType {
  _id: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  stock: string;
  slug: string;
  isFeatured: boolean;
  brand: {
    name: string;
  };
  category: [name: string];
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
