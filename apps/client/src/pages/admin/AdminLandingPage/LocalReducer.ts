// -------------------
// Reducer setup
// -------------------
import type { CombinedImage } from '../../../components/ImageUploader';
import type { LandingPageData, Section } from '../../../types/landing';

export type State = {
  form: LandingPageData;
  images: CombinedImage[];
  errorMessage: string;
  successMessage: string;
  showSnackbar: boolean;
  loading: boolean;
};

export type Action =
  | { type: 'SET_FORM'; payload: Partial<LandingPageData> }
  | { type: 'SET_IMAGE_STATE'; payload: CombinedImage[] }
  | { type: 'SET_SECTIONS'; payload: Section[] }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_SUCCESS'; payload: string }
  | { type: 'CLOSE_SNACKBAR' }
  | { type: 'SET_LOADING'; payload: boolean };

export const initialState: State = {
  form: {
    title: '',
    subtitle: '',
    bannerImageUrl: '',
    ctaButtonText: '',
    ctaButtonLink: '',
    sections: [],
  },
  images: [],
  errorMessage: '',
  successMessage: '',
  showSnackbar: false,
  loading: false,
};

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_FORM':
      return {
        ...state,
        form: { ...state.form, ...action.payload },
      };
    case 'SET_IMAGE_STATE':
      return { ...state, images: action.payload };
    case 'SET_SECTIONS':
      return {
        ...state,
        form: { ...state.form, sections: action.payload },
      };
    case 'SET_ERROR':
      return {
        ...state,
        errorMessage: action.payload,
        successMessage: '',
        showSnackbar: true,
      };
    case 'SET_SUCCESS':
      return {
        ...state,
        errorMessage: '',
        successMessage: action.payload,
        showSnackbar: true,
      };
    case 'CLOSE_SNACKBAR':
      return {
        ...state,
        showSnackbar: false,
        errorMessage: '',
        successMessage: '',
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}
