// src/store/productFilters.ts
import { create } from 'zustand';
import { Dayjs } from 'dayjs';

interface ProductFilters {
  searchTerm: string;
  categoryId: string;
  createdAfter: Dayjs | null;
  setSearchTerm: (value: string) => void;
  setCategoryId: (id: string) => void;
  setCreatedAfter: (date: Dayjs | null) => void;
}

export const useProductFilters = create<ProductFilters>((set) => ({
  searchTerm: '',
  categoryId: '',
  createdAfter: null,
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setCategoryId: (categoryId) => set({ categoryId }),
  setCreatedAfter: (createdAfter) => set({ createdAfter }),
}));
