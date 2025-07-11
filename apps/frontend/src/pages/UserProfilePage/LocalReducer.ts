import { Area } from 'react-easy-crop/types';
export interface State {
  uploading: boolean;
  cropDialogOpen: boolean;
  selectedImage: File | null;
  crop: { x: number; y: number };
  zoom: number;
  croppedAreaPixels: Area | null;
  imageSrc: string | null;
  toastOpen: boolean;
  errorMsg: string;
}

export const initialState: State = {
  uploading: false,
  cropDialogOpen: false,
  selectedImage: null,
  crop: { x: 0, y: 0 },
  zoom: 1,
  croppedAreaPixels: null,
  imageSrc: null,
  toastOpen: false,
  errorMsg: '',
};

export type Action =
  | { type: 'SET_UPLOADING'; payload: boolean }
  | { type: 'SET_CROP_DIALOG_OPEN'; payload: boolean }
  | { type: 'SET_SELECTED_IMAGE'; payload: File | null }
  | { type: 'SET_CROP'; payload: { x: number; y: number } }
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'SET_CROPPED_AREA_PIXELS'; payload: Area | null }
  | { type: 'SET_IMAGE_SRC'; payload: string | null }
  | { type: 'SET_TOAST_OPEN'; payload: boolean }
  | { type: 'SET_ERROR_MSG'; payload: string };

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_UPLOADING': return { ...state, uploading: action.payload };
    case 'SET_CROP_DIALOG_OPEN': return { ...state, cropDialogOpen: action.payload };
    case 'SET_SELECTED_IMAGE': return { ...state, selectedImage: action.payload };
    case 'SET_CROP': return { ...state, crop: action.payload };
    case 'SET_ZOOM': return { ...state, zoom: action.payload };
    case 'SET_CROPPED_AREA_PIXELS': return { ...state, croppedAreaPixels: action.payload };
    case 'SET_IMAGE_SRC': return { ...state, imageSrc: action.payload };
    case 'SET_TOAST_OPEN': return { ...state, toastOpen: action.payload };
    case 'SET_ERROR_MSG': return { ...state, errorMsg: action.payload };
    default: return state;
  }
}

