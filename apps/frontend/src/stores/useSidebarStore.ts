// src/stores/useSidebarStore.ts
import { create } from 'zustand';

interface SidebarState {
  mobileOpen: boolean;
  expanded: boolean;

  toggleMobileDrawer: () => void;
  closeMobileDrawer: () => void;
  setExpanded: (expanded: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  mobileOpen: false,
  expanded: true,

  toggleMobileDrawer: () =>
    set((state) => ({ mobileOpen: !state.mobileOpen })),

  closeMobileDrawer: () =>
    set({ mobileOpen: false }),

  setExpanded: (expanded) =>
    set({ expanded }),
}));
