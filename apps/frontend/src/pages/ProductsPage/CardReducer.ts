import { Product } from '../../types/firebase';
export type Props = {
  product: Product;
  

};

// Reducer state and actions
export type State = {
  dialogOpen: boolean;
  loading: boolean;
};

export type Action =
  | { type: 'OPEN_DIALOG' }
  | { type: 'CLOSE_DIALOG' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'RESET' };

export const initialState: State = {
  dialogOpen: false,
  loading: false,
};

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'OPEN_DIALOG':
      return { ...state, dialogOpen: true };
    case 'CLOSE_DIALOG':
      return { ...state, dialogOpen: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
      case 'RESET':
  return initialState;
    default:
      return state;
  }
}
