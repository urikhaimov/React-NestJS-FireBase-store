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
  imageUrls: string[];
  createdAt: any;
  updatedAt: any;
  createdBy: string;
};

export type NewProduct = Omit<Product, 'id' | 'imageUrls' | 'createdAt' | 'updatedAt'> & {
  images: File[];
};


