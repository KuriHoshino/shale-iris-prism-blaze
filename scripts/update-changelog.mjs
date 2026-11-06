import { execSync } from "node:child_process"
import { existsSync, readFileSync, writeFileSync } from "node:fs"

const message = execSync('git log -1 --pretty=format:"%s"', { encoding: "utf8" }).trim()
if (!message || message.startsWith("chore:")) process.exit(0)

const path = "public/changelog.json"
const data = existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : { entries: [] }
if (!Array.isArray(data.entries)) data.entries = []
if (data.entries[0]?.title === message) process.exit(0)

const bullets = message.split(",").map((part) => part.trim()).filter(Boolean)
data.entries.unshift({
  version: new Date().toISOString().slice(0, 10),
  title: message,
  bullets: bullets.length ? bullets : [message],
})
writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`)
