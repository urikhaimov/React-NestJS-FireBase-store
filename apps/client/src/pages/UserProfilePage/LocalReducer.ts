export type State = {
  toastOpen: boolean;
  toastMessage: string;
  errorMsg: string;
};

export type Action =
  | { type: 'SET_TOAST_OPEN'; payload: boolean }
  | { type: 'SET_TOAST_MESSAGE'; payload: string }
  | { type: 'SET_ERROR_MSG'; payload: string };

export const initialState: State = {
  toastOpen: false,
  toastMessage: '',
  errorMsg: '',
};

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_TOAST_OPEN':
      return { ...state, toastOpen: action.payload };
    case 'SET_TOAST_MESSAGE':
      return { ...state, toastMessage: action.payload };
    case 'SET_ERROR_MSG':
      return { ...state, errorMsg: action.payload };
    default:
      return state;
  }
}
