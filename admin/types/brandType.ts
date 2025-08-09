export interface BrandsType {
  _id: string;
  name: string;
  description: string;
  slug: string;
  images: {
    url: string;
    public_id: string;
    _id: string;
  };
}
