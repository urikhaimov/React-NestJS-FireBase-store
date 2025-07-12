import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance'; // ✅ Auth interceptor already configured

export const useUploadAvatarMutation = (uid: string) => {
  return useMutation({
    mutationFn: async (file: Blob) => {
      const formData = new FormData();
      formData.append('file', file);

      const res = await axiosInstance.post(`/users/${uid}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return res.data; // Should return { photoURL }
    },
  });
};
