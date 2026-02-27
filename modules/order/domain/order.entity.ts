import type { ObjectId } from "mongodb";

export enum OrderStatus {
  PENDING = "pending",
  COMPLETED = "completed",
}

export interface IOrderProduct {
  productId: ObjectId;
  quantity: number;
}

export interface IOrder {
  _id: ObjectId;
  buyerId: ObjectId;
  products: IOrderProduct[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export const ORDERS_COLLECTION = "orders";
