import { useEffect, useMemo, useState } from "react"
import { GUILD_ISLANDS, ISLANDS, LABOR_JOBS, ENCHANT, guildHousePlots, guildSlots, houseYield, laborLoot, scoreHouses, upgradePath } from "@/lib/forge/labor"
import { liveId } from "@/lib/forge/lookup"
import { fetchMarketPrices, loadMarketPrices, type PriceQuote } from "@/lib/forge/prices"
import { CRAFT_CITIES, SETUP_FEE, TAX_PREMIUM, TAX_STANDARD } from "@/lib/forge/rules"
import { Num, Select, exact, pct, priceAge, silver } from "./fields"

const TIERS = [2, 3, 4, 5, 6, 7, 8]
const EMPTY: Record<number, number> = { 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 2, 8: 3 }

export function LaborLab() {
  const [jobId, setJobId] = useState("wood")
  const [where, setWhere] = useState<"island" | "guild">("island")
  const [islandTier, setIslandTier] = useState(6)
  const [counts, setCounts] = useState<Record<number, number>>(EMPTY)
  const [hallTier, setHallTier] = useState(8)
  const [journalTier, setJournalTier] = useState<Record<number, number>>({})
  const [happy, setHappy] = useState<Record<number, number>>({})
  const [hallJournal, setHallJournal] = useState(8)
  const [hallHappy, setHallHappy] = useState(0)
  const [upgradeKind, setUpgradeKind] = useState<"house" | "hall">("house")
  const [upgradeFrom, setUpgradeFrom] = useState(1)
  const [upgradeTo, setUpgradeTo] = useState(8)
  const job = LABOR_JOBS.find((entry) => entry.id === jobId) ?? LABOR_JOBS[0]
  const island = ISLANDS.find((entry) => entry.tier === islandTier) ?? ISLANDS[5]
  const guild = guildHousePlots(islandTier)
  const mix = scoreHouses(job, counts, journalTier, happy)
  const hallLabor = Math.min(hallTier, Math.max(2, hallJournal))
  const hallRate = houseYield(hallTier, hallLabor)
  const hallPeople = guildSlots(hallTier)
  const hallBase = job.loot[hallLabor]
  const hallJournals = hallPeople
  const hallAmount = hallBase * hallRate * hallPeople
  const path = upgradePath(upgradeKind, upgradeFrom, upgradeTo)
  const over = where === "island" ? mix.houses > island.plots : mix.houses > guild.houses
  const tiers = TIERS.map((value) => ({ value: String(value), label: `T${value}` }))
  const fromOptions = [1, 2, 3, 4, 5, 6, 7].map((value) => ({
    value: String(value),
    label: value === 1 ? "T1, not built" : `T${value}`,
  }))
  const toOptions = [2, 3, 4, 5, 6, 7, 8]
    .filter((value) => value > upgradeFrom)
    .map((value) => ({ value: String(value), label: `T${value}` }))

  return (
    <div className="grid gap-section">
      <JournalDesk />
      <div className="grid gap-section lg:grid-cols-2">
      <section className="rounded-lg border border-line bg-panel p-5">
        <h2 className="font-display text-2xl">Island laborers</h2>
        <p className="mt-2 text-sm text-muted">
          Set the houses you have. Each house is separate. A guild island has one hall.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Select
            label="Where"
            value={where}
            onChange={(value) => setWhere(value as "island" | "guild")}
            options={[
              { value: "island", label: "Island" },
              { value: "guild", label: "Guild island" },
            ]}
          />
          <Select
            label="Laborer"
            value={job.id}
            onChange={setJobId}
            options={LABOR_JOBS.map((entry) => ({ value: entry.id, label: entry.name }))}
          />
          {where === "island" ? (
            <Select
              label="Island level"
              value={String(island.tier)}
              onChange={(value) => setIslandTier(Number(value))}
              options={ISLANDS.map((entry) => ({ value: String(entry.tier), label: `T${entry.tier}` }))}
            />
          ) : (
            <>
              <Select
                label="Island level"
                value={String(guild.tier)}
                onChange={(value) => setIslandTier(Number(value))}
                options={GUILD_ISLANDS.map((entry) => ({ value: String(entry.tier), label: `T${entry.tier}` }))}
              />
              <Select label="Guild hall" value={String(hallTier)} onChange={(value) => setHallTier(Number(value))} options={tiers} />
            </>
          )}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TIERS.map((tier) => (
            <Num
              key={tier}
              label={`T${tier} houses`}
              min={0}
              value={counts[tier] ?? 0}
              onChange={(value) => setCounts((current) => ({ ...current, [tier]: value }))}
            />
          ))}
        </div>
        <ul className="mt-4 flex flex-col gap-3 text-sm">
          {where === "guild" ? (
            <li className="border-b border-line pb-3">
              <div className="flex justify-between gap-3">
                <span>Guild hall</span>
                <span className="text-muted">{exact(hallJournals)} journals</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Select
                  label="Laborer"
                  value={String(hallLabor)}
                  onChange={(value) => setHallJournal(Number(value))}
                  options={TIERS.filter((tier) => tier <= hallTier).map((tier) => ({ value: String(tier), label: `T${tier}` }))}
                />
                <Num
                  label="Trophy happiness"
                  min={0}
                  value={hallHappy}
                  onChange={(value) => setHallHappy(Math.min(100, Math.max(0, value)))}
                />
              </div>
              <p className="mt-2 text-muted">
                {exact(hallAmount)} {job.returns} · {pct(hallRate)} of the base return
              </p>
              {job.id === "mercenary" ? null : <Chances amount={hallAmount} />}
            </li>
          ) : null}
          {mix.rows.map((row) => (
            <li key={row.tier} className="border-b border-line pb-3">
              <div className="flex justify-between gap-3">
                <span>
                  {exact(row.houses)} × T{row.tier}
                </span>
                <span className="text-muted">{exact(row.journals)} journals</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Select
                  label="Laborer"
                  value={String(row.labor)}
                  onChange={(value) => setJournalTier((current) => ({ ...current, [row.tier]: Number(value) }))}
                  options={TIERS.filter((tier) => tier <= row.tier).map((tier) => ({ value: String(tier), label: `T${tier}` }))}
                />
                <Num
                  label="Trophy happiness"
                  min={0}
                  value={happy[row.tier] ?? 0}
                  onChange={(value) => setHappy((current) => ({ ...current, [row.tier]: Math.min(100, Math.max(0, value)) }))}
                />
              </div>
              <p className="mt-2 text-muted">
                {exact(row.amount)} {job.returns} · {pct(row.rate)} of the base return
              </p>
              {job.id === "mercenary" ? null : <Chances amount={row.amount} />}
            </li>
          ))}
        </ul>
      </section>
      <section className="rounded-lg border border-line bg-panel p-5">
        <p className="text-sm text-muted">{where === "guild" ? "Guild island" : `T${island.tier} island`}</p>
        {where === "island" ? (
          <dl className="mt-4 flex flex-col">
            <Result
              label="Houses"
              value={exact(mix.houses)}
              note={
                over
                  ? `This island only has ${exact(island.plots)} plots.`
                  : `${exact(island.plots)} plots. ${exact(island.large)} large${island.small ? `, ${exact(island.small)} small` : ""}.`
              }
            />
            <Result label="Laborers" value={exact(mix.people)} note="A house holds 1, then 2, then 3 from T5." />
            <Result label="Journals" value={exact(mix.journals)} note="One filled journal per laborer, the laborer's tier." />
            <Result label="Return" value="22 hours" note="The amount follows the house tier and the journal tier." />
            <Result
              label={job.family === "Mercenary" ? "Silver" : "Materials"}
              value={exact(mix.amount)}
              note={job.returns}
            />
          </dl>
        ) : (
          <dl className="mt-4 flex flex-col">
            <Result label="Guild hall" value={`T${hallTier}`} note="One hall. A guild island cannot farm." />
            <Result
              label="Houses"
              value={exact(mix.houses)}
              note={
                over
                  ? `This guild island fits ${exact(guild.houses)} houses besides the hall.`
                  : `${exact(guild.houses)} houses fit besides the hall.`
              }
            />
            <Result
              label="Laborers"
              value={exact(hallPeople + mix.people)}
              note={`${exact(hallPeople)} in the hall. 15 is the hall maximum. ${exact(mix.people)} in houses.`}
            />
            <Result label="Journals" value={exact(hallJournals + mix.journals)} note={`${exact(hallJournals)} for the hall. ${exact(mix.journals)} for the houses.`} />
            <Result label="Return" value="22 hours" note="The amount follows the house tier and the journal tier." />
            <Result
              label={job.family === "Mercenary" ? "Silver" : "Materials"}
              value={exact(hallAmount + mix.amount)}
              note={`${exact(hallAmount)} from the hall. ${exact(mix.amount)} from the houses.`}
            />
          </dl>
        )}
      </section>
      <section className="rounded-lg border border-line bg-panel p-5 lg:col-span-2">
        <h2 className="font-display text-2xl">Upgrade</h2>
        <p className="mt-2 text-sm text-muted">
          Houses and guild halls start at T2. T1 means it is not built yet.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Select
            label="Building"
            value={upgradeKind}
            onChange={(value) => setUpgradeKind(value as "house" | "hall")}
            options={[
              { value: "house", label: "House" },
              { value: "hall", label: "Guild hall" },
            ]}
          />
          <Select
            label="From"
            value={String(upgradeFrom)}
            onChange={(value) => {
              const next = Number(value)
              setUpgradeFrom(next)
              if (upgradeTo <= next) setUpgradeTo(Math.min(8, next + 1))
            }}
            options={fromOptions}
          />
          <Select label="To" value={String(upgradeTo)} onChange={(value) => setUpgradeTo(Number(value))} options={toOptions} />
        </div>
        <dl className="mt-4 flex flex-col">
          <Result
            label="Rough logs"
            value={exact(path.wood)}
            note={`${exact(path.stone)} rough stone · ${exact(path.blocks)} stone blocks`}
          />
        </dl>
        <ul className="mt-3 flex flex-col gap-2 text-sm">
          {path.steps.map((step) => (
            <li key={step.tier} className="flex justify-between gap-3 border-b border-line py-2">
              <span>T{step.tier}</span>
              <span className="text-muted">
                {exact(step.wood)} logs · {exact(step.stone)} stone · {exact(step.blocks)} {step.block}
              </span>
            </li>
          ))}
        </ul>
      </section>
      </div>
    </div>
  )
}

function JournalDesk() {
  const jobs = LABOR_JOBS.filter((job) => job.kind)
  const [jobId, setJobId] = useState("wood")
  const [house, setHouse] = useState(6)
  const [count, setCount] = useState(1)
  const [city, setCity] = useState<(typeof CRAFT_CITIES)[number]>("Martlock")
  const [premium, setPremium] = useState(true)
  const [sellOrder, setSellOrder] = useState(true)
  const [buyOrder, setBuyOrder] = useState(true)
  const [book, setBook] = useState<Record<string, Record<string, Record<string, PriceQuote>>>>({})
  const [typed, setTyped] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [note, setNote] = useState("Sell orders first. An empty city uses Albion Free Market.")
  const job = jobs.find((entry) => entry.id === jobId) ?? jobs[0]

  const rows = useMemo(() => {
    const tiers = [4, 5, 6, 7, 8].filter((tier) => laborLoot(job.kind, tier))
    return tiers.map((tier) => {
      const loot = laborLoot(job.kind, tier)
      const rate = houseYield(house, tier)
      const fullId = `T${tier}_JOURNAL_${job.kind}_FULL`
      const emptyId = `T${tier}_JOURNAL_${job.kind}_EMPTY`
      const full = typed[fullId] ?? readPrice(book, fullId, city)
      const empty = typed[emptyId] ?? readPrice(book, emptyId, city)
      const weight = loot?.items.reduce((sum, item) => sum + item.weight, 0) ?? 0
      let gross = 0
      let covered = 0
      for (const item of loot?.items ?? []) {
        const unit = typed[item.id] ?? readPrice(book, item.id, city)
        if (!unit) continue
        covered += item.weight
        gross += weight ? ((loot?.amount ?? 0) * rate * item.weight) / weight * unit : 0
      }
      const known = full > 0 && empty > 0 && rate > 0 && covered > 0
      const revenue = net(gross, premium, sellOrder) + net(empty, premium, sellOrder)
      const cost = full * (buyOrder ? 1 + SETUP_FEE : 1)
      const profit = known ? (revenue - cost) * count : null
      return { tier, rate, fullId, emptyId, full, empty, profit, amount: (loot?.amount ?? 0) * rate }
    })
  }, [book, buyOrder, city, count, house, job.kind, premium, sellOrder, typed])

  async function load() {
    setLoading(true)
    const tiers = [4, 5, 6, 7, 8].filter((tier) => laborLoot(job.kind, tier))
    const ids = [
      ...new Set(
        tiers.flatMap((tier) => {
          const loot = laborLoot(job.kind, tier)
          return [`T${tier}_JOURNAL_${job.kind}_FULL`, `T${tier}_JOURNAL_${job.kind}_EMPTY`, ...(loot?.items.map((item) => item.id) ?? [])]
        }),
      ),
    ]
    try {
      const request = { server: "asia" as const, itemIds: ids.slice(0, 400), locations: [city], qualities: [1] }
      const result = import.meta.env.VITE_PAGES === "1" ? await loadMarketPrices(request) : await fetchMarketPrices({ data: request })
      setBook(result.quotes)
      setNote("Asia data project first. An empty order uses Albion Free Market.")
    } catch (error) {
      setNote(error instanceof Error ? error.message : "Could not load prices")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, city])

  return (
    <section className="grid gap-3">
      <div className="grid gap-3 rounded-lg border border-line bg-panel p-3 sm:grid-cols-2">
        <Select label="Journal" value={job.id} onChange={setJobId} options={jobs.map((entry) => ({ value: entry.id, label: entry.name }))} />
        <Select
          label="House tier"
          value={String(house)}
          onChange={(value) => setHouse(Number(value))}
          options={[4, 5, 6, 7, 8].map((tier) => ({ value: String(tier), label: `T${tier}` }))}
        />
        <Select label="City" value={city} onChange={(value) => setCity(value as (typeof CRAFT_CITIES)[number])} options={CRAFT_CITIES.map((name) => ({ value: name, label: name }))} />
        <Num label="Journals" min={1} value={count} onChange={setCount} />
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => void load()} className="h-11 rounded-lg bg-brass px-3 text-sm font-semibold text-ink">
          {loading ? "Loading" : "Fetch latest prices"}
        </button>
        <button type="button" onClick={() => setPremium((on) => !on)} className={"h-11 rounded-lg px-3 text-sm " + (premium ? "bg-brass text-ink" : "border border-line")}>
          {premium ? "Premium" : "No premium"}
        </button>
        <button type="button" onClick={() => setSellOrder((on) => !on)} className={"h-11 rounded-lg px-3 text-sm " + (sellOrder ? "bg-brass text-ink" : "border border-line")}>
          Sell tax
        </button>
        <button type="button" onClick={() => setBuyOrder((on) => !on)} className={"h-11 rounded-lg px-3 text-sm " + (buyOrder ? "bg-brass text-ink" : "border border-line")}>
          Buy fee
        </button>
      </div>
      <p className="text-xs text-muted">{note} A matching journal in a higher house returns more, up to 150%.</p>
      <div className="grid gap-3">
        {rows.map((row) => (
          <article key={row.tier} className="rounded-lg border border-line bg-panel p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold">T{row.tier} {job.name}</p>
              <p className={"text-sm font-semibold tabular-nums " + (row.profit != null && row.profit < 0 ? "text-ember" : "text-sage")}>{row.profit == null ? "No data" : silver(row.profit)}</p>
            </div>
            <p className="text-xs text-muted">{pct(row.rate)} return · {exact(row.amount)} materials</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="text-xs text-muted">
                Full journal
                <input className="mt-1 h-11 w-full rounded-md border border-line bg-ink px-2" type="number" min={0} value={row.full || ""} placeholder="0" onChange={(event) => setTyped((current) => ({ ...current, [row.fullId]: Number(event.target.value) }))} />
                <span className="mt-1 block">{stamp(book, row.fullId, city)}</span>
              </label>
              <label className="text-xs text-muted">
                Empty journal
                <input className="mt-1 h-11 w-full rounded-md border border-line bg-ink px-2" type="number" min={0} value={row.empty || ""} placeholder="0" onChange={(event) => setTyped((current) => ({ ...current, [row.emptyId]: Number(event.target.value) }))} />
                <span className="mt-1 block">{stamp(book, row.emptyId, city)}</span>
              </label>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function readPrice(book: Record<string, Record<string, Record<string, PriceQuote>>>, id: string, city: string) {
  return book[id]?.[city]?.["1"]?.sell ?? book[liveId(id)]?.[city]?.["1"]?.sell ?? 0
}

function stamp(book: Record<string, Record<string, Record<string, PriceQuote>>>, id: string, city: string) {
  const row = book[id]?.[city]?.["1"] ?? book[liveId(id)]?.[city]?.["1"]
  if (!row?.sell) return "No data"
  return `${row.sellDate === "afm" ? "Free Market" : "Data Project"} · ${priceAge(row.sellDate) || "live"}`
}

function net(price: number, premium: boolean, sellOrder: boolean) {
  const tax = premium ? TAX_PREMIUM : TAX_STANDARD
  return price * (1 - tax - (sellOrder ? SETUP_FEE : 0))
}

function Chances({ amount }: { amount: number }) {
  return (
    <ul className="mt-2 text-xs text-muted">
      {ENCHANT.map((roll) => (
        <li key={roll.label} className="flex justify-between gap-3 py-0.5">
          <span>
            {roll.label} {pct(roll.weight / 2000)}
          </span>
          <span>{exact(amount * (roll.weight / 2000))}</span>
        </li>
      ))}
    </ul>
  )
}

function Result({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="border-b border-line py-3 last:border-b-0">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="font-sans text-2xl font-semibold tabular-nums tracking-tight text-brass">{value}</dd>
      <p className="text-xs text-muted">{note}</p>
    </div>
  )
}
