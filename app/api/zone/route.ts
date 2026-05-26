import { NextRequest, NextResponse } from 'next/server'
import { detectZone, DELIVERY_DAYS } from '@/lib/zones'

// Nominatim (OpenStreetMap) — geocodificación 100% gratuita, sin API key
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address')

  if (!address || address.trim().length < 5) {
    return NextResponse.json({ error: 'Dirección inválida' }, { status: 400 })
  }

  try {
    const query = encodeURIComponent(`${address.trim()}, Córdoba, Argentina`)
    const res = await fetch(
      `${NOMINATIM_URL}?q=${query}&format=json&limit=1&countrycodes=ar&addressdetails=1`,
      {
        cache: 'no-store',
        headers: {
          // Nominatim requiere un User-Agent identificable
          'User-Agent': 'PandaPan/1.0 (panaderia artesanal cordoba)',
        },
      },
    )

    const data = await res.json()

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: 'No encontramos esa dirección. Verificá que sea correcta.' },
        { status: 404 },
      )
    }

    const lat = parseFloat(data[0].lat)
    const lng = parseFloat(data[0].lon)
    const formattedAddress = data[0].display_name

    const zone = detectZone(lat, lng)
    const days = DELIVERY_DAYS[zone]

    return NextResponse.json({ zone, days, lat, lng, formattedAddress })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
