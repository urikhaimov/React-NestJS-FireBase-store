import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

const docRef = doc(db, 'themes', 'settings');

export function useThemeSettings() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['themeSettings'],
    queryFn: async () => {
      const snap = await getDoc(docRef);
      return snap.exists() ? snap.data() : null;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      await setDoc(docRef, data, { merge: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['themeSettings'] });
    },
  });


  return {
    data: query.data,
    isLoading: query.isLoading,
    saveTheme: mutation.mutate,
    isSaving: mutation.isPending,
  };
}
