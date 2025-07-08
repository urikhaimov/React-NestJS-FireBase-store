// src/pages/admin/AdminOrdersPage/LocalReducer.ts

export type Order = {
  id: string;
  userId: string;
  email?: string;        // ✅ Add this
  total?: number;        // ✅ Add this
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment: {
    method: string;
    status: 'paid' | 'unpaid';
    transactionId?: string;
  };
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  delivery: {
    provider?: string;
    trackingNumber?: string;
    eta?: string;
  };
  notes?: string;
  statusHistory?: Array<{
    status: string;
    timestamp: string;
    changedBy: string;
  }>;
  createdAt: string;
  updatedAt: string;
};

export interface FilterState {
  email: string;
  status: string;
  minTotal: number;
  maxTotal: number;
  startDate: Date | null;
  endDate: Date | null;
  sortDirection: 'asc' | 'desc';
  loading: boolean;
  orders: Order[];
  page: number;
  pageSize: number;
  searchTerm: string;
  selectedCategoryId: string;
  createdAfter: Date | null;
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
  page: 1,
  pageSize: 10,
  searchTerm: '',
  selectedCategoryId: '',
  createdAfter: null,
};

export type Action =
  | { type: 'setEmail'; payload: string }
  | { type: 'setStatus'; payload: string }
  | { type: 'setMinTotal'; payload: number }
  | { type: 'setMaxTotal'; payload: number }
  | { type: 'setStartDate'; payload: Date | null }
  | { type: 'setEndDate'; payload: Date | null }
  | { type: 'setSortDirection'; payload: 'asc' | 'desc' }
  | { type: 'setLoading'; payload: boolean }
  | { type: 'setOrders'; payload: Order[] }
  | { type: 'setPage'; payload: number }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_CATEGORY_FILTER'; payload: string }
  | { type: 'SET_CREATED_AFTER'; payload: Date | null }
  | { type: 'RESET_FILTERS' };

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
    case 'setPage':
      return { ...state, page: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_CATEGORY_FILTER':
      return { ...state, selectedCategoryId: action.payload };
    case 'SET_CREATED_AFTER':
      return { ...state, createdAfter: action.payload };
    case 'RESET_FILTERS':
      return {
        ...state,
        searchTerm: '',
        selectedCategoryId: '',
        createdAfter: null,
        email: '',
        status: 'all',
        minTotal: 0,
        maxTotal: 0,
        startDate: null,
        endDate: null,
        sortDirection: 'desc',
      };
    default:
      return state;
  }
}