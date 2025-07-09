import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';

// Upload a file and return its download URL
export async function uploadImage(file: File, path: string): Promise<string> {
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
}

// Delete file by storage path
export async function deleteImage(path: string): Promise<void> {
  const fileRef = ref(storage, path);
  await deleteObject(fileRef);
}

// Delete file by full download URL
export async function deleteImageByUrl(url: string): Promise<void> {
  try {
    const path = decodeURIComponent(new URL(url).pathname.split('/o/')[1].split('?')[0]);
    await deleteImage(path);
  } catch (error) {
    console.warn('Failed to delete image by URL:', error);
  }
}
