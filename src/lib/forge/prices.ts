import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"
import { liveId } from "./lookup"
import { marketStatsUrl } from "./marketBase"
import { MARKETS } from "./rules"

const Input = z.object({
  server: z.string().transform(() => "asia" as const),
  itemIds: z.array(z.string().regex(/^[A-Z0-9_@]+$/)).max(400),
  locations: z.array(z.enum(MARKETS)).min(1).max(8),
  qualities: z.array(z.number().int().min(1).max(5)).min(1).max(5),
})

export type PriceKind = "Live" | "EMV" | "None"

export type PriceQuote = {
  sell: number
  buy: number
  sellDate: string
  buyDate: string
  sellStock?: number
  buyStock?: number
  type?: PriceKind
  updatedAt?: string | null
  value?: number
}

type BookLevel = { price: number; amount: number; updated_at?: string }
type BookRow = {
  item_id: string
  city: string
  quality: number
  sell?: BookLevel[]
  buy?: BookLevel[]
}

type PriceRow = {
  item_id: string
  city: string
  quality: number
  sell_price_min?: number
  sell_price_min_date?: string
  buy_price_max?: number
  buy_price_max_date?: string
}

type MarketSide = { sell: number; buy: number; sellDate: string; buyDate: string }

function ageHours(isoDate: string): number | null {
  if (!isoDate) return null
  const parsed = Date.parse(isoDate)
  if (Number.isNaN(parsed)) return null
  return (Date.now() - parsed) / (1000 * 60 * 60)
}

function newestStamp(side: MarketSide): string {
  const sellTime = Date.parse(side.sellDate)
  const buyTime = Date.parse(side.buyDate)
  const sellOk = !Number.isNaN(sellTime)
  const buyOk = !Number.isNaN(buyTime)
  if (sellOk && buyOk) return sellTime >= buyTime ? side.sellDate : side.buyDate
  if (sellOk) return side.sellDate
  if (buyOk) return side.buyDate
  return side.sellDate || side.buyDate || ""
}

function liveOf(side: MarketSide): { price: number; updatedAt: string } | null {
  const updatedAt = newestStamp(side)
  const age = ageHours(updatedAt)
  if (age == null || !(age < 24)) return null
  const sellTime = Date.parse(side.sellDate)
  const buyTime = Date.parse(side.buyDate)
  const sellNewer = !Number.isNaN(sellTime) && (Number.isNaN(buyTime) || sellTime >= buyTime)
  const price = sellNewer ? (side.sell > 0 ? side.sell : side.buy) : side.buy > 0 ? side.buy : side.sell
  if (!(price > 0)) return null
  return { price, updatedAt }
}

function emvOf(side: MarketSide): { price: number; updatedAt: string } | null {
  const sell = side.sell > 0 ? side.sell : 0
  const buy = side.buy > 0 ? side.buy : 0
  const price = sell > 0 && buy > 0 ? (sell + buy) / 2 : sell > 0 ? sell : buy > 0 ? buy : 0
  if (!price) return null
  return { price, updatedAt: newestStamp(side) }
}

type AfmRow = { city: string; sell: number; buy: number; updatedAt: string }

async function pullAfm(itemId: string): Promise<AfmRow[]> {
  void itemId
  return []
}

function afmSide(row: AfmRow): MarketSide {
  return { sell: row.sell, buy: row.buy, sellDate: row.updatedAt, buyDate: row.updatedAt }
}

export async function getPriceWithFallback(
  itemId: string,
  location: string,
): Promise<{ price: number; updatedAt: string | null; type: PriceKind }> {
  let aodp: MarketSide | null = null
  try {
    const url = marketStatsUrl("prices", encodeURIComponent(itemId), `locations=${encodeURIComponent(location)}&qualities=1`)
    const res = await fetch(url, { signal: AbortSignal.timeout(12000) })
    if (!res.ok) throw new Error(String(res.status))
    const row = ((await res.json()) as PriceRow[])?.[0]
    if (row && ((row.sell_price_min || 0) > 0 || (row.buy_price_max || 0) > 0)) {
      aodp = { sell: row.sell_price_min || 0, buy: row.buy_price_max || 0, sellDate: row.sell_price_min_date || "", buyDate: row.buy_price_max_date || "" }
    }
    const live = aodp && liveOf(aodp)
    if (live) return { price: live.price, updatedAt: live.updatedAt, type: "Live" }
  } catch (error) {
    console.warn("AODP fetch failed", itemId, location, error)
    aodp = null
  }
  let afm: MarketSide | null = null
  try {
    const afmRows = await pullAfm(itemId)
    let hit = afmRows.find((row) => row.city.toLowerCase() === location.toLowerCase())
    if (!hit) {
      hit = afmRows.find(
        (row) =>
          row.city.toLowerCase().includes(location.toLowerCase()) ||
          location.toLowerCase().includes(row.city.toLowerCase()),
      )
    }
    if (hit && (hit.sell > 0 || hit.buy > 0)) {
      afm = afmSide(hit)
      const live = liveOf(afm)
      if (live) return { price: live.price, updatedAt: live.updatedAt, type: "Live" }
    }
  } catch (error) {
    console.warn("AFM fetch failed", itemId, location, error)
    afm = null
  }
  const ranked = [aodp, afm].filter((row): row is MarketSide => Boolean(row && (row.sell > 0 || row.buy > 0)))
  ranked.sort((a, b) => (newestStamp(b) || "").localeCompare(newestStamp(a) || ""))
  const estimated = ranked.length ? emvOf(ranked[0]) : null
  if (estimated) return { price: estimated.price, updatedAt: estimated.updatedAt, type: "EMV" }
  return { price: 0, updatedAt: null, type: "None" }
}

function classify(aodp: MarketSide | null, afm: MarketSide | null) {
  const fresh = aodp && liveOf(aodp)
  if (fresh) return { ...fresh, type: "Live" as const, row: aodp }
  const afmFresh = afm && liveOf(afm)
  if (afmFresh) return { ...afmFresh, type: "Live" as const, row: afm }
  const ranked = [aodp, afm].filter((row): row is MarketSide => Boolean(row && (row.sell > 0 || row.buy > 0)))
  ranked.sort((a, b) => (newestStamp(b) || "").localeCompare(newestStamp(a) || ""))
  const estimated = ranked.length ? emvOf(ranked[0]) : null
  if (estimated) return { ...estimated, type: "EMV" as const, row: ranked[0] }
  return { price: 0, updatedAt: null, type: "None" as const, row: null }
}

function bestLevel(levels: BookLevel[] | undefined, side: "sell" | "buy") {
  let best: BookLevel | undefined
  for (const row of levels ?? []) {
    if (!row.price || row.price <= 0) continue
    if (!best || (side === "sell" ? row.price < best.price : row.price > best.price)) best = row
  }
  return { price: best?.price || 0, at: best?.updated_at || "", amount: best?.amount || 0 }
}

/** Market ids that differ from the recipe id are translated by liveId. */

async function pullJson(url: string): Promise<unknown> {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const res = await fetch(url, {
      headers: { Accept: "application/json", "Accept-Encoding": "gzip, deflate" },
      signal: AbortSignal.timeout(12000),
    }).catch(() => null)
    if (!res) return []
    if (res.status === 429) {
      await new Promise((resolve) => setTimeout(resolve, 1200))
      continue
    }
    if (!res.ok) return []
    return res.json().catch(() => [])
  }
  return []
}

async function pullPrices(ids: string[], locations: string[], qualities: number[]) {
  const loc = locations.map((name) => encodeURIComponent(name)).join(",")
  const url = marketStatsUrl("prices", ids.join(","), `locations=${loc}&qualities=${qualities.join(",")}`)
  return (await pullJson(url)) as PriceRow[]
}

async function pullBook(ids: string[], locations: string[], qualities: number[]) {
  const loc = locations.map((name) => encodeURIComponent(name)).join(",")
  const url = marketStatsUrl("orders", ids.join(","), `locations=${loc}&qualities=${qualities.join(",")}`)
  return (await pullJson(url)) as BookRow[]
}

export async function loadMarketPrices(data: z.infer<typeof Input>) {
  const ids = [...new Set(data.itemIds)]
  const apiIds = ids.map(liveId)
  const quotes: Record<string, Record<string, Record<string, PriceQuote>>> = {}
  for (let i = 0; i < apiIds.length; i += 40) {
    const chunk = apiIds.slice(i, i + 40)
    const locations = [...data.locations]
    const qualities = data.qualities
    let book: BookRow[] = []
    let listed: PriceRow[] = []
    try {
      listed = (await pullPrices(chunk, locations, qualities)) as PriceRow[]
      if (!Array.isArray(listed)) listed = []
    } catch {
      listed = []
    }
    try {
      book = (await pullBook(chunk, locations, qualities)) as BookRow[]
      if (!Array.isArray(book)) book = []
    } catch {
      book = []
    }
    for (const row of listed) {
      const sell = row.sell_price_min || 0
      const buy = row.buy_price_max || 0
      if (!sell && !buy) continue
      const item = (quotes[row.item_id] ??= {})
      const city = (item[row.city] ??= {})
      city[String(row.quality)] = {
        sell,
        buy,
        sellDate: row.sell_price_min_date || "",
        buyDate: row.buy_price_max_date || "",
      }
    }
    for (const row of book) {
      const ask = bestLevel(row.sell, "sell")
      const bid = bestLevel(row.buy, "buy")
      if (!ask.price && !bid.price) continue
      const item = (quotes[row.item_id] ??= {})
      const city = (item[row.city] ??= {})
      const prev = city[String(row.quality)] ?? { sell: 0, buy: 0, sellDate: "", buyDate: "" }
      city[String(row.quality)] = {
        sell: ask.price || prev.sell,
        buy: bid.price || prev.buy,
        sellDate: ask.price ? ask.at : prev.sellDate,
        buyDate: bid.price ? bid.at : prev.buyDate,
        sellStock: ask.price ? ask.amount : prev.sellStock,
        buyStock: bid.price ? bid.amount : prev.buyStock,
      }
    }
    if (i + 40 < apiIds.length) await new Promise((r) => setTimeout(r, 250))
  }
  for (let index = 0; index < ids.length; index += 1) {
    const api = apiIds[index]
    if (api !== ids[index] && quotes[api]) quotes[ids[index]] = quotes[api]
  }
  const afmRows = new Map<string, AfmRow[]>()
  const pending = ids.filter((id) =>
    data.locations.some((city) =>
      data.qualities.some((quality) => {
        const quote = quotes[id]?.[city]?.[String(quality)] ?? quotes[liveId(id)]?.[city]?.[String(quality)]
        return !quote || !liveOf(quote)
      }),
    ),
  )
  for (let index = 0; index < pending.length; index += 1) {
    if (index) await new Promise((resolve) => setTimeout(resolve, 100))
    try {
      afmRows.set(pending[index], await pullAfm(liveId(pending[index])))
    } catch {
      afmRows.set(pending[index], [])
    }
  }
  for (const id of ids) {
    const book = quotes[id] ?? quotes[liveId(id)]
    for (const city of data.locations) {
      for (const quality of data.qualities) {
        const current = book?.[city]?.[String(quality)] ?? null
        const rows = afmRows.get(id) ?? []
        const hit =
          rows.find((row) => row.city.toLowerCase() === city.toLowerCase()) ??
          rows.find(
            (row) =>
              row.city.toLowerCase().includes(city.toLowerCase()) || city.toLowerCase().includes(row.city.toLowerCase()),
          ) ??
          null
        const afm = hit ? afmSide(hit) : null
        const judged = classify(current, afm)
        if (!judged.row) continue
        const item = (quotes[id] ??= {})
        const slot = (item[city] ??= {})
        slot[String(quality)] = {
          ...(current ?? {}),
          sell: judged.row.sell,
          buy: judged.row.buy,
          sellDate: judged.row.sellDate,
          buyDate: judged.row.buyDate,
          type: judged.type,
          updatedAt: judged.updatedAt,
          value: judged.price,
        }
      }
    }
  }
  return { quotes, fetchedAt: Date.now() }
}

export const fetchMarketPrices = createServerFn({ method: "POST" })
  .validator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => loadMarketPrices(data))

export type HourPoint = { time: string; price: number; count: number }
export type HourSeries = { city: string; points: HourPoint[] }

const HourInput = z.object({
  server: z.string().transform(() => "asia" as const),
  itemId: z.string().regex(/^[A-Z0-9_@]+$/),
  locations: z.array(z.enum(MARKETS)).min(1).max(MARKETS.length),
  quality: z.number().int().min(1).max(5),
})

type HistPoint = { timestamp?: string; avg_price?: number; item_count?: number }
type HistRow = {
  location?: string
  data?:
    | HistPoint[]
    | {
        timestamps?: string[]
        prices_avg?: number[]
        item_count?: number[]
      }
}

function addHour(series: Map<string, HourPoint[]>, city: string, time: string, price: number, count: number) {
  if (!city || !time || price <= 0) return
  const points = series.get(city) ?? []
  const found = points.find((point) => point.time === time)
  if (found) {
    found.price = price
    if (count > 0) found.count = count
  } else {
    points.push({ time, price, count })
  }
  series.set(city, points)
}

function readHistory(rows: HistRow[], series: Map<string, HourPoint[]>) {
  for (const row of rows) {
    const city = row.location || ""
    const data = row.data
    if (Array.isArray(data)) {
      for (const point of data) {
        addHour(series, city, point.timestamp || "", point.avg_price || 0, point.item_count || 0)
      }
      continue
    }
    const times = data?.timestamps ?? []
    const prices = data?.prices_avg ?? []
    const counts = data?.item_count ?? []
    for (let i = 0; i < times.length; i++) addHour(series, city, times[i] || "", prices[i] || 0, counts[i] || 0)
  }
}

async function readJson(url: string): Promise<{ status: number; body: unknown }> {
  const res = await fetch(url, {
    headers: { Accept: "application/json", "Accept-Encoding": "gzip, deflate" },
    signal: AbortSignal.timeout(20000),
  })
  if (res.status === 429) return { status: 429, body: null }
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text.slice(0, 180) || `Market data ${res.status}`)
  }
  return { status: res.status, body: await res.json() }
}

export async function loadHourlyPrices(data: z.infer<typeof HourInput>) {
  const loc = [...new Set(data.locations)].map((name) => encodeURIComponent(name)).join(",")
  const itemId = liveId(data.itemId)
  const historyUrl = marketStatsUrl(
    "history",
    itemId,
    `locations=${loc}&qualities=${data.quality}&time-scale=1`,
  )
  const historyRes = await readJson(historyUrl).catch(() => ({ status: 0, body: null }))
  if (historyRes.status === 429) return { series: [], fetchedAt: Date.now() }
  const bucket = new Map<string, HourPoint[]>()
  if (historyRes.status === 200 && Array.isArray(historyRes.body)) readHistory(historyRes.body as HistRow[], bucket)
  const series: HourSeries[] = []
  for (const [city, points] of bucket) {
    points.sort((a, b) => a.time.localeCompare(b.time))
    if (points.length) series.push({ city, points })
  }
  return { series, fetchedAt: Date.now() }
}

export const fetchHourlyPrices = createServerFn({ method: "POST" })
  .validator((input: unknown) => HourInput.parse(input))
  .handler(async ({ data }) => loadHourlyPrices(data))
