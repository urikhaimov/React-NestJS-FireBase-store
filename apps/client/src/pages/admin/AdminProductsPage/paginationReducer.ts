export type PaginationState = {
  lastDoc: any;
  loading: boolean;
  hasMore: boolean;
};

export type PaginationAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_LAST_DOC'; payload: any }
  | { type: 'SET_HAS_MORE'; payload: boolean }
  | { type: 'RESET_PAGINATION' };

export const initialPaginationState: PaginationState = {
  lastDoc: null,
  loading: false,
  hasMore: true,
};

export function paginationReducer(
  state: PaginationState,
  action: PaginationAction
): PaginationState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_LAST_DOC':
      return { ...state, lastDoc: action.payload };
    case 'SET_HAS_MORE':
      return { ...state, hasMore: action.payload };
    case 'RESET_PAGINATION':
      return initialPaginationState;
    default:
      return state;
  }
}
