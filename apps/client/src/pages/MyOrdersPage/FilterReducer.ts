import dayjs, { Dayjs } from 'dayjs';

export type Order = {
  id: string;
  status: string;
  createdAt?: { toDate: () => Date };
  amount: number;
  items: { name: string; quantity: number; price: number }[];
};

type FilterState = {
  status: string;
  createdAfter: Dayjs | null;
  page: number;
  pageSize: number;
};

type FilterAction =
  | { type: 'SET_STATUS'; payload: string }
  | { type: 'SET_CREATED_AFTER'; payload: Dayjs | null }
  | { type: 'SET_PAGE'; payload: number };

export const initialFilterState: FilterState = {
  status: 'all',
  createdAfter: null,
  page: 1,
  pageSize: 5,
};

export function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_STATUS':
      return { ...state, status: action.payload, page: 1 };
    case 'SET_CREATED_AFTER':
      return { ...state, createdAfter: action.payload, page: 1 };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    default:
      return state;
  }
}
