import { useEffect, useMemo, useState, type ReactNode } from "react"
import animals from "@/lib/forge/data/aog-animals.json"
import {
  CROP_PRODUCT,
  FARM_ROWS,
  ISLAND_CITIES,
  farmFocusCost,
  farmProfit,
  islandCities,
  npcSeedPrice,
  type IslandCity,
} from "@/lib/forge/farming"
import { liveId } from "@/lib/forge/lookup"
import { marketStatsUrl } from "@/lib/forge/marketBase"
import { fetchMarketPrices, loadMarketPrices, type PriceQuote } from "@/lib/forge/prices"
import { SETUP_FEE, TAX_PREMIUM, TAX_STANDARD } from "@/lib/forge/rules"
import { ItemIcon, Num, Select, exact, priceAge, silver } from "./fields"

type Book = Record<string, Record<string, Record<string, PriceQuote>>>
type Animal = (typeof animals)[number]
type Kind = "farm" | "breed"
type CropTab = "all" | "crop" | "herb"

const CROPS = FARM_ROWS.filter((row) => row.group === "crop" || row.group === "herb")

export function FarmLab() {
  const [kind, setKind] = useState<Kind>("farm")
  return (
    <div className="grid gap-section">
      <div className="grid grid-cols-2 gap-2">
        <ModeButton
          on={kind === "farm"}
          title="Farming"
          note="Crops and herbs"
          onClick={() => setKind("farm")}
        />
        <ModeButton
          on={kind === "breed"}
          title="Animals"
          note="Pasture, mounts, and kennels"
          onClick={() => setKind("breed")}
        />
      </div>
      {kind === "farm" ? <CropBoard /> : <AnimalBoard />}
    </div>
  )
}

function CropBoard() {
  const [island, setIsland] = useState<IslandCity>("Lymhurst")
  const [seedCity, setSeedCity] = useState<IslandCity>("Fort Sterling")
  const [sellCity, setSellCity] = useState<IslandCity>("Fort Sterling")
  const [premium, setPremium] = useState(true)
  const [cityBonus, setCityBonus] = useState(true)
  const [sellOrder, setSellOrder] = useState(true)
  const [buyOrder, setBuyOrder] = useState(true)
  const [merchant, setMerchant] = useState(false)
  const [watered, setWatered] = useState<Record<string, boolean>>({})
  const [showYield, setShowYield] = useState(true)
  const [labels, setLabels] = useState(false)
  const [discount, setDiscount] = useState(0)
  const [worms, setWorms] = useState(0)
  const [specs, setSpecs] = useState<Record<string, number>>({})
  const [cropMastery, setCropMastery] = useState(0)
  const [herbMastery, setHerbMastery] = useState(0)
  const [edit, setEdit] = useState<"crop" | "herb" | null>(null)
  const [volume, setVolume] = useState(9)
  const [tab, setTab] = useState<CropTab>("all")
  const [sort, setSort] = useState("tier")
  const [book, setBook] = useState<Book>({})
  const [sold, setSold] = useState<Record<string, number>>({})
  const [typed, setTyped] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [note, setNote] = useState("Prices come from the Asia data project. An empty city falls back to Albion Free Market.")

  const rows = useMemo(() => {
    const list = CROPS.filter((row) => tab === "all" || row.group === tab).map((row) => {
      const product = CROP_PRODUCT[row.id]
      const spec = specs[row.id] ?? 0
      const watering = Boolean(watered[row.id])
      const focusEach = farmFocusCost(row.group === "herb" ? herbMastery : cropMastery, spec)
      const bonus = cityBonus && islandCities(row.id).includes(island)
      const seedLive = quote(book, row.id, seedCity)
      const productLive = quote(book, product.id, sellCity)
      const seedUnit = merchant
        ? npcSeedPrice(row.tier) * (1 - Math.min(100, Math.max(0, discount)) / 100)
        : typed[row.id] ?? seedLive?.sell ?? 0
      const productUnit = typed[product.id] ?? productLive?.sell ?? 0
      const seedPay = merchant ? seedUnit : buyOrder ? seedUnit * (1 + SETUP_FEE) : seedUnit
      const productNet = netSell(productUnit, premium, sellOrder)
      const known = seedPay > 0 && productNet > 0
      const priced = known
        ? farmProfit(row, volume, premium, bonus, seedPay, productNet, worms, watering ? focusEach : 0)
        : null
      return { row, product, bonus, seedLive, productLive, priced, watering, focusEach }
    })
    const rank = (row: (typeof list)[number]) =>
      (row.watering ? row.priced?.wateredPlot : row.priced?.unwateredPlot) ?? Number.NEGATIVE_INFINITY
    if (sort === "profit") list.sort((a, b) => rank(b) - rank(a))
    else if (sort === "name") list.sort((a, b) => a.row.name.localeCompare(b.row.name))
    else if (sort === "tier-desc") list.sort((a, b) => b.row.tier - a.row.tier)
    else list.sort((a, b) => a.row.tier - b.row.tier)
    return list
  }, [book, buyOrder, cityBonus, cropMastery, discount, herbMastery, island, merchant, premium, seedCity, sellCity, sellOrder, sort, specs, tab, typed, volume, watered, worms])

  async function load() {
    setLoading(true)
    setNote("Fetching live prices…")
    const ids = [...new Set(CROPS.flatMap((row) => [row.id, CROP_PRODUCT[row.id].id]))]
    try {
      const next = await pullPrices(ids, [seedCity, sellCity])
      const history = await pullHistory(ids, [seedCity, sellCity], sellCity)
      setBook(applyAverage(next, history.fill, ids))
      setSold(history.sold)
      setNote("Sell orders first. An empty order uses Albion Free Market, then the latest daily average.")
    } catch (error) {
      setNote(error instanceof Error ? error.message : "Could not load prices")
    } finally {
      setLoading(false)
    }
  }

  const cropRows = CROPS.filter((row) => row.group === "crop")
  const herbRows = CROPS.filter((row) => row.group === "herb")
  const cropSum = cropRows.reduce((sum, row) => sum + (specs[row.id] ?? 0), 0)
  const herbSum = herbRows.reduce((sum, row) => sum + (specs[row.id] ?? 0), 0)
  const sellPct = premium ? "6.5%" : "10.5%"

  useEffect(() => {
    void load()
  }, [])

  return (
    <section className="grid gap-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <MasteryBar title="Crop Farmer" value={cropSum} max={800} open={edit === "crop"} onEdit={() => setEdit(edit === "crop" ? null : "crop")} />
        <MasteryBar title="Herbalist" value={herbSum} max={700} open={edit === "herb"} onEdit={() => setEdit(edit === "herb" ? null : "herb")} />
      </div>
      {edit ? (
        <div className="grid gap-2 rounded-lg border border-line bg-panel p-4 sm:grid-cols-2">
          <Num
            label={edit === "crop" ? "Crop Farmer mastery" : "Herbalist mastery"}
            min={0}
            value={edit === "crop" ? cropMastery : herbMastery}
            onChange={(value) => (edit === "crop" ? setCropMastery(Math.min(100, value)) : setHerbMastery(Math.min(100, value)))}
          />
          {(edit === "crop" ? cropRows : herbRows).map((row) => (
            <Num
              key={row.id}
              label={row.name.replace(" Seeds", "")}
              min={0}
              value={specs[row.id] ?? 0}
              onChange={(value) => setSpecs({ ...specs, [row.id]: Math.min(100, value) })}
            />
          ))}
        </div>
      ) : null}
      <div className="grid grid-cols-2 gap-x-3 gap-y-4 rounded-lg border border-line bg-panel p-4 sm:grid-cols-3">
        <label className="text-sm text-muted">
          Earthworm price
          <input
            className="mt-1 h-10 w-full rounded-lg border border-line bg-ink px-2 tabular-nums text-parchment"
            type="number"
            min={0}
            value={worms || ""}
            placeholder="0"
            onChange={(event) => setWorms(Number(event.target.value))}
          />
        </label>
        <Switch label="City bonus (+10%)" on={cityBonus} text="Enabled" onClick={() => setCityBonus((on) => !on)} />
        <Switch label="Premium" on={premium} text="Enabled" onClick={() => setPremium((on) => !on)} />
        <Switch label="Item labels" on={labels} text="Enabled" onClick={() => setLabels((on) => !on)} />
        <Switch label="Buy from merchant" on={merchant} text="Enabled" onClick={() => setMerchant((on) => !on)} />
        <Switch label={`Sell order (+${sellPct})`} on={sellOrder} text="Include taxes" onClick={() => setSellOrder((on) => !on)} />
        <label className="text-sm text-muted">
          Sort by
          <select className="mt-1 h-10 w-full rounded-lg border border-line bg-ink px-2 text-parchment" value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="tier">T1 → T8</option>
            <option value="tier-desc">T8 → T1</option>
            <option value="profit">Profit</option>
            <option value="name">Name</option>
          </select>
        </label>
        <Switch label="Seed yield details" on={showYield} text="Enabled" onClick={() => setShowYield((on) => !on)} />
        <label className="text-sm text-muted">
          Global discount (%)
          <input
            className="mt-1 h-10 w-full rounded-lg border border-line bg-ink px-2 tabular-nums text-parchment"
            type="number"
            min={0}
            max={100}
            value={discount || ""}
            placeholder="0"
            onChange={(event) => setDiscount(Math.min(100, Number(event.target.value)))}
          />
        </label>
        <Switch label="Buy order (+2.5%)" on={buyOrder} text="Include taxes" onClick={() => setBuyOrder((on) => !on)} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Select label="Island" value={island} onChange={(value) => setIsland(value as IslandCity)} options={cityOptions()} />
        <Select label="Buy seeds from" value={seedCity} onChange={(value) => setSeedCity(value as IslandCity)} options={cityOptions()} />
        <Select label="Sell products to" value={sellCity} onChange={(value) => setSellCity(value as IslandCity)} options={cityOptions()} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => void load()} className="h-11 rounded-lg bg-brass px-3 text-sm font-semibold text-ink">
          {loading ? "Loading" : "Fetch latest prices"}
        </button>
        {(["all", "crop", "herb"] as const).map((id) => (
          <button key={id} type="button" onClick={() => setTab(id)} className={"h-11 rounded-lg px-3 text-sm " + (tab === id ? "bg-brass text-ink" : "border border-line text-parchment")}>
            {id === "all" ? "Crops and herbs" : id === "crop" ? "Crops" : "Herbs"}
          </button>
        ))}
        <label className="text-sm text-muted">
          Plot size
          <input className="ml-2 h-11 w-16 rounded-lg border border-line bg-ink px-2 tabular-nums text-parchment" type="number" min={1} value={volume} onChange={(event) => setVolume(Math.max(1, Number(event.target.value)))} />
        </label>
      </div>
      <p className="text-xs text-muted">{note} Watering only changes the seeds that come back.</p>
      <div className="grid gap-3">
        {rows.map(({ row, product, bonus, seedLive, productLive, priced, watering, focusEach }) => (
          <article key={row.id} className="rounded-lg border border-line bg-panel p-4">
            <div className="flex items-center gap-2">
              <ItemIcon id={row.id} size={40} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-parchment">{labels ? row.name : `T${row.tier}`}</p>
                <p className="text-xs text-muted">{bonus ? "Island +10%" : "No city bonus"}</p>
              </div>
              <button
                type="button"
                onClick={() => setWatered((current) => ({ ...current, [row.id]: !watering }))}
                className={"h-10 shrink-0 rounded-lg px-3 text-sm " + (watering ? "bg-brass text-ink" : "border border-line text-parchment")}
              >
                {watering ? "Watered" : "Water"}
              </button>
            </div>
            <p className={"mt-2 text-right text-sm font-semibold tabular-nums " + (priced && (watering ? priced.wateredPlot : priced.unwateredPlot) < 0 ? "text-ember" : "text-sage")}>
              {priced ? silver(watering ? priced.wateredPlot : priced.unwateredPlot) : "No data"}
              <span className="ml-2 text-xs font-normal text-muted">plot</span>
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Field label="Seed price">
                <PriceBox id={row.id} live={merchant ? npcSeedPrice(row.tier) : seedLive?.sell} typed={typed} setTyped={setTyped} />
                <p className="text-xs text-muted">{merchant ? "Merchant" : sourceLabel(seedLive)}</p>
              </Field>
              <Field label="Product price">
                <span className="mb-1 flex items-center gap-1 text-xs text-muted">
                  <ItemIcon id={product.id} size={20} />
                  {labels ? product.name : "Crop"}
                </span>
                <PriceBox id={product.id} live={productLive?.sell} typed={typed} setTyped={setTyped} />
                <p className="text-xs text-muted">{sourceLabel(productLive)}</p>
              </Field>
              <Field label="Sold / day">{sold[liveId(product.id)] ? exact(sold[liveId(product.id)]) : "—"}</Field>
              {watering ? (
                <Field label="Specialization">
                  <input
                    className="h-11 w-full rounded-md border border-line bg-ink px-2 tabular-nums"
                    type="number"
                    min={0}
                    max={100}
                    value={specs[row.id] || ""}
                    placeholder="0"
                    onChange={(event) => setSpecs({ ...specs, [row.id]: Math.min(100, Math.max(0, Number(event.target.value))) })}
                  />
                </Field>
              ) : null}
              {watering ? <Field label="Focus spent">{exact(focusEach * volume)}</Field> : null}
              {showYield ? (
                <Field label="Seed yield">
                  {watering ? `${((row.baseYield + row.careBonus) * 100).toFixed(2)}%` : `${(row.baseYield * 100).toFixed(2)}%`}
                </Field>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function AnimalBoard() {
  const [babyCity, setBabyCity] = useState<IslandCity>("Fort Sterling")
  const [foodCity, setFoodCity] = useState<IslandCity>("Fort Sterling")
  const [sellCity, setSellCity] = useState<IslandCity>("Fort Sterling")
  const [premium, setPremium] = useState(true)
  const [sellOrder, setSellOrder] = useState(true)
  const [buyOrder, setBuyOrder] = useState(true)
  const [nurtured, setNurtured] = useState<Record<string, boolean>>({})
  const [labels, setLabels] = useState(false)
  const [details, setDetails] = useState(true)
  const [showFarm, setShowFarm] = useState(true)
  const [showSaddled, setShowSaddled] = useState(true)
  const [showRare, setShowRare] = useState(true)
  const [mastery, setMastery] = useState(0)
  const [specs, setSpecs] = useState<Record<string, number>>({})
  const [editMastery, setEditMastery] = useState(false)
  const [volume, setVolume] = useState(1)
  const [sort, setSort] = useState("tier")
  const [book, setBook] = useState<Book>({})
  const [sold, setSold] = useState<Record<string, number>>({})
  const [typed, setTyped] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [note, setNote] = useState("Sell orders first. An empty order uses Albion Free Market, then the latest daily average.")

  const rows = useMemo(() => {
    const list = animals
      .filter((row) => (row.group === "farm" ? showFarm : row.group === "saddled" ? showSaddled : showRare))
      .map((row) => {
        const babyLive = quote(book, row.id, babyCity)
        const foodLive = quote(book, row.foodId, foodCity)
        const grownLive = quote(book, row.grownId, sellCity)
        const baby = typed[row.id] ?? babyLive?.sell ?? 0
        const food = typed[row.foodId] ?? foodLive?.sell ?? 0
        const grown = typed[row.grownId] ?? grownLive?.sell ?? 0
        const spec = specs[row.id] ?? 0
        const each = farmFocusCost(mastery, spec)
        const care = Boolean(nurtured[row.id])
        const growCost = (buyOrder ? baby * (1 + SETUP_FEE) : baby) + (buyOrder ? food * (1 + SETUP_FEE) : food) * row.totalFood
        const known = baby > 0 && food > 0 && grown > 0
        const chance = (care ? row.nurtured : row.offspring) / 100
        const profitEach = known ? netSell(grown, premium, sellOrder) + chance * netSell(baby, premium, sellOrder) - growCost : null
        return { row, babyLive, foodLive, grownLive, profitEach, care, focusSpent: each * row.cycles * volume }
      })
    if (sort === "profit") list.sort((a, b) => (b.profitEach ?? Number.NEGATIVE_INFINITY) - (a.profitEach ?? Number.NEGATIVE_INFINITY))
    else if (sort === "tier-desc") list.sort((a, b) => b.row.tier - a.row.tier || a.row.name.localeCompare(b.row.name))
    else if (sort === "name") list.sort((a, b) => a.row.name.localeCompare(b.row.name))
    else list.sort((a, b) => a.row.tier - b.row.tier || a.row.name.localeCompare(b.row.name))
    return list
  }, [babyCity, book, buyOrder, foodCity, mastery, nurtured, premium, sellCity, sellOrder, showFarm, showRare, showSaddled, sort, specs, typed, volume])

  async function load() {
    setLoading(true)
    setNote("Fetching live prices…")
    const ids = [...new Set(animals.flatMap((row) => [row.id, row.foodId, row.grownId]))]
    try {
      const quotes = await pullPrices(ids, [babyCity, foodCity, sellCity])
      const history = await pullHistory(ids, [babyCity, foodCity, sellCity], sellCity)
      setBook(applyAverage(quotes, history.fill, ids))
      setSold(history.sold)
      setNote("Sell orders first. An empty order uses Albion Free Market, then the latest daily average.")
    } catch (error) {
      setNote(error instanceof Error ? error.message : "Could not load prices")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sellPct = premium ? "6.5%" : "10.5%"
  const specSum = animals.reduce((sum, row) => sum + (specs[row.id] ?? 0), 0)
  const groups = [
    ["farm", "Pasture"],
    ["saddled", "Horses and oxen"],
    ["rare", "Rare mounts"],
  ] as const

  return (
    <section className="grid gap-3">
      <MasteryBar
        title="Animal Breeder"
        value={specSum}
        max={animals.length * 100}
        open={editMastery}
        onEdit={() => setEditMastery((open) => !open)}
      />
      {editMastery ? (
        <div className="grid gap-3 rounded-lg border border-line bg-panel p-4">
          <Num label="Animal Breeder mastery" min={0} value={mastery} onChange={(value) => setMastery(Math.min(100, value))} />
          {groups.map(([id, title]) => (
            <div key={id} className="grid gap-2 sm:grid-cols-2">
              <p className="sm:col-span-2 text-sm font-semibold text-parchment">{title}</p>
              {animals
                .filter((row) => row.group === id)
                .map((row) => (
                  <Num
                    key={row.id}
                    label={row.name}
                    min={0}
                    value={specs[row.id] ?? 0}
                    onChange={(value) => setSpecs({ ...specs, [row.id]: Math.min(100, value) })}
                  />
                ))}
            </div>
          ))}
        </div>
      ) : null}
      <div className="grid grid-cols-2 gap-x-3 gap-y-4 rounded-lg border border-line bg-panel p-4 sm:grid-cols-3">
        <label className="text-sm text-parchment">
          Sort by
          <select className="mt-1 h-10 w-full rounded-lg border border-line bg-ink px-2" value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="tier">T1 → T8</option>
            <option value="tier-desc">T8 → T1</option>
            <option value="profit">Profit</option>
            <option value="name">Name</option>
          </select>
        </label>
        <Switch label="Farm animals" on={showFarm} text="Show animals" onClick={() => setShowFarm((on) => !on)} />
        <Switch label="Rare animals" on={showRare} text="Show animals" onClick={() => setShowRare((on) => !on)} />
        <Switch label="Item labels" on={labels} text="Enabled" onClick={() => setLabels((on) => !on)} />
        <Switch label={`Sell order (+${sellPct})`} on={sellOrder} text="Include taxes" onClick={() => setSellOrder((on) => !on)} />
        <Switch label="Premium" on={premium} text="Enabled" onClick={() => setPremium((on) => !on)} />
        <Switch label="Saddled animals" on={showSaddled} text="Show animals" onClick={() => setShowSaddled((on) => !on)} />
        <Switch label="Breeding details" on={details} text="Enabled" onClick={() => setDetails((on) => !on)} />
        <Switch label="Buy order (+2.5%)" on={buyOrder} text="Include taxes" onClick={() => setBuyOrder((on) => !on)} />
      </div>
      <div className="rounded-lg border border-line bg-panel p-4">
        <p className="mb-2 text-sm font-semibold text-parchment">Prices</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <Select label="Buy baby animals from" value={babyCity} onChange={(value) => setBabyCity(value as IslandCity)} options={cityOptions()} />
          <Select label="Buy food from" value={foodCity} onChange={(value) => setFoodCity(value as IslandCity)} options={cityOptions()} />
          <Select label="Sell grown animals to" value={sellCity} onChange={(value) => setSellCity(value as IslandCity)} options={cityOptions()} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => void load()} className="h-11 rounded-lg bg-brass px-3 text-sm font-semibold text-ink">
          {loading ? "Loading" : "Fetch latest prices"}
        </button>
        <label className="text-sm text-muted">
          Count
          <input className="ml-2 h-11 w-16 rounded-lg border border-line bg-ink px-2 tabular-nums text-parchment" type="number" min={1} value={volume} onChange={(event) => setVolume(Math.max(1, Number(event.target.value)))} />
        </label>
      </div>
      <p className="text-xs text-muted">{note}</p>
      <div className="grid gap-3">
        {rows.map(({ row, babyLive, foodLive, grownLive, profitEach, care, focusSpent }) => (
          <article key={row.id} className="rounded-lg border border-line bg-panel p-4">
            <div className="flex items-center gap-2">
              <ItemIcon id={row.id} size={40} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-parchment">{labels ? row.name : `T${row.tier}`}</p>
                <p className="truncate text-xs text-muted">{labels ? row.grownName : "Grown animal"}</p>
              </div>
              <button
                type="button"
                onClick={() => setNurtured((current) => ({ ...current, [row.id]: !care }))}
                className={"h-10 shrink-0 rounded-lg px-3 text-sm " + (care ? "bg-brass text-ink" : "border border-line text-parchment")}
              >
                {care ? "Nurtured" : "Nurture"}
              </button>
            </div>
            <p className={"mt-2 text-right text-sm font-semibold tabular-nums " + (profitEach != null && profitEach < 0 ? "text-ember" : "text-sage")}>
              {profitEach == null ? "No data" : silver(profitEach * volume)}
              <span className="ml-2 text-xs font-normal text-muted">{care ? `${row.nurtured}%` : `${row.offspring}% offspring`}</span>
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Field label="Baby price">
                <PriceBox id={row.id} live={babyLive?.sell} typed={typed} setTyped={setTyped} />
                <p className="text-xs text-muted">{sourceLabel(babyLive)}</p>
              </Field>
              <Field label="Grown price">
                <span className="mb-1 flex items-center gap-1 text-xs text-muted">
                  <ItemIcon id={row.grownId} size={20} />
                  {sold[liveId(row.grownId)] ? `${exact(sold[liveId(row.grownId)])} / day` : "Sold / day —"}
                </span>
                <PriceBox id={row.grownId} live={grownLive?.sell} typed={typed} setTyped={setTyped} />
                <p className="text-xs text-muted">{sourceLabel(grownLive)}</p>
              </Field>
              <Field label={labels ? row.foodName : "Food price"}>
                <span className="mb-1 flex items-center gap-1 text-xs text-muted">
                  <ItemIcon id={row.foodId} size={20} />
                  {exact(row.totalFood)} food
                </span>
                <PriceBox id={row.foodId} live={foodLive?.sell} typed={typed} setTyped={setTyped} />
                <p className="text-xs text-muted">{sourceLabel(foodLive)}</p>
              </Field>
              {care ? (
                <Field label="Specialization">
                  <input
                    className="h-11 w-full rounded-md border border-line bg-ink px-2 tabular-nums"
                    type="number"
                    min={0}
                    max={100}
                    value={specs[row.id] || ""}
                    placeholder="0"
                    onChange={(event) => setSpecs({ ...specs, [row.id]: Math.min(100, Math.max(0, Number(event.target.value))) })}
                  />
                </Field>
              ) : null}
              {care ? <Field label="Focus spent">{exact(focusSpent)}</Field> : null}
              {details ? (
                <Field label="Raise">
                  <p>{span(row.hours)}</p>
                  <p className="text-xs text-muted">{care ? `${row.nurtured}% nurtured` : `${row.offspring}% offspring`}</p>
                  <p className="text-xs text-muted">
                    {exact(row.perCycle)} × {exact(row.cycles)} feeds
                  </p>
                </Field>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0 text-sm">
      <p className="text-xs text-muted">{label}</p>
      <div className="mt-1 tabular-nums text-parchment">{children}</div>
    </div>
  )
}

function MasteryBar({ title, value, max, open, onEdit }: { title: string; value: number; max: number; open: boolean; onEdit: () => void }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-line bg-panel px-3 py-2 sm:flex-row sm:items-center">
      <p className="min-w-0 flex-1 text-base font-semibold text-parchment">
        {title} ({exact(value)}/{exact(max)})
      </p>
      <button type="button" onClick={onEdit} className="h-9 rounded-md bg-brass px-3 text-sm font-semibold text-ink">
        {open ? "Close" : "Edit masteries"}
      </button>
    </div>
  )
}

function Switch({ label, on, text, onClick }: { label: string; on: boolean; text: string; onClick: () => void }) {
  return (
    <div className="min-w-0">
      <p className="text-sm text-parchment">{label}</p>
      <button type="button" onClick={onClick} className="mt-1 flex items-center gap-2 text-sm text-muted">
        <span className={"relative h-6 w-11 shrink-0 rounded-full " + (on ? "bg-brass" : "bg-panel-2")}>
          <span className={"absolute top-0.5 size-5 rounded-full bg-parchment " + (on ? "left-5" : "left-0.5")} />
        </span>
        {text}
      </button>
    </div>
  )
}

function ModeButton({ on, title, note, onClick }: { on: boolean; title: string; note: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={"rounded-lg border px-3 py-3 text-left " + (on ? "border-brass bg-panel" : "border-line bg-ink")}>
      <p className="font-display text-xl text-parchment">{title}</p>
      <p className="text-xs text-muted">{note}</p>
    </button>
  )
}

function PriceBox({
  id,
  live,
  typed,
  setTyped,
}: {
  id: string
  live: number | undefined
  typed: Record<string, number>
  setTyped: (next: Record<string, number>) => void
}) {
  const value = typed[id] ?? live ?? 0
  return (
    <input
      className="h-11 w-full rounded-md border border-line bg-ink px-2 tabular-nums"
      type="number"
      min={0}
      value={value || ""}
      placeholder="0"
      onChange={(event) => setTyped({ ...typed, [id]: Number(event.target.value) })}
    />
  )
}

function cityOptions() {
  return ISLAND_CITIES.map((name) => ({ value: name, label: name }))
}

function quote(book: Book, id: string, city: string) {
  return book[id]?.[city]?.["1"] ?? book[liveId(id)]?.[city]?.["1"]
}

function sourceLabel(row: PriceQuote | undefined) {
  if (!row?.sell) return "No data"
  if (row.buyDate === "avg") return `Average · ${priceAge(row.sellDate) || "daily"}`
  return `${row.sellDate === "afm" ? "Free Market" : "Data Project"} · ${priceAge(row.sellDate) || "live"}`
}

function netSell(price: number, premium: boolean, sellOrder: boolean) {
  const tax = premium ? TAX_PREMIUM : TAX_STANDARD
  const setup = sellOrder ? SETUP_FEE : 0
  return price * (1 - tax - setup)
}

async function pullPrices(itemIds: string[], locations: IslandCity[]) {
  const request = {
    server: "asia" as const,
    itemIds,
    locations: [...new Set(locations)],
    qualities: [1],
  }
  try {
    const result =
      import.meta.env.VITE_PAGES === "1" ? await loadMarketPrices(request) : await fetchMarketPrices({ data: request })
    return result.quotes
  } catch {
    return (await loadMarketPrices(request)).quotes
  }
}

async function pullHistory(ids: string[], cities: string[], soldCity: string) {
  const sold: Record<string, number> = {}
  const fill: { id: string; city: string; price: number; time: string }[] = []
  const loc = [...new Set(cities)].map((city) => encodeURIComponent(city)).join(",")
  for (let index = 0; index < ids.length; index += 15) {
    const chunk = ids.slice(index, index + 15).map(liveId)
    const url = marketStatsUrl("history", chunk.join(","), `locations=${loc}&qualities=1&time-scale=24`)
    const res = await fetch(url, {
      headers: { Accept: "application/json", "Accept-Encoding": "gzip, deflate" },
      signal: AbortSignal.timeout(12000),
    }).catch(() => null)
    if (!res?.ok) continue
    const body = (await res.json().catch(() => null)) as HistoryRow[] | null
    if (!Array.isArray(body)) continue
    for (const row of body) {
      const day = lastDay(row.data)
      if (!row.item_id || !row.location || !day || day.avg <= 0) continue
      fill.push({ id: row.item_id, city: row.location, price: day.avg, time: day.time })
      if (row.location === soldCity && day.count > 0) sold[row.item_id] = day.count
    }
  }
  return { sold, fill }
}

function applyAverage(book: Book, fill: { id: string; city: string; price: number; time: string }[], ids: string[]) {
  const alias = new Map(ids.map((id) => [liveId(id), id]))
  const next: Book = { ...book }
  for (const row of fill) {
    const id = alias.get(row.id) ?? row.id
    const item = { ...(next[id] ?? {}) }
    const city = { ...(item[row.city] ?? {}) }
    const prev = city["1"]
    if (prev?.sell && prev.sell > 0) {
      item[row.city] = city
      next[id] = item
      continue
    }
    city["1"] = {
      sell: row.price,
      buy: prev?.buy || 0,
      sellDate: row.time,
      buyDate: prev?.buy ? prev.buyDate : "avg",
      sellStock: prev?.sellStock,
      buyStock: prev?.buyStock,
    }
    item[row.city] = city
    next[id] = item
  }
  return next
}

type HistoryPoint = { item_count?: number; avg_price?: number; timestamp?: string }
type HistoryRow = { item_id?: string; location?: string; data?: HistoryPoint[] | { item_count?: number[]; prices_avg?: number[]; timestamps?: string[] } }

function lastDay(data: HistoryRow["data"]) {
  if (!data) return null
  if (Array.isArray(data)) {
    const point = data[data.length - 1]
    if (!point) return null
    return { count: point.item_count || 0, avg: point.avg_price || 0, time: point.timestamp || "" }
  }
  const last = (data.item_count?.length ?? 0) - 1
  if (last < 0) return null
  return { count: data.item_count?.[last] || 0, avg: data.prices_avg?.[last] || 0, time: data.timestamps?.[last] || "" }
}

function span(hours: number) {
  const total = Math.round(hours)
  const days = Math.floor(total / 24)
  const rest = total % 24
  if (!days) return rest === 1 ? "1 hour" : `${rest} hours`
  if (!rest) return days === 1 ? "1 day" : `${days} days`
  return `${days}d ${rest}h`
}
