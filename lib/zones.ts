// Zona 1 — polígono extraído de Google My Maps
// KML original: https://www.google.com/maps/d/edit?mid=1K-b4rVO1X0d2eRt2PfPEyRLXTuVt93U
// Coordenadas en formato [lat, lng]
export const ZONA1_POLYGON: [number, number][] = [
  [-31.4414293, -64.1496281],
  [-31.4332274, -64.1489414],
  [-31.4304444, -64.1492848],
  [-31.4249515, -64.1690258],
  [-31.4233402, -64.1743473],
  [-31.4085440, -64.1758923],
  [-31.4059801, -64.1801838],
  [-31.4071521, -64.1884236],
  [-31.4051742, -64.1989807],
  [-31.4080312, -64.2006115],
  [-31.4134635, -64.2034642],
  [-31.4170160, -64.2079274],
  [-31.4216005, -64.2088119],
  [-31.4345681, -64.1974895],
  [-31.4424770, -64.1950862],
  [-31.4440466, -64.1947218],
]

export const DELIVERY_DAYS = {
  zona1: ['Lunes', 'Miércoles', 'Viernes'],
  zona2: ['Martes', 'Jueves'],
} as const

export type Zone = keyof typeof DELIVERY_DAYS

/**
 * Ray casting algorithm — determina si un punto está dentro del polígono de Zona 1.
 */
export function isInsideZona1(lat: number, lng: number): boolean {
  const polygon = ZONA1_POLYGON
  const n = polygon.length
  let inside = false

  for (let i = 0, j = n - 1; i < n; j = i++) {
    const [yi, xi] = polygon[i]
    const [yj, xj] = polygon[j]

    const intersect =
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi

    if (intersect) inside = !inside
  }

  return inside
}

export function detectZone(lat: number, lng: number): Zone {
  return isInsideZona1(lat, lng) ? 'zona1' : 'zona2'
}
