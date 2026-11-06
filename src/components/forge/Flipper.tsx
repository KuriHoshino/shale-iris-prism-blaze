import { useEffect, useMemo, useState } from "react"
import { Plus, RefreshCw, Search } from "lucide-react"
import { items, type CraftItem } from "@/lib/forge/catalog"
import { enchantStones, liveId, marketId } from "@/lib/forge/lookup"
import { marketApiBase } from "@/lib/forge/marketBase"
import { fetchMarketPrices, loadMarketPrices } from "@/lib/forge/prices"
import { MARKETS, TAX_PREMIUM, TAX_STANDARD, WEAPON_LINE, gearLine } from "@/lib/forge/rules"
import { useForge, type PriceBook } from "@/lib/forge/store"
import { stackBuy, stackSell } from "@/lib/forge/formulas"
import { ItemIcon, itemMark, silver, pct, orderAge } from "./fields"

const TIERS = [4, 5, 6, 7, 8]
const ENCHANTS = [0, 1, 2, 3, 4]
const SAVE_KEY = "hearthforge-flips"

const SECTIONS: { id: string; label: string; lines: { id: string; label: string }[] }[] = [
  {
    id: "head",
    label: "Head",
    lines: [
      { id: "cloth_helmet", label: "Cloth Helmet" },
      { id: "leather_helmet", label: "Leather Helmet" },
      { id: "plate_helmet", label: "Plate Helmet" },
    ],
  },
  {
    id: "body",
    label: "Armor",
    lines: [
      { id: "cloth_armor", label: "Cloth Armor" },
      { id: "leather_armor", label: "Leather Armor" },
      { id: "plate_armor", label: "Plate Armor" },
    ],
  },
  {
    id: "feet",
    label: "Shoes",
    lines: [
      { id: "cloth_shoes", label: "Cloth Shoes" },
      { id: "leather_shoes", label: "Leather Shoes" },
      { id: "plate_shoes", label: "Plate Shoes" },
    ],
  },
  {
    id: "weapon",
    label: "Weapons",
    lines: Object.entries(WEAPON_LINE).map(([id, line]) => ({ id, label: line.label })),
  },
  {
    id: "offhand",
    label: "Off-hands",
    lines: [
      { id: "shield", label: "Shield" },
      { id: "torch", label: "Torch" },
      { id: "tome", label: "Tome" },
    ],
  },
  {
    id: "accessory",
    label: "Bags & capes",
    lines: [
      { id: "bag", label: "Bag" },
      { id: "cape", label: "Cape" },
    ],
  },
  {
    id: "tool",
    label: "Tools",
    lines: [
      { id: "axe", label: "Axe" },
      { id: "pick", label: "Pickaxe" },
      { id: "sickle", label: "Sickle" },
      { id: "knife", label: "Skinning Knife" },
      { id: "hammer", label: "Stone Hammer" },
      { id: "fishingrod", label: "Fishing Rod" },
      { id: "siegehammer", label: "Siege Hammer" },
    ],
  },
]

type Saved = { id: string; name: string; buy: string; sell: string; picks: string[] }

function loadSaved(): Saved[] {
  try {
    const raw = JSON.parse(localStorage.getItem(SAVE_KEY) || "[]")
    return Array.isArray(raw) ? raw : []
  } catch {
    return []
  }
}

function order(book: PriceBook, id: string, city: string, quality: number, side: "sell" | "buy") {
  const quote = book[id]?.[city]?.[String(quality)] ?? book[liveId(id)]?.[city]?.[String(quality)]
  const price = side === "sell" ? quote?.sell : quote?.buy
  return price && price > 0 ? price : null
}

function pickKey(tier: number, enchant: number) {
  return `${tier}.${enchant}`
}

export function FlipLab() {
  const server = useForge((s) => s.server)
  const premium = useForge((s) => s.premium)
  const patch = useForge((s) => s.patch)
  const [picks, setPicks] = useState<string[]>(["8.0"])
  const [quality, setQuality] = useState(1)
  const [dealPath, setDealPath] = useState<"listed" | "upgrade">("listed")
  const [fromEnchant, setFromEnchant] = useState(0)
  const [query, setQuery] = useState("")
  const [saved, setSaved] = useState<Saved[]>(loadSaved)
  const [book, setBook] = useState<PriceBook | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [rank, setRank] = useState<"profit" | "roi">("profit")
  const [page, setPage] = useState(0)
  const [picked, setPicked] = useState<Record<string, boolean>>({})
  const [amounts, setAmounts] = useState<Record<string, number>>({})
  const [planned, setPlanned] = useState(false)
  const [fetchedAt, setFetchedAt] = useState<number | null>(null)
  const [pulse, setPulse] = useState(0)
  const [now, setNow] = useState(() => Date.now())

  const pickSet = useMemo(() => new Set(picks), [picks])
  const tiers = useMemo(() => [...new Set(picks.map((pick) => Number(pick.split(".")[0])))], [picks])

  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(saved))
  }, [saved])

  useEffect(() => {
    if (!picks.length) return
    let cancel = false
    const timer = window.setTimeout(() => {
      void (async () => {
        const pool = items.filter((item) => tiers.includes(item.tier) && gearLine(item))
        const ids = new Set<string>()
        for (const tier of tiers) {
          ids.add(`T${tier}_RUNE`)
          ids.add(`T${tier}_SOUL`)
          ids.add(`T${tier}_RELIC`)
        }
        for (const item of pool) {
          for (const enchant of ENCHANTS) {
            if (!pickSet.has(pickKey(item.tier, enchant))) continue
            ids.add(marketId(item.id, enchant))
            if (enchant > 1 && enchant < 4) ids.add(marketId(item.id, 1))
            if (enchant > 2 && enchant < 4) ids.add(marketId(item.id, 2))
            if (enchant > 0 && enchant < 4) ids.add(marketId(item.id, 0))
          }
        }
        const idList = [...ids]
        if (!idList.length) return
        const places = [...MARKETS]
        setLoading(true)
        setError("")
        try {
          const next: PriceBook = {}
          let got = 0
          for (let index = 0; index < idList.length; index += 80) {
            const request = {
              server,
              itemIds: idList.slice(index, index + 80),
              locations: places,
              qualities: [quality],
            }
            const marketBase = marketApiBase()
            const result = import.meta.env.VITE_PAGES === "1" ? await loadMarketPrices(request) : await fetchMarketPrices({ data: request })
            if (!marketBase) throw new Error("missing market base")
            Object.assign(next, result.quotes)
            got += Object.keys(result.quotes).length
            if (cancel) return
            if (Object.keys(result.quotes).length) setBook((prev) => ({ ...(prev ?? {}), ...next }))
          }
          if (!cancel) {
            setFetchedAt(Date.now())
            setError(got ? "" : "No live prices for these cities yet. Press Live prices to try again.")
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : "Could not load flip prices"
          if (!cancel && !/busy|retry in a minute/i.test(message)) setError(message)
        } finally {
          if (!cancel) setLoading(false)
        }
      })()
    }, 250)
    return () => {
      cancel = true
      window.clearTimeout(timer)
    }
  }, [server, quality, pickSet, tiers, picks.length, pulse])

  useEffect(() => {
    setPage(0)
  }, [rank, quality, picks])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!fetchedAt) return
    const wait = Math.max(1000, fetchedAt + 60_000 - Date.now())
    const timer = window.setTimeout(() => setPulse((value) => value + 1), wait)
    return () => window.clearTimeout(timer)
  }, [fetchedAt])

  function hasPrice(item: CraftItem, enchant: number) {
    if (!book || !pickSet.has(pickKey(item.tier, enchant))) return false
    const id = marketId(item.id, enchant)
    const quotes = book[id] ?? book[liveId(id)]
    if (!quotes) return false
    return Object.values(quotes).some((cities) => {
      const quote = cities[String(quality)]
      return Boolean(quote && ((quote.sell || 0) > 0 || (quote.buy || 0) > 0))
    })
  }

  function pricedEnchants(item: CraftItem) {
    return ENCHANTS.filter((enchant) => hasPrice(item, enchant))
  }

  function variants(item: CraftItem) {
    const selected = pricedEnchants(item).length
    return { selected, total: selected }
  }

  function itemsFor(line: string, needle: string) {
    return items.filter((item) => {
      if (gearLine(item) !== line) return false
      if (!tiers.includes(item.tier)) return false
      if (needle && !item.name.toLowerCase().includes(needle)) return false
      return pricedEnchants(item).length > 0
    })
  }

  const needle = query.trim().toLowerCase()
  const tree = SECTIONS.map((section) => {
    const lines = section.lines
      .map((line) => {
        const rows = itemsFor(line.id, needle)
        const selected = rows.reduce((sum, item) => sum + variants(item).selected, 0)
        const total = rows.reduce((sum, item) => sum + variants(item).total, 0)
        return { ...line, rows, selected, total }
      })
      .filter((line) => line.rows.length)
    return {
      ...section,
      lines,
      selected: lines.reduce((sum, line) => sum + line.selected, 0),
      total: lines.reduce((sum, line) => sum + line.total, 0),
    }
  }).filter((section) => section.lines.length)

  const shownCount = tree.reduce((sum, section) => sum + section.lines.reduce((inner, line) => inner + line.rows.length, 0), 0)
  const left = fetchedAt ? Math.max(0, Math.ceil((fetchedAt + 60_000 - now) / 1000)) : 0
  const leftLabel = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`

  function togglePick(key: string) {
    setPicks((current) => (current.includes(key) ? current.filter((pick) => pick !== key) : [...current, key]))
  }

  function saveRoute() {
    const next: Saved = {
      id: `${Date.now()}`,
      name: "All cities",
      buy: "all",
      sell: "all",
      picks: [...picks],
    }
    setSaved((current) => [next, ...current].slice(0, 12))
  }

  function flipDeal(item: CraftItem, enchant: number) {
    if (!book) return null
    const upgrade = dealPath === "upgrade" && enchant > fromEnchant && enchant < 4
    const stones = upgrade
      ? enchantStones(item, enchant).filter((stone) => {
          const step = stone.id.includes("RELIC") ? 3 : stone.id.includes("SOUL") ? 2 : 1
          return step > fromEnchant
        })
      : []
    const marketOnly = !upgrade || stones.length === 0
    const buyId = marketOnly ? marketId(item.id, enchant) : marketId(item.id, fromEnchant)
    const sellId = marketId(item.id, enchant)
    let best: {
      buy: number
      sell: number
      extra: number
      investment: number
      fee: number
      profit: number
      roi: number
      age: string
      from: number | null
      buyCity: string
      sellCity: string
    } | null = null
    for (const buyCity of MARKETS) {
      const buyPrice = order(book, buyId, buyCity, quality, "sell")
      if (buyPrice == null) continue
      let extra = 0
      let missingStone = false
      for (const stone of marketOnly ? [] : stones) {
        const unit = order(book, stone.id, buyCity, 1, "sell")
        if (unit == null) {
          missingStone = true
          break
        }
        extra += stackBuy(unit, stone.qty, "instant").cost
      }
      if (missingStone) continue
      for (const sellCity of MARKETS) {
        if (sellCity === buyCity) continue
        const sellPrice = order(book, sellId, sellCity, quality, "buy")
        if (sellPrice == null) continue
        const bought = stackBuy(buyPrice, 1, "instant")
        const sold = stackSell(sellPrice, 1, "instant", premium)
        const investment = bought.cost + extra
        const fee = sold.tax + sold.setup
        const profit = sold.net - investment
        const roi = investment > 0 ? profit / investment : 0
        const stamp = book[buyId]?.[buyCity]?.[String(quality)]?.sellDate || book[liveId(buyId)]?.[buyCity]?.[String(quality)]?.sellDate
        const next = {
          buy: buyPrice,
          sell: sellPrice,
          extra,
          investment,
          fee,
          profit,
          roi,
          age: orderAge(stamp),
          from: marketOnly ? null : fromEnchant,
          buyCity,
          sellCity,
        }
        if (!best || (rank === "roi" ? next.roi > best.roi : next.profit > best.profit)) best = next
      }
    }
    return best
  }

  const field = "h-9 w-full rounded-md border border-white/10 bg-[#1a1d27] px-2 text-sm text-parchment outline-none"

  const flips = tree
    .flatMap((section) => section.lines.flatMap((line) => line.rows))
    .flatMap((item) =>
      pricedEnchants(item).flatMap((enchant) => {
        const deal = flipDeal(item, enchant)
        return deal ? [{ id: item.id, name: item.name, tier: item.tier, enchant, ...deal }] : []
      }),
    )
    .sort((a, b) => (rank === "roi" ? b.roi - a.roi : b.profit - a.profit))
    .slice(0, 100)
  const pageCount = Math.max(1, Math.ceil(flips.length / 20))
  const safePage = Math.min(page, pageCount - 1)
  const view = flips.slice(safePage * 20, safePage * 20 + 20)

  function rowMoney(row: (typeof flips)[number], count: number) {
    const sold = stackSell(row.sell, count, "instant", premium)
    const investment = stackBuy(row.buy, count, "instant").cost + row.extra * count
    const tax = sold.tax
    const profit = sold.net - investment
    return { investment, tax, profit, roi: investment > 0 ? profit / investment : 0 }
  }

  const targetEnchant = picks.reduce((highest, pick) => Math.max(highest, Number(pick.split(".")[1]) || 0), 0)
  const startOptions = [0, 1, 2].filter((start) => start < targetEnchant && targetEnchant < 4)
  const taxRate = premium ? TAX_PREMIUM : TAX_STANDARD

  function pathLabel(tier: number, enchant: number, from: number | null) {
    if (from == null) return `T${tier}.${enchant}`
    return `T${tier}.${from} to T${tier}.${enchant}`
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-line bg-[#0c0e14]">
      <div className="border-b border-line bg-[#101218] px-3 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="mr-2 text-xs text-muted">Best flip</p>
          <button
            type="button"
            onClick={() => setRank("profit")}
            className={"h-10 rounded-md border px-3 text-sm " + (rank === "profit" ? "border-violet-400 bg-[#6d4aff] text-white" : "border-white/10 text-muted")}
          >
            Best profit
          </button>
          <button
            type="button"
            onClick={() => setRank("roi")}
            className={"h-10 rounded-md border px-3 text-sm " + (rank === "roi" ? "border-violet-400 bg-[#6d4aff] text-white" : "border-white/10 text-muted")}
          >
            Best ROI
          </button>
          <button
            type="button"
            onClick={() => patch({ premium: true })}
            className={"h-10 rounded-md border px-3 text-sm " + (premium ? "border-violet-400 bg-[#6d4aff] text-white" : "border-white/10 text-muted")}
          >
            Premium
          </button>
          <button
            type="button"
            onClick={() => patch({ premium: false })}
            className={"h-10 rounded-md border px-3 text-sm " + (!premium ? "border-violet-400 bg-[#6d4aff] text-white" : "border-white/10 text-muted")}
          >
            No premium
          </button>
          <p className="ml-auto text-xs text-muted">{flips.length} of the top 100</p>
        </div>
        <p className="mt-2 text-xs text-muted">
          Sell tax is {pct(taxRate)} {premium ? "with premium" : "without premium"}, including the Black Market. It is taken off the sell price before profit. No setup fee, because the flip sells into a buy order.
        </p>
      </div>
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      <aside className="flex w-full shrink-0 flex-col border-b border-line bg-[#101218] lg:w-64 lg:border-r lg:border-b-0">
        <div className="border-b border-line px-3 py-3">
          <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">Flip route</p>
          <p className="mt-2 text-[12px] text-muted">All cities are compared. Each row shows the city to buy in.</p>
        </div>
        <div className="border-b border-line px-3 py-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">Item filters</p>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-muted">Tier & enchantment</span>
            <button
              type="button"
              className="text-violet-300"
              onClick={() => setPicks(picks.length === TIERS.length * ENCHANTS.length ? [] : TIERS.flatMap((tier) => ENCHANTS.map((enchant) => pickKey(tier, enchant))))}
            >
              {picks.length === TIERS.length * ENCHANTS.length ? "Clear" : "Select all"}
            </button>
          </div>
          <div className="mt-2 flex flex-col gap-1">
            {TIERS.map((tier) => (
              <div key={tier} className="grid grid-cols-5 gap-1">
                {ENCHANTS.map((enchant) => {
                  const key = pickKey(tier, enchant)
                  const on = pickSet.has(key)
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => togglePick(key)}
                      className={
                        "h-7 rounded-md border text-[11px] " +
                        (on ? "border-violet-400 bg-[#6d4aff] text-white" : "border-white/10 bg-[#1a1d27] text-muted")
                      }
                    >
                      {tier}.{enchant}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-muted">
            {picks.length} tier/enchant group{picks.length === 1 ? "" : "s"} selected
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDealPath("listed")}
              className={"h-10 rounded-md border px-2 text-[11px] " + (dealPath === "listed" ? "border-violet-400 bg-[#6d4aff] text-white" : "border-white/10 text-muted")}
            >
              Buy this enchant
            </button>
            {startOptions.map((start) => (
              <button
                key={start}
                type="button"
                onClick={() => {
                  setDealPath("upgrade")
                  setFromEnchant(start)
                }}
                className={
                  "h-10 rounded-md border px-2 text-[11px] " +
                  (dealPath === "upgrade" && fromEnchant === start ? "border-violet-400 bg-[#6d4aff] text-white" : "border-white/10 text-muted")
                }
              >
                Upgrade from .{start}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-muted">
            {dealPath === "listed" || !startOptions.length
              ? "Uses the live price of the enchant you pick."
              : `Buys the .${fromEnchant} item plus only the stones still needed, then sells the enchant you picked.`}
          </p>
          <label className="mt-3 block text-[11px] text-muted">
            Quality
            <select className={field + " mt-1"} value={quality} onChange={(event) => setQuality(Number(event.target.value))}>
              <option value={1}>Normal</option>
              <option value={2}>Good</option>
              <option value={3}>Outstanding</option>
              <option value={4}>Excellent</option>
              <option value={5}>Masterpiece</option>
            </select>
          </label>
        </div>
        <div className="px-3 py-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">Saved configs</p>
            <button type="button" onClick={saveRoute} aria-label="Save this route" className="grid size-6 place-items-center rounded text-muted">
              <Plus className="size-4" />
            </button>
          </div>
          {saved.length === 0 ? (
            <div className="mt-3 text-[12px] text-muted">
              <p>No saved configurations yet.</p>
              <p className="mt-3">Configurations are saved on this device.</p>
            </div>
          ) : (
            <ul className="mt-3 flex flex-col gap-1">
              {saved.map((config) => (
                <li key={config.id}>
                  <button
                    type="button"
                    onClick={() => setPicks(config.picks)}
                    className="w-full rounded-md px-2 py-1.5 text-left text-xs text-parchment hover:bg-white/5"
                  >
                    {config.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3 border-b border-line px-3 py-2">
          <label className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search flip items..."
              className="h-10 w-full rounded-lg border border-white/10 bg-[#12141c] pr-3 pl-9 text-sm text-parchment outline-none"
            />
          </label>
          <p className="shrink-0 text-xs text-muted">{loading ? "Loading prices" : `${shownCount} with prices`}</p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-3 py-2">
          <p className="text-xs text-muted">
            {fetchedAt
              ? `Live order book, refreshed ${new Date(fetchedAt).toLocaleTimeString()}. Next check in ${leftLabel}.`
              : "Fetching the live order book."}
            {loading && fetchedAt != null ? " Updating." : ""}
          </p>
          <button
            type="button"
            onClick={() => setPulse((value) => value + 1)}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-brass px-3 text-sm font-semibold text-ink"
          >
            <RefreshCw className={"size-4 " + (loading ? "animate-spin" : "")} />
            {loading && fetchedAt == null ? "Loading" : "Live prices"}
          </button>
        </div>
        {error ? <p className="px-4 py-2 text-sm text-ember">{error}</p> : null}
        <ul className="flex flex-col gap-2 p-3 md:hidden">
          {view.map((row) => {
            const key = `${row.id}|${row.enchant}`
            const count = Math.max(1, amounts[key] ?? 1)
            const money = rowMoney(row, count)
            const on = Boolean(picked[key])
            return (
              <li key={key} className="rounded-lg border border-white/10 p-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => setPicked((current) => ({ ...current, [key]: !current[key] }))}
                    aria-label={`Pick ${row.name}`}
                    className="mt-1 size-5 accent-violet-400"
                  />
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    <ItemIcon id={row.id} enchant={row.enchant} quality={quality} size={40} />
                    <div className="min-w-0">
                    <p className="font-medium text-parchment">
                      {row.name} <span className="text-muted">[{itemMark(row.id, row.enchant)}]</span>
                    </p>
                    <p className="text-xs text-muted">{pathLabel(row.tier, row.enchant, row.from)} · {row.age || "no age"}</p>
                    </div>
                  </div>
                  <p className={"text-right text-sm font-semibold tabular-nums " + (money.profit >= 0 ? "text-sage" : "text-ember")}>
                    {silver(money.profit)}
                    <span className="block text-xs font-normal text-muted">{pct(money.roi)}</span>
                  </p>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div><dt className="text-muted">Buy in {row.buyCity}</dt><dd className="tabular-nums">{silver(row.buy)}</dd></div>
                  <div><dt className="text-muted">Sell in {row.sellCity}</dt><dd className="tabular-nums">{silver(row.sell)}</dd></div>
                  <div><dt className="text-muted">Investment</dt><dd className="tabular-nums">{silver(money.investment)}</dd></div>
                  <div><dt className="text-muted">Tax {pct(taxRate)}</dt><dd className="tabular-nums">{silver(money.tax)}</dd></div>
                </dl>
                <label className="mt-3 flex items-center justify-between gap-3 text-xs text-muted">
                  Buy qty
                  <input
                    value={count}
                    inputMode="numeric"
                    onChange={(event) => setAmounts((current) => ({ ...current, [key]: Math.max(1, Number(event.target.value) || 1) }))}
                    className="h-11 w-20 rounded-md border border-white/10 bg-[#12141c] px-2 text-right text-base text-parchment tabular-nums"
                  />
                </label>
              </li>
            )
          })}
          {view.length === 0 ? <li className="px-1 py-6 text-sm text-muted">No priced flip for this route yet.</li> : null}
        </ul>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="text-[11px] tracking-wide text-muted uppercase">
              <tr className="border-b border-white/10">
                <th className="w-8 px-3 py-2" />
                <th className="px-2 py-2 font-medium">Item / tier / quality</th>
                <th className="px-2 py-2 font-medium">Buy in</th>
                <th className="px-2 py-2 font-medium">Sell in</th>
                <th className="px-2 py-2 font-medium">Investment</th>
                <th className="px-2 py-2 font-medium">Tax {pct(taxRate)}</th>
                <th className="px-2 py-2 font-medium">Profit</th>
                <th className="px-2 py-2 font-medium">ROI</th>
                <th className="px-2 py-2 font-medium">Volume 7d</th>
                <th className="px-2 py-2 font-medium">Buy qty</th>
                <th className="px-2 py-2 font-medium">Age</th>
              </tr>
            </thead>
            <tbody>
              {view.map((row) => {
                const key = `${row.id}|${row.enchant}`
                const count = Math.max(1, amounts[key] ?? 1)
                const money = rowMoney(row, count)
                const on = Boolean(picked[key])
                return (
                  <tr key={key} className="border-b border-white/5">
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => setPicked((current) => ({ ...current, [key]: !current[key] }))}
                        aria-label={`Pick ${row.name}`}
                        className="size-4 accent-violet-400"
                      />
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2">
                        <ItemIcon id={row.id} enchant={row.enchant} quality={quality} size={40} />
                        <div>
                          <p className="font-medium text-parchment">
                            {row.name} <span className="text-muted">[{itemMark(row.id, row.enchant)}]</span>
                          </p>
                          <p className="text-xs text-muted">{pathLabel(row.tier, row.enchant, row.from)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-3 tabular-nums">
                      {silver(row.buy)}
                      <span className="block text-xs text-brass">{row.buyCity}</span>
                    </td>
                    <td className="px-2 py-3 tabular-nums">
                      {silver(row.sell)}
                      <span className="block text-xs text-muted">{row.sellCity}</span>
                    </td>
                    <td className="px-2 py-3 tabular-nums">{silver(money.investment)}</td>
                    <td className="px-2 py-3 tabular-nums text-muted">{silver(money.tax)}</td>
                    <td className={"px-2 py-3 font-semibold tabular-nums " + (money.profit >= 0 ? "text-sage" : "text-ember")}>{silver(money.profit)}</td>
                    <td className="px-2 py-3 tabular-nums">{pct(money.roi)}</td>
                    <td className="px-2 py-3 text-muted">—</td>
                    <td className="px-2 py-3">
                      <input
                        value={count}
                        inputMode="numeric"
                        onChange={(event) => setAmounts((current) => ({ ...current, [key]: Math.max(1, Number(event.target.value) || 1) }))}
                        className="h-9 w-16 rounded-md border border-white/10 bg-[#12141c] px-2 text-right tabular-nums"
                      />
                    </td>
                    <td className="px-2 py-3 text-xs text-muted">{row.age || "—"}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {view.length === 0 ? <p className="px-4 py-6 text-sm text-muted">No priced flip for this route yet.</p> : null}
        </div>
        <div className="flex flex-col gap-3 border-t border-white/10 px-3 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" disabled={safePage === 0} onClick={() => setPage(safePage - 1)} className="h-10 rounded-md border border-white/10 px-3 text-sm disabled:opacity-40">
              Prev
            </button>
            {Array.from({ length: pageCount }, (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setPage(index)}
                className={"h-10 min-w-10 rounded-md border px-2 text-sm " + (index === safePage ? "border-violet-400 bg-[#6d4aff] text-white" : "border-white/10 text-muted")}
              >
                {index + 1}
              </button>
            ))}
            <button type="button" disabled={safePage >= pageCount - 1} onClick={() => setPage(safePage + 1)} className="h-10 rounded-md border border-white/10 px-3 text-sm disabled:opacity-40">
              Next
            </button>
          </div>
          <button
            type="button"
            onClick={() => setPlanned(true)}
            className="h-11 w-full rounded-md bg-brass px-3 text-sm font-semibold text-ink sm:w-auto"
          >
            Calculate picked flips
          </button>
        </div>
        {planned ? (
          <div className="border-t border-white/10 px-3 py-3 text-sm">
            {(() => {
              const chosen = flips.filter((row) => picked[`${row.id}|${row.enchant}`])
              if (!chosen.length) return <p className="text-muted">Pick at least one item.</p>
              const totals = chosen.reduce(
                (sum, row) => {
                  const money = rowMoney(row, Math.max(1, amounts[`${row.id}|${row.enchant}`] ?? 1))
                  return { investment: sum.investment + money.investment, tax: sum.tax + money.tax, profit: sum.profit + money.profit }
                },
                { investment: 0, tax: 0, profit: 0 },
              )
              return (
                <p>
                  {chosen.length} picked · investment {silver(totals.investment)} · tax {silver(totals.tax)} · profit{" "}
                  <span className={totals.profit >= 0 ? "text-sage" : "text-ember"}>{silver(totals.profit)}</span>
                  {" · "}
                  {pct(totals.investment > 0 ? totals.profit / totals.investment : 0)} ROI
                </p>
              )
            })()}
          </div>
        ) : null}
      </div>
      </div>
    </div>
  )
}
