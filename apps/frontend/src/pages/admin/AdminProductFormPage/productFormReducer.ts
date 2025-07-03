// src/pages/admin/AdminProductFormPage/productFormReducer.ts
import { Product } from '../../../types/firebase';
import { CombinedImage } from '../../../components/ImageUploader';

export interface ProductFormState {
  product: Product | null;
  combinedImages: CombinedImage[];
  isUploadingImages: boolean;
}

export const initialProductFormState: ProductFormState = {
  product: null,
  combinedImages: [],
  isUploadingImages: false,
};

type Action =
  | { type: 'SET_PRODUCT'; payload: Product }
  | { type: 'SET_COMBINED_IMAGES'; payload: CombinedImage[] }
  | { type: 'ADD_COMBINED_IMAGES'; payload: CombinedImage[] }
  | { type: 'SET_UPLOAD_PROGRESS'; payload: { id: string; progress: number } }
  | { type: 'SET_UPLOADING_IMAGES'; payload: boolean };

export function productFormReducer(state: ProductFormState, action: Action): ProductFormState {
  switch (action.type) {
    case 'SET_PRODUCT':
      return { ...state, product: action.payload };

    case 'SET_COMBINED_IMAGES':
      return { ...state, combinedImages: action.payload };

    case 'ADD_COMBINED_IMAGES':
      return {
        ...state,
        combinedImages: [...state.combinedImages, ...action.payload],
      };

    case 'SET_UPLOAD_PROGRESS':
      return {
        ...state,
        combinedImages: state.combinedImages.map((img) =>
          img.id === action.payload.id
            ? { ...img, progress: action.payload.progress }
            : img
        ),
      };

    case 'SET_UPLOADING_IMAGES':
      return { ...state, isUploadingImages: action.payload };

    default:
      return state;
  }
}
