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
  | { type: 'SET_IMAGE_UPLOADING'; payload: boolean }
  | { type: 'ADD_NEW_IMAGES'; payload: { files: File[]; previews: string[] } }
  | { type: 'REMOVE_EXISTING_IMAGE'; payload: string }
  | { type: 'REMOVE_NEW_IMAGE'; payload: number }
  | { type: 'SET_EXISTING_IMAGES'; payload: string[] };

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
    case 'ADD_NEW_IMAGES':
      return {
        ...state,
        newFiles: [...state.newFiles, ...action.payload.files],
        previews: [...state.previews, ...action.payload.previews],
      };
    case 'REMOVE_EXISTING_IMAGE':
      return {
        ...state,
        keepImageUrls: state.keepImageUrls.filter((url) => url !== action.payload),
      };
    case 'REMOVE_NEW_IMAGE':
      return {
        ...state,
        newFiles: state.newFiles.filter((_, i) => i !== action.payload),
        previews: state.previews.filter((_, i) => i !== action.payload),
        progress: state.progress.filter((_, i) => i !== action.payload),
      };
    case 'SET_EXISTING_IMAGES':
      return {
        ...state,
        keepImageUrls: action.payload,
      };
    default:
      return state;
  }
}
