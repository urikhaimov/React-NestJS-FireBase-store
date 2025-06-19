export interface Order {
  id: string;
  userId: string;
  email: string;
  total: number;
  createdAt: string;
  status: string;
}

interface FilterState {
  email: string;
  status: string;
  minTotal: number;
  maxTotal: number;
  startDate: Date | null;
  endDate: Date | null;
  sortDirection: 'asc' | 'desc';
  loading: boolean;
  orders: Order[];
}

export const initialState: FilterState = {
  email: '',
  status: 'all',
  minTotal: 0,
  maxTotal: 0,
  startDate: null,
  endDate: null,
  sortDirection: 'desc',
  loading: false,
  orders: [],
};

type Action =
  | { type: 'setEmail'; payload: string }
  | { type: 'setStatus'; payload: string }
  | { type: 'setMinTotal'; payload: number }
  | { type: 'setMaxTotal'; payload: number }
  | { type: 'setStartDate'; payload: Date | null }
  | { type: 'setEndDate'; payload: Date | null }
  | { type: 'setSortDirection'; payload: 'asc' | 'desc' }
  | { type: 'setLoading'; payload: boolean }
  | { type: 'setOrders'; payload: Order[] };

export function reducer(state: FilterState, action: Action): FilterState {
  switch (action.type) {
    case 'setEmail':
      return { ...state, email: action.payload };
    case 'setStatus':
      return { ...state, status: action.payload };
    case 'setMinTotal':
      return { ...state, minTotal: action.payload };
    case 'setMaxTotal':
      return { ...state, maxTotal: action.payload };
    case 'setStartDate':
      return { ...state, startDate: action.payload };
    case 'setEndDate':
      return { ...state, endDate: action.payload };
    case 'setSortDirection':
      return { ...state, sortDirection: action.payload };
    case 'setLoading':
      return { ...state, loading: action.payload };
    case 'setOrders':
      return { ...state, orders: action.payload };
    default:
      return state;
  }
}

