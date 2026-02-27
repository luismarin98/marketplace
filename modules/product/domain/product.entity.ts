import type { ObjectId } from "mongodb";

export interface IProduct {
  _id: ObjectId;
  title: string;
  description: string;
  price: number;
  stock: number;
  sellerId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const PRODUCTS_COLLECTION = "products";
