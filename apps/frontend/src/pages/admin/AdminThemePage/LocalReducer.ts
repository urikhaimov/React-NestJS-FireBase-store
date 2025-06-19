type ThemeForm = {
  darkMode: boolean;
  primaryColor: string;
  secondaryColor: string;
  font: string;
  logoUrl: string;
};


type UIState = {
  loading: boolean;
  toastOpen: boolean;
};

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_TOAST'; payload: boolean };

const initialState: UIState = {
  loading: true,
  toastOpen: false,
};

function reducer(state: UIState, action: Action): UIState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_TOAST':
      return { ...state, toastOpen: action.payload };
    default:
      return state;
  }
}