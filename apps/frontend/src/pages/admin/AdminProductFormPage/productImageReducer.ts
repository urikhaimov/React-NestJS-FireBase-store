// ✅ src/pages/admin/AdminProductFormPage/productImageReducer.ts

export type ImageState = {
  keepImageUrls: string[];
  newFiles: File[];
  previews: string[];
  progress: number[];
  uploadedUrls: string[];
};

export type ImageAction =
  | { type: 'SET_KEEP_IMAGE_URLS'; payload: string[] }
  | { type: 'SET_NEW_FILES'; payload: File[] }
  | { type: 'SET_PREVIEWS'; payload: string[] }
  | { type: 'SET_PROGRESS'; payload: number[] }
  | { type: 'UPDATE_PROGRESS'; index: number; percent: number }
  | { type: 'REMOVE_EXISTING_IMAGE'; url: string }
  | { type: 'REMOVE_NEW_IMAGE'; index: number }
  | { type: 'SET_UPLOADED_URLS'; payload: string[] }
  | { type: 'UPDATE_UPLOADED_URL'; index: number; url: string }
  | { type: 'UPLOAD_PROGRESS'; index: number; percent: number }
  | { type: 'UPLOAD_SUCCESS'; index: number; url: string };

export const initialImageState: ImageState = {
  keepImageUrls: [],
  newFiles: [],
  previews: [],
  progress: [],
  uploadedUrls: [],
};

export function imageReducer(state: ImageState, action: ImageAction): ImageState {
  switch (action.type) {
    case 'SET_KEEP_IMAGE_URLS':
      return { ...state, keepImageUrls: action.payload };
    case 'SET_NEW_FILES':
      return { ...state, newFiles: action.payload };
    case 'SET_PREVIEWS':
      return { ...state, previews: action.payload };
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    case 'UPDATE_PROGRESS':
    case 'UPLOAD_PROGRESS': {
      const newProgress = [...state.progress];
      newProgress[action.index] = action.percent;
      return { ...state, progress: newProgress };
    }
    case 'SET_UPLOADED_URLS':
      return { ...state, uploadedUrls: action.payload };
    case 'UPDATE_UPLOADED_URL':
    case 'UPLOAD_SUCCESS': {
      const newUrls = [...state.uploadedUrls];
      newUrls[action.index] = action.url;
      return { ...state, uploadedUrls: newUrls };
    }
    case 'REMOVE_EXISTING_IMAGE':
      return {
        ...state,
        keepImageUrls: state.keepImageUrls.filter((url) => url !== action.url),
      };
    case 'REMOVE_NEW_IMAGE':
      return {
        ...state,
        newFiles: state.newFiles.filter((_, i) => i !== action.index),
        previews: state.previews.filter((_, i) => i !== action.index),
        progress: state.progress.filter((_, i) => i !== action.index),
        uploadedUrls: state.uploadedUrls.filter((_, i) => i !== action.index),
      };
    default:
      return state;
  }
}