// src/hooks/useFirebaseUpload.ts
import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase'; // adjust if your path is different

export interface UploadStatus {
  progress: number;
  uploading: boolean;
  error: string | null;
  downloadURL: string | null;
}

export function useFirebaseUpload(folder = 'products') {
  const [status, setStatus] = useState<UploadStatus>({
    progress: 0,
    uploading: false,
    error: null,
    downloadURL: null,
  });

  const uploadFile = (file: File) => {
    const fileRef = ref(storage, `${folder}/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    setStatus({ progress: 0, uploading: true, error: null, downloadURL: null });

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setStatus((prev) => ({ ...prev, progress }));
      },
      (error) => {
        setStatus((prev) => ({
          ...prev,
          uploading: false,
          error: error.message,
        }));
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setStatus({ progress: 100, uploading: false, error: null, downloadURL });
      }
    );
  };

  return { uploadFile, ...status };
}
