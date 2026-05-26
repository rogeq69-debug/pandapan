'use client'

import { useState, useEffect, useRef } from 'react'
import { useCartStore } from '@/store/cartStore'
import { saveOrder } from '@/app/actions'
import { buildWhatsAppURL } from '@/lib/whatsapp'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import type { Zone } from '@/lib/zones'

const MINIMUM_FREE_DELIVERY = 50000
const SHIPPING_ESTIMATE = '$9.000–$10.000'
const PICKUP_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']

export default function CheckoutForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('delivery')
  const [address, setAddress] = useState('')
  const [deliveryTime, setDeliveryTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Zone detection
  const [availableDays, setAvailableDays] = useState<string[]>([])
  const [zoneLoading, setZoneLoading] = useState(false)
  const [detectedZone, setDetectedZone] = useState<Zone | null>(null)
  const [zoneError, setZoneError] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { items, total, clearCart } = useCartStore()

  // Fetch zone from API
  const fetchZone = async (addr: string) => {
    setZoneLoading(true)
    setZoneError('')
    setDetectedZone(null)
    setAvailableDays([])
    setDeliveryTime('')
    try {
      const res = await fetch(`/api/zone?address=${encodeURIComponent(addr)}`)
      const data = await res.json()
      if (data.days) {
        setAvailableDays(data.days)
        setDetectedZone(data.zone as Zone)
      } else {
        setZoneError(data.error ?? 'No pudimos detectar la zona. Verificá la dirección.')
      }
    } catch {
      setZoneError('Error de conexión al detectar la zona.')
    } finally {
      setZoneLoading(false)
    }
  }

  // When delivery type changes, reset days
  useEffect(() => {
    setDeliveryTime('')
    setDetectedZone(null)
    setZoneError('')
    if (deliveryType === 'pickup') {
      setAvailableDays(PICKUP_DAYS)
    } else {
      setAvailableDays([])
      // Re-check if there's already an address
      if (address.trim().length >= 5) fetchZone(address)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryType])

  // Debounce address changes to detect zone
  useEffect(() => {
    if (deliveryType !== 'delivery') return
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (address.trim().length >= 5) {
      debounceRef.current = setTimeout(() => fetchZone(address), 700)
    } else {
      setAvailableDays([])
      setDetectedZone(null)
      setZoneError('')
      setDeliveryTime('')
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (name.trim().length < 2) {
      setError('Ingresá el nombre del local o comercio.')
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
    if (!deliveryTime) {
      setError('Elegí el día de entrega.')
      return
    }

    const fullPhone = `549${cleanPhone}`

    setLoading(true)
    try {
      const result = await saveOrder({
        customerName: name.trim(),
        customerPhone: cleanPhone,
        address: deliveryType === 'delivery' ? address.trim() : 'Retiro en fábrica',
        deliveryTime: deliveryTime,
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
        deliveryTime,
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

  const zoneBadge =
    detectedZone === 'zona1'
      ? '📍 Zona 1 — entregas lunes, miércoles y viernes'
      : detectedZone === 'zona2'
        ? '📍 Zona 2 — entregas martes y jueves'
        : null

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
      {/* Nombre */}
      <div className="space-y-1.5">
        <Label htmlFor="checkout-name" className="text-sm font-semibold">
          Nombre del local / comercio
        </Label>
        <Input
          id="checkout-name"
          placeholder="Ej: Restaurante El Rancho"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-12 rounded-xl border-border bg-background text-base"
          required
          minLength={2}
          autoComplete="organization"
        />
      </div>

      {/* Teléfono */}
      <div className="space-y-1.5">
        <Label htmlFor="checkout-phone" className="text-sm font-semibold">
          Celular del responsable (sin 0 ni 15)
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

      {/* Día de entrega */}
      <div className="space-y-1.5">
        <Label htmlFor="checkout-day" className="text-sm font-semibold">
          Día de entrega
        </Label>

        {/* Detectando zona... */}
        {zoneLoading && (
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            Detectando zona según tu dirección…
          </div>
        )}

        {/* Badge de zona detectada */}
        {zoneBadge && !zoneLoading && (
          <p className="text-xs font-medium text-muted-foreground">{zoneBadge}</p>
        )}

        {/* Dropdown de días */}
        {!zoneLoading && availableDays.length > 0 && (
          <select
            id="checkout-day"
            value={deliveryTime}
            onChange={(e) => setDeliveryTime(e.target.value)}
            required
            className="h-12 w-full rounded-xl border border-border bg-background px-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Elegí un día</option>
            {availableDays.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        )}

        {/* Mensaje si delivery sin dirección todavía */}
        {deliveryType === 'delivery' && !zoneLoading && availableDays.length === 0 && !zoneError && (
          <p className="text-sm text-muted-foreground">
            Ingresá tu dirección para ver los días disponibles en tu zona.
          </p>
        )}

        {/* Error de zona */}
        {zoneError && !zoneLoading && (
          <p className="text-sm text-destructive">{zoneError}</p>
        )}
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
