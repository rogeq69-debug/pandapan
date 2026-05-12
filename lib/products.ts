import { Product } from '@/types'

export const products: Product[] = [
  // ── Panes ──────────────────────────────────────────────
  {
    id: 'pan-hamburguesa',
    name: 'Pan de Papa de Hamburguesa',
    slug: 'pan-hamburguesa',
    category: 'Panes',
    variants: [
      { label: 'Burger grande (12 cm)', price: 0 },
      { label: 'Burger chica (10 cm)', price: 0 },
    ],
    imageUrl: '/catalogo/pan-hamburguesa.jpg',
    available: true,
  },
  {
    id: 'pan-lomo',
    name: 'Pan de Lomo',
    slug: 'pan-lomo',
    category: 'Panes',
    variants: [{ label: '20 cm', price: 0 }],
    imageUrl: '/catalogo/pan-lomo.jpg',
    available: true,
  },
  {
    id: 'pan-chori',
    name: 'Pan de Chori',
    slug: 'pan-chori',
    category: 'Panes',
    variants: [{ label: '20 cm', price: 0 }],
    imageUrl: '/catalogo/pan-chori.jpg',
    available: true,
  },
  {
    id: 'ciabatta',
    name: 'Ciabatta',
    slug: 'ciabatta',
    category: 'Panes',
    variants: [{ label: 'Unidad', price: 0 }],
    imageUrl: '/catalogo/ciabatta.jpg',
    available: true,
  },
  {
    id: 'pan-pancho',
    name: 'Pan de Pancho',
    slug: 'pan-pancho',
    category: 'Panes',
    variants: [
      { label: 'Super pancho (24 cm)', price: 0 },
      { label: 'Pancho regular (12 cm)', price: 0 },
    ],
    imageUrl: '/catalogo/pan-pancho.jpg',
    available: true,
  },
  {
    id: 'bollito-blanco',
    name: 'Pan Bollito Blanco',
    slug: 'bollito-blanco',
    category: 'Panes',
    variants: [{ label: 'Unidad', price: 0 }],
    imageUrl: '/catalogo/bollito-blanco.jpg',
    available: true,
  },
  {
    id: 'bollito-salvado',
    name: 'Pan Bollito Salvado',
    slug: 'bollito-salvado',
    category: 'Panes',
    variants: [{ label: 'Unidad', price: 0 }],
    imageUrl: '/catalogo/bollito-salvado.jpg',
    available: true,
  },
  {
    id: 'molde-blanco',
    name: 'Pan de Molde Blanco',
    slug: 'molde-blanco',
    category: 'Panes',
    variants: [{ label: '450 gr', price: 0 }],
    imageUrl: '/catalogo/molde-blanco.jpg',
    available: true,
  },
  {
    id: 'molde-semillas',
    name: 'Pan de Molde con Semillas',
    slug: 'molde-semillas',
    category: 'Panes',
    variants: [{ label: '450 gr', price: 0 }],
    imageUrl: '/catalogo/molde-semillas.jpg',
    available: true,
  },

]

export const categories = ['Panes'] as const

export function getByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category && p.available)
}
