import { r as createServerFn } from "../server.js";
import { t as createServerRpc } from "./createServerRpc-B7jhVFkC.js";
import { l as MARKETS } from "./rules-Cy2qndry.js";
import { z } from "zod";
//#region src/lib/forge/prices.ts?tss-serverfn-split
var HOST = {
	americas: "https://west.albion-online-data.com",
	europe: "https://europe.albion-online-data.com",
	asia: "https://east.albion-online-data.com"
};
var Input = z.object({
	server: z.enum([
		"asia",
		"europe",
		"americas"
	]),
	itemIds: z.array(z.string().regex(/^[A-Z0-9_@]+$/)).max(400),
	locations: z.array(z.enum(MARKETS)).min(1).max(8),
	qualities: z.array(z.number().int().min(1).max(5)).min(1).max(5)
});
function bestLevel(levels) {
	const level = levels?.find((row) => row.price > 0);
	return {
		price: level?.price || 0,
		at: level?.updated_at || ""
	};
}
async function pullJson(url) {
	const res = await fetch(url, {
		headers: { Accept: "application/json" },
		signal: AbortSignal.timeout(2e4)
	});
	if (res.status === 429) throw new Error("The data project is busy. Prices retry in a minute.");
	if (!res.ok) {
		const text = await res.text();
		throw new Error(text.slice(0, 180) || `Market data ${res.status}`);
	}
	return res.json();
}
async function pullPrices(host, ids, locations, qualities) {
	const loc = locations.map((name) => encodeURIComponent(name)).join(",");
	return await pullJson(`${host}/api/v2/stats/prices/${ids.join(",")}.json?locations=${loc}&qualities=${qualities.join(",")}`);
}
async function pullBook(host, ids, locations, qualities) {
	const loc = locations.map((name) => encodeURIComponent(name)).join(",");
	return await pullJson(`${host}/api/v2/stats/orderbook/${ids.join(",")}.json?locations=${loc}&qualities=${qualities.join(",")}`);
}
async function loadMarketPrices(data) {
	const ids = [...new Set(data.itemIds)];
	const host = HOST[data.server];
	const quotes = {};
	for (let i = 0; i < ids.length; i += 40) {
		const chunk = ids.slice(i, i + 40);
		const locations = [...data.locations];
		const qualities = data.qualities;
		const book = await pullBook(host, chunk, locations, qualities);
		const listed = book.length ? [] : await pullPrices(host, chunk, locations, qualities);
		for (const row of listed) {
			const item = quotes[row.item_id] ??= {};
			const city = item[row.city] ??= {};
			city[String(row.quality)] = {
				sell: row.sell_price_min || 0,
				buy: row.buy_price_max || 0,
				sellDate: row.sell_price_min_date || "",
				buyDate: row.buy_price_max_date || ""
			};
		}
		for (const row of book) {
			const ask = bestLevel(row.sell);
			const bid = bestLevel(row.buy);
			if (!ask.price && !bid.price) continue;
			const item = quotes[row.item_id] ??= {};
			const city = item[row.city] ??= {};
			const prev = city[String(row.quality)] ?? {
				sell: 0,
				buy: 0,
				sellDate: "",
				buyDate: ""
			};
			city[String(row.quality)] = {
				sell: ask.price || prev.sell,
				buy: bid.price || prev.buy,
				sellDate: ask.price ? ask.at : prev.sellDate,
				buyDate: bid.price ? bid.at : prev.buyDate
			};
		}
		if (i + 40 < ids.length) await new Promise((r) => setTimeout(r, 250));
	}
	return {
		quotes,
		fetchedAt: Date.now()
	};
}
var fetchMarketPrices_createServerFn_handler = createServerRpc({
	id: "42f59d9d4471ffd5477b3a5b6a4ae02e4546bc795ce9cc1866e55a2aa79c129a",
	name: "fetchMarketPrices",
	filename: "src/lib/forge/prices.ts"
}, (opts) => fetchMarketPrices.__executeServer(opts));
var fetchMarketPrices = createServerFn({ method: "POST" }).validator((input) => Input.parse(input)).handler(fetchMarketPrices_createServerFn_handler, async ({ data }) => loadMarketPrices(data));
var HourInput = z.object({
	server: z.enum([
		"asia",
		"europe",
		"americas"
	]),
	itemId: z.string().regex(/^[A-Z0-9_@]+$/),
	locations: z.array(z.enum(MARKETS)).min(1).max(MARKETS.length),
	quality: z.number().int().min(1).max(5)
});
function addHour(series, city, time, price, count) {
	if (!city || !time || price <= 0) return;
	const points = series.get(city) ?? [];
	const found = points.find((point) => point.time === time);
	if (found) {
		found.price = price;
		if (count > 0) found.count = count;
	} else points.push({
		time,
		price,
		count
	});
	series.set(city, points);
}
function readHistory(rows, series) {
	for (const row of rows) {
		const city = row.location || "";
		const data = row.data;
		if (Array.isArray(data)) {
			for (const point of data) addHour(series, city, point.timestamp || "", point.avg_price || 0, point.item_count || 0);
			continue;
		}
		const times = data?.timestamps ?? [];
		const prices = data?.prices_avg ?? [];
		const counts = data?.item_count ?? [];
		for (let i = 0; i < times.length; i++) addHour(series, city, times[i] || "", prices[i] || 0, counts[i] || 0);
	}
}
async function readJson(url) {
	const res = await fetch(url, {
		headers: { Accept: "application/json" },
		signal: AbortSignal.timeout(2e4)
	});
	if (res.status === 429) return {
		status: 429,
		body: null
	};
	if (!res.ok) {
		const text = await res.text();
		throw new Error(text.slice(0, 180) || `Market data ${res.status}`);
	}
	return {
		status: res.status,
		body: await res.json()
	};
}
async function loadHourlyPrices(data) {
	const loc = [...new Set(data.locations)].map((name) => encodeURIComponent(name)).join(",");
	const historyRes = await readJson(`${HOST[data.server]}/api/v2/stats/history/${data.itemId}.json?locations=${loc}&qualities=${data.quality}&time-scale=1`).catch(() => ({
		status: 0,
		body: null
	}));
	if (historyRes.status === 429) throw new Error("The data project is busy. The chart retries in a minute.");
	const bucket = /* @__PURE__ */ new Map();
	if (historyRes.status === 200 && Array.isArray(historyRes.body)) readHistory(historyRes.body, bucket);
	const series = [];
	for (const [city, points] of bucket) {
		points.sort((a, b) => a.time.localeCompare(b.time));
		if (points.length) series.push({
			city,
			points
		});
	}
	return {
		series,
		fetchedAt: Date.now()
	};
}
var fetchHourlyPrices_createServerFn_handler = createServerRpc({
	id: "0a31263371f71b39edf22cba1c62c98ca7292577ab4adbbbb38d999d9f4086cd",
	name: "fetchHourlyPrices",
	filename: "src/lib/forge/prices.ts"
}, (opts) => fetchHourlyPrices.__executeServer(opts));
var fetchHourlyPrices = createServerFn({ method: "POST" }).validator((input) => HourInput.parse(input)).handler(fetchHourlyPrices_createServerFn_handler, async ({ data }) => loadHourlyPrices(data));
//#endregion
export { fetchHourlyPrices_createServerFn_handler, fetchMarketPrices_createServerFn_handler };
