// src/utils/uploadFilesAndReturnUrls.ts
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { app } from '../firebase';

export async function uploadFilesAndReturnUrls(files: File[], folderPath: string): Promise<string[]> {
  const storage = getStorage(app);
  const imageUrls: string[] = [];

  for (const file of files) {
    const storageRef = ref(storage, `${folderPath}/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    await new Promise<void>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        null,
        reject,
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          imageUrls.push(url);
          resolve();
        }
      );
    });
  }

  return imageUrls;
}
