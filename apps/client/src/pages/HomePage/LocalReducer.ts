import { Dayjs } from 'dayjs';

export interface State {
  search: string;
  selectedCategoryId: string;
  createdAfter: Dayjs | null;
  page: number;
  hasMore: boolean;
}

export type Action =
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'SET_CREATED_AFTER'; payload: Dayjs | null }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_HAS_MORE'; payload: boolean }
  | { type: 'RESET_FILTERS' };

type FilterState = {
  search: string;
  selectedCategoryId: string;
  createdAfter: Dayjs | null;
  page: number;
  pageSize: number;
};

type FilterAction =
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'SET_CREATED_AFTER'; payload: Dayjs | null }
  | { type: 'SET_PAGE'; payload: number };

export const initialState: FilterState = {
  search: '',
  selectedCategoryId: '',
  createdAfter: null,
  page: 1,
  pageSize: 6,
};

export function reducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, search: action.payload, page: 1 };
    case 'SET_CATEGORY':
      return { ...state, selectedCategoryId: action.payload, page: 1 };
    case 'SET_CREATED_AFTER':
      return { ...state, createdAfter: action.payload, page: 1 };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    default:
      return state;
  }
}
