import { Product } from '../../types/firebase';

export type State = {
  products: Product[];
  loading: boolean;
  search: string;
};

export type Action =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'UPDATE_PRODUCT'; payload: { id: string; updates: Partial<Product> } };