'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingBag } from 'lucide-react'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const [added, setAdded] = useState(false)
  const { addItem, openCart } = useCartStore()

  const handleAdd = () => {
    addItem(product, selectedVariant.label, selectedVariant.price)
    openCart()
    setAdded(true)
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
        <p className="mt-auto text-sm font-medium text-muted-foreground">
          {selectedVariant.price > 0
            ? `$${selectedVariant.price.toLocaleString('es-AR')}`
            : 'Consultar precio'}
        </p>

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
          {added ? '¡Agregado!' : 'Agregar al carrito'}
        </Button>
      </div>
    </div>
  )
}
