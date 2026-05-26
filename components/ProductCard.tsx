'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Minus, Plus, ShoppingBag } from 'lucide-react'

interface Props {
  product: Product
  prices: Record<string, number>
  units: Record<string, { cantidad: number; medidas: string }>
}

export default function ProductCard({ product, prices, units }: Props) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem, openCart } = useCartStore()

  const resolvePrice = (label: string) =>
    prices[`${product.id}|${label}`] ?? 0

  const resolveUnit = (label: string): string => {
    const u = units[`${product.id}|${label}`]
    if (!u) return 'c/u'
    return u.cantidad > 1 ? `x${u.cantidad} ${u.medidas}` : u.medidas
  }

  const handleAdd = () => {
    addItem(product, selectedVariant.label, resolvePrice(selectedVariant.label), qty)
    openCart()
    setAdded(true)
    setQty(1)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      {/* Imagen */}
      <div className="relative aspect-video w-full overflow-hidden bg-accent">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Contenido */}
      <div className="flex flex-grow flex-col gap-2 p-4">
        <h3
          className="text-lg font-bold leading-tight text-foreground"
          style={{ fontFamily: 'var(--font-playfair, serif)' }}
        >
          {product.name}
        </h3>

        {/* Selector de variante */}
        {product.variants.length > 1 ? (
          <select
            value={selectedVariant.label}
            onChange={(e) => {
              const v = product.variants.find((v) => v.label === e.target.value)
              if (v) setSelectedVariant(v)
            }}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {product.variants.map((v) => (
              <option key={v.label} value={v.label}>
                {v.label}
              </option>
            ))}
          </select>
        ) : (
          <Badge variant="secondary" className="w-fit text-xs">
            {product.variants[0].label}
          </Badge>
        )}

        {/* Precio */}
        <p className="text-sm font-medium text-muted-foreground">
          {resolvePrice(selectedVariant.label) > 0
            ? `$${resolvePrice(selectedVariant.label).toLocaleString('es-AR')} ${resolveUnit(selectedVariant.label)}`
            : 'Consultar precio'}
        </p>

        {/* Selector de unidades */}
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Unidades</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-foreground transition active:scale-90"
              aria-label="Restar unidad"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-6 text-center text-sm font-bold">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white transition active:scale-90"
              aria-label="Sumar unidad"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          {resolvePrice(selectedVariant.label) > 0 && qty > 1 && (
            <span className="ml-auto text-sm font-bold text-primary">
              ${(resolvePrice(selectedVariant.label) * qty).toLocaleString('es-AR')}
            </span>
          )}
        </div>

        {/* Botón agregar */}
        <Button
          onClick={handleAdd}
          className={`mt-2 w-full gap-2 rounded-xl font-semibold transition-all active:scale-95 ${
            added
              ? 'bg-green-600 hover:bg-green-600'
              : 'bg-primary hover:bg-[#C94420]'
          } text-white`}
        >
          <ShoppingBag className="h-4 w-4" />
          {added ? '¡Agregado!' : `Agregar${qty > 1 ? ` ${qty}` : ''} al carrito`}
        </Button>
      </div>
    </div>
  )
}
