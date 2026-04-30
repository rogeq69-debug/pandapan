@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto

**PandaPan** — Plataforma web para panadería artesanal. Catálogo de productos, carrito de compras y generación de pedidos vía WhatsApp.

## Stack Tecnológico

- **Framework**: Next.js 15 con App Router y TypeScript estricto
- **Estilos**: Tailwind CSS + Shadcn UI (componentes base)
- **Estado global**: Zustand (exclusivamente para el carrito de compras)
- **Base de datos**: Google Apps Script desplegado como Web App — la Server Action usa `fetch` POST nativo, sin librerías externas
- **Pedidos**: Integración mediante enlaces `wa.me` con mensajes pre-formateados en URL encoding

## Branding

- **Color primario**: `#E8532A` (terracota/naranja quemado) — usado en headers, botones CTA y acentos
- **Color fondo**: `#FFF5E1` (crema) — fondo de página y cards
- **Color texto**: `#1A1A1A` negro, con acento en `#E8532A`
- Tipografía: `Inter` (cuerpo) + `Playfair Display` (Serif para headings)
- El logo disponible es `public/branding/logo.png`
- **Mobile-first obligatorio**: todos los layouts deben funcionar perfectamente en 375px antes de adaptar a desktop
- Imágenes de productos con relación de aspecto fija (4:3), siempre con `next/image`

## Catálogo de Productos

Productos con sus variantes (precios se gestionan en Google Sheets):

| slug | Nombre | Variantes |
|------|--------|-----------|
| `pan-hamburguesa` | Pan de Papa de Hamburguesa | Burger grande (12 cm), Burger chica (10 cm) |
| `pan-lomo` | Pan de Lomo | 20 cm |
| `pan-chori` | Pan de Chori | 20 cm |
| `ciabatta` | Ciabatta | — |
| `pan-pancho` | Pan de Pancho | Super pancho (24 cm), Pancho regular (12 cm) |
| `bollito-blanco` | Pan Bollito Blanco | — |
| `bollito-salvado` | Pan Bollito Salvado | — |
| `molde-blanco` | Pan de Molde Blanco | 450 gr |
| `molde-semillas` | Pan de Molde con Semillas | 450 gr |
| `medialunas` | Medialunas Dulces | — |
| `criollos` | Criollos | — |

Las imágenes del catálogo están en `public/catalogo/`.

## Arquitectura

```
pandapan/
├── app/
│   ├── layout.tsx              # Fuentes, providers, metadata
│   ├── page.tsx                # Server Component — ensambla Hero + CatalogSection
│   ├── globals.css             # Variables CSS con tokens de color PandaPan
│   └── actions/
│       ├── getProducts.ts      # Lee productos desde Google Sheets
│       └── saveOrder.ts        # Graba pedido en Google Sheets
├── components/
│   ├── ui/                     # Generados por Shadcn (no editar manualmente)
│   ├── Hero.tsx
│   ├── CatalogSection.tsx      # Tabs de categorías + grid de ProductCard
│   ├── ProductCard.tsx
│   ├── CartSheet.tsx           # Sheet lateral Shadcn (carrito)
│   ├── CartItem.tsx
│   └── CheckoutForm.tsx
├── store/
│   └── cartStore.ts            # Zustand: items, addItem, removeItem, clearCart, total
├── lib/
│   ├── sheets.ts               # Cliente googleapis autenticado (solo server)
│   └── whatsapp.ts             # buildWhatsAppURL(order, items)
├── types/
│   └── index.ts                # Product, CartItem, Order
└── public/
    ├── branding/logo.png
    └── catalogo/               # Imágenes de productos
```

## Reglas de Desarrollo

- **Server Actions**: toda lectura/escritura a Google Sheets ocurre en `app/actions/`. Los componentes cliente nunca llaman directamente a la Sheets API.
- **Zustand**: el store del carrito es el único estado global. No usar Context API para el carrito.
- **WhatsApp**: los mensajes de pedido se construyen con `buildWhatsAppURL()` en `lib/whatsapp.ts` y se abren con `window.open()`. Número en `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- **Google Apps Script**: la URL del Web App va en `GOOGLE_SCRIPT_URL` (variable server-side, nunca exponer al cliente). El Apps Script recibe `{ id, cliente, productos, total }` vía POST y escribe en Google Sheets.
- **Flujo de pedido**: `CheckoutForm` llama `saveOrder()` → fetch POST al Apps Script → si OK, `buildWhatsAppURL()` + `window.open()` → `clearCart()`.

## Variables de Entorno

```
GOOGLE_SCRIPT_URL=             # URL secreta del Google Apps Script Web App
NEXT_PUBLIC_WHATSAPP_NUMBER=   # formato: 521XXXXXXXXXX (sin +)
```

## Comandos

```bash
npm run dev          # Servidor de desarrollo en localhost:3000
npm run build        # Build de producción
npm run lint         # ESLint
npx tsc --noEmit     # Type check
```
