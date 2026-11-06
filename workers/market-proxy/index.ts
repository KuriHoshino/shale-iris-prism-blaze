const PROVIDER = "https://east.albion-online-data.com"

const PROVIDER_KIND: Record<string, string> = {
  prices: "prices",
  history: "history",
  orders: "orderbook",
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== "GET") return new Response("Method not allowed", { status: 405 })
    const url = new URL(request.url)
    const match = url.pathname.match(/^\/stats\/(prices|history|orders)\/([^/]+\.json)$/)
    if (!match) return new Response("Not found", { status: 404 })
    const upstream = `${PROVIDER}/api/v2/stats/${PROVIDER_KIND[match[1]]}/${match[2]}${url.search}`
    let response: Response | null = null
    for (let attempt = 0; attempt < 5; attempt += 1) {
      response = await fetch(upstream, {
        headers: { Accept: "application/json", "User-Agent": "HearthforgeMarketProxy/1.0" },
      })
      if (response.status !== 429 || attempt === 4) break
      await new Promise((resolve) => setTimeout(resolve, 250 * 2 ** attempt))
    }
    if (!response) return new Response("Upstream failed", { status: 502 })
    const headers = new Headers(response.headers)
    headers.set("cache-control", "public, max-age=60, stale-while-revalidate=300")
    return new Response(response.body, { status: response.status, headers })
  },
}
