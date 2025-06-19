import { create } from 'zustand';

interface StoreState {
  storeId: string;
  setStoreId: (id: string) => void;
}

export const useStoreContext = create<StoreState>((set) => ({
  storeId: 'store1',
  setStoreId: (id) => set({ storeId: id }),
}));
