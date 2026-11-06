import { useEffect, useState, type ReactNode } from "react"
import { marketId, matName } from "@/lib/forge/lookup"

export const fieldClass =
  "h-11 w-full rounded-lg border border-line bg-ink px-3 text-base text-parchment outline-none focus-visible:border-brass"
export const labelClass = "flex min-w-0 flex-col gap-1 text-sm text-muted"

export function silver(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—"
  const cents = Math.round(value * 100) / 100
  const sign = cents < 0 ? "-" : ""
  return (
    sign +
    Math.abs(cents).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  )
}

export function exact(value: number): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: 2 })
}

/** Official item picture. The plain URL is the one Albion Free Market already has cached. */
export function itemIconUrl(id: string, enchant = 0, quality = 1): string {
  const unique = marketId(id, enchant)
  const base = `https://render.albiononline.com/v1/item/${encodeURIComponent(unique)}.png`
  if (quality > 1 && quality <= 5) return `${base}?quality=${quality}`
  return base
}

export function itemMark(id: string, enchant = 0): string {
  const unique = marketId(id, enchant)
  const tier = unique.match(/^T(\d+)/)?.[1]
  const level = unique.match(/@(\d)/)?.[1] ?? "0"
  return tier ? `${tier}.${level}` : ""
}

export function ItemIcon({
  id,
  enchant = 0,
  quality = 1,
  size = 40,
}: {
  id: string
  enchant?: number
  quality?: number
  size?: number
}) {
  const frame = quality > 1 && quality <= 5 ? quality : 1
  const sources = [
    ...new Set(
      [itemIconUrl(id, enchant, frame), itemIconUrl(id, 0, frame), matName(id) ? itemIconUrl(matName(id), 0, frame) : ""].filter(Boolean),
    ),
  ]
  const [step, setStep] = useState(0)
  useEffect(() => {
    setStep(0)
  }, [id, enchant, quality])
  if (step >= sources.length) return null
  return (
    <img
      src={sources[step]}
      alt=""
      width={size}
      height={size}
      decoding="async"
      loading={size >= 48 ? "eager" : "lazy"}
      className="shrink-0 rounded-md bg-ink object-contain"
      style={{ width: size, height: size }}
      onError={() => setStep((current) => current + 1)}
    />
  )
}

/** Short age for a price timestamp, such as "5m ago" or "2d ago". */
export function formatTimeAgo(isoDate: string | null): string {
  if (!isoDate) return "No recent data"
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return "No recent data"
  const diffMins = Math.floor((Date.now() - date.getTime()) / 60000)
  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  return `${Math.floor(diffHours / 24)}d ago`
}

export function quoteNote(
  quote: { type?: "Live" | "EMV" | "None"; updatedAt?: string | null; sellDate?: string; buyDate?: string } | null | undefined,
  side: "sell" | "buy" = "sell",
) {
  if (!quote || quote.type === "None") return "No data"
  if (quote.type === "EMV") return "EMV"
  if (quote.type === "Live") return formatTimeAgo(quote.updatedAt || null)
  return priceAge(side === "sell" ? quote.sellDate : quote.buyDate) || "No data"
}

export function PriceTag({
  price,
  updatedAt,
  type,
}: {
  price: number
  updatedAt: string | null
  type: "Live" | "EMV" | "None"
}) {
  if (type === "None" || !(price > 0)) {
    return (
      <span className="text-muted">
        —
        <span className="block text-xs">No data</span>
      </span>
    )
  }
  return (
    <span>
      <span className="tabular-nums text-parchment">{silver(price)}</span>
      {type === "EMV" ? (
        <span className="block text-xs text-muted">EMV</span>
      ) : (
        <span className="block text-xs text-muted">{formatTimeAgo(updatedAt)}</span>
      )}
    </span>
  )
}

/** How old a market timestamp is, such as "2h ago". */
export function priceAge(stamp: string | undefined): string {
  if (!stamp) return ""
  if (stamp === "afm") return "AFM"
  const time = Date.parse(stamp.endsWith("Z") || stamp.includes("+") ? stamp : `${stamp}Z`)
  if (Number.isNaN(time)) return ""
  const mins = Math.max(0, Math.floor((Date.now() - time) / 60000))
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 48) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

/** Age written the way a market order is aged, such as "11.9h old". */
export function orderAge(stamp: string | undefined): string {
  if (!stamp) return ""
  if (stamp === "afm") return "AFM"
  const time = Date.parse(stamp.endsWith("Z") || stamp.includes("+") ? stamp : `${stamp}Z`)
  if (Number.isNaN(time)) return ""
  const hours = Math.max(0, (Date.now() - time) / 3_600_000)
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))}m old`
  if (hours < 48) return `${hours.toFixed(1)}h old`
  return `${Math.floor(hours / 24)}d old`
}

export function pct(value: number): string {
  return `${(value * 100).toFixed(2)}%`
}

export function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className={labelClass}>
      <span>{label}</span>
      {children}
    </label>
  )
}

export function Num({
  label,
  value,
  onChange,
  min,
  step,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  step?: number
}) {
  return (
    <Field label={label}>
      <input
        className={fieldClass}
        type="number"
        inputMode="decimal"
        min={min}
        step={step ?? 1}
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => onChange(event.target.value === "" ? 0 : Number(event.target.value))}
      />
    </Field>
  )
}

export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <Field label={label}>
      <select className={fieldClass} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  )
}

export function Toggle({
  on,
  onClick,
  children,
}: {
  on: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={
        "inline-flex h-11 items-center justify-center rounded-lg border px-3 text-sm font-medium " +
        (on ? "border-brass bg-brass text-ink" : "border-line bg-panel text-parchment")
      }
    >
      {children}
    </button>
  )
}
