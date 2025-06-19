import { create } from 'zustand';

interface AdminState {
  role: 'admin' | 'user' | null;
  loading: boolean;
  setRole: (role: 'admin' | 'user' | null) => void;
  setLoading: (loading: boolean) => void;
  isAdmin: boolean;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  role: null,
  loading: true,

  setRole: (role) => set({ role }),
  setLoading: (loading) => set({ loading }),

  get isAdmin() {
    return get().role === 'admin';
  },
}));
