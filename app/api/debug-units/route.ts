import { NextResponse } from 'next/server'

export async function GET() {
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL

  if (!scriptUrl) {
    return NextResponse.json({ error: 'GOOGLE_SCRIPT_URL no configurada' })
  }

  try {
    const res = await fetch(`${scriptUrl}?action=cantidades`, {
      redirect: 'follow',
      cache: 'no-store',
    })
    const text = await res.text()
    let json = null
    try { json = JSON.parse(text) } catch { /* no es JSON */ }

    return NextResponse.json({
      status: res.status,
      ok: res.ok,
      raw: text.slice(0, 2000),
      parsed: json,
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) })
  }
}
