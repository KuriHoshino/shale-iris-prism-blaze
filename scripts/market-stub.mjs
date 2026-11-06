import { createServer } from "node:http"
import { readFileSync } from "node:fs"

const fixtures = {
  prices: readFileSync(new URL("./__fixtures__/market/prices.json", import.meta.url)),
  history: readFileSync(new URL("./__fixtures__/market/history.json", import.meta.url)),
  orders: readFileSync(new URL("./__fixtures__/market/orders.json", import.meta.url)),
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://127.0.0.1:8787")
  const kind = url.pathname.split("/")[2]
  const body = fixtures[kind]
  if (req.method !== "GET" || !body) {
    res.writeHead(404, { "content-type": "text/plain" })
    res.end("Not found")
    return
  }
  res.writeHead(200, {
    "content-type": "application/json",
    "cache-control": "public, max-age=60, stale-while-revalidate=300",
  })
  res.end(body)
})

server.listen(8787, "127.0.0.1", () => {
  console.log("market stub http://127.0.0.1:8787")
})
