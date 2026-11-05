import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"
import { liveId } from "./lookup"
import { MARKETS } from "./rules"

const HOST = "https://east.albion-online-data.com"
const AFM_QUERY = "east"

const Input = z.object({
  server: z.string().transform(() => "asia" as const),
  itemIds: z.array(z.string().regex(/^[A-Z0-9_@]+$/)).max(400),
  locations: z.array(z.enum(MARKETS)).min(1).max(8),
  qualities: z.array(z.number().int().min(1).max(5)).min(1).max(5),
})

export type PriceQuote = {
  sell: number
  buy: number
  sellDate: string
  buyDate: string
  sellStock?: number
  buyStock?: number
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

const AFM_CITY: Record<string, (typeof MARKETS)[number]> = {
  "Black Market": "Black Market",
  "Brecilien Market": "Brecilien",
  "Bridgewatch Market": "Bridgewatch",
  "Caerleon Market": "Caerleon",
  "Fort Sterling Market": "Fort Sterling",
  "Lymhurst Market": "Lymhurst",
  "Martlock Market": "Martlock",
  "Thetford Market": "Thetford",
}

function silverCell(cell: string) {
  const match = cell.replace(/<[^>]+>/g, " ").match(/[0-9][0-9,]*/)
  return match ? Number(match[0].replace(/,/g, "")) : 0
}

function parseAfm(html: string) {
  const start = html.indexOf('class="summary-table"')
  if (start < 0) return []
  const end = html.indexOf("</table>", start)
  const table = html.slice(start, end)
  const rows: { city: (typeof MARKETS)[number]; sell: number; buy: number }[] = []
  for (const row of table.split("</tr>").slice(1)) {
    const name = row.match(/>((?:Black Market)|(?:[A-Za-z ]+ Market))</)
    const city = name ? AFM_CITY[name[1]] : undefined
    if (!city) continue
    const cells = [...row.matchAll(/class="numeric">([\s\S]*?)<\/td>/g)]
    if (cells.length < 2) continue
    rows.push({ city, sell: silverCell(cells[0][1]), buy: silverCell(cells[1][1]) })
  }
  return rows
}

async function pullAfm(itemId: string) {
  const url = `https://albionfreemarket.com/pricecheck/${encodeURIComponent(itemId)}?s=${AFM_QUERY}`
  const res = await fetch(url, {
    headers: { Accept: "text/html" },
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) return []
  return parseAfm(await res.text())
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
      headers: { Accept: "application/json" },
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

async function pullPrices(host: string, ids: string[], locations: string[], qualities: number[]) {
  const loc = locations.map((name) => encodeURIComponent(name)).join(",")
  const url = `${host}/api/v2/stats/prices/${ids.join(",")}.json?locations=${loc}&qualities=${qualities.join(",")}`
  return (await pullJson(url)) as PriceRow[]
}

async function pullBook(host: string, ids: string[], locations: string[], qualities: number[]) {
  const loc = locations.map((name) => encodeURIComponent(name)).join(",")
  const url = `${host}/api/v2/stats/orderbook/${ids.join(",")}.json?locations=${loc}&qualities=${qualities.join(",")}`
  return (await pullJson(url)) as BookRow[]
}

export async function loadMarketPrices(data: z.infer<typeof Input>) {
  const ids = [...new Set(data.itemIds)]
  const apiIds = ids.map(liveId)
  const host = HOST
  const quotes: Record<string, Record<string, Record<string, PriceQuote>>> = {}
  for (let i = 0; i < apiIds.length; i += 40) {
    const chunk = apiIds.slice(i, i + 40)
    const locations = [...data.locations]
    const qualities = data.qualities
    let book: BookRow[] = []
    let listed: PriceRow[] = []
    try {
      listed = (await pullPrices(host, chunk, locations, qualities)) as PriceRow[]
      if (!Array.isArray(listed)) listed = []
    } catch {
      listed = []
    }
    try {
      book = (await pullBook(host, chunk, locations, qualities)) as BookRow[]
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
  const missing = ids.filter((id) => {
    const item = quotes[id] ?? quotes[liveId(id)]
    return data.locations.some((city) => {
      const slot = item?.[city]
      if (!slot) return true
      return !data.qualities.some((quality) => {
        const row = slot[String(quality)]
        return Boolean(row && (row.sell > 0 || row.buy > 0))
      })
    })
  })
  for (const id of missing.slice(0, missing.length <= 24 ? missing.length : 12)) {
    try {
      const rows = await pullAfm(liveId(id))
      if (!rows.length) continue
      const key = quotes[id] ? id : liveId(id)
      const item = (quotes[key] ??= {})
      const api = liveId(id)
      if (api !== key) quotes[api] = item
      if (id !== key) quotes[id] = item
      for (const row of rows) {
        if (!row.sell && !row.buy) continue
        if (!data.locations.includes(row.city)) continue
        const city = (item[row.city] ??= {})
        for (const quality of data.qualities) {
          const prev = city[String(quality)]
          if (prev && (prev.sell > 0 || prev.buy > 0)) continue
          city[String(quality)] = {
            sell: row.sell,
            buy: row.buy,
            sellDate: row.sell ? "afm" : "",
            buyDate: row.buy ? "afm" : "",
          }
        }
      }
    } catch {
      continue
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
    headers: { Accept: "application/json" },
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
  const host = HOST
  const itemId = liveId(data.itemId)
  const historyUrl = `${host}/api/v2/stats/history/${itemId}.json?locations=${loc}&qualities=${data.quality}&time-scale=1`
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
