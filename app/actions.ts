'use server'

import { CartItem, Order } from '@/types'

interface SaveOrderPayload {
  customerName: string
  customerPhone: string
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
    items: payload.items,
    total: payload.total,
    createdAt: new Date().toISOString(),
  }

  const body = {
    id: order.id,
    cliente: `${order.customerName} | ${order.customerPhone}`,
    productos: buildProductsSummary(order.items),
    total: order.total,
  }

  try {
    // Google Apps Script redirects POST+JSON to GET — send as form-encoded instead
    const formBody = new URLSearchParams({
      id:        body.id,
      cliente:   body.cliente,
      productos: body.productos,
      total:     String(body.total),
    })

    await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody.toString(),
      redirect: 'follow',
    })

    // Apps Script always returns 200 after redirect — treat any completed fetch as success
    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error de red'
    return { success: false, error: message }
  }
}
