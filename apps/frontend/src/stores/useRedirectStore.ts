import { create } from 'zustand';

interface RedirectState {
  redirectTo: string | null;
  message: string | null;
  setRedirectTo: (path: string | null) => void;
  setMessage: (msg: string | null) => void;
}

export const useRedirectStore = create<RedirectState>((set) => ({
  redirectTo: null,
  message: null,
  setRedirectTo: (path) => set({ redirectTo: path }),
  setMessage: (msg) => set({ message: msg }),
}));
