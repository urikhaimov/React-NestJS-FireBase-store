import { create } from 'zustand';
import { Product } from '../types/firebase';
import { persist } from 'zustand/middleware';
export type CartItem = Product & { quantity: number };

type CartState = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};



export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
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
          });
        } else {
          set({
            items: [...get().items, { ...item, quantity: item.quantity || 1 }],
          });
        }
      },
      removeFromCart: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },
      updateQuantity: (id, quantity) => {
        const items = get().items.map((item) =>
          item.id === id
            ? { ...item, quantity: Math.min(quantity, item.stock) }
            : item
        );
        set({ items });
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage', // 🔑 Key used in localStorage
    }
  )
);
