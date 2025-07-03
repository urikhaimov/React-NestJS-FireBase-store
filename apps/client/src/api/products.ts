import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  deleteDoc,
  serverTimestamp,
  writeBatch,
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
import axios from '../api/axios';

// -------------------------
// Types
// -------------------------
export type NewProduct = {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  createdBy: string;
  images: string[]; // ✅ URLs from Firebase
};

export type UpdateProductPayload = {
  data: Partial<Omit<Product, 'id' | 'images' | 'createdAt' | 'updatedAt' | 'createdBy'>>;
  keepImageUrls: string[];
  newImageFiles?: File[]; // ✅ Files to upload
};

// -------------------------
// Create Product
// -------------------------
export async function createProduct(product: NewProduct, userId: string) {
  const docRef = await addDoc(collection(db, 'products'), {
    ...product,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef;
}

// -------------------------
// Update Product (with file upload & cleanup)
// -------------------------
export async function updateProduct(productId: string, payload: UpdateProductPayload): Promise<void> {
  const { data, keepImageUrls, newImageFiles = [] } = payload;
  const refDoc = doc(db, 'products', productId);
  const existingSnap = await getDoc(refDoc);

  if (!existingSnap.exists()) return;

  const existingData = existingSnap.data();

  const noFieldChanges = Object.entries(data).every(([key, value]) => value === existingData[key]);
  const noImageChanges = arraysEqual(existingData.images ?? [], [...keepImageUrls]);

  if (noFieldChanges && noImageChanges && newImageFiles.length === 0) {
    return; // Nothing changed
  }

  // Delete any old images that are not kept
  const folderRef = ref(storage, `products/${productId}`);
  const { items } = await listAll(folderRef);

  for (const item of items) {
    const url = await getDownloadURL(item);
    if (!keepImageUrls.includes(url)) {
      await deleteObject(item);
    }
  }

  const uploadedUrls = await uploadFilesAndReturnUrls(newImageFiles, `products/${productId}`);

  await updateDoc(refDoc, {
    ...data,
    images: [...keepImageUrls, ...uploadedUrls],
    updatedAt: serverTimestamp(),
  });
}

// -------------------------
// Get Single Product by ID
// -------------------------
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

// -------------------------
// Delete Product + Images
// -------------------------
export async function deleteProduct(productId: string): Promise<void> {
  const folderRef = ref(storage, `products/${productId}`);
  const { items } = await listAll(folderRef);
  for (const item of items) {
    await deleteObject(item);
  }

  const refDoc = doc(db, 'products', productId);
  await deleteDoc(refDoc);
}

// -------------------------
// Reorder Products via API
// -------------------------
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

// -------------------------
// Utility: Array equality check
// -------------------------
export function arraysEqual(arr1: string[], arr2: string[]): boolean {
  return arr1.length === arr2.length && arr1.every((val) => arr2.includes(val));
}
