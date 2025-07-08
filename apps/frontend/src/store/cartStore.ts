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
  hasItem: (id: string) => boolean;
  _persistedAt?: number;
};

const EXPIRATION_MS = 1000 * 60 * 60; // 1 hour

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => {
      // Expiration auto-clear interval
      if (typeof window !== 'undefined') {
        setInterval(() => {
          const savedAt = get()._persistedAt ?? 0;
          const now = Date.now();
          const expired = now - savedAt > EXPIRATION_MS;

          if (expired && get().items.length > 0) {
            set({ items: [], _persistedAt: now });
            console.log('🕒 Cart auto-cleared after 1 hour of inactivity');
          }
        }, 60_000); // Every 60 seconds
      }

      return {
        items: [],

        addToCart: (item) => {
          const now = Date.now();
          const existing = get().items.find((i) => i.id === item.id);

          if (existing) {
            set({
              items: get().items.map((i) =>
                i.id === item.id
                  ? {
                      ...i,
                      quantity: Math.min(i.quantity + (item.quantity ?? 1), i.stock),
                    }
                  : i
              ),
              _persistedAt: now,
            });
          } else {
            set({
              items: [...get().items, { ...item, quantity: item.quantity ?? 1 }],
              _persistedAt: now,
            });
          }
        },

        removeFromCart: (id) => {
          set({
            items: get().items.filter((item) => item.id !== id),
            _persistedAt: Date.now(),
          });
        },

        updateQuantity: (id, quantity) => {
          set({
            items: get().items.map((item) =>
              item.id === id
                ? { ...item, quantity: Math.min(quantity, item.stock) }
                : item
            ),
            _persistedAt: Date.now(),
          });
        },

        clearCart: () => {
          set({ items: [], _persistedAt: Date.now() });
        },

        hasItem: (id) => {
          return get().items.some((item) => item.id === id);
        },
      };
    },
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => sessionStorage),
      version: 1,
      migrate: (persistedState, version) => {
        const now = Date.now();
        const savedAt = (persistedState as CartState)._persistedAt ?? 0;
        const expired = now - savedAt > EXPIRATION_MS;

        if (expired) {
          console.log('🕒 Cart expired during sessionStorage migration');
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
