import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { auth } from '../firebase';

export const useUploadAvatarMutation = (uid: string) => {
  return useMutation({
    mutationFn: async (file: Blob) => {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error('Not authenticated');

      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post(`/api/users/${uid}/avatar`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return res.data;
    },
  });
};
