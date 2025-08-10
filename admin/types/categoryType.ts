export type CategoryType = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export interface CategoryOption {
  value: string;
  label: string;
}
