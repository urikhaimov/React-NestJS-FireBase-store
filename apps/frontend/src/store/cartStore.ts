import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '../types/firebase';

export type CartItem = Product & { quantity: number };

type CartState = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  hasItem?: (id: string) => boolean;
  _persistedAt?: number;
};

const EXPIRATION_MS = 1000 * 60 * 60; // 1 hour

// Zustand store with expiration logic
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => {
      // Setup live interval check
      if (typeof window !== 'undefined') {
        setInterval(() => {
          const savedAt = get()._persistedAt || 0;
          if (Date.now() - savedAt > EXPIRATION_MS && get().items.length > 0) {
            set({ items: [], _persistedAt: Date.now() });
            console.log('🕒 Cart auto-cleared after expiration');
          }
        }, 60_000); // Check every 60 seconds
      }

      return {
        items: [],
        addToCart: (item) => {
          const existing = get().items.find((i) => i.id === item.id);
          if (existing) {
            set({
              items: get().items.map((i) =>
                i.id === item.id
                  ? {
                      ...i,
                      quantity: Math.min(i.quantity + (item.quantity || 1), i.stock),
                    }
                  : i
              ),
              _persistedAt: Date.now(),
            });
          } else {
            set({
              items: [...get().items, { ...item, quantity: item.quantity || 1 }],
              _persistedAt: Date.now(),
            });
          }
        },
        removeFromCart: (id) => {
          set({ items: get().items.filter((item) => item.id !== id), _persistedAt: Date.now() });
        },
        updateQuantity: (id, quantity) => {
          const items = get().items.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.min(quantity, item.stock) }
              : item
          );
          set({ items, _persistedAt: Date.now() });
        },
        clearCart: () => set({ items: [], _persistedAt: Date.now() }),
        hasItem: (id) => get().items.some((item) => item.id === id),
      };
    },
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => sessionStorage),
      version: 1,
      migrate: (persistedState, version) => {
        const now = Date.now();
        const savedAt = (persistedState as CartState)._persistedAt || 0;
        if (now - savedAt > EXPIRATION_MS) {
          return {
            items: [],
            _persistedAt: now,
          };
        }
        return persistedState as CartState;
      },
    }
  )
);
