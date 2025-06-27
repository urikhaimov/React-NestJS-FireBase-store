import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  ref,
  listAll,
  deleteObject,
  getDownloadURL,
} from 'firebase/storage';
import { db, storage } from '../firebase';
import type { Product } from '../types/firebase';
import { uploadFilesAndReturnUrls } from '../utils/uploadFilesAndReturnUrls';
import { writeBatch } from 'firebase/firestore';
import axios from '../api/axios';
export type NewProduct = {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  createdBy: string;
  images: string[]; // ✅ image URLs from Firebase
};

export type UpdateProductPayload = {
  data: Partial<Omit<Product, 'id' | 'images' | 'createdAt' | 'updatedAt' | 'createdBy'>>;
  keepImageUrls: string[];
  newImageFiles: File[];
};

export async function createProduct(product: NewProduct, userId: string) {
  const docRef = await addDoc(collection(db, 'products'), {
    ...product,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef;
}

export async function updateProduct(productId: string, payload: UpdateProductPayload): Promise<void> {
  const { data, keepImageUrls, newImageFiles } = payload;

  // Delete old images not in keep list
  const folderRef = ref(storage, `products/${productId}`);
  const { items } = await listAll(folderRef);

  for (const item of items) {
    const url = await getDownloadURL(item);
    if (!keepImageUrls.includes(url)) {
      await deleteObject(item);
    }
  }

  const newImageUrls = await uploadFilesAndReturnUrls(newImageFiles, `products/${productId}`);
  const refDoc = doc(db, 'products', productId);

  await updateDoc(refDoc, {
    ...data,
    images: [...keepImageUrls, ...newImageUrls],
    updatedAt: serverTimestamp(),
  });
}

export async function getProductById(productId: string): Promise<Product | null> {
  const refDoc = doc(db, 'products', productId);
  const snapshot = await getDoc(refDoc);
  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  return {
    id: snapshot.id,
    name: data.name,
    description: data.description,
    price: data.price,
    stock: data.stock ?? 0,
    categoryId: data.categoryId,
    images: data.images || [],
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    createdBy: data.createdBy,
  };
}

export async function deleteProduct(productId: string): Promise<void> {
  const folderRef = ref(storage, `products/${productId}`);
  const { items } = await listAll(folderRef);
  for (const item of items) {
    await deleteObject(item);
  }

  const refDoc = doc(db, 'products', productId);
  await deleteDoc(refDoc);
}

export const reorderProducts = (
  orderList: { id: string; order: number }[],
  token: string
) => {
  return axios.patch(
    '/api/products/reorder',
    { orderList },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
