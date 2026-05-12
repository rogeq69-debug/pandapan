'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { saveOrder } from '@/app/actions'
import { buildWhatsAppURL } from '@/lib/whatsapp'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

const MINIMUM_FREE_DELIVERY = 50000
const SHIPPING_ESTIMATE = '$9.000–$10.000'

export default function CheckoutForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('delivery')
  const [address, setAddress] = useState('')
  const [deliveryTime, setDeliveryTime] = useState('')
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
    const cleanPhone = phone.replace(/\D/g, '')
    if (!/^\d{8,10}$/.test(cleanPhone)) {
      setError('Ingresá tu número sin 0 ni 15. Ej: 3511234567')
      return
    }
    if (deliveryType === 'delivery' && address.trim().length < 5) {
      setError('Ingresá tu dirección de entrega.')
      return
    }
    if (deliveryTime.trim().length < 2) {
      setError('Ingresá el horario de entrega preferido.')
      return
    }

    const fullPhone = `549${cleanPhone}`

    setLoading(true)
    try {
      const result = await saveOrder({
        customerName: name.trim(),
        customerPhone: cleanPhone,
        address: deliveryType === 'delivery' ? address.trim() : 'Retiro en fábrica',
        deliveryTime: deliveryTime.trim(),
        deliveryType,
        items,
        total,
      })

      if (!result.success) {
        setError(result.error ?? 'Error al registrar el pedido. Intentá de nuevo.')
        return
      }

      const url = buildWhatsAppURL(
        name.trim(),
        fullPhone,
        deliveryType === 'delivery' ? address.trim() : 'Retiro en fábrica',
        deliveryTime.trim(),
        deliveryType,
        items,
        total,
      )
      clearCart()
      window.location.href = url
    } catch {
      setError('Error de conexión. Verificá tu internet e intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
      {/* Nombre */}
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

      {/* Teléfono */}
      <div className="space-y-1.5">
        <Label htmlFor="checkout-phone" className="text-sm font-semibold">
          Celular (sin 0 ni 15)
        </Label>
        <Input
          id="checkout-phone"
          type="tel"
          placeholder="Ej: 3511234567"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, ''))}
          className="h-12 rounded-xl border-border bg-background text-base"
          required
          autoComplete="tel"
          inputMode="numeric"
        />
      </div>

      {/* Tipo de entrega */}
      <div className="space-y-1.5">
        <Label className="text-sm font-semibold">Tipo de entrega</Label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setDeliveryType('pickup')}
            className={`rounded-xl border-2 px-3 py-3 text-sm font-medium transition-all ${
              deliveryType === 'pickup'
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-background text-foreground'
            }`}
          >
            🏭 Retiro en fábrica
          </button>
          <button
            type="button"
            onClick={() => setDeliveryType('delivery')}
            className={`rounded-xl border-2 px-3 py-3 text-sm font-medium transition-all ${
              deliveryType === 'delivery'
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-background text-foreground'
            }`}
          >
            🚚 Envío a domicilio
          </button>
        </div>
      </div>

      {/* Aviso pedido mínimo para envío gratis */}
      {deliveryType === 'delivery' && total > 0 && total < MINIMUM_FREE_DELIVERY && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          ⚠️ Pedido mínimo para envío sin cargo: $50.000. Tu pedido tiene costo de envío adicional (estimado {SHIPPING_ESTIMATE} según zona).
        </div>
      )}

      {/* Dirección (solo si envío) */}
      {deliveryType === 'delivery' && (
        <div className="space-y-1.5">
          <Label htmlFor="checkout-address" className="text-sm font-semibold">
            Dirección de entrega
          </Label>
          <Input
            id="checkout-address"
            placeholder="Ej: Av. Colón 1234, Córdoba"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="h-12 rounded-xl border-border bg-background text-base"
            required
            autoComplete="street-address"
          />
        </div>
      )}

      {/* Horario preferido */}
      <div className="space-y-1.5">
        <Label htmlFor="checkout-time" className="text-sm font-semibold">
          Horario preferido
        </Label>
        <Input
          id="checkout-time"
          placeholder="Ej: Martes y jueves por la tarde"
          value={deliveryTime}
          onChange={(e) => setDeliveryTime(e.target.value)}
          className="h-12 rounded-xl border-border bg-background text-base"
          required
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
