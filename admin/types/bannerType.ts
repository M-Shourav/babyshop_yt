export interface BannerType {
  _id: string;
  title: string;
  subtitle: string;
  slug: string;
  image: {
    url: string;
    public_id: string;
  };
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}
