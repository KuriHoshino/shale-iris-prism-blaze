import { useEffect, useMemo, useRef, useState } from "react"
import { RefreshCw, Trash2, Check } from "lucide-react"
import { craftMath } from "@/lib/forge/formulas"
import { enchantsOf, getItem, journalFor, marketId, matName, matWeight, upgradeSource, variantOf } from "@/lib/forge/lookup"
import { CRAFT_CITIES, HO_BIOMES, MARKETS, biomeById, biomeFavors, bonusBiome } from "@/lib/forge/rules"
import { moneySide, readQuote, useForge, type Line, type PriceBook } from "@/lib/forge/store"
import { Num, Select, Toggle, exact, fieldClass, orderAge, pct, priceAge, silver } from "./fields"
import { HourlyChart } from "./Hourly"
import { ItemPicker } from "./Picker"

function lookup(
  book: PriceBook,
  id: string,
  city: string,
  quality: number,
  side: "sell" | "buy",
  override: number | null | undefined,
): { price: number | null; from: string | null } {
  if (override != null && Number.isFinite(override)) return { price: override, from: null }
  return { price: moneySide(readQuote(book, id, city, quality), side), from: null }
}

function buyPlace(book: PriceBook, id: string, city: string, quality: number, side: "sell" | "buy") {
  return lookup(book, id, city, quality, side, null).from || city
}

function evaluateLine(line: Line, state: ReturnType<typeof useForge.getState>) {
  const item = getItem(line.itemId)
  if (!item) return null
  const raw = variantOf(item, line.enchant, line.route)
  const variant = upgradeSource(item, raw, line.upgradeFrom === "craft" ? "craft" : "buy")
  const buySide = state.buyMode === "instant" ? "sell" : "buy"
  const sellSide = state.sellMode === "instant" ? "buy" : "sell"
  const productId = marketId(item.id, variant.enchant)
  const sellAt = line.sellAt || state.sellCity
  const productSide = sellAt === "Black Market" || state.sellMode === "instant" ? "buy" : "sell"
  const product = lookup(state.prices, productId, sellAt, state.quality, productSide, line.productOverride)
  const notes: string[] = []
  if (product.from) notes.push(`${item.name} from ${product.from}`)
  const buyAt = line.shopCity || state.buyCity
  const boughtIn = (id: string) => {
    const city = line.matCities?.[id] || buyAt
    return city === "Black Market" ? CRAFT_CITIES[0] : city
  }
  const matLook = (id: string, city: string, side: "sell" | "buy", quality = 1) => {
    const found = lookup(state.prices, id, city, quality, side, line.matOverrides[id] ?? null)
    if (found.from) notes.push(`${id} from ${found.from}`)
    return found.price
  }
  const baseId =
    line.route === "upgrade" && line.upgradeFrom !== "craft"
      ? raw.mats.find((mat) => !/RUNE|SOUL|RELIC/.test(mat.id))?.id
      : undefined
  const chosen = line.journal ? [item.tier].filter((tier) => tier >= 2 && tier <= 8) : []
  const journalFills = chosen.flatMap((tier) => {
    const journal = journalFor(item.journal, tier)
    if (!journal) return []
    return [
      {
        tier,
        fame: journal.fame,
        empty: matLook(`${journal.id}_EMPTY`, boughtIn(`${journal.id}_EMPTY`), line.matModes?.[`${journal.id}_EMPTY`] ?? buySide),
        full: matLook(`${journal.id}_FULL`, line.matCities?.[`${journal.id}_FULL`] || sellAt, sellSide),
      },
    ]
  })
  const math = craftMath({
    variant,
    tier: item.tier,
    category: item.category,
    place: line.place,
    city: line.city,
    focus: line.focus,
    daily: line.daily,
    power: line.power,
    biome: line.hoBiome,
    mapQuality: line.hoQuality,
    region: line.hoRegion,
    extra: line.extra,
    runs: line.runs,
    mastery: line.mastery,
    specialist: line.specialist,
    siblings: line.siblings,
    focusOverride: line.focusOverride,
    premium: state.premium,
    buyMode: state.buyMode,
    sellMode: state.sellMode,
    productSellMode: sellAt === "Black Market" ? "notax" : state.sellMode,
    leftover: state.leftover,
    stationRate: state.stationRate,
    productUnit: product.price,
    matUnit: (id) => matLook(id, boughtIn(id), line.matModes?.[id] ?? buySide, id === baseId ? state.quality : 1),
    matSellUnit: (id) => matLook(id, sellAt, sellSide),
    journalFills,
    flip: false,
  })
  return { math, stoodIn: notes }
}

export function Bench() {
  const state = useForge()
  const line = state.lines.find((entry) => entry.uid === state.active) ?? state.lines[0]
  const item = line ? getItem(line.itemId) : undefined
  const [copied, setCopied] = useState(false)
  const [picking, setPicking] = useState(false)
  const [merged, setMerged] = useState<string[]>([])

  const evaluated = useMemo(() => (line ? evaluateLine(line, state) : null), [line, state])
  const math = evaluated?.math ?? null
  const variant = item && line ? upgradeSource(item, variantOf(item, line.enchant, line.route), line.upgradeFrom === "craft" ? "craft" : "buy") : undefined
  const journal = item ? journalFor(item.journal, item.tier) : undefined
  const buySide = state.buyMode === "instant" ? "sell" : "buy"
  const sellSide = state.sellMode === "instant" ? "buy" : "sell"
  const buyAt = line ? line.shopCity || state.buyCity : state.buyCity
  const sellAt = line?.sellAt || state.sellCity
  const fullJournal = journal && line ? lookup(state.prices, `${journal.id}_FULL`, line.matCities?.[`${journal.id}_FULL`] || sellAt, 1, sellSide, line.matOverrides[`${journal.id}_FULL`] ?? null) : { price: null, from: null }
  const routes = item && line ? item.variants.filter((entry) => entry.enchant === (variant?.enchant ?? line.enchant)) : []
  const hasUpgrade = routes.some((entry) => entry.route === "upgrade")
  const autoCities = useRef("")
  const favorKey = useRef("")

  useEffect(() => {
    if (!line) return
    const key = `${line.uid}|${line.itemId}|${line.place}`
    if (favorKey.current === key) return
    favorKey.current = key
    const crafted = getItem(line.itemId)
    if (!crafted) return
    const biome = bonusBiome(crafted.category)
    if (!biome) return
    if (line.place === "hideout") {
      if (line.hoBiome === biome) return
      state.patchLine(line.uid, { hoBiome: biome })
      return
    }
    const city = biomeById(biome).city
    if (line.city === city) return
    state.patchLine(line.uid, { city })
  }, [line, state])

  useEffect(() => {
    if (!item || !line || !variant) return
    const productId = marketId(item.id, variant.enchant)
    const key = `${line.uid}|${productId}|${state.quality}`
    if (autoCities.current === key) return
    const priced = (id: string, quality: number) => {
      let low: { city: string; price: number } | null = null
      let high: { city: string; price: number } | null = null
      for (const city of MARKETS) {
        const sell = moneySide(readQuote(state.prices, id, city, quality), "sell")
        if (sell == null) continue
        if (city !== "Black Market" && (!low || sell < low.price)) low = { city, price: sell }
        if (!high || sell > high.price) high = { city, price: sell }
      }
      return { low, high }
    }
    const product = priced(productId, state.quality)
    if (!product.low || !product.high) return
    const matCities = { ...line.matCities }
    for (const mat of variant.mats) {
      const row = priced(mat.id, 1)
      if (row.low) matCities[mat.id] = row.low.city
    }
    autoCities.current = key
    state.patch({ buyCity: product.low.city })
    state.patchLine(line.uid, { shopCity: product.low.city, matCities })
  }, [item, line, variant, state])

  const shop = useMemo(() => {
    const rows = new Map<string, { id: string; city: string; qty: number; cost: number | null }>()
    let weight = 0
    for (const entry of state.lines) {
      const result = evaluateLine(entry, state)
      if (!result) continue
      for (const mat of result.math.consumed) {
        const picked = entry.matCities?.[mat.id] || entry.shopCity || state.buyCity
        const chosen = picked === "Black Market" ? CRAFT_CITIES[0] : picked
        const side = entry.matModes?.[mat.id] ?? (state.buyMode === "instant" ? "sell" : "buy")
        const city = buyPlace(state.prices, mat.id, chosen, 1, side)
        const key = `${mat.id}|${city}`
        const current = rows.get(key) ?? { id: mat.id, city, qty: 0, cost: 0 }
        const cost = current.cost == null || mat.cost == null ? null : current.cost + mat.cost
        rows.set(key, { id: mat.id, city, qty: current.qty + mat.qty, cost })
        weight += mat.qty * matWeight(mat.id)
      }
      if (!entry.flip && entry.journal) {
        const made = getItem(entry.itemId)
        const side = state.buyMode === "instant" ? "sell" : "buy"
        for (const fill of result.math.journalRows) {
          const book = made ? journalFor(made.journal, fill.tier) : undefined
          if (!book) continue
          const id = `${book.id}_EMPTY`
          const picked = entry.matCities?.[id] || entry.shopCity || state.buyCity
          const chosen = picked === "Black Market" ? CRAFT_CITIES[0] : picked
          const city = buyPlace(state.prices, id, chosen, 1, side)
          const key = `${id}|${city}`
          const current = rows.get(key) ?? { id, city, qty: 0, cost: 0 }
          rows.set(key, { id, city, qty: current.qty + fill.count, cost: current.cost })
        }
      }
    }
    return {
      weight,
      rows: [...rows.values()].sort((a, b) => b.qty - a.qty),
    }
  }, [state])

  const plan = useMemo(() => {
    const rows = state.lines.map((entry) => {
      const result = evaluateLine(entry, state)
      const named = getItem(entry.itemId)
      return {
        uid: entry.uid,
        name: named ? `${named.name} .${entry.enchant}` : "Recipe",
        profit: result?.math.profit ?? null,
      }
    })
    return { rows }
  }, [state])

  if (!line || !item || !variant || !math) {
    return <p className="text-muted">That recipe is no longer in the desk.</p>
  }

  const productId = marketId(item.id, variant.enchant)
  const itemSide = sellAt === "Black Market" || state.sellMode === "instant" ? "buy" : "sell"
  const profitClass = math.profit == null ? "text-parchment" : math.profit >= 0 ? "text-sage" : "text-ember"
  const mergeRows = plan.rows.filter((row) => merged.includes(row.uid))
  const mergeTotal = mergeRows.length > 0 && mergeRows.every((row) => row.profit != null)
    ? mergeRows.reduce((sum, row) => sum + (row.profit ?? 0), 0)
    : null
  const focused = evaluateLine({ ...line, focus: true }, state)
  const plain = evaluateLine({ ...line, focus: false }, state)
  const focusEach = focused?.math.focusEach ?? 0
  const focusBatch = focusEach * line.runs
  const focusGain =
    focused?.math.profit != null && plain?.math.profit != null ? focused.math.profit - plain.math.profit : null
  const perFocus = focusGain != null && focusBatch > 0 ? focusGain / focusBatch : null
  const fromPool = perFocus == null ? null : perFocus * 10000

  async function copyList() {
    const text = shop.rows
      .map((row) => `${Math.ceil(row.qty)}  ${matName(row.id)}  · ${row.city}`)
      .join("\n")
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      return
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {state.lines.map((entry) => {
          const named = getItem(entry.itemId)
          const on = entry.uid === line.uid
          return (
            <button
              key={entry.uid}
              type="button"
              onClick={() => state.setActive(entry.uid)}
              className={
                "h-11 shrink-0 rounded-full border px-3 text-sm " +
                (on ? "border-brass text-brass" : "border-line text-muted")
              }
            >
              {named ? `${named.name} .${entry.enchant}` : "Recipe"}
            </button>
          )
        })}
        <button
          type="button"
          onClick={() => setPicking((open) => !open)}
          className="h-11 shrink-0 rounded-full border border-line px-3 text-sm text-parchment"
        >
          Add craft
        </button>
      </div>

      {picking ? (
        <section className="rounded-lg border border-line bg-panel p-4">
          <ItemPicker
            onPick={(id) => {
              state.addLine(id)
              setPicking(false)
            }}
          />
        </section>
      ) : null}

      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3">
      <div className="flex min-w-0 flex-col gap-4 lg:col-span-2">

        <section className="rounded-lg border border-line bg-panel p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl text-parchment">{item.name}</h2>
              <p className="mt-1 text-sm text-muted">
                T{item.tier}.{variant.enchant} · {item.station}
                {item.study ? " · can be studied" : " · no studying"}
              </p>
            </div>
            {state.lines.length > 1 ? (
              <button
                type="button"
                onClick={() => state.removeLine(line.uid)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-line text-muted"
                aria-label="Remove craft"
              >
                <Trash2 className="size-4" />
              </button>
            ) : null}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Select
              label="Enchant"
              value={String(line.enchant)}
              onChange={(value) => {
                const enchant = Number(value)
                const next = variantOf(item, enchant, line.route)
                state.patchLine(line.uid, { enchant, route: next.route })
              }}
              options={enchantsOf(item).map((enchant) => ({ value: String(enchant), label: `.${enchant}` }))}
            />
            <Select
              label="Route"
              value={variant.route}
              onChange={(value) => state.patchLine(line.uid, { route: value as Line["route"] })}
              options={[
                { value: "direct", label: "Direct craft" },
                ...(hasUpgrade || line.route === "upgrade" ? [{ value: "upgrade", label: "Upgrade" }] : []),
              ]}
            />
            <Num label="Runs" min={0} value={line.runs} onChange={(runs) => state.patchLine(line.uid, { runs })} />
            {variant.route === "upgrade" ? (
              <Select
                label="Base item"
                value={line.upgradeFrom === "craft" ? "craft" : "buy"}
                onChange={(value) => state.patchLine(line.uid, { upgradeFrom: value === "craft" ? "craft" : "buy" })}
                options={[
                  { value: "buy", label: "Buy from market" },
                  { value: "craft", label: "Craft it" },
                ]}
              />
            ) : null}
          </div>
          {variant.route === "upgrade" ? (
            <ul className="mt-3 flex flex-col gap-1 text-sm">
              {variant.mats
                .filter((mat) => /RUNE|SOUL|RELIC/.test(mat.id))
                .map((mat) => {
                  const bought = math.consumed.find((row) => row.id === mat.id)
                  const qty = bought?.qty ?? mat.qty * line.runs
                  return (
                    <li key={mat.id} className="flex items-baseline justify-between gap-3">
                      <span className="text-parchment">{matName(mat.id)}</span>
                      <span className="tabular-nums text-muted">
                        {exact(qty)} for {exact(line.runs)} · {exact(mat.qty)} each
                      </span>
                    </li>
                  )
                })}
            </ul>
          ) : null}
        </section>

        <section className="rounded-lg border border-line bg-panel p-4">
          <h3 className="text-sm font-semibold tracking-wide text-brass uppercase">Station</h3>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Select
              label="Where"
              value={line.place}
              onChange={(place) => {
                const biome = bonusBiome(item.category)
                const city = biome ? biomeById(biome).city : line.city
                if (place === "hideout") {
                  state.patchLine(line.uid, {
                    place: "hideout",
                    hoRegion: "outlands",
                    city,
                    ...(biome ? { hoBiome: biome } : {}),
                  })
                  return
                }
                state.patchLine(line.uid, { place: place as Line["place"], city })
              }}
              options={[
                { value: "city", label: "Royal city" },
                { value: "island", label: "Island" },
                { value: "hideout", label: "Hideout" },
              ]}
            />
            {line.place === "hideout" ? (
              <Select
                label="Region"
                value={line.hoRegion ?? "outlands"}
                onChange={(hoRegion) =>
                  state.patchLine(line.uid, {
                    hoRegion: hoRegion as Line["hoRegion"],
                    ...(hoRegion === "roads" ? { hoQuality: 1 } : {}),
                  })
                }
                options={[
                  { value: "outlands", label: "Outlands" },
                  { value: "roads", label: "Roads of Avalon" },
                ]}
              />
            ) : (
              <Select
                label={line.place === "island" ? "Island city" : "Craft city"}
                value={line.city}
                onChange={(city) => state.patchLine(line.uid, { city })}
                options={CRAFT_CITIES.map((city) => ({ value: city, label: city }))}
              />
            )}
            {line.place === "hideout" ? (
              <Select
                label="City"
                value={line.hoBiome ?? "forest"}
                onChange={(hoBiome) => state.patchLine(line.uid, { hoBiome: hoBiome as Line["hoBiome"] })}
                options={HO_BIOMES.map((biome) => ({ value: biome.id, label: biome.label }))}
              />
            ) : null}
            {line.place === "hideout" && biomeById(line.hoBiome).kind === "hideout" ? (
              <Select
                label="Map quality"
                value={String(line.hoRegion === "roads" ? 1 : (line.hoQuality ?? 4))}
                onChange={(value) => state.patchLine(line.uid, { hoQuality: Number(value) })}
                options={(line.hoRegion === "roads" ? [1] : [1, 2, 3, 4, 5, 6]).map((quality) => ({
                  value: String(quality),
                  label: line.hoRegion === "roads" ? "Q1 (Roads)" : `Q${quality}`,
                }))}
              />
            ) : null}
            {line.place === "hideout" && biomeById(line.hoBiome).kind === "hideout" ? (
              <Select
                label="Hideout level"
                value={String(Math.min(9, Math.max(1, Math.round(line.power || 1))))}
                onChange={(value) => state.patchLine(line.uid, { power: Number(value) })}
                options={[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => ({ value: String(level), label: String(level) }))}
              />
            ) : null}
            <Select
              label="Daily bonus"
              value={String(line.daily)}
              onChange={(value) => state.patchLine(line.uid, { daily: Number(value) as Line["daily"] })}
              options={[
                { value: "0", label: "None" },
                { value: "10", label: "+10%" },
                { value: "20", label: "+20%" },
              ]}
            />
            <Num
              label="Extra bonus"
              value={line.extra}
              onChange={(extra) => state.patchLine(line.uid, { extra })}
            />
            <Num
              label="Fee / 100 nutrition"
              min={0}
              value={state.stationRate}
              onChange={(stationRate) => state.patch({ stationRate })}
            />
            <Num
              label="Base focus override"
              min={0}
              value={line.focusOverride ?? variant.focus}
              onChange={(focusOverride) => state.patchLine(line.uid, { focusOverride })}
            />
          </div>
          {line.place === "hideout" ? (
            <p className="mt-3 text-xs text-muted">
              {biomeById(line.hoBiome).kind === "city" ? (
                <>
                  {biomeById(line.hoBiome).label} is a city station, not a hideout.{" "}
                  {biomeById(line.hoBiome).favors}. Map quality and hideout level do not apply. Food is Caerleon.
                  Bags and capes are Brecilien.
                </>
              ) : (
                <>
                  {biomeById(line.hoBiome).label} favors {biomeById(line.hoBiome).favors.toLowerCase()}.{" "}
                  {biomeFavors(line.hoBiome, item.category)
                    ? item.group === "refine"
                      ? "This refine gets the hideout base plus level. Map quality does not change refining."
                      : `This craft uses the ${line.hoRegion === "roads" ? "Roads Q1" : `${biomeById(line.hoBiome).label} Q${line.hoQuality ?? 4}`} specialty, then hideout level.`
                    : "This item is not a specialty here, so only hideout level applies."}
                </>
              )}
            </p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2">
            <Toggle on={line.focus} onClick={() => state.patchLine(line.uid, { focus: !line.focus })}>
              Use focus
            </Toggle>
            <Toggle on={state.premium} onClick={() => state.patch({ premium: !state.premium })}>
              Premium
            </Toggle>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <Num label="Mastery" min={0} value={line.mastery} onChange={(mastery) => state.patchLine(line.uid, { mastery })} />
            <Num
              label="Specialist"
              min={0}
              value={line.specialist}
              onChange={(specialist) => state.patchLine(line.uid, { specialist })}
            />
            <Num
              label="Other specs"
              min={0}
              value={line.siblings}
              onChange={(siblings) => state.patchLine(line.uid, { siblings })}
            />
          </div>
          <p className="mt-2 text-xs text-muted">
            Efficiency {exact(math.efficiency)} · focus {exact(math.focusEach)} each · {exact(math.focusTotal)} for the batch.
            Own specialist is 280 per level, mastery and each sibling specialist are 30.
          </p>
        </section>

        <section className="rounded-lg border border-line bg-panel p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold tracking-wide text-brass uppercase">Markets</h3>
            <button
              type="button"
              onClick={() => void state.loadPrices()}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-brass px-3 text-sm font-semibold text-ink"
            >
              <RefreshCw className={"size-4 " + (state.loading ? "animate-spin" : "")} />
              {state.loading && state.priceAt == null ? "Loading" : "Live prices"}
            </button>
          </div>
          <p className="mt-2 text-xs text-muted">
            {state.priceAt
              ? `Live order book, refreshed ${new Date(state.priceAt).toLocaleTimeString()}. It checks again every minute.`
              : "Fetching the live order book."}
            {state.loading && state.priceAt != null ? " Updating." : ""}
          </p>
          {state.priceError ? <p className="mt-2 text-sm text-ember">{state.priceError}</p> : null}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Select
              label="Buy as"
              value={state.buyMode}
              onChange={(buyMode) => state.patch({ buyMode: buyMode as typeof state.buyMode })}
              options={[
                { value: "instant", label: "Instant (sell orders)" },
                { value: "order", label: "Buy order + 2.5%" },
              ]}
            />
            <Select
              label="Sell as"
              value={state.sellMode}
              onChange={(sellMode) => state.patch({ sellMode: sellMode as typeof state.sellMode })}
              options={[
                { value: "order", label: "Sell order, tax + 2.5%" },
                { value: "instant", label: "Instant, tax only" },
                { value: "notax", label: "No tax" },
              ]}
            />
            <Select
              label="Product quality"
              value={String(state.quality)}
              onChange={(value) => state.patch({ quality: Number(value) })}
              options={[
                { value: "1", label: "Normal" },
                { value: "2", label: "Good" },
                { value: "3", label: "Outstanding" },
                { value: "4", label: "Excellent" },
                { value: "5", label: "Masterpiece" },
              ]}
            />
            <Select
              label="Returns"
              value={state.leftover}
              onChange={(leftover) => state.patch({ leftover: leftover as typeof state.leftover })}
              options={[
                { value: "reuse", label: "Reuse, sell the last return" },
                { value: "sell", label: "Sell every return" },
              ]}
            />
          </div>
          <div className="mt-4">
            <h3 className="text-base font-semibold text-parchment">Input materials ({variant.mats.length})</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {variant.mats.map((mat) => {
                const side = line.matModes?.[mat.id] ?? buySide
                const picked = line.matCities?.[mat.id] || buyAt
                const city = picked === "Black Market" ? CRAFT_CITIES[0] : picked
                const quality =
                  variant.route === "upgrade" && line.upgradeFrom !== "craft" && !/RUNE|SOUL|RELIC/.test(mat.id)
                    ? state.quality
                    : 1
                const quote = lookup(state.prices, mat.id, city, quality, side, null)
                const quoteRow = readQuote(state.prices, mat.id, city, quality)
                const bought = math?.consumed.find((row) => row.id === mat.id)
                const left = math?.leftovers.find((row) => row.id === mat.id)
                return (
                  <MatCard
                    key={mat.id}
                    name={matName(mat.id)}
                    itemId={mat.id}
                    prices={state.prices}
                    amount={bought?.qty ?? mat.qty * line.runs}
                    leftover={left?.qty ?? 0}
                    city={city}
                    side={side}
                    market={quote.price}
                    age={orderAge(side === "sell" ? quoteRow?.sellDate : quoteRow?.buyDate)}
                    userPrice={line.matOverrides[mat.id] ?? null}
                    total={bought?.cost ?? null}
                    onCity={(next) => state.patchLine(line.uid, { matCities: { ...line.matCities, [mat.id]: next } })}
                    onSide={(next) => state.patchLine(line.uid, { matModes: { ...line.matModes, [mat.id]: next } })}
                    onPrice={(value) => state.setMatOverride(line.uid, mat.id, value)}
                  />
                )
              })}
            </div>
            {line.route !== "upgrade" || variant.enchant < 1 ? null : (
              <p className="mt-3 text-xs text-muted">
                .{variant.enchant} includes every stone up to here.
                {variant.enchant >= 1 ? " Runes for .1." : ""}
                {variant.enchant >= 2 ? " Souls for .2." : ""}
                {variant.enchant >= 3 ? " Relics for .3." : ""} Plus the flat item.
              </p>
            )}
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-parchment">Journal and sell price</h3>
              {journal ? (
                <button
                  type="button"
                  onClick={() =>
                    state.patchLine(line.uid, {
                      journal: !line.journal,
                      journalTier: item.tier,
                      journalTiers: line.journal ? [] : [item.tier],
                    })
                  }
                  className={
                    "h-11 rounded-lg border px-3 text-sm " +
                    (line.journal ? "border-brass text-brass" : "border-line text-muted")
                  }
                >
                  {line.journal ? "Journal added" : "Add journal"}
                </button>
              ) : null}
            </div>
            <HourlyChart
              server={state.server}
              itemId={productId}
              itemName={`${item.name} .${variant.enchant}`}
              quality={state.quality}
              side={itemSide}
              usedCity={sellAt}
              onUse={(city, price) => {
                state.patch({ sellCity: city })
                state.patchLine(line.uid, { sellAt: city, productOverride: price })
              }}
            />
            <PriceRow
              role="Item price"
              name={`${item.name} .${variant.enchant}`}
              market={lookup(state.prices, productId, sellAt, state.quality, itemSide, null).price}
              hint={lookup(state.prices, productId, sellAt, state.quality, itemSide, null).from}
              value={line.productOverride}
              onChange={(productOverride) => state.patchLine(line.uid, { productOverride })}
              cityLabel="Sell in"
              city={sellAt}
              cities={liveSellOptions(state.prices, productId, state.quality, itemSide)}
              onCity={(city) => {
                state.patch({ sellCity: city })
                state.patchLine(line.uid, { sellAt: city, productOverride: null })
              }}
              priceBox={false}
              manual
            />
            {line.journal && journal ? (
              <div className="grid gap-3 md:grid-cols-2">
                <MatCard
                  name={`${journal.name} (Empty)`}
                  itemId={`${journal.id}_EMPTY`}
                  prices={state.prices}
                  amount={math?.journalRows[0]?.count ?? 0}
                  leftover={0}
                  city={(() => {
                    const picked = line.matCities?.[`${journal.id}_EMPTY`] || buyAt
                    return picked === "Black Market" ? CRAFT_CITIES[0] : picked
                  })()}
                  side={line.matModes?.[`${journal.id}_EMPTY`] ?? buySide}
                  market={
                    lookup(
                      state.prices,
                      `${journal.id}_EMPTY`,
                      line.matCities?.[`${journal.id}_EMPTY`] || buyAt,
                      1,
                      line.matModes?.[`${journal.id}_EMPTY`] ?? buySide,
                      null,
                    ).price
                  }
                  age={orderAge(
                    (line.matModes?.[`${journal.id}_EMPTY`] ?? buySide) === "sell"
                      ? readQuote(state.prices, `${journal.id}_EMPTY`, line.matCities?.[`${journal.id}_EMPTY`] || buyAt, 1)?.sellDate
                      : readQuote(state.prices, `${journal.id}_EMPTY`, line.matCities?.[`${journal.id}_EMPTY`] || buyAt, 1)?.buyDate,
                  )}
                  userPrice={line.matOverrides[`${journal.id}_EMPTY`] ?? null}
                  total={(() => {
                    const price = lookup(
                      state.prices,
                      `${journal.id}_EMPTY`,
                      line.matCities?.[`${journal.id}_EMPTY`] || buyAt,
                      1,
                      line.matModes?.[`${journal.id}_EMPTY`] ?? buySide,
                      line.matOverrides[`${journal.id}_EMPTY`] ?? null,
                    ).price
                    return price == null || !math?.journalRows[0] ? null : price * math.journalRows[0].count
                  })()}
                  onCity={(next) =>
                    state.patchLine(line.uid, { matCities: { ...line.matCities, [`${journal.id}_EMPTY`]: next } })
                  }
                  onSide={(next) =>
                    state.patchLine(line.uid, { matModes: { ...line.matModes, [`${journal.id}_EMPTY`]: next } })
                  }
                  onPrice={(value) => state.setMatOverride(line.uid, `${journal.id}_EMPTY`, value)}
                />
                <PriceRow
                  role="Full journal price"
                  name="Full"
                  market={fullJournal.price}
                  hint={fullJournal.from}
                  value={line.matOverrides[`${journal.id}_FULL`] ?? null}
                  onChange={(value) => state.setMatOverride(line.uid, `${journal.id}_FULL`, value)}
                  cityLabel="Sell in"
                  city={line.matCities?.[`${journal.id}_FULL`] || sellAt}
                  cities={citiesWith(state.prices, `${journal.id}_FULL`, 1, sellSide, line.matCities?.[`${journal.id}_FULL`] || sellAt)}
                  age={quoteAge(state.prices, `${journal.id}_FULL`, line.matCities?.[`${journal.id}_FULL`] || sellAt, 1, sellSide)}
                  onCity={(next) =>
                    state.patchLine(line.uid, { matCities: { ...line.matCities, [`${journal.id}_FULL`]: next } })
                  }
                />
              </div>
            ) : null}
          </div>
          <p className="mt-3 text-xs text-muted">
            Prices are the cheapest sell and the highest buy on the Albion Online Data Project order book. A typed
            number overrides that quote and stops following the market. Tax is 4% with Premium and 8% without. Sell
            orders also pay a 2.5% setup fee. Black Market and direct trades use “No tax”.
          </p>
        </section>

        <section className="rounded-lg border border-line bg-panel p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold tracking-wide text-brass uppercase">Shopping list</h3>
            <button type="button" onClick={() => void copyList()} className="h-11 rounded-lg border border-line px-3 text-sm">
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="mt-1 text-sm text-muted">
            Profit {silver(math.profit)} · about {exact(shop.weight)} kg
          </p>
          <ul className="mt-3 flex flex-col">
            {shop.rows.map((row) => (
              <li key={`${row.id}|${row.city}`} className="flex items-baseline justify-between gap-3 border-b border-line py-2 text-sm last:border-b-0">
                <span>
                  {matName(row.id)}
                  <span className="ml-2 text-muted">buy {Math.ceil(row.qty)}</span>
                  <span className="ml-2 text-brass">{row.city}</span>
                </span>
                <span className="tabular-nums text-muted">{silver(row.cost)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <aside className="order-first self-start lg:sticky lg:top-40 lg:z-20 lg:order-none">
        <section className="rounded-lg border border-line bg-panel p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted">Batch profit</p>
            <button
              type="button"
              onClick={() =>
                setMerged((ids) => (ids.includes(line.uid) ? ids.filter((id) => id !== line.uid) : [...ids, line.uid]))
              }
              className={
                "h-11 rounded-lg border px-3 text-sm " +
                (merged.includes(line.uid) ? "border-brass text-brass" : "border-line text-muted")
              }
            >
              {merged.includes(line.uid) ? "In merge" : "Add to merge"}
            </button>
          </div>
          <p className={"font-sans text-4xl font-semibold tabular-nums tracking-tight " + profitClass}>{silver(math.profit)}</p>
          <p className="mt-1 text-sm text-muted">
            {math.profit == null
              ? `Need prices${math.missing.length ? ` for ${[...new Set(math.missing)].map((id) => (id === "product" ? "the item" : id === "journal" ? "the journal" : matName(id))).join(", ")}` : ""}`
              : `${silver(math.profit / Math.max(1, math.items))} each · ${math.margin == null ? "—" : pct(math.margin)} margin`}
            {evaluated?.stoodIn.length ? " · a missing city quote was filled from another market" : ""}
          </p>
          {mergeRows.length > 0 ? (
            <div className="mt-3 border-t border-line pt-3">
              <p className="text-sm text-muted">Merged profit</p>
              <p className={"mt-1 text-2xl font-semibold tabular-nums " + (mergeTotal == null ? "text-parchment" : mergeTotal >= 0 ? "text-sage" : "text-ember")}>
                {silver(mergeTotal)}
              </p>
              <ul className="mt-2 flex flex-col">
                {mergeRows.map((row) => (
                    <li key={row.uid} className="flex items-baseline justify-between gap-3 py-1 text-sm">
                      <button type="button" onClick={() => state.setActive(row.uid)} className={row.uid === line.uid ? "text-brass" : "text-parchment"}>
                        {row.name}
                      </button>
                      <span className="tabular-nums text-muted">{silver(row.profit)}</span>
                    </li>
                  ))}
              </ul>
            </div>
          ) : null}
          <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
            <Stat label="Return rate" value={pct(math.rrr)} />
            <Stat label="Material" value={silver(math.materialCost)} />
            <Stat label="Station fee" value={silver(math.fee)} />
            <Stat label="Revenue" value={silver(math.revenue)} />
            <Stat label="Returns sold" value={silver(math.leftoverValue)} />
            <Stat label="Item value" value={exact(variant.value)} />
            <Stat label="Nutrition" value={exact(math.nutrition)} />
            <Stat label="Fame" value={exact(math.fameTotal)} />
            <Stat label="Focus each" value={focusEach > 0 ? exact(focusEach) : "—"} />
            <Stat label="Focus for batch" value={focusBatch > 0 ? exact(focusBatch) : "—"} />
            <Stat label="Silver / focus" value={silver(perFocus)} />
            <Stat label="Study fame / item" value={item.study ? exact(math.studyEach) : "—"} />
            <Stat
              label="Journals"
              value={math.journalRows.length ? math.journalRows.map((row) => `T${row.tier} ${exact(row.count)}`).join(" · ") : "Off"}
            />
            <Stat label="Journal profit" value={math.journalRows.length ? silver(math.journalProfit) : "—"} />
          </dl>
          <p className="mt-3 text-xs text-muted">
            {focusEach <= 0
              ? "This craft has no focus cost."
              : line.focus
                ? "This profit includes the focus return bonus."
                : "This profit does not spend focus."}{" "}
            {focusGain == null
              ? "Need prices to value the focus."
              : `Using focus ${focusGain >= 0 ? "adds" : "loses"} ${silver(Math.abs(focusGain))} on this batch, ${silver(perFocus)} per focus. 10,000 focus is about ${silver(fromPool)}.`}
          </p>
        </section>
      </aside>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <dt className="text-muted">{label}</dt>
      <dd className="tabular-nums text-parchment">{value}</dd>
    </div>
  )
}

function MatCard({
  name,
  itemId,
  prices,
  amount,
  leftover,
  city,
  side,
  market,
  age,
  userPrice,
  total,
  onCity,
  onSide,
  onPrice,
}: {
  name: string
  itemId: string
  prices: PriceBook
  amount: number
  leftover: number
  city: string
  side: "sell" | "buy"
  market: number | null
  age: string
  userPrice: number | null
  total: number | null
  onCity: (city: string) => void
  onSide: (side: "sell" | "buy") => void
  onPrice: (value: number | null) => void
}) {
  const kind = side === "sell" ? "Sell order" : "Buy order"
  return (
    <article className="rounded-lg border border-line bg-ink p-3">
      <h4 className="text-sm font-medium text-parchment">{name}</h4>
      <p className="mt-2 text-sm text-parchment">
        Amount: {exact(amount)}
        {leftover > 0 ? <span className="text-muted"> ({exact(leftover)} leftover)</span> : null}
      </p>
      <label className="mt-3 block text-xs text-muted">
        Buy location
        <select className={fieldClass + " mt-1"} value={(CRAFT_CITIES as readonly string[]).includes(city) ? city : CRAFT_CITIES[0]} onChange={(event) => onCity(event.target.value)}>
          {CRAFT_CITIES.map((marketCity) => {
            const quote = readQuote(prices, itemId, marketCity, 1)
            const price = moneySide(quote, side)
            const stamp = orderAge(side === "sell" ? quote?.sellDate : quote?.buyDate)
            const label =
              price == null ? `${marketCity} Market` : `${marketCity} Market · ${silver(price)}${stamp ? ` · ${stamp}` : ""}`
            return (
              <option key={marketCity} value={marketCity}>
                {label}
              </option>
            )
          })}
        </select>
      </label>
      <label className="mt-2 block text-xs text-muted">
        Price type
        <select
          className={fieldClass + " mt-1"}
          value={side}
          onChange={(event) => onSide(event.target.value === "buy" ? "buy" : "sell")}
        >
          <option value="sell">Sell order</option>
          <option value="buy">Buy order</option>
        </select>
      </label>
      <label className="mt-2 block text-xs text-muted">
        User price
        <input
          className={fieldClass + " mt-1"}
          inputMode="decimal"
          placeholder="0"
          value={userPrice ?? ""}
          onChange={(event) => onPrice(event.target.value.trim() === "" ? null : Number(event.target.value))}
        />
      </label>
      <p className="mt-2 text-sm text-muted">
        {market == null ? `${kind}: no data` : `${kind}${age ? ` (${age})` : ""}: ${silver(market)}`}
      </p>
      <p className="mt-3 flex items-baseline justify-between gap-3 border-t border-line pt-3 text-sm">
        <span className="text-muted">Total cost</span>
        <span className="text-lg font-semibold tabular-nums text-parchment">{silver(total)}</span>
      </p>
    </article>
  )
}

function liveSellOptions(book: PriceBook, id: string, quality: number, side: "sell" | "buy") {
  return MARKETS.map((city) => {
    const quote = readQuote(book, id, city, quality)
    const price = moneySide(quote, side)
    const age = priceAge(side === "sell" ? quote?.sellDate : quote?.buyDate)
    if (price == null) return { value: city, label: `${city} · no order` }
    return { value: city, label: age ? `${city} · ${silver(price)} · ${age}` : `${city} · ${silver(price)}` }
  })
}

function citiesWith(
  book: PriceBook,
  id: string,
  quality: number,
  side: "sell" | "buy",
  current: string,
  places: readonly string[] = MARKETS,
) {
  const listed = places.filter((city) => moneySide(readQuote(book, id, city, quality), side) != null)
  const cities = listed.length ? [...listed] : [...places]
  if (!cities.includes(current as (typeof MARKETS)[number])) cities.unshift(current as (typeof MARKETS)[number])
  return cities.map((city) => {
    const quote = readQuote(book, id, city, quality)
    const price = moneySide(quote, side)
    const age = priceAge(side === "sell" ? quote?.sellDate : quote?.buyDate)
    if (price == null) return { value: city, label: city }
    return { value: city, label: age ? `${city} · ${silver(price)} · ${age}` : `${city} · ${silver(price)}` }
  })
}

function quoteAge(book: PriceBook, id: string, city: string, quality: number, side: "sell" | "buy") {
  const quote = readQuote(book, id, city, quality)
  return priceAge(side === "sell" ? quote?.sellDate : quote?.buyDate)
}

function PriceRow({
  role,
  name,
  market,
  hint,
  value,
  onChange,
  cityLabel,
  city,
  cities,
  onCity,
  age,
  priceBox = true,
  manual = false,
}: {
  role: string
  name: string
  market: number | null
  hint: string | null
  value: number | null
  onChange: (value: number | null) => void
  cityLabel: string
  city: string
  cities: { value: string; label: string }[]
  onCity: (city: string) => void
  age?: string
  priceBox?: boolean
  manual?: boolean
}) {
  const locked = value != null && market != null && value === market
  return (
    <div className="flex min-w-0 flex-col gap-1 text-sm">
      <span className="text-muted">{role}</span>
      <span className="truncate text-parchment">
        {name}
        {hint ? <span className="ml-2 text-xs text-muted">using {hint}</span> : null}
      </span>
      <Select label={cityLabel} value={city} onChange={onCity} options={cities} />
      {manual ? (
        <label className="text-xs text-muted">
          Manual price
          <input
            className={fieldClass + " mt-1"}
            inputMode="decimal"
            placeholder={market == null ? "Leave empty for the live price" : `Live ${silver(market)}`}
            value={value ?? ""}
            onChange={(event) => onChange(event.target.value.trim() === "" ? null : Number(event.target.value))}
            aria-label={`Manual price for ${name}`}
          />
        </label>
      ) : null}
      {priceBox ? (
        <>
          <span className="flex items-center gap-2">
            <span className="tabular-nums text-base text-parchment">
              {market == null ? "No live order" : age ? `${silver(market)} · ${age}` : silver(market)}
            </span>
            <button
              type="button"
              disabled={market == null}
              onClick={() => market != null && onChange(market)}
              aria-label={`Put ${role} into the box`}
              className={
                "grid size-8 shrink-0 place-items-center rounded-md border " +
                (locked ? "border-brass text-brass" : "border-line text-muted")
              }
            >
              <Check className="size-4" />
            </button>
          </span>
          <input
            className={fieldClass}
            inputMode="decimal"
            placeholder="Type a price to override"
            value={value ?? ""}
            onChange={(event) => onChange(event.target.value === "" ? null : Number(event.target.value))}
            aria-label={`${role}: ${name}`}
          />
        </>
      ) : null}
    </div>
  )
}

