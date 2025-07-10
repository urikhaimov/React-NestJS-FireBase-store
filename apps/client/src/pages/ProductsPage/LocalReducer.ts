// src/pages/ProductsPage/LocalReducer.ts
import { Dayjs } from 'dayjs';

export interface State {
  search: string;
  selectedCategoryId: string;
  createdAfter: Dayjs | null;
  minPrice: number | null;
  maxPrice: number | null;
  inStockOnly: boolean;
  page: number;
  pageSize: number;
}

export type Action =
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'SET_CREATED_AFTER'; payload: Dayjs | null }
  | { type: 'SET_MIN_PRICE'; payload: number | null }
  | { type: 'SET_MAX_PRICE'; payload: number | null }
  | { type: 'SET_IN_STOCK_ONLY'; payload: boolean }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'RESET_FILTERS' };

export const initialState: State = {
  search: '',
  selectedCategoryId: '',
  createdAfter: null,
  minPrice: null,
  maxPrice: null,
  inStockOnly: false,
  page: 1,
  pageSize: 6,
};

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, search: action.payload, page: 1 };
    case 'SET_CATEGORY':
      return { ...state, selectedCategoryId: action.payload, page: 1 };
    case 'SET_CREATED_AFTER':
      return { ...state, createdAfter: action.payload, page: 1 };
    case 'SET_MIN_PRICE':
      return { ...state, minPrice: action.payload, page: 1 };
    case 'SET_MAX_PRICE':
      return { ...state, maxPrice: action.payload, page: 1 };
    case 'SET_IN_STOCK_ONLY':
      return { ...state, inStockOnly: action.payload, page: 1 };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'RESET_FILTERS':
      return { ...initialState };
    default:
      return state;
  }
}
