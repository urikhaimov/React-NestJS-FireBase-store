// src/api/products.ts
import { db, storage } from '../firebase';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  getDoc,
  getDocs
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  listAll, deleteObject
} from 'firebase/storage';
import type { Product } from '../types/firebase';

import { query, where } from 'firebase/firestore';
import { uploadFilesAndReturnUrls } from '../utils/uploadFilesAndReturnUrls';

type NewProduct = Omit<Product, 'id' | 'imageUrls'> & {
  images: File[];
};

export async function createProduct(product: NewProduct): Promise<void> {
  const { name, description, price, stock, categoryId, images } = product;
  const imageUrls = await uploadFilesAndReturnUrls(images, 'products');

  await addDoc(collection(db, 'products'), {
    name,
    description,
    price,
    stock,
    categoryId,
    imageUrls,
  });
}


export async function fetchProducts(): Promise<Product[]> {
  const snapshot = await getDocs(collection(db, 'products'));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Product, 'id'>),
  }));
}
export async function fetchProductsByCategory(categoryId: string): Promise<Product[]> {
  const q = query(collection(db, 'products'), where('categoryId', '==', categoryId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Product, 'id'>),
    stock: (doc.data() as any).stock ?? 0, // fallback if needed
  }));
}

export async function getProductById(productId: string): Promise<Product | null> {
  const ref = doc(db, 'products', productId);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  return {
    id: snapshot.id,
    name: data.name,
    description: data.description,
    price: data.price,
    stock: data.stock ?? 0,
    categoryId: data.categoryId,
    imageUrls: data.imageUrls || [],
  } as Product;
}


export async function deleteProduct(productId: string): Promise<void> {
  // Delete product document
  await deleteDoc(doc(db, 'products', productId));

  // Delete associated images from storage
  const folderRef = ref(storage, `products/${productId}`);
  const { items } = await listAll(folderRef);
  for (const item of items) {
    await deleteObject(item);
  }
}
export async function updateProduct(productId: string, data: Partial<Omit<Product, 'id'>>): Promise<void> {
  const ref = doc(db, 'products', productId);
  await updateDoc(ref, data);
}
