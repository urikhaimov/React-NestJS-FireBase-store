// src/hooks/useFirestoreDoc.ts
import { useQuery, useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

type Updater<T> = (data: T) => void;

interface UseFirestoreDocOptions<T> {
  collection: string;
  docId: string;
  onUpdate?: Updater<T>;
  merge?: boolean;
  queryKey?: readonly string[];
  enabled?: boolean;
}

export function useFirestoreDoc<T extends Record<string, any> = Record<string, any>>({
  collection,
  docId,
  onUpdate,
  merge = true,
  queryKey,
  enabled = true,
}: UseFirestoreDocOptions<T>) {
  const queryClient = useQueryClient();

  const fullQueryKey = queryKey ?? [collection, docId];

  const query = useQuery<T>({
    queryKey: fullQueryKey,
    queryFn: async () => {
      try {
        const docRef = doc(db, collection, docId);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) throw new Error('Document does not exist');
        const data = snapshot.data() as T;
        if (onUpdate) onUpdate(data);
        return data;
      } catch (error) {
        console.error(`Failed to load document ${collection}/${docId}`, error);
        throw error;
      }
    },
    enabled,
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({
    mutationFn: async (updatedData: T) => {
      const cleaned = Object.fromEntries(
        Object.entries(updatedData).filter(([_, v]) => v !== undefined)
      ) as T;
      const docRef = doc(db, collection, docId);
      await setDoc(docRef, cleaned, { merge });
      return cleaned;
    },
    onSuccess: (data) => {
      if (onUpdate) onUpdate(data);
      queryClient.invalidateQueries({ queryKey: fullQueryKey });
    },
    onError: (error) => {
      console.error(`Failed to save document ${collection}/${docId}`, error);
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    save: mutation.mutate,
    saveAsync: mutation.mutateAsync,
    isSaving: mutation.status === 'pending',
  };
}
