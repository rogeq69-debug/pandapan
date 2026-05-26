'use server'

import { CartItem, Order } from '@/types'

export async function getUnits(): Promise<Record<string, { cantidad: number; medidas: string }>> {
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL
  if (!scriptUrl) return {}

  try {
    const res = await fetch(`${scriptUrl}?action=cantidades`, {
      redirect: 'follow',
      cache: 'no-store',
    })
    if (!res.ok) return {}
    const data = await res.json()
    return (data.units as Record<string, { cantidad: number; medidas: string }>) ?? {}
  } catch {
    return {}
  }
}

export async function getPrices(): Promise<Record<string, number>> {
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL
  if (!scriptUrl) return {}

  try {
    const res = await fetch(`${scriptUrl}?action=precios`, {
      redirect: 'follow',
      cache: 'no-store',
    })
    if (!res.ok) return {}
    const data = await res.json()
    return (data.prices as Record<string, number>) ?? {}
  } catch {
    return {}
  }
}

interface SaveOrderPayload {
  customerName: string
  customerPhone: string
  address: string
  deliveryTime: string
  deliveryType: 'pickup' | 'delivery'
  items: CartItem[]
  total: number
}

function buildProductsSummary(items: CartItem[]): string {
  return items
    .map((item) => `${item.product.name} (${item.variantLabel}) x${item.qty} — $${item.price * item.qty}`)
    .join('\n')
}

export async function saveOrder(payload: SaveOrderPayload): Promise<{ success: boolean; error?: string }> {
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL
  if (!scriptUrl) {
    return { success: false, error: 'GOOGLE_SCRIPT_URL no configurada' }
  }

  const order: Order = {
    id: `PP-${Date.now()}`,
    customerName: payload.customerName,
    customerPhone: payload.customerPhone,
    address: payload.address,
    deliveryTime: payload.deliveryTime,
    deliveryType: payload.deliveryType,
    items: payload.items,
    total: payload.total,
    createdAt: new Date().toISOString(),
  }

  const body = {
    id:          order.id,
    nombre:      order.customerName,
    telefono:    order.customerPhone,
    direccion:   order.address,
    horario:     order.deliveryTime,
    tipoEntrega: order.deliveryType === 'pickup' ? 'Retiro en fábrica' : 'Envío a domicilio',
    productos:   buildProductsSummary(order.items),
    total:       order.total,
  }

  try {
    await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(body),
      redirect: 'follow',
    })

    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error de red'
    return { success: false, error: message }
  }
}
