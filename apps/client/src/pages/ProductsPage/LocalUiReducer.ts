import { initialState } from './LocalReducer';

export type UIState = {
  visibleCount: number;
  loading: boolean;
  snackbarOpen: boolean;
  mobileDrawerOpen: boolean;
};

export const initialUIState: UIState = {
  visibleCount: initialState.pageSize,
  loading: true,
  snackbarOpen: false,
  mobileDrawerOpen: false,
};

export type UIAction =
  | { type: 'setVisibleCount'; payload: number }
  | { type: 'incrementVisibleCount'; payload: number }
  | { type: 'setLoading'; payload: boolean }
  | { type: 'setSnackbarOpen'; payload: boolean }
  | { type: 'setMobileDrawerOpen'; payload: boolean };

export function uiReducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {
    case 'setVisibleCount':
      return { ...state, visibleCount: action.payload };
    case 'incrementVisibleCount':
      return { ...state, visibleCount: state.visibleCount + action.payload };
    case 'setLoading':
      return { ...state, loading: action.payload };
    case 'setSnackbarOpen':
      return { ...state, snackbarOpen: action.payload };
    case 'setMobileDrawerOpen':
      return { ...state, mobileDrawerOpen: action.payload };
    default:
      return state;
  }
}
