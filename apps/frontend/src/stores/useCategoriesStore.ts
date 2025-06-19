import { create } from 'zustand';

export interface Category {
  id: string;
  name: string;
}

interface CategoriesState {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  addCategoryToState: (category: Category) => void;
  removeCategoryFromState: (id: string) => void;
}

export const useCategoriesStore = create<CategoriesState>((set) => ({
  categories: [],
  setCategories: (categories) => set({ categories }),
  addCategoryToState: (category) =>
    set((state) => ({
      categories: [...state.categories, category],
    })),
  removeCategoryFromState: (id) =>
    set((state) => ({
      categories: state.categories.filter((cat) => cat.id !== id),
    })),
}));
