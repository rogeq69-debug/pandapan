export interface ProductVariant {
  label: string
  price: number
}

export interface Product {
  id: string
  name: string
  slug: string
  category: 'Panes' | 'Facturas' | 'Tortas'
  variants: ProductVariant[]
  imageUrl: string
  available: boolean
}

export interface CartItem {
  product: Product
  variantLabel: string
  price: number
  qty: number
}

export interface Order {
  id: string
  customerName: string
  customerPhone: string
  items: CartItem[]
  total: number
  createdAt: string
}
