export const dynamic = 'force-dynamic'

export async function GET() {
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL
  if (!scriptUrl) {
    return Response.json({ error: 'GOOGLE_SCRIPT_URL no configurada', prices: {} })
  }

  try {
    const res = await fetch(`${scriptUrl}?action=precios`, {
      redirect: 'follow',
      cache: 'no-store',
    })
    const text = await res.text()
    let parsed: unknown = null
    try { parsed = JSON.parse(text) } catch { /* not json */ }

    return Response.json({
      status: res.status,
      ok: res.ok,
      url: res.url,
      rawText: text.slice(0, 500),
      parsed,
    })
  } catch (err) {
    return Response.json({ error: String(err) })
  }
}
