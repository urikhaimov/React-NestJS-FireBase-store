// src/types/firebase.ts
import { Timestamp } from 'firebase/firestore';
export type Category = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  images: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  order?: number; // ✅ optional, for sorting
  imageUrl?: string; // ✅ Add this line
};
export type NewProduct = {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  createdBy: string;
  images: string[]; // ✅ URLs
};


export type ProductOrderItem = {
  id: string;
  order: number;
};