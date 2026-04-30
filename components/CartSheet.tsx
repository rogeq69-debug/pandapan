'use client'

import { useCartStore } from '@/store/cartStore'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import CartItemComponent from '@/components/CartItem'
import CheckoutForm from '@/components/CheckoutForm'
import { ShoppingBag } from 'lucide-react'

export default function CartSheet() {
  const { items, isOpen, toggleCart, total, count } = useCartStore()

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={toggleCart}
        aria-label="Abrir carrito"
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-2xl transition-transform active:scale-90 hover:scale-105"
      >
        <ShoppingBag className="h-7 w-7" />
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#2D1B0E] text-xs font-bold text-white">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>

      {/* Sheet lateral */}
      <Sheet open={isOpen} onOpenChange={toggleCart}>
        <SheetContent
          side="right"
          className="flex w-full flex-col gap-0 bg-background p-0 sm:max-w-md"
        >
          {/* Header */}
          <SheetHeader className="border-b border-border px-5 py-4">
            <SheetTitle
              className="text-xl font-bold text-foreground"
              style={{ fontFamily: 'var(--font-playfair, serif)' }}
            >
              Tu Pedido 🐼
            </SheetTitle>
          </SheetHeader>

          {items.length === 0 ? (
            /* Carrito vacío */
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 text-center">
              <span className="text-6xl">🥐</span>
              <p className="text-lg font-semibold text-foreground">
                Tu carrito está vacío
              </p>
              <p className="text-sm text-muted-foreground">
                Elegí tus panes favoritos del catálogo
              </p>
            </div>
          ) : (
            <>
              {/* Lista de items */}
              <div className="flex-1 overflow-y-auto px-5">
                <div className="divide-y divide-border">
                  {items.map((item) => (
                    <CartItemComponent
                      key={`${item.product.id}-${item.variantLabel}`}
                      item={item}
                    />
                  ))}
                </div>
              </div>

              {/* Total + Checkout */}
              <div className="border-t border-border bg-card px-5 pb-6 pt-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-base font-semibold text-foreground">Total</span>
                  <span className="text-xl font-bold text-primary">
                    {total > 0
                      ? `$${total.toLocaleString('es-AR')}`
                      : 'A confirmar'}
                  </span>
                </div>
                <Separator className="mb-4" />
                <CheckoutForm />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
