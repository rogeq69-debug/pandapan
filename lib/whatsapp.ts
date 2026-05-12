import { CartItem } from '@/types'

export function buildWhatsAppURL(
  customerName: string,
  customerPhone: string,
  address: string,
  deliveryTime: string,
  deliveryType: 'pickup' | 'delivery',
  items: CartItem[],
  total: number
): string {
  const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '').replace(/\D/g, '')

  const lines = items
    .map((item) => `• ${item.product.name} (${item.variantLabel}) x${item.qty} — $${(item.price * item.qty).toLocaleString('es-AR')}`)
    .join('\n')

  const entregaLine = deliveryType === 'pickup'
    ? '🏭 Entrega: Retiro en fábrica'
    : `🚚 Entrega: Envío a domicilio\n📍 Dirección: ${address}`

  const message = [
    '🐼 *Nuevo Pedido PandaPan*',
    `🏪 Local: ${customerName}`,
    `📱 Tel: ${customerPhone}`,
    entregaLine,
    `🕐 Horario preferido: ${deliveryTime}`,
    '',
    '🛒 Detalle:',
    lines,
    '',
    `💰 Total: $${total.toLocaleString('es-AR')}`,
  ].join('\n')

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
