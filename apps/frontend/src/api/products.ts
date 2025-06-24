import { db, storage } from '../firebase';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import {
  ref,
  listAll,
  deleteObject,
  getDownloadURL,
} from 'firebase/storage';

import type { Product } from '../types/firebase';
import { uploadFilesAndReturnUrls } from '../utils/uploadFilesAndReturnUrls';

type NewProduct = Omit<Product, 'id' | 'imageUrls'> & {
  images: File[];
};

export async function createProduct(product: NewProduct): Promise<void> {
  const { name, description, price, stock, categoryId, images } = product;
  const docRef = await addDoc(collection(db, 'products'), {
    name,
    description,
    price,
    stock,
    categoryId,
    imageUrls: [],
  });

  const imageUrls = await uploadFilesAndReturnUrls(images, `products/${docRef.id}`);
  await updateDoc(docRef, { imageUrls });
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
    stock: (doc.data() as any).stock ?? 0,
  }));
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
    imageUrls: data.imageUrls || [],
  };
}

type UpdateProductPayload = {
  data: Partial<Omit<Product, 'id'>>;
  keepImageUrls: string[];
  newImages: File[];
};

export async function updateProduct(productId: string, payload: UpdateProductPayload): Promise<void> {
  const { data, keepImageUrls, newImages } = payload;

  const folderRef = ref(storage, `products/${productId}`);
  const { items } = await listAll(folderRef);

  for (const item of items) {
    const url = await getDownloadURL(item);
    if (!keepImageUrls.includes(url)) {
      await deleteObject(item);
    }
  }

  const newImageUrls = await uploadFilesAndReturnUrls(newImages, `products/${productId}`);
  const refDoc = doc(db, 'products', productId);

  await updateDoc(refDoc, {
    ...data,
    imageUrls: [...keepImageUrls, ...newImageUrls],
  });
}

export async function deleteProduct(productId: string): Promise<void> {
  await deleteDoc(doc(db, 'products', productId));

  const folderRef = ref(storage, `products/${productId}`);
  const { items } = await listAll(folderRef);
  for (const item of items) {
    await deleteObject(item);
  }
}
