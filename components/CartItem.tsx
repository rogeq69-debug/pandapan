'use client'

import Image from 'next/image'
import { CartItem as CartItemType } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { Minus, Plus, X } from 'lucide-react'

interface Props {
  item: CartItemType
}

export default function CartItem({ item }: Props) {
  const { updateQty, removeItem } = useCartStore()

  return (
    <div className="flex items-center gap-3 py-3">
      {/* Miniatura */}
      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-accent">
        <Image
          src={item.product.imageUrl}
          alt={item.product.name}
          fill
          sizes="56px"
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">
          {item.product.name}
        </p>
        <p className="truncate text-xs text-muted-foreground">{item.variantLabel}</p>
        <p className="mt-0.5 text-sm font-bold text-primary">
          {item.price > 0
            ? `$${(item.price * item.qty).toLocaleString('es-AR')}`
            : 'Consultar'}
        </p>
      </div>

      {/* Controles de cantidad */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => updateQty(item.product.id, item.variantLabel, -1)}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-foreground transition active:scale-90"
          aria-label="Restar"
        >
          <Minus className="h-3 w-3" />
        </button>
        <span className="w-6 text-center text-sm font-bold">{item.qty}</span>
        <button
          onClick={() => updateQty(item.product.id, item.variantLabel, 1)}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white transition active:scale-90"
          aria-label="Sumar"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>

      {/* Eliminar */}
      <button
        onClick={() => removeItem(item.product.id, item.variantLabel)}
        className="ml-1 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition hover:text-destructive active:scale-90"
        aria-label="Eliminar"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
