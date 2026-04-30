import { create } from 'zustand'
import { CartItem, Product } from '@/types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  total: number
  count: number
  addItem: (product: Product, variantLabel: string, price: number) => void
  removeItem: (productId: string, variantLabel: string) => void
  updateQty: (productId: string, variantLabel: string, delta: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
}

function sumTotal(items: CartItem[]) {
  return items.reduce((s, i) => s + i.price * i.qty, 0)
}

function sumCount(items: CartItem[]) {
  return items.reduce((s, i) => s + i.qty, 0)
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  isOpen: false,
  total: 0,
  count: 0,

  addItem: (product, variantLabel, price) => {
    set((state) => {
      const existing = state.items.find(
        (i) => i.product.id === product.id && i.variantLabel === variantLabel
      )
      const newItems = existing
        ? state.items.map((i) =>
            i.product.id === product.id && i.variantLabel === variantLabel
              ? { ...i, qty: i.qty + 1 }
              : i
          )
        : [...state.items, { product, variantLabel, price, qty: 1 }]
      return { items: newItems, total: sumTotal(newItems), count: sumCount(newItems) }
    })
  },

  removeItem: (productId, variantLabel) => {
    set((state) => {
      const newItems = state.items.filter(
        (i) => !(i.product.id === productId && i.variantLabel === variantLabel)
      )
      return { items: newItems, total: sumTotal(newItems), count: sumCount(newItems) }
    })
  },

  updateQty: (productId, variantLabel, delta) => {
    set((state) => {
      const newItems = state.items
        .map((i) =>
          i.product.id === productId && i.variantLabel === variantLabel
            ? { ...i, qty: i.qty + delta }
            : i
        )
        .filter((i) => i.qty > 0)
      return { items: newItems, total: sumTotal(newItems), count: sumCount(newItems) }
    })
  },

  clearCart: () => set({ items: [], isOpen: false, total: 0, count: 0 }),

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  openCart: () => set({ isOpen: true }),
}))
