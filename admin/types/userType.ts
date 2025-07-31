export interface UserType {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar: {
    _id: string;
    url: string;
    public_id: string;
  };
  address: any[];
  cart: any[];
  wishList: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
