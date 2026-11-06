import { useEffect, useState } from "react"
import { Clock, Hammer, Repeat, Sprout, Users, type LucideIcon } from "lucide-react"
import type { View } from "@/lib/forge/store"

const TOOLS: { id: View; title: string; note: string; icon: LucideIcon }[] = [
  { id: "bench", title: "Add Craft", note: "Calculate material cost, returns, and profit.", icon: Hammer },
  { id: "flip", title: "Flipping", note: "Compare cities and the silver left after tax.", icon: Repeat },
  { id: "farm", title: "Farming and Breeding", note: "See seed yield, offspring, and focus spent.", icon: Sprout },
  { id: "labor", title: "Laborers", note: "Check journals, house tier, and the return.", icon: Users },
  { id: "recent", title: "Recent", note: "Reopen a craft you already priced.", icon: Clock },
]

export function Dashboard({ onOpen }: { onOpen: (view: View) => void }) {
  const [latest, setLatest] = useState<{ title: string; bullets: string[] } | null>(null)

  useEffect(() => {
    void fetch("/changelog.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const entry = data?.entries?.[0]
        if (entry?.title) setLatest({ title: entry.title, bullets: entry.bullets ?? [] })
      })
      .catch(() => undefined)
  }, [])

  return (
    <div className="grid gap-section">
      <section className="grid gap-section">
        <div>
          <p className="eyebrow">HEARTHFORGE TOOLKIT</p>
          <h1 className="page-title">Albion economy tools for informed silver decisions.</h1>
          <p className="lead">
            Craft, flip, farm, and run laborers from the same Asia prices. Check the cost before you spend the silver.
          </p>
        </div>
        <div className="grid gap-section lg:grid-cols-2">
          <article className="rounded-lg border border-line bg-panel p-6">
            <h2 className="font-display text-2xl text-parchment">How to start</h2>
            <p className="lead">Pick a tool, set the city, and read the profit before you commit materials or focus.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {TOOLS.slice(0, 3).map((tool) => (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => onOpen(tool.id)}
                  className="h-11 rounded-full border border-line px-4 text-sm text-parchment"
                >
                  {tool.title}
                </button>
              ))}
            </div>
          </article>
          <article className="rounded-lg border border-line bg-panel p-6">
            <h2 className="font-display text-2xl text-parchment">Latest updates</h2>
            <div className="thin-scroll mt-6 max-h-52 overflow-y-auto pr-3">
              <p className="font-semibold text-parchment">{latest?.title}</p>
              <ul className="mt-4 list-disc space-y-4 pl-5 text-sm leading-relaxed text-muted">
                {(latest?.bullets ?? []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => {
          const Icon = tool.icon
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => onOpen(tool.id)}
              className="rounded-lg border border-line bg-panel p-6 text-left transition duration-150 hover:-translate-y-0.5 hover:border-brass"
            >
              <Icon className="size-5 text-brass" />
              <p className="mt-5 font-semibold text-parchment">{tool.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{tool.note}</p>
            </button>
          )
        })}
      </section>

      <section className="grid gap-section lg:grid-cols-3">
        <div>
          <h2 className="font-semibold text-parchment">Market context</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Prices are Asia sell orders. An empty city falls back to Albion Free Market, then the last daily average. The age sits next to the number.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-parchment">Character settings</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Premium, station, and mastery change the result. Specialization counts double when focus is spent on a crop or an animal.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-parchment">Production planning</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            A craft shows the materials to buy, the silver back from returns, and the profit after tax. Journals are included only when their prices are known.
          </p>
        </div>
      </section>
    </div>
  )
}
