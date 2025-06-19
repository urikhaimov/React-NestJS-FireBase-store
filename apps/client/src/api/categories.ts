import { db } from '../firebase';
import { collection, getDocs, addDoc,deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Category } from '../types/firebase';

export async function fetchCategories(): Promise<Category[]> {
  const snapshot = await getDocs(collection(db, 'categories'));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Category, 'id'>),
  }));
}

export async function addCategory(name: string): Promise<Category> {
  const docRef = await addDoc(collection(db, 'categories'), { name });
  return { id: docRef.id, name };
}

export async function deleteCategory(id: string): Promise<void> {
  await deleteDoc(doc(db, 'categories', id));
}
export async function updateCategory(id: string, name: string): Promise<void> {
  const categoryRef = doc(db, 'categories', id);
  await updateDoc(categoryRef, { name });
}