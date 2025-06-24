// src/pages/admin/ProductFormPage/productFormReducer.ts
import type { Product } from '../../../types/firebase';
export type ProductFormAction =
  | { type: 'SET_PRODUCT'; payload: Product | null } // ✅ allow null
  | { type: 'SET_KEEP_IMAGE_URLS'; payload: string[] }
  | { type: 'SET_NEW_FILES'; payload: File[] }
  | { type: 'SET_UPLOADING'; payload: boolean }
  | { type: 'SET_SUCCESS'; payload: boolean };

export interface ProductFormState {
  keepImageUrls: string[];
  newFiles: File[];
  uploading: boolean;
  success: boolean;
  product: Product | null | undefined;
}

export const initialProductFormState: ProductFormState = {
  keepImageUrls: [],
  newFiles: [],
  uploading: false,
  success: false,
  product: undefined,
};

export function productFormReducer(
  state: ProductFormState,
  action: ProductFormAction
): ProductFormState {
  switch (action.type) {
    case 'SET_PRODUCT':
      return {
        ...state,
        product: action.payload,
        keepImageUrls: action.payload?.imageUrls ?? [],
      };
    case 'SET_KEEP_IMAGE_URLS':
      return { ...state, keepImageUrls: action.payload };
    case 'SET_NEW_FILES':
      return { ...state, newFiles: action.payload };
    case 'SET_UPLOADING':
      return { ...state, uploading: action.payload };
    case 'SET_SUCCESS':
      return { ...state, success: action.payload };
    default:
      return state;
  }
}
