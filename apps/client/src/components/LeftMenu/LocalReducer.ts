// src/components/LocalReducer.ts

export interface SidebarState {
  expanded: boolean;
  mobileOpen: boolean;
  cartOpen: boolean;
  anchorEl: HTMLElement | null;
}

export type SidebarAction =
  | { type: 'TOGGLE_EXPANDED' }
  | { type: 'SET_EXPANDED'; payload: boolean }
  | { type: 'TOGGLE_MOBILE' }
  | { type: 'CLOSE_MOBILE' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'SET_ANCHOR_EL'; payload: HTMLElement | null };

export const initialSidebarState: SidebarState = {
  expanded: true,
  mobileOpen: false,
  cartOpen: false,
  anchorEl: null,
};

export function sidebarReducer(state: SidebarState, action: SidebarAction): SidebarState {
  switch (action.type) {
    case 'TOGGLE_EXPANDED':
      return { ...state, expanded: !state.expanded };
    case 'SET_EXPANDED':
      return { ...state, expanded: action.payload };
    case 'TOGGLE_MOBILE':
      return { ...state, mobileOpen: !state.mobileOpen };
    case 'CLOSE_MOBILE':
      return { ...state, mobileOpen: false };
    case 'OPEN_CART':
      return { ...state, cartOpen: true };
    case 'CLOSE_CART':
      return { ...state, cartOpen: false };
    case 'SET_ANCHOR_EL':
      return { ...state, anchorEl: action.payload };
    default:
      return state;
  }
}
