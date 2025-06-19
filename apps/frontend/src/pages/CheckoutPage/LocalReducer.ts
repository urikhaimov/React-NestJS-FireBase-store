type State = {
  loading: boolean;
  error: string;
  success: boolean;
};

type Action =
  | { type: 'loading'; payload: boolean }
  | { type: 'error'; payload: string }
  | { type: 'success'; payload: boolean };

export const initialState: State = {
  loading: false,
  error: '',
  success: false,
};

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'loading':
      return { ...state, loading: action.payload };
    case 'error':
      return { ...state, error: action.payload };
    case 'success':
      return { ...state, success: action.payload };
    default:
      return state;
  }
}
