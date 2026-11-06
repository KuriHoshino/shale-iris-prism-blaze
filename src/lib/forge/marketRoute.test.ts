import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { afterEach, describe, it } from "node:test"
import { marketApiBase, marketStatsUrl } from "./marketBase.ts"

const saved = process.env.VITE_MARKET_API_BASE
const stub = "http://127.0.0.1:8787"

afterEach(() => {
  if (saved == null) delete process.env.VITE_MARKET_API_BASE
  else process.env.VITE_MARKET_API_BASE = saved
})

function priceQuery(locations: string[], qualities: number[]) {
  const loc = locations.map((name) => encodeURIComponent(name)).join(",")
  return `locations=${loc}&qualities=${qualities.join(",")}`
}

describe("the three market call sites share one base", () => {
  it("keeps today's provider URLs when the var is empty", () => {
    delete process.env.VITE_MARKET_API_BASE
    const base = marketApiBase()
    const query = priceQuery(["Martlock"], [1])
    assert.equal(marketStatsUrl("prices", "T4_BAG", query), `${base}/api/v2/stats/prices/T4_BAG.json?${query}`)
    assert.equal(marketStatsUrl("orders", "T4_BAG", query), `${base}/api/v2/stats/orderbook/T4_BAG.json?${query}`)
    assert.equal(
      marketStatsUrl("history", "T4_BAG", `${query}&time-scale=1`),
      `${base}/api/v2/stats/history/T4_BAG.json?${query}&time-scale=1`,
    )
  })

  it("Flipper, the craft desk, and the hourly chart target the stub and not the provider", () => {
    delete process.env.VITE_MARKET_API_BASE
    const provider = marketApiBase()
    process.env.VITE_MARKET_API_BASE = stub
    const flip = marketStatsUrl("prices", "T4_BAG", priceQuery(["Martlock"], [1]))
    const desk = marketStatsUrl("prices", "T4_BAG", priceQuery(["Martlock", "Caerleon"], [1, 2, 3, 4, 5]))
    const orders = marketStatsUrl("orders", "T4_BAG", priceQuery(["Martlock"], [1]))
    const hourly = marketStatsUrl("history", "T4_BAG", `${priceQuery(["Martlock"], [1])}&time-scale=1`)
    for (const url of [flip, desk, orders, hourly]) {
      assert.equal(url.startsWith(`${stub}/stats/`), true)
      assert.equal(url.startsWith(provider), false)
    }
    assert.match(flip, /\/stats\/prices\/T4_BAG\.json/)
    assert.match(orders, /\/stats\/orders\/T4_BAG\.json/)
    assert.match(hourly, /\/stats\/history\/T4_BAG\.json/)
    const prices = readFileSync("src/lib/forge/prices.ts", "utf8")
    assert.match(prices, /marketStatsUrl\("prices"/)
    assert.match(prices, /marketStatsUrl\("orders"/)
    assert.match(prices, /marketStatsUrl\(\s*"history"/)
  })
})
