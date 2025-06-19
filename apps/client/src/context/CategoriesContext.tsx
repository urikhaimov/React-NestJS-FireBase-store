import { createContext, useReducer, useContext, ReactNode } from 'react';

interface Category {
  id: string;
  name: string;
}

type State = {
  categories: Category[];
};

type Action =
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'REMOVE_CATEGORY'; payload: string };

const CategoriesContext = createContext<
  { state: State; dispatch: React.Dispatch<Action> } | undefined
>(undefined);

const initialState: State = {
  categories: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'REMOVE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter((cat) => cat.id !== action.payload),
      };
    default:
      return state;
  }
}

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <CategoriesContext.Provider value={{ state, dispatch }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories must be used inside CategoriesProvider');
  }
  return context;
};
