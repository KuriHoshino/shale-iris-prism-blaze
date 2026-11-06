const DEFAULT_MARKET_API = "https://east.albion-online-data.com"

/** Proxy origin when VITE_MARKET_API_BASE is set, otherwise the public Asia host. */
export function marketApiBase(): string {
  const vite = import.meta.env?.VITE_MARKET_API_BASE
  const raw =
    typeof vite === "string" && vite.trim()
      ? vite
      : typeof process !== "undefined"
        ? process.env.VITE_MARKET_API_BASE
        : ""
  if (typeof raw === "string" && raw.trim()) return raw.trim().replace(/\/+$/, "")
  return DEFAULT_MARKET_API
}

/** Provider paths stay /api/v2/stats/... . A configured proxy uses /stats/prices|history|orders. */
export function marketStatsUrl(kind: "prices" | "history" | "orders", ids: string, query: string): string {
  const base = marketApiBase()
  const search = query ? `?${query}` : ""
  if (base === DEFAULT_MARKET_API) {
    const provider = kind === "orders" ? "orderbook" : kind
    return `${base}/api/v2/stats/${provider}/${ids}.json${search}`
  }
  return `${base}/stats/${kind}/${ids}.json${search}`
}
