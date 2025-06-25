import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc
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
import { serverTimestamp } from 'firebase/firestore';

export type NewProduct = Omit<Product, 'id' | 'imageUrls' | 'createdAt' | 'updatedAt'> & {
  images: File[];
};

export type UpdateProductPayload = {
  data: Partial<Omit<Product, 'id' | 'imageUrls' | 'createdAt' | 'updatedAt' | 'createdBy'>>;
  keepImageUrls: string[];
  newImages: File[];
};

export async function createProduct(product: NewProduct, userId: string): Promise<void> {
  const { name, description, price, stock, categoryId, images } = product;

  const docRef = await addDoc(collection(db, 'products'), {
    name,
    description,
    price,
    stock,
    categoryId,
    createdBy: userId,
    imageUrls: [],
    createdAt: serverTimestamp(), // ✅
    updatedAt: serverTimestamp(), // ✅
  });

  const imageUrls = await uploadFilesAndReturnUrls(images, `products/${docRef.id}`);
  await updateDoc(docRef, { imageUrls });
}
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
    updatedAt: serverTimestamp(), // ✅
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
    imageUrls: data.imageUrls || [],
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    createdBy: data.createdBy,
  };
}