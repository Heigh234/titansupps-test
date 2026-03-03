import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string; // Ej: Sabor Vainilla, 5 lbs
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  
  // Acciones
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string, variant?: string) => void;
  updateQuantity: (id: string, variant: string | undefined, quantity: number) => void;
  toggleCart: (open?: boolean) => void;
  clearCart: () => void;
  
  // Getters computados
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.id === newItem.id && item.variant === newItem.variant
          );

          if (existingItemIndex > -1) {
            // Si ya existe la misma variante, sumamos la cantidad
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += (newItem.quantity || 1);
            return { items: updatedItems, isOpen: true }; // Abre el drawer al añadir
          }

          // Si es nuevo, lo añadimos
          return { 
            items: [...state.items, { ...newItem, quantity: newItem.quantity || 1 }],
            isOpen: true // Abrimos el drawer para confirmación visual (UX premium)
          };
        });
      },

      removeItem: (id, variant) => {
        set((state) => ({
          items: state.items.filter((item) => !(item.id === id && item.variant === variant)),
        }));
      },

      updateQuantity: (id, variant, quantity) => {
        set((state) => ({
          items: quantity <= 0 
            ? state.items.filter((item) => !(item.id === id && item.variant === variant))
            : state.items.map((item) => 
                (item.id === id && item.variant === variant) 
                  ? { ...item, quantity } 
                  : item
              ),
        }));
      },

      toggleCart: (open) => set((state) => ({ isOpen: open !== undefined ? open : !state.isOpen })),
      clearCart: () => set({ items: [] }),

      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      getTotalPrice: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
    }),
    {
      name: 'titan-cart-storage', // Key en localStorage
      // Excluimos 'isOpen' para que el carrito no aparezca abierto al recargar la página
      partialize: (state) => ({ items: state.items }), 
    }
  )
);