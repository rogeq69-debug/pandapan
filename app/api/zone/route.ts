import { NextRequest, NextResponse } from 'next/server'
import { detectZone, DELIVERY_DAYS } from '@/lib/zones'

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address')

  if (!address || address.trim().length < 5) {
    return NextResponse.json({ error: 'Dirección inválida' }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'GOOGLE_MAPS_API_KEY no configurada' }, { status: 500 })
  }

  try {
    const query = encodeURIComponent(`${address.trim()}, Córdoba, Argentina`)
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${apiKey}&region=ar&language=es`,
      { cache: 'no-store' },
    )

    const data = await res.json()

    if (data.status !== 'OK' || !data.results?.length) {
      return NextResponse.json(
        { error: 'No encontramos esa dirección. Verificá que sea correcta.' },
        { status: 404 },
      )
    }

    const { lat, lng } = data.results[0].geometry.location
    const zone = detectZone(lat, lng)
    const days = DELIVERY_DAYS[zone]
    const formattedAddress = data.results[0].formatted_address

    return NextResponse.json({ zone, days, lat, lng, formattedAddress })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
