import assert from "node:assert/strict"
import { readFileSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"
import { afterEach, describe, it } from "node:test"
import { marketApiBase, marketStatsUrl } from "./marketBase.ts"

const saved = process.env.VITE_MARKET_API_BASE

afterEach(() => {
  if (saved == null) delete process.env.VITE_MARKET_API_BASE
  else process.env.VITE_MARKET_API_BASE = saved
})

function filesUnder(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules") continue
    const path = join(dir, name)
    if (statSync(path).isDirectory()) filesUnder(path, out)
    else if (/\.(ts|tsx)$/.test(name) && !name.endsWith(".test.ts")) out.push(path.split("\\").join("/"))
  }
  return out
}

function defaultHost(): string {
  const source = readFileSync("src/lib/forge/marketBase.ts", "utf8")
  const match = source.match(/DEFAULT_MARKET_API = "([^"]+)"/)
  assert.ok(match)
  return match[1]
}

describe("marketApiBase", () => {
  it("uses the public Asia host when the env var is empty", () => {
    delete process.env.VITE_MARKET_API_BASE
    const base = defaultHost()
    assert.equal(marketApiBase(), base)
    assert.equal(
      marketStatsUrl("prices", "T4_BAG", "locations=Martlock&qualities=1"),
      `${base}/api/v2/stats/prices/T4_BAG.json?locations=Martlock&qualities=1`,
    )
    assert.equal(
      marketStatsUrl("orders", "T4_BAG", "locations=Martlock&qualities=1"),
      `${base}/api/v2/stats/orderbook/T4_BAG.json?locations=Martlock&qualities=1`,
    )
    assert.equal(
      marketStatsUrl("history", "T4_BAG", "locations=Martlock&qualities=1&time-scale=1"),
      `${base}/api/v2/stats/history/T4_BAG.json?locations=Martlock&qualities=1&time-scale=1`,
    )
  })

  it("sends prices, history, and orders to the configured base", () => {
    process.env.VITE_MARKET_API_BASE = "http://127.0.0.1:8787/"
    assert.equal(marketApiBase(), "http://127.0.0.1:8787")
    assert.equal(
      marketStatsUrl("prices", "T4_BAG", "locations=Martlock&qualities=1"),
      "http://127.0.0.1:8787/stats/prices/T4_BAG.json?locations=Martlock&qualities=1",
    )
    assert.equal(
      marketStatsUrl("orders", "T4_BAG", "locations=Martlock&qualities=1"),
      "http://127.0.0.1:8787/stats/orders/T4_BAG.json?locations=Martlock&qualities=1",
    )
    assert.equal(
      marketStatsUrl("history", "T4_BAG", "locations=Martlock&qualities=1&time-scale=1"),
      "http://127.0.0.1:8787/stats/history/T4_BAG.json?locations=Martlock&qualities=1&time-scale=1",
    )
  })
})

describe("market host stays in one file", () => {
  it("mentions the provider host and the env var only in marketBase.ts", () => {
    const needle = defaultHost().replace("https://", "")
    const hits = filesUnder("src").filter((file) => {
      const text = readFileSync(file, "utf8")
      return text.includes(needle) || (file !== "src/lib/forge/marketBase.ts" && text.includes("VITE_MARKET_API_BASE"))
    })
    assert.deepEqual(hits, ["src/lib/forge/marketBase.ts"])
  })

  it("keeps the Pages fallback at the three market call sites", () => {
    for (const file of [
      "src/components/forge/Flipper.tsx",
      "src/lib/forge/store.ts",
      "src/components/forge/Hourly.tsx",
    ]) {
      const text = readFileSync(file, "utf8")
      assert.match(text, /import\.meta\.env\.VITE_PAGES === "1"/)
      assert.match(text, /marketApiBase\(\)/)
      assert.equal(text.includes(defaultHost().replace("https://", "")), false)
    }
    const prices = readFileSync("src/lib/forge/prices.ts", "utf8")
    assert.match(prices, /marketStatsUrl\("prices"/)
    assert.match(prices, /marketStatsUrl\("orders"/)
    assert.match(prices, /marketStatsUrl\(\s*"history"/)
    assert.equal(prices.includes(defaultHost().replace("https://", "")), false)
  })
})
