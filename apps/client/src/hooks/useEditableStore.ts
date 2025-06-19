// src/hooks/useEditableStore.ts
import { useContext, useState, useMemo } from 'react';
import { StoreConfigContext } from '../context/StoreConfigContext';
import type { StoreConfig } from '../types/StoreConfig';

export function useEditableStore() {
  const original = useContext(StoreConfigContext);
  const [override, setOverride] = useState<Partial<StoreConfig>>({});

  const editableStore = useMemo(
    () => ({ ...original, ...override }),
    [original, override]
  );

  const updateStore = (updates: Partial<StoreConfig>) => {
    setOverride((prev) => ({ ...prev, ...updates }));
  };

  return { editableStore, updateStore };
}
