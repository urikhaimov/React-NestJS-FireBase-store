import { Product } from '../../types/firebase';
import { CombinedImage } from '../../components/ImageUploader';
import type { Category } from '../../types/firebase';

export interface ProductFormState {
  product: Product | null;
  combinedImages: CombinedImage[];
  isUploadingImages: boolean;
  categories: Category[];
  showSuccessSnackbar: boolean;
  showLimitSnackbar: boolean;
  ready: boolean; // ✅ NEW
}

export const initialProductFormState: ProductFormState = {
  product: null,
  combinedImages: [],
  isUploadingImages: false,
  categories: [],
  showSuccessSnackbar: false,
  showLimitSnackbar: false,
  ready: false, // ✅ NEW
};

type Action =
  | { type: 'SET_PRODUCT'; payload: Product }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'SET_COMBINED_IMAGES'; payload: CombinedImage[] }
  | { type: 'ADD_COMBINED_IMAGES'; payload: CombinedImage[] }
  | { type: 'SET_UPLOAD_PROGRESS'; payload: { id: string; progress: number } }
  | { type: 'SET_UPLOADING_IMAGES'; payload: boolean }
  | { type: 'SET_SHOW_SUCCESS_SNACKBAR'; payload: boolean }
  | { type: 'SET_SHOW_LIMIT_SNACKBAR'; payload: boolean }
  | { type: 'SET_READY'; payload: boolean }; // ✅ NEW

export function productFormReducer(
  state: ProductFormState,
  action: Action
): ProductFormState {
  switch (action.type) {
    case 'SET_PRODUCT':
      return { ...state, product: action.payload };

    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };

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

    case 'SET_SHOW_SUCCESS_SNACKBAR':
      return { ...state, showSuccessSnackbar: action.payload };

    case 'SET_SHOW_LIMIT_SNACKBAR':
      return { ...state, showLimitSnackbar: action.payload };

    case 'SET_READY': // ✅ NEW
      return { ...state, ready: action.payload };

    default:
      return state;
  }
}
