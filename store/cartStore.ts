import { create } from 'zustand'
import { CartItem, Product } from '@/types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, variantLabel: string, price: number) => void
  removeItem: (productId: string, variantLabel: string) => void
  updateQty: (productId: string, variantLabel: string, delta: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  total: number
  count: number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (product, variantLabel, price) => {
    set((state) => {
      const existing = state.items.find(
        (i) => i.product.id === product.id && i.variantLabel === variantLabel
      )
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id && i.variantLabel === variantLabel
              ? { ...i, qty: i.qty + 1 }
              : i
          ),
        }
      }
      return { items: [...state.items, { product, variantLabel, price, qty: 1 }] }
    })
  },

  removeItem: (productId, variantLabel) => {
    set((state) => ({
      items: state.items.filter(
        (i) => !(i.product.id === productId && i.variantLabel === variantLabel)
      ),
    }))
  },

  updateQty: (productId, variantLabel, delta) => {
    set((state) => ({
      items: state.items
        .map((i) =>
          i.product.id === productId && i.variantLabel === variantLabel
            ? { ...i, qty: i.qty + delta }
            : i
        )
        .filter((i) => i.qty > 0),
    }))
  },

  clearCart: () => set({ items: [], isOpen: false }),

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  openCart: () => set({ isOpen: true }),

  get total() {
    return get().items.reduce((sum, i) => sum + i.price * i.qty, 0)
  },

  get count() {
    return get().items.reduce((sum, i) => sum + i.qty, 0)
  },
}))
