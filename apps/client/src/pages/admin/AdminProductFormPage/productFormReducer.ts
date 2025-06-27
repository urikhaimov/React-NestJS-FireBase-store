// src/pages/admin/ProductFormPage/productFormReducer.ts
import type { Product } from '../../../types/firebase';

export type ProductFormAction =
  | { type: 'SET_PRODUCT'; payload: Product | null }
  | { type: 'SET_KEEP_IMAGE_URLS'; payload: string[] }
  | { type: 'SET_NEW_FILES'; payload: File[] }
  | { type: 'SET_UPLOADED_URLS'; payload: string[] }
  | { type: 'SET_PREVIEWS'; payload: string[] }
  | { type: 'SET_PROGRESS'; payload: number[] }
  | { type: 'SET_UPLOADING'; payload: boolean }
  | { type: 'SET_SUCCESS'; payload: boolean }
  | { type: 'SET_IMAGE_UPLOADING'; payload: boolean };

export interface ProductFormState {
  keepImageUrls: string[];
  newFiles: File[];
  previews: string[];
  uploadedUrls: string[];
  progress: number[];
  uploading: boolean;
  success: boolean;
  product: Product | null | undefined;
  isUploadingImages: boolean;
}

export const initialProductFormState: ProductFormState = {
  keepImageUrls: [],
  newFiles: [],
  previews: [],
  uploadedUrls: [],
  progress: [],
  uploading: false,
  success: false,
  product: undefined,
  isUploadingImages: false,
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
        keepImageUrls: action.payload?.images ?? [],
      };
    case 'SET_KEEP_IMAGE_URLS':
      return { ...state, keepImageUrls: action.payload };
    case 'SET_NEW_FILES':
      return { ...state, newFiles: action.payload };
    case 'SET_UPLOADED_URLS':
      return { ...state, uploadedUrls: action.payload };
    case 'SET_PREVIEWS':
      return { ...state, previews: action.payload };
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    case 'SET_UPLOADING':
      return { ...state, uploading: action.payload };
    case 'SET_SUCCESS':
      return { ...state, success: action.payload };
    case 'SET_IMAGE_UPLOADING':
      return { ...state, isUploadingImages: action.payload };
    default:
      return state;
  }
}
