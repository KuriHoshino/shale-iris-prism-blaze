import { Jt as number, Qt as string, Ut as array, Vt as _enum, Yt as object } from "../_libs/@better-auth/core+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { F as liveId, R as marketStatsUrl, l as MARKETS } from "./marketBase-C95cZX-A.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/prices-CLJsA9V-.js
var Input = object({
	server: string().transform(() => "asia"),
	itemIds: array(string().regex(/^[A-Z0-9_@]+$/)).max(400),
	locations: array(_enum(MARKETS)).min(1).max(8),
	qualities: array(number().int().min(1).max(5)).min(1).max(5)
});
function ageHours(isoDate) {
	if (!isoDate) return null;
	const parsed = Date.parse(isoDate);
	if (Number.isNaN(parsed)) return null;
	return (Date.now() - parsed) / 36e5;
}
function newestStamp(side) {
	const sellTime = Date.parse(side.sellDate);
	const buyTime = Date.parse(side.buyDate);
	const sellOk = !Number.isNaN(sellTime);
	const buyOk = !Number.isNaN(buyTime);
	if (sellOk && buyOk) return sellTime >= buyTime ? side.sellDate : side.buyDate;
	if (sellOk) return side.sellDate;
	if (buyOk) return side.buyDate;
	return side.sellDate || side.buyDate || "";
}
function liveOf(side) {
	const updatedAt = newestStamp(side);
	const age = ageHours(updatedAt);
	if (age == null || !(age < 24)) return null;
	const sellTime = Date.parse(side.sellDate);
	const buyTime = Date.parse(side.buyDate);
	const price = !Number.isNaN(sellTime) && (Number.isNaN(buyTime) || sellTime >= buyTime) ? side.sell > 0 ? side.sell : side.buy : side.buy > 0 ? side.buy : side.sell;
	if (!(price > 0)) return null;
	return {
		price,
		updatedAt
	};
}
function emvOf(side) {
	const sell = side.sell > 0 ? side.sell : 0;
	const buy = side.buy > 0 ? side.buy : 0;
	const price = sell > 0 && buy > 0 ? (sell + buy) / 2 : sell > 0 ? sell : buy > 0 ? buy : 0;
	if (!price) return null;
	return {
		price,
		updatedAt: newestStamp(side)
	};
}
async function pullAfm(itemId) {
	return [];
}
function afmSide(row) {
	return {
		sell: row.sell,
		buy: row.buy,
		sellDate: row.updatedAt,
		buyDate: row.updatedAt
	};
}
function classify(aodp, afm) {
	const fresh = aodp && liveOf(aodp);
	if (fresh) return {
		...fresh,
		type: "Live",
		row: aodp
	};
	const afmFresh = afm && liveOf(afm);
	if (afmFresh) return {
		...afmFresh,
		type: "Live",
		row: afm
	};
	const ranked = [aodp, afm].filter((row) => Boolean(row && (row.sell > 0 || row.buy > 0)));
	ranked.sort((a, b) => (newestStamp(b) || "").localeCompare(newestStamp(a) || ""));
	const estimated = ranked.length ? emvOf(ranked[0]) : null;
	if (estimated) return {
		...estimated,
		type: "EMV",
		row: ranked[0]
	};
	return {
		price: 0,
		updatedAt: null,
		type: "None",
		row: null
	};
}
function bestLevel(levels, side) {
	let best;
	for (const row of levels ?? []) {
		if (!row.price || row.price <= 0) continue;
		if (!best || (side === "sell" ? row.price < best.price : row.price > best.price)) best = row;
	}
	return {
		price: best?.price || 0,
		at: best?.updated_at || "",
		amount: best?.amount || 0
	};
}
/** Market ids that differ from the recipe id are translated by liveId. */
async function pullJson(url) {
	for (let attempt = 0; attempt < 2; attempt += 1) {
		const res = await fetch(url, {
			headers: {
				Accept: "application/json",
				"Accept-Encoding": "gzip, deflate"
			},
			signal: AbortSignal.timeout(12e3)
		}).catch(() => null);
		if (!res) return [];
		if (res.status === 429) {
			await new Promise((resolve) => setTimeout(resolve, 1200));
			continue;
		}
		if (!res.ok) return [];
		return res.json().catch(() => []);
	}
	return [];
}
async function pullPrices(ids, locations, qualities) {
	const loc = locations.map((name) => encodeURIComponent(name)).join(",");
	return await pullJson(marketStatsUrl("prices", ids.join(","), `locations=${loc}&qualities=${qualities.join(",")}`));
}
async function pullBook(ids, locations, qualities) {
	const loc = locations.map((name) => encodeURIComponent(name)).join(",");
	return await pullJson(marketStatsUrl("orders", ids.join(","), `locations=${loc}&qualities=${qualities.join(",")}`));
}
async function loadMarketPrices(data) {
	const ids = [...new Set(data.itemIds)];
	const apiIds = ids.map(liveId);
	const quotes = {};
	for (let i = 0; i < apiIds.length; i += 40) {
		const chunk = apiIds.slice(i, i + 40);
		const locations = [...data.locations];
		const qualities = data.qualities;
		let book = [];
		let listed = [];
		try {
			listed = await pullPrices(chunk, locations, qualities);
			if (!Array.isArray(listed)) listed = [];
		} catch {
			listed = [];
		}
		try {
			book = await pullBook(chunk, locations, qualities);
			if (!Array.isArray(book)) book = [];
		} catch {
			book = [];
		}
		for (const row of listed) {
			const sell = row.sell_price_min || 0;
			const buy = row.buy_price_max || 0;
			if (!sell && !buy) continue;
			const item = quotes[row.item_id] ??= {};
			const city = item[row.city] ??= {};
			city[String(row.quality)] = {
				sell,
				buy,
				sellDate: row.sell_price_min_date || "",
				buyDate: row.buy_price_max_date || ""
			};
		}
		for (const row of book) {
			const ask = bestLevel(row.sell, "sell");
			const bid = bestLevel(row.buy, "buy");
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
				buyDate: bid.price ? bid.at : prev.buyDate,
				sellStock: ask.price ? ask.amount : prev.sellStock,
				buyStock: bid.price ? bid.amount : prev.buyStock
			};
		}
		if (i + 40 < apiIds.length) await new Promise((r) => setTimeout(r, 250));
	}
	for (let index = 0; index < ids.length; index += 1) {
		const api = apiIds[index];
		if (api !== ids[index] && quotes[api]) quotes[ids[index]] = quotes[api];
	}
	const afmRows = /* @__PURE__ */ new Map();
	const pending = ids.filter((id) => data.locations.some((city) => data.qualities.some((quality) => {
		const quote = quotes[id]?.[city]?.[String(quality)] ?? quotes[liveId(id)]?.[city]?.[String(quality)];
		return !quote || !liveOf(quote);
	})));
	for (let index = 0; index < pending.length; index += 1) {
		if (index) await new Promise((resolve) => setTimeout(resolve, 100));
		try {
			afmRows.set(pending[index], await pullAfm(liveId(pending[index])));
		} catch {
			afmRows.set(pending[index], []);
		}
	}
	for (const id of ids) {
		const book = quotes[id] ?? quotes[liveId(id)];
		for (const city of data.locations) for (const quality of data.qualities) {
			const current = book?.[city]?.[String(quality)] ?? null;
			const rows = afmRows.get(id) ?? [];
			const hit = rows.find((row) => row.city.toLowerCase() === city.toLowerCase()) ?? rows.find((row) => row.city.toLowerCase().includes(city.toLowerCase()) || city.toLowerCase().includes(row.city.toLowerCase())) ?? null;
			const judged = classify(current, hit ? afmSide(hit) : null);
			if (!judged.row) continue;
			const item = quotes[id] ??= {};
			const slot = item[city] ??= {};
			slot[String(quality)] = {
				...current ?? {},
				sell: judged.row.sell,
				buy: judged.row.buy,
				sellDate: judged.row.sellDate,
				buyDate: judged.row.buyDate,
				type: judged.type,
				updatedAt: judged.updatedAt,
				value: judged.price
			};
		}
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
var HourInput = object({
	server: string().transform(() => "asia"),
	itemId: string().regex(/^[A-Z0-9_@]+$/),
	locations: array(_enum(MARKETS)).min(1).max(MARKETS.length),
	quality: number().int().min(1).max(5)
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
		headers: {
			Accept: "application/json",
			"Accept-Encoding": "gzip, deflate"
		},
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
	const itemId = liveId(data.itemId);
	const historyRes = await readJson(marketStatsUrl("history", itemId, `locations=${loc}&qualities=${data.quality}&time-scale=1`)).catch(() => ({
		status: 0,
		body: null
	}));
	if (historyRes.status === 429) return {
		series: [],
		fetchedAt: Date.now()
	};
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
