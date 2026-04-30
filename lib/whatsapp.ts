import { CartItem } from '@/types'

export function buildWhatsAppURL(
  customerName: string,
  customerPhone: string,
  items: CartItem[],
  total: number
): string {
  // Bakery's number from env — wa.me opens a chat TO the bakery
  const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '').replace(/\D/g, '')

  const lines = items
    .map((item) => `• ${item.product.name} (${item.variantLabel}) x${item.qty} — $${item.price * item.qty}`)
    .join('\n')

  const message = [
    '🐼 *Nuevo Pedido PandaPan*',
    `👤 Nombre: ${customerName}`,
    `📱 Tel: ${customerPhone}`,
    '',
    '🛒 Detalle:',
    lines,
    '',
    `💰 Total: $${total}`,
  ].join('\n')

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
