'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { saveOrder } from '@/app/actions'
import { buildWhatsAppURL } from '@/lib/whatsapp'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

export default function CheckoutForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { items, total, clearCart } = useCartStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (name.trim().length < 2) {
      setError('Ingresá tu nombre completo.')
      return
    }
    if (!/^\d{7,15}$/.test(phone.replace(/\s/g, ''))) {
      setError('Ingresá un número de WhatsApp válido (solo dígitos).')
      return
    }

    setLoading(true)
    try {
      const result = await saveOrder({
        customerName: name.trim(),
        customerPhone: phone.trim(),
        items,
        total,
      })

      if (!result.success) {
        setError(result.error ?? 'Error al registrar el pedido. Intentá de nuevo.')
        return
      }

      const url = buildWhatsAppURL(name.trim(), phone.trim(), items, total)
      window.open(url, '_blank')
      clearCart()
    } catch {
      setError('Error de conexión. Verificá tu internet e intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
      <div className="space-y-1.5">
        <Label htmlFor="checkout-name" className="text-sm font-semibold">
          Tu nombre
        </Label>
        <Input
          id="checkout-name"
          placeholder="Ej: María García"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-12 rounded-xl border-border bg-background text-base"
          required
          minLength={2}
          autoComplete="name"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="checkout-phone" className="text-sm font-semibold">
          WhatsApp (sin +, sin espacios)
        </Label>
        <Input
          id="checkout-phone"
          type="tel"
          placeholder="Ej: 5491112345678"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/[^\d\s]/g, ''))}
          className="h-12 rounded-xl border-border bg-background text-base"
          required
          autoComplete="tel"
          inputMode="numeric"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={loading || items.length === 0}
        className="h-14 w-full gap-2 rounded-xl bg-primary text-base font-bold text-white hover:bg-[#C94420] active:scale-[0.98] disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Enviando pedido…
          </>
        ) : (
          '🐼 Confirmar y enviar por WhatsApp'
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Te redirigiremos a WhatsApp para confirmar tu pedido con la panadería.
      </p>
    </form>
  )
}
