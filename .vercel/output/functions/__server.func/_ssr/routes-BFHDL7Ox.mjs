import { o as __toESM } from "../_runtime.mjs";
import { Jt as number, Qt as string, Ut as array, Vt as _enum, Wt as boolean, Yt as object } from "../_libs/@better-auth/core+[...].mjs";
import { b as require_jsx_runtime, q as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as signOut, r as signIn, t as authClient } from "./client-CUsKFAtC.mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { n as authMiddleware, r as snapshotFrom, t as DeskSchema } from "./desk-BCx422vU.mjs";
import { a as hasGateSessionMarker } from "./server-D3pgLwls.mjs";
import { A as getItem, B as matWeight, C as biomeFavors, D as enchantsOf, E as enchantStones, F as liveId, G as variantOf, H as setNameBook, I as marketApiBase, L as marketId, M as installCatalog, N as items, O as gearLine, P as journalFor, R as marketStatsUrl, S as biomeById, T as clampStep, U as specialtyBonus, V as searchItems, W as upgradeSource, _ as STUDY_FACTOR, a as GROUP_LABEL, b as TOOL_LINE, c as HO_QUALITY_BASE, d as NUTRITION_FACTOR, f as OFFHAND_LINE, g as SETUP_FEE, h as REPAIR_SILVER, i as GATHER_LINE, j as hideoutSpecPower, k as gearLineLabel, l as MARKETS, m as REFINE_LINE, n as CRAFT_CITIES, o as HIDEOUT_CRAFT, p as PREMIUM_FAME, r as FORGE_STATIONS, s as HO_BIOMES, t as ARMOR_LINE, u as MOUNT_LINE, v as TAX_PREMIUM, w as bonusBiome, x as WEAPON_LINE, y as TAX_STANDARD, z as matName } from "./marketBase-C95cZX-A.mjs";
import { _ as Check, a as Sprout, c as RefreshCw, d as Menu, f as LayoutDashboard, g as Clock, h as Dices, i as Trash2, l as Plus, m as GraduationCap, n as Users, o as Search, p as Hammer, s as Repeat, t as X, u as Percent } from "../_libs/lucide-react.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BFHDL7Ox.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	return useSessionUserState();
}
function useSessionUserState() {
	const { data, isPending } = authClient.useSession();
	const id = data?.user.id;
	const displayName = data?.user.name ?? null;
	const primaryEmail = data?.user.email ?? null;
	const profileImageUrl = data?.user.image ?? null;
	const user = (0, import_react.useMemo)(() => id ? {
		id,
		displayName,
		primaryEmail,
		profileImageUrl,
		isDevFallback: false
	} : null, [
		id,
		displayName,
		primaryEmail,
		profileImageUrl
	]);
	return (0, import_react.useMemo)(() => ({
		user,
		isPending
	}), [user, isPending]);
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/** Render children only when a user is present (real session, or the disabled-auth dev user). */
function SignedIn({ children }) {
	const { user } = useCurrentUserState();
	return user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children }) : null;
}
/**
* Render children only once we KNOW the visitor is signed out (`isPending` has
* cleared and there is no user). Hidden while the session is still loading.
*/
function SignedOut({ children }) {
	const { user, isPending } = useCurrentUserState();
	if (isPending || user) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-panel-2 text-sm font-medium text-parchment",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hidden text-sm font-medium sm:inline",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var SaveInput = object({
	id: string().min(1).max(80).nullable(),
	name: string().trim().min(1).max(80),
	summary: string().max(240),
	desk: DeskSchema
});
var listCraftGroups = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("fcda325398c22b6a5bf87e27d2b5246b08926ee17f10301aa3ab21cfa7ed84b3"));
var loadCraftGroup = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => object({ id: string().min(1).max(80) }).parse(input)).handler(createSsrRpc("5e40a97356d4c329676960f6b064d42a72b45da9241052dda2d692c30964aacb"));
var saveCraftGroup = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => SaveInput.parse(input)).handler(createSsrRpc("4bb74e2c1562f8eecf2090806bb0bbcd1875d93afd00c7d2d609699c92a58f56"));
var deleteCraftGroup = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => object({ id: string().min(1).max(80) }).parse(input)).handler(createSsrRpc("f91a6c1069a80fedc83dbcaed7cb2e336842c9d2f88adcc0c9445338c67dacdc"));
var RecentRow = object({
	id: string().min(1).max(40),
	itemId: string().min(1).max(80),
	enchant: number().int().min(0).max(4),
	route: _enum(["direct", "upgrade"]),
	city: string().min(1).max(40),
	place: _enum([
		"city",
		"island",
		"hideout"
	]),
	saved: boolean(),
	at: number().int()
});
var loadCraftRecents = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("d3264cb1401d81fabc70c3b7d6716ac0e9e9773596cb576b684eefcc7c9ebbaf"));
var saveCraftRecents = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => object({ recents: array(RecentRow).max(40) }).parse(input)).handler(createSsrRpc("f016ba736eb31d53bc7afd5608500d5b816e587929a091c92c0838d1e08ac66a"));
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
async function pullPrices$1(ids, locations, qualities) {
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
			listed = await pullPrices$1(chunk, locations, qualities);
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
var fetchMarketPrices = createServerFn({ method: "POST" }).validator((input) => Input.parse(input)).handler(createSsrRpc("42f59d9d4471ffd5477b3a5b6a4ae02e4546bc795ce9cc1866e55a2aa79c129a"));
var HourInput = object({
	server: string().transform(() => "asia"),
	itemId: string().regex(/^[A-Z0-9_@]+$/),
	locations: array(_enum(MARKETS)).min(1).max(MARKETS.length),
	quality: number().int().min(1).max(5)
});
var fetchHourlyPrices = createServerFn({ method: "POST" }).validator((input) => HourInput.parse(input)).handler(createSsrRpc("0a31263371f71b39edf22cba1c62c98ca7292577ab4adbbbb38d999d9f4086cd"));
function rememberSearch(current, line) {
	const next = {
		id: Math.random().toString(36).slice(2, 10),
		itemId: line.itemId,
		enchant: line.enchant,
		route: line.route,
		city: line.city,
		place: line.place,
		saved: false,
		at: Date.now()
	};
	const kept = (current ?? []).filter((row) => row.saved || row.itemId !== next.itemId || row.enchant !== next.enchant || row.route !== next.route);
	return [...[next, ...kept.filter((row) => !row.saved)].slice(0, 10), ...kept.filter((row) => row.saved)];
}
function blankLine(itemId = "T4_MAIN_SWORD") {
	return {
		uid: Math.random().toString(36).slice(2, 10),
		itemId,
		enchant: 0,
		route: "direct",
		runs: 10,
		place: "city",
		city: "Lymhurst",
		power: 4,
		hoBiome: "forest",
		hoQuality: 4,
		hoRegion: "outlands",
		extra: 0,
		focus: false,
		daily: 0,
		mastery: 0,
		specialist: 0,
		siblings: 0,
		journal: false,
		journalTier: 4,
		journalTiers: [],
		productOverride: null,
		matOverrides: {},
		focusOverride: null
	};
}
var seed = blankLine();
seed.uid = "broadsword";
function collectIds(lines) {
	const ids = /* @__PURE__ */ new Set();
	for (const line of lines) {
		const item = getItem(line.itemId);
		if (!item) continue;
		const variant = upgradeSource(item, variantOf(item, line.enchant, line.route), line.upgradeFrom === "craft" ? "craft" : "buy");
		ids.add(marketId(item.id, variant.enchant));
		for (const mat of variant.mats) ids.add(mat.id);
		if (line.flip && line.enchant > 0) {
			ids.add(marketId(item.id, 0));
			for (const stone of enchantStones(item, line.enchant)) ids.add(stone.id);
		}
		if (item.journal) {
			const journal = journalFor(item.journal, item.tier);
			if (journal) {
				ids.add(`${journal.id}_EMPTY`);
				ids.add(`${journal.id}_FULL`);
			}
		}
	}
	return [...ids];
}
var loadingFlag = false;
var loadAgain = false;
var retryTimer = 0;
function priceWatchKey(state) {
	return `${state.server}|${collectIds(state.lines).slice().sort().join(",")}`;
}
var useForge = create()(persist((set, get) => ({
	view: "dash",
	server: "asia",
	premium: true,
	buyCity: "Lymhurst",
	sellCity: "Lymhurst",
	buyMode: "instant",
	sellMode: "order",
	leftover: "reuse",
	stationRate: 500,
	quality: 1,
	lines: [seed],
	active: seed.uid,
	loadedId: null,
	loadedName: "My craft",
	prices: {},
	priceAt: null,
	priceError: null,
	loading: false,
	catalogRev: 0,
	catalogNote: null,
	names: {},
	recents: [],
	setItemName: (id, name) => {
		const trimmed = name.trim();
		const names = { ...get().names };
		if (!trimmed) delete names[id];
		else names[id] = trimmed;
		setNameBook(names);
		set({
			names,
			catalogRev: get().catalogRev + 1
		});
	},
	setView: (view) => set({ view }),
	patch: (partial) => set(partial),
	patchLine: (uid, partial) => set({ lines: get().lines.map((line) => line.uid === uid ? {
		...line,
		...partial
	} : line) }),
	setActive: (uid) => set({ active: uid }),
	addLine: (itemId) => {
		const line = blankLine(itemId);
		const current = get().lines.find((entry) => entry.uid === get().active);
		if (current) {
			line.city = current.city;
			line.place = current.place;
			line.power = current.power;
			line.hoBiome = current.hoBiome ?? "forest";
			line.hoQuality = current.hoQuality ?? 4;
			line.hoRegion = current.hoRegion ?? "outlands";
			line.focus = current.focus;
			line.mastery = current.mastery;
			line.specialist = current.specialist;
			line.siblings = current.siblings;
			line.runs = current.runs;
			line.enchant = current.enchant;
			line.route = current.route;
			line.sellAt = current.sellAt;
			line.shopCity = current.shopCity;
		}
		const item = getItem(line.itemId);
		if (item?.journal) line.journalTier = Math.min(8, Math.max(2, item.tier));
		set({
			lines: [...get().lines, line],
			active: line.uid,
			recents: rememberSearch(get().recents, line)
		});
	},
	removeLine: (uid) => {
		const lines = get().lines.filter((line) => line.uid !== uid);
		if (!lines.length) {
			const fresh = blankLine();
			set({
				lines: [fresh],
				active: fresh.uid
			});
			return;
		}
		set({
			lines,
			active: get().active === uid ? lines[0].uid : get().active
		});
	},
	setMatOverride: (uid, id, value) => {
		set({ lines: get().lines.map((line) => {
			if (line.uid !== uid) return line;
			const matOverrides = { ...line.matOverrides };
			if (value == null || Number.isNaN(value)) delete matOverrides[id];
			else matOverrides[id] = value;
			return {
				...line,
				matOverrides
			};
		}) });
	},
	applyDesk: (desk, meta) => {
		const lines = desk.lines.map((line) => ({
			...blankLine(line.itemId),
			...line
		}));
		const active = lines.some((line) => line.uid === desk.active) ? desk.active : lines[0].uid;
		set({
			server: "asia",
			premium: desk.premium,
			buyCity: desk.buyCity,
			sellCity: desk.sellCity,
			buyMode: desk.buyMode,
			sellMode: desk.sellMode,
			leftover: desk.leftover,
			stationRate: desk.stationRate,
			quality: desk.quality,
			lines,
			active,
			loadedId: meta.id,
			loadedName: meta.name,
			view: "bench",
			priceError: null
		});
		get().loadPrices();
	},
	openRecent: (id) => {
		const row = (get().recents ?? []).find((entry) => entry.id === id);
		if (!row) return;
		const line = blankLine(row.itemId);
		line.enchant = row.enchant;
		line.route = row.route;
		line.city = row.city;
		line.place = row.place;
		set({
			lines: [...get().lines, line],
			active: line.uid,
			view: "bench"
		});
	},
	saveRecent: (id) => set({ recents: (get().recents ?? []).map((entry) => entry.id === id ? {
		...entry,
		saved: true
	} : entry) }),
	dropRecent: (id) => set({ recents: (get().recents ?? []).filter((entry) => entry.id !== id) }),
	setRecents: (recents) => set({ recents: capRecents(recents) }),
	loadPrices: async () => {
		if (loadingFlag) {
			loadAgain = true;
			return;
		}
		loadingFlag = true;
		set({
			loading: true,
			priceError: null
		});
		const server = get().server;
		const itemIds = collectIds(get().lines);
		try {
			if (!itemIds.length) {
				set({ loading: false });
				return;
			}
			const request = {
				server,
				itemIds,
				locations: [...MARKETS],
				qualities: [
					1,
					2,
					3,
					4,
					5
				]
			};
			const marketBase = marketApiBase();
			const result = await fetchMarketPrices({ data: request });
			if (!marketBase) throw new Error("missing market base");
			if (get().server !== server) {
				loadAgain = true;
				return;
			}
			const live = new Set(collectIds(get().lines));
			const next = {};
			for (const id of itemIds) {
				if (!live.has(id)) continue;
				const fresh = result.quotes[id];
				if ((fresh ? Object.values(fresh).some((cities) => Object.values(cities).some((quote) => quote.sell > 0 || quote.buy > 0)) : false) && fresh) next[id] = fresh;
			}
			if (!Object.keys(next).length) {
				set({
					loading: false,
					priceError: get().priceAt ? null : "No live prices yet. Press Live prices to try again."
				});
				return;
			}
			set({
				prices: replaceIds(get().prices, next, Object.keys(next)),
				priceAt: result.fetchedAt,
				loading: false,
				priceError: null
			});
		} catch (error) {
			const message = error instanceof Error ? error.message : "Could not load market prices";
			if (/busy|throttl|retry in a minute/i.test(message)) {
				set({
					loading: false,
					priceError: null
				});
				if (!retryTimer) retryTimer = window.setTimeout(() => {
					retryTimer = 0;
					get().loadPrices();
				}, 6e4);
			} else set({
				loading: false,
				priceError: message
			});
		} finally {
			loadingFlag = false;
			if (loadAgain && !retryTimer) {
				loadAgain = false;
				get().loadPrices();
			} else loadAgain = false;
		}
	}
}), {
	name: "hearthforge-v1",
	storage: createJSONStorage(() => localStorage),
	skipHydration: true,
	partialize: (state) => ({
		server: state.server,
		premium: state.premium,
		buyCity: state.buyCity,
		sellCity: state.sellCity,
		buyMode: state.buyMode,
		sellMode: state.sellMode,
		leftover: state.leftover,
		stationRate: state.stationRate,
		quality: state.quality,
		lines: state.lines,
		active: state.active,
		loadedId: state.loadedId,
		loadedName: state.loadedName,
		names: state.names,
		recents: capRecents(state.recents ?? []),
		prices: state.prices,
		priceAt: state.priceAt
	}),
	merge: (persisted, current) => {
		const saved = persisted ?? {};
		const names = saved.names ?? current.names;
		setNameBook(names);
		const lines = (saved.lines ?? current.lines).map((line) => ({
			...blankLine(line.itemId),
			...line
		})).filter((line) => getItem(line.itemId));
		const kept = lines.length ? lines : [blankLine()];
		const active = kept.some((line) => line.uid === saved.active) ? saved.active : kept[0].uid;
		return {
			...current,
			...saved,
			server: "asia",
			prices: saved.server === "asia" ? saved.prices ?? current.prices : {},
			priceAt: saved.server === "asia" ? saved.priceAt ?? null : null,
			lines: kept,
			active: active ?? kept[0].uid,
			loadedId: saved.loadedId ?? null,
			loadedName: saved.loadedName || "My craft",
			recents: capRecents(Array.isArray(saved.recents) ? saved.recents : current.recents)
		};
	}
}));
function replaceIds(prev, next, ids) {
	const out = { ...prev };
	for (const id of ids) out[id] = next[id] ?? {};
	return out;
}
function capRecents(rows) {
	const clean = (rows ?? []).filter((row) => row && typeof row.id === "string" && typeof row.itemId === "string" && typeof row.at === "number");
	const saved = clean.filter((row) => row.saved);
	return [...clean.filter((row) => !row.saved).sort((a, b) => b.at - a.at).slice(0, 10), ...saved];
}
function readQuote(book, id, city, quality) {
	return book[id]?.[city]?.[String(quality)] ?? null;
}
function moneySide(quote, side) {
	if (!quote) return null;
	const value = side === "sell" ? quote.sell : quote.buy;
	return value > 0 ? value : null;
}
var GITHUB_REPO = "KuriHoshino/oasis-orbit-mist-plaza";
var GITHUB_BRANCH = "main";
`${GITHUB_REPO}${GITHUB_BRANCH}`;
var RECIPE_FILES = [
	"accessory.json",
	"armor-cloth.json",
	"armor-leather.json",
	"armor-plate.json",
	"food.json",
	"gather.json",
	"offhand.json",
	"mount.json",
	"potion.json",
	"refine.json",
	"tool.json",
	"weapon-arcanestaff.json",
	"weapon-axe.json",
	"weapon-bow.json",
	"weapon-crossbow.json",
	"weapon-cursestaff.json",
	"weapon-dagger.json",
	"weapon-firestaff.json",
	"weapon-froststaff.json",
	"weapon-hammer.json",
	"weapon-holystaff.json",
	"weapon-knuckles.json",
	"weapon-mace.json",
	"weapon-naturestaff.json",
	"weapon-quarterstaff.json",
	"weapon-shapeshifterstaff.json",
	"weapon-spear.json",
	"weapon-sword.json"
];
var MATERIAL_FILES = [
	"materials-1.json",
	"materials-2.json",
	"materials-3.json",
	"materials-4.json",
	"materials-5.json",
	"materials-mounts.json"
];
var RAW = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/src/lib/forge/data`;
var DB = "hearthforge-catalog";
var KEY = "snap";
function rawUrl(file) {
	return `${RAW}/${file}?t=${Date.now()}`;
}
async function readJson(file) {
	const res = await fetch(rawUrl(file), { cache: "no-store" });
	if (!res.ok) throw new Error(`${file} ${res.status}`);
	return res.json();
}
function asItems(value, file) {
	if (!Array.isArray(value) || value.length === 0 || typeof value[0]?.id !== "string" || typeof value[0]?.name !== "string") throw new Error(`${file} is not a recipe list`);
	return value;
}
function asMaterials(value, file) {
	if (!value || Array.isArray(value) || typeof value !== "object") throw new Error(`${file} is not a material book`);
	return value;
}
function asJournals(value) {
	if (!Array.isArray(value)) throw new Error("journals.json is not a list");
	return value;
}
function idbGet() {
	return new Promise((resolve, reject) => {
		const open = indexedDB.open(DB, 1);
		open.onupgradeneeded = () => open.result.createObjectStore(DB);
		open.onerror = () => reject(open.error);
		open.onsuccess = () => {
			const req = open.result.transaction(DB, "readonly").objectStore(DB).get(KEY);
			req.onsuccess = () => resolve(req.result);
			req.onerror = () => reject(req.error);
		};
	});
}
function idbPut(snap) {
	return new Promise((resolve, reject) => {
		const open = indexedDB.open(DB, 1);
		open.onupgradeneeded = () => open.result.createObjectStore(DB);
		open.onerror = () => reject(open.error);
		open.onsuccess = () => {
			const tx = open.result.transaction(DB, "readwrite");
			tx.objectStore(DB).put(snap, KEY);
			tx.oncomplete = () => resolve();
			tx.onerror = () => reject(tx.error);
		};
	});
}
async function commitSha() {
	const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/commits/${GITHUB_BRANCH}`, {
		headers: { Accept: "application/vnd.github+json" },
		cache: "no-store"
	});
	if (!res.ok) throw new Error(`GitHub ${res.status}`);
	const body = await res.json();
	if (!body.sha) throw new Error("GitHub did not return a commit");
	return body.sha;
}
async function downloadSnap(sha) {
	const [recipes, mats, journals] = await Promise.all([
		Promise.all(RECIPE_FILES.map(async (file) => asItems(await readJson(file), file))),
		Promise.all(MATERIAL_FILES.map(async (file) => asMaterials(await readJson(file), file))),
		readJson("journals.json").then(asJournals)
	]);
	return {
		sha,
		items: recipes.flat(),
		materials: Object.assign({}, ...mats),
		journals
	};
}
function withoutBlackHands(snap) {
	const items = snap.items.filter((item) => !item.id.includes("IRONGAUNTLETS_HELL") && !/black hands/i.test(item.name));
	const materials = { ...snap.materials };
	for (const key of Object.keys(materials)) if (key.includes("IRONGAUNTLETS_HELL") || /black hands/i.test(materials[key]?.name ?? "")) delete materials[key];
	return {
		...snap,
		items,
		materials
	};
}
function applySnap(snap, note) {
	installCatalog(withoutBlackHands(snap));
	const state = useForge.getState();
	useForge.setState({
		catalogRev: state.catalogRev + 1,
		catalogNote: note
	});
}
var syncing = false;
async function syncCatalogFromGitHub(force = false) {
	if (syncing) return;
	syncing = true;
	try {
		const sha = await commitSha();
		if (!force) {
			const cached = await idbGet().catch(() => void 0);
			if (cached?.sha === sha && cached.items?.length) {
				applySnap(cached, "Recipes are up to date.");
				return;
			}
		}
		const snap = await downloadSnap(sha);
		applySnap(snap, "Recipes updated.");
		await idbPut(snap).catch(() => void 0);
	} finally {
		syncing = false;
	}
}
function productionBonus(opts) {
	const refine = [
		"ore",
		"wood",
		"hide",
		"fiber",
		"rock"
	].includes(opts.category);
	const parts = [];
	if (opts.place === "city") parts.push({
		label: "City base",
		value: 18
	});
	if (opts.place === "island") parts.push({
		label: "Island base",
		value: 0
	});
	if (opts.place === "hideout") {
		const level = clampStep(opts.power, 1, 9, 1);
		const region = opts.region === "roads" ? "roads" : "outlands";
		const quality = region === "roads" ? 1 : clampStep(opts.mapQuality ?? 1, 1, 6, 1);
		const biome = biomeById(opts.biome);
		if (biome.kind === "city") {
			parts.push({
				label: "City base",
				value: 18
			});
			const spec = specialtyBonus(biome.city, opts.category);
			if (spec) parts.push({
				label: `${biome.label} specialty`,
				value: spec
			});
		} else {
			const general = HIDEOUT_CRAFT[level] ?? 0;
			const matched = biomeFavors(biome.id, opts.category);
			if (refine) {
				const base = region === "roads" ? 10 : 15;
				parts.push({
					label: region === "roads" ? "Roads refining" : "Outlands refining",
					value: base
				});
				parts.push({
					label: `Hideout level ${level}`,
					value: general
				});
				if (matched) {
					const spec = hideoutSpecPower(level);
					if (spec) parts.push({
						label: `${biome.label} specialty`,
						value: spec
					});
				}
			} else if (matched) {
				parts.push({
					label: `${biome.label} Q${quality}`,
					value: HO_QUALITY_BASE[quality] ?? 0
				});
				parts.push({
					label: `Hideout level ${level}`,
					value: general
				});
				const spec = hideoutSpecPower(level);
				if (spec) parts.push({
					label: `Level ${level} specialty`,
					value: spec
				});
			} else parts.push({
				label: `Hideout level ${level}`,
				value: general
			});
		}
	}
	if (opts.place !== "hideout") {
		const spec = specialtyBonus(opts.city, opts.category);
		if (spec) parts.push({
			label: `${opts.city} specialty`,
			value: spec
		});
	}
	if (opts.focus) parts.push({
		label: "Focus",
		value: 59
	});
	if (opts.daily) parts.push({
		label: "Daily bonus",
		value: opts.daily
	});
	if (opts.extra) parts.push({
		label: "Extra bonus",
		value: opts.extra
	});
	return {
		total: parts.reduce((sum, p) => sum + p.value, 0),
		parts
	};
}
/** Resource return rate from a production bonus. bonus / (100 + bonus). */
function returnRate(bonus) {
	if (bonus <= 0) return 0;
	return bonus / (100 + bonus);
}
var UNIQUE_FOCUS = 250;
/** Group bonus one specialization level gives the other crafts in that node. */
function specGroupBonus(itemId, category) {
	const bare = itemId.split("#")[0].replace(/@\d+$/, "");
	if (/^T\d_(HEAD|ARMOR|SHOES)_LEATHER_(?!SET\d)/.test(bare)) return {
		focus: 12.5,
		quality: .3125
	};
	if (category === "potion" || /_ALCOHOL$/.test(bare)) return {
		focus: /_(ACID|MOB_RESET|CLEANSE2|BERSERK|GATHER|LAVA|LIFEWARD|TORNADO)$/.test(bare) ? 11.25 : 22.5,
		quality: 0
	};
	return {
		focus: 30,
		quality: .75
	};
}
/** Focus cost = base × 0.5 ^ (efficiency / 10000). The station shows the nearest whole point. */
function focusFromSpecs(base, mastery, specialist, siblings, groupFocus = 30) {
	const efficiency = Math.max(0, mastery) * 30 + Math.max(0, specialist) * (UNIQUE_FOCUS + groupFocus) + Math.max(0, siblings) * groupFocus;
	const raw = base * Math.pow(.5, efficiency / 1e4);
	return {
		efficiency,
		cost: Math.round(raw)
	};
}
/**
* Refining has no mastery node. Every T4–T8 spec adds 30, and the tier you refine adds another 250.
* T2 and T3 have no specialization, so they stay at the base cost.
*/
function focusFromRefine(base, specs, tier) {
	const nodes = [
		4,
		5,
		6,
		7,
		8
	];
	let efficiency = 0;
	if (nodes.includes(tier)) for (const level of nodes) {
		const spec = Math.min(100, Math.max(0, specs[level] ?? 0));
		efficiency += spec * 30;
		if (level === tier) efficiency += spec * 250;
	}
	const raw = base * Math.pow(.5, efficiency / 1e4);
	return {
		efficiency,
		cost: Math.round(raw)
	};
}
function nutrition(itemValue, itemsCrafted, tier) {
	if (tier <= 2) return 0;
	return itemValue * NUTRITION_FACTOR * itemsCrafted;
}
function stationFee(itemValue, itemsCrafted, tier, ratePer100) {
	return nutrition(itemValue, itemsCrafted, tier) * ratePer100 / 100;
}
function ceilShare(price, rate) {
	if (price <= 0 || rate <= 0) return 0;
	return Math.ceil(price * rate - 1e-9);
}
/** Fees on a whole stack, matching the market: ceil(rate × total silver), not per item. */
function stackSell(unit, qty, mode, premium) {
	const gross = unit * qty;
	const taxRate = mode === "notax" ? 0 : premium ? TAX_PREMIUM : TAX_STANDARD;
	const setupRate = mode === "order" ? SETUP_FEE : 0;
	const tax = ceilShare(gross, taxRate);
	const setup = ceilShare(gross, setupRate);
	return {
		gross,
		tax,
		setup,
		net: gross - tax - setup
	};
}
function stackBuy(unit, qty, mode) {
	const gross = unit * qty;
	const setup = mode === "order" ? ceilShare(gross, SETUP_FEE) : 0;
	return {
		cost: gross + setup,
		setup
	};
}
/**
* Whole resources the game returns over `runs` crafts.
* Floor, except when the value is within a rounding hair of the next integer.
*/
function wholeReturn(value) {
	if (value <= 0) return 0;
	const nearest = Math.round(value);
	const slop = Number.EPSILON * Math.max(1, Math.abs(value)) * 8;
	return Math.abs(value - nearest) <= slop ? nearest : Math.floor(value);
}
/**
* What you actually buy, and the leftover stack you sell.
* Returns from the earlier crafts are reused. The last craft's return is leftover.
*/
function materialLots(runs, perCraft, rrr) {
	const n = Math.floor(Math.max(0, runs));
	const rate = Math.max(0, rrr);
	if (n <= 0 || perCraft <= 0) return {
		buy: 0,
		leftover: 0
	};
	if (rate <= 0) return {
		buy: perCraft * n,
		leftover: 0
	};
	const per = perCraft * rate;
	const before = wholeReturn((n - 1) * per);
	const all = wholeReturn(n * per);
	const reusable = Math.min(before, perCraft * (n - 1));
	return {
		buy: Math.ceil(perCraft * n - reusable),
		leftover: all - reusable
	};
}
function repairSilver(itemValue, missingFraction, serverMultiplier, count) {
	const fraction = Math.min(1, Math.max(0, missingFraction));
	const mult = serverMultiplier > 0 ? serverMultiplier : 1;
	const each = Math.ceil(itemValue * fraction * REPAIR_SILVER * mult - 1e-9);
	return {
		each,
		total: each * Math.max(0, Math.round(count))
	};
}
function craftMath(opts) {
	const runs = Math.max(0, opts.runs);
	const bonus = productionBonus(opts);
	const total = bonus.total;
	const parts = bonus.parts;
	const rrr = returnRate(total);
	const items = (opts.variant.output || 1) * runs;
	const fameEach = opts.variant.fame * (opts.premium ? PREMIUM_FAME : 1);
	const fameTotal = fameEach * items;
	const journalFame = opts.variant.fame * items;
	const fee = opts.flip ? 0 : stationFee(opts.variant.value, items, opts.tier, opts.stationRate);
	const nut = nutrition(opts.variant.value, items, opts.tier);
	const baseFocus = opts.focusOverride != null && opts.focusOverride >= 0 ? opts.focusOverride : opts.variant.focus;
	const group = specGroupBonus(opts.itemId ?? "", opts.category);
	const spec = focusFromSpecs(baseFocus, opts.mastery, opts.specialist, opts.siblings, group.focus);
	const focusEach = opts.focus ? spec.cost : 0;
	const dailyMult = opts.daily === 20 ? 1.2 : opts.daily === 10 ? 1.1 : 1;
	const studyEach = opts.variant.fame * STUDY_FACTOR * dailyMult * (opts.premium ? PREMIUM_FAME : 1);
	const missing = [];
	let materialCost = 0;
	let materialKnown = true;
	let leftoverValue = 0;
	let leftoverKnown = true;
	const consumed = [];
	const leftovers = [];
	if (opts.flip) {
		const n = Math.max(0, opts.runs);
		const buys = [...opts.flipItemId ? [{
			id: opts.flipItemId,
			qty: opts.variant.output || 1
		}] : [], ...opts.flipMats ?? []];
		for (const mat of buys) {
			const bought = mat.qty * n;
			const unit = opts.matUnit(mat.id);
			if (unit == null) {
				materialKnown = false;
				missing.push(mat.id);
			}
			const priced = unit == null ? null : stackBuy(unit, bought, opts.buyMode).cost;
			if (priced != null) materialCost += priced;
			consumed.push({
				id: mat.id,
				qty: bought,
				unit,
				cost: priced
			});
		}
	}
	for (const mat of opts.flip ? [] : opts.variant.mats) {
		const rate = mat.ret ? rrr : 0;
		const returns = rate > 0;
		const lots = returns ? materialLots(runs, mat.qty, rate) : {
			buy: mat.qty * Math.floor(Math.max(0, runs)),
			leftover: 0
		};
		const n = Math.floor(Math.max(0, runs));
		const sold = opts.leftover === "sell" && returns ? wholeReturn(mat.qty * n * rate) : lots.leftover;
		const bought = opts.leftover === "sell" && returns ? mat.qty * n : lots.buy;
		const unit = opts.matUnit(mat.id);
		if (unit == null) {
			materialKnown = false;
			missing.push(mat.id);
		}
		const priced = unit == null ? null : stackBuy(unit, bought, opts.buyMode).cost;
		if (priced != null) materialCost += priced;
		consumed.push({
			id: mat.id,
			qty: bought,
			unit,
			cost: priced
		});
		if (sold > 0) {
			leftovers.push({
				id: mat.id,
				qty: sold
			});
			const sell = opts.matSellUnit(mat.id) ?? opts.matUnit(mat.id);
			if (sell == null) {
				leftoverKnown = false;
				missing.push(mat.id);
			} else leftoverValue += stackSell(sell, sold, opts.sellMode, opts.premium).net;
		}
	}
	const silverCost = opts.flip ? 0 : (opts.variant.silver || 0) * runs;
	let revenue = null;
	if (opts.productUnit == null) missing.push("product");
	else revenue = stackSell(opts.productUnit, items, opts.productSellMode ?? opts.sellMode, opts.premium).net;
	let journalProfit = null;
	let journals = 0;
	const journalRows = [];
	const fills = opts.flip ? [] : opts.journalFills.filter((fill) => fill.fame > 0);
	if (fills.length) {
		const share = journalFame / fills.length;
		let profit = 0;
		let known = true;
		for (const fill of fills) {
			const count = share / fill.fame;
			journals += count;
			if (fill.empty == null || fill.full == null) {
				known = false;
				journalRows.push({
					tier: fill.tier,
					count,
					profit: null
				});
				continue;
			}
			const row = stackSell(fill.full, count, opts.sellMode, opts.premium).net - stackBuy(fill.empty, count, opts.buyMode).cost;
			profit += row;
			journalRows.push({
				tier: fill.tier,
				count,
				profit: row
			});
		}
		journalProfit = known ? profit : null;
		if (!known) missing.push("journal");
	}
	const journalsPriced = fills.length === 0 || journalProfit != null;
	const profit = revenue == null || !materialKnown || !leftoverKnown || !journalsPriced ? null : revenue + leftoverValue + (journalProfit ?? 0) - materialCost - fee - silverCost;
	const spent = materialKnown && journalsPriced ? materialCost + fee + silverCost + (journalProfit != null && journalProfit < 0 ? -journalProfit : 0) : null;
	const margin = profit != null && spent && spent > 0 ? profit / spent : null;
	return {
		bonus: total,
		parts,
		rrr,
		focusEach,
		focusTotal: focusEach * runs,
		efficiency: spec.efficiency,
		items,
		fameEach,
		fameTotal,
		studyEach,
		fee,
		nutrition: nut,
		materialCost: materialKnown ? materialCost : null,
		leftoverValue: leftoverKnown ? leftoverValue : null,
		revenue,
		journalProfit,
		journals,
		journalRows,
		silverCost,
		profit,
		margin,
		missing,
		consumed,
		leftovers
	};
}
/** Repair-station quality reroll. Quality cannot fall. Masterpiece cannot be rerolled. */
var REROLL_NAMES = [
	"",
	"Normal",
	"Good",
	"Outstanding",
	"Excellent",
	"Masterpiece"
];
/** Silver multiplier on item value for one attempt, before the server multiplier. */
var REROLL_MOD = {
	1: 4.4,
	2: 5.5,
	3: 6.6,
	4: 27.5
};
/**
* Chance of each result quality 1–5, indexed by destination.
* Index 0 is unused. A Normal item always improves.
*/
var REROLL_TO = {
	1: [
		0,
		0,
		.8,
		.15,
		.0495,
		5e-4
	],
	2: [
		0,
		0,
		.3,
		.6,
		.09925,
		75e-5
	],
	3: [
		0,
		0,
		0,
		.5,
		.499,
		.001
	],
	4: [
		0,
		0,
		0,
		0,
		.995,
		.005
	]
};
function rerollAttempt(itemValue, quality, multiplier) {
	const mod = REROLL_MOD[quality];
	if (!mod || !(itemValue > 0) || !(multiplier > 0)) return 0;
	return itemValue * multiplier * mod;
}
/** Expected attempts and silver to reach the target quality or better. */
function rerollPlan(itemValue, from, target, multiplier) {
	const start = Math.min(5, Math.max(1, Math.round(from)));
	const goal = Math.min(5, Math.max(start, Math.round(target)));
	const attempts = [
		0,
		0,
		0,
		0,
		0,
		0
	];
	const silverCost = [
		0,
		0,
		0,
		0,
		0,
		0
	];
	for (let q = goal - 1; q >= 1; q--) {
		const row = REROLL_TO[q];
		if (!row) continue;
		let laterAttempts = 0;
		let laterSilver = 0;
		for (let next = q + 1; next <= 5; next++) {
			laterAttempts += row[next] * attempts[next];
			laterSilver += row[next] * silverCost[next];
		}
		const leave = 1 - row[q];
		attempts[q] = leave > 0 ? (1 + laterAttempts) / leave : 0;
		silverCost[q] = leave > 0 ? (rerollAttempt(itemValue, q, multiplier) + laterSilver) / leave : 0;
	}
	const row = REROLL_TO[start] ?? [
		0,
		0,
		0,
		0,
		0,
		0
	];
	let hit = 0;
	for (let next = goal; next <= 5; next++) hit += row[next] ?? 0;
	return {
		attempt: start >= 5 ? 0 : rerollAttempt(itemValue, start, multiplier),
		attempts: start >= goal ? 0 : attempts[start],
		silver: start >= goal ? 0 : silverCost[start],
		hit,
		chances: row
	};
}
var fieldClass = "h-11 w-full rounded-lg border border-line bg-ink px-3 text-base text-parchment outline-none focus-visible:border-brass";
var labelClass = "flex min-w-0 flex-col gap-1 text-sm text-muted";
function silver(value) {
	if (value == null || Number.isNaN(value)) return "—";
	const cents = Math.round(value * 100) / 100;
	return (cents < 0 ? "-" : "") + Math.abs(cents).toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
}
function exact(value) {
	return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
}
/** Official item picture. The plain URL is the one Albion Free Market already has cached. */
function itemIconUrl(id, enchant = 0, quality = 1) {
	const unique = marketId(id, enchant);
	const base = `https://render.albiononline.com/v1/item/${encodeURIComponent(unique)}.png`;
	if (quality > 1 && quality <= 5) return `${base}?quality=${quality}`;
	return base;
}
function itemMark(id, enchant = 0) {
	const unique = marketId(id, enchant);
	const tier = unique.match(/^T(\d+)/)?.[1];
	const level = unique.match(/@(\d)/)?.[1] ?? "0";
	return tier ? `${tier}.${level}` : "";
}
function ItemIcon({ id, enchant = 0, quality = 1, size = 40 }) {
	const frame = quality > 1 && quality <= 5 ? quality : 1;
	const sources = [...new Set([
		itemIconUrl(id, enchant, frame),
		itemIconUrl(id, 0, frame),
		matName(id) ? itemIconUrl(matName(id), 0, frame) : ""
	].filter(Boolean))];
	const [step, setStep] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		setStep(0);
	}, [
		id,
		enchant,
		quality
	]);
	if (step >= sources.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: sources[step],
		alt: "",
		width: size,
		height: size,
		decoding: "async",
		loading: size >= 48 ? "eager" : "lazy",
		className: "shrink-0 rounded-md bg-ink object-contain",
		style: {
			width: size,
			height: size
		},
		onError: () => setStep((current) => current + 1)
	});
}
/** Short age for a price timestamp, such as "5m ago" or "2d ago". */
function formatTimeAgo(isoDate) {
	if (!isoDate) return "No recent data";
	const date = new Date(isoDate);
	if (Number.isNaN(date.getTime())) return "No recent data";
	const diffMins = Math.floor((Date.now() - date.getTime()) / 6e4);
	if (diffMins < 1) return "just now";
	if (diffMins < 60) return `${diffMins}m ago`;
	const diffHours = Math.floor(diffMins / 60);
	if (diffHours < 24) return `${diffHours}h ago`;
	return `${Math.floor(diffHours / 24)}d ago`;
}
function quoteNote(quote, side = "sell") {
	if (!quote || quote.type === "None") return "No data";
	if (quote.type === "EMV") return "EMV";
	if (quote.type === "Live") return formatTimeAgo(quote.updatedAt || null);
	return priceAge(side === "sell" ? quote.sellDate : quote.buyDate) || "No data";
}
function PriceTag({ price, updatedAt, type }) {
	if (type === "None" || !(price > 0)) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "text-muted",
		children: ["—", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block text-xs",
			children: "No data"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "tabular-nums text-parchment",
		children: silver(price)
	}), type === "EMV" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "block text-xs text-muted",
		children: "EMV"
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "block text-xs text-muted",
		children: formatTimeAgo(updatedAt)
	})] });
}
/** How old a market timestamp is, such as "2h ago". */
function priceAge(stamp) {
	if (!stamp) return "";
	if (stamp === "afm") return "AFM";
	const time = Date.parse(stamp.endsWith("Z") || stamp.includes("+") ? stamp : `${stamp}Z`);
	if (Number.isNaN(time)) return "";
	const mins = Math.max(0, Math.floor((Date.now() - time) / 6e4));
	if (mins < 1) return "just now";
	if (mins < 60) return `${mins}m ago`;
	const hours = Math.floor(mins / 60);
	if (hours < 48) return `${hours}h ago`;
	return `${Math.floor(hours / 24)}d ago`;
}
/** Age written the way a market order is aged, such as "11.9h old". */
function orderAge(stamp) {
	if (!stamp) return "";
	if (stamp === "afm") return "AFM";
	const time = Date.parse(stamp.endsWith("Z") || stamp.includes("+") ? stamp : `${stamp}Z`);
	if (Number.isNaN(time)) return "";
	const hours = Math.max(0, (Date.now() - time) / 36e5);
	if (hours < 1) return `${Math.max(1, Math.round(hours * 60))}m old`;
	if (hours < 48) return `${hours.toFixed(1)}h old`;
	return `${Math.floor(hours / 24)}d old`;
}
function pct(value) {
	return `${(value * 100).toFixed(2)}%`;
}
function Field$1({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: labelClass,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), children]
	});
}
function Num({ label, value, onChange, min, step }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
		label,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			className: fieldClass,
			type: "number",
			inputMode: "decimal",
			min,
			step: step ?? 1,
			value: Number.isFinite(value) ? value : 0,
			onChange: (event) => onChange(event.target.value === "" ? 0 : Number(event.target.value))
		})
	});
}
function Select({ label, value, onChange, options }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
		label,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
			className: fieldClass,
			value,
			onChange: (event) => onChange(event.target.value),
			children: options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: option.value,
				children: option.label
			}, option.value))
		})
	});
}
function Toggle({ on, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-pressed": on,
		onClick,
		className: "inline-flex h-11 items-center justify-center rounded-lg border px-3 text-sm font-medium " + (on ? "border-brass bg-brass text-ink" : "border-line bg-panel text-parchment"),
		children
	});
}
var STROKE = {
	Thetford: "#9ece6a",
	Lymhurst: "#2dd4bf",
	Bridgewatch: "#bb9af7",
	Martlock: "#7aa2f7",
	"Fort Sterling": "#c0caf5",
	Caerleon: "#f7768e",
	Brecilien: "#9ece6a",
	"Black Market": "#565f89"
};
function soldInDay(points) {
	if (!points.length) return null;
	const newest = points[points.length - 1];
	const end = Date.parse(newest.time.endsWith("Z") ? newest.time : `${newest.time}Z`);
	if (Number.isNaN(end)) return null;
	const start = end - 864e5;
	let sold = 0;
	for (const point of points) {
		const time = Date.parse(point.time.endsWith("Z") ? point.time : `${point.time}Z`);
		if (!Number.isNaN(time) && time >= start) sold += point.count;
	}
	return sold;
}
function hourLabel(stamp) {
	const date = new Date(stamp.endsWith("Z") ? stamp : `${stamp}Z`);
	if (Number.isNaN(date.getTime())) return stamp;
	return date.toLocaleString(void 0, {
		month: "short",
		day: "numeric",
		hour: "numeric"
	});
}
function HourlyChart({ server, itemId, itemName, quality, side, usedCity, onUse, cities = MARKETS }) {
	const [series, setSeries] = (0, import_react.useState)([]);
	const [bandSold, setBandSold] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [at, setAt] = (0, import_react.useState)(null);
	const book = useForge((s) => s.prices);
	const filled = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (!itemId) return;
		let cancel = false;
		const load = () => {
			setLoading(true);
			const request = {
				server,
				itemId,
				locations: [...MARKETS],
				quality
			};
			const marketBase = marketApiBase();
			const pending = fetchHourlyPrices({ data: request });
			if (!marketBase) throw new Error("missing market base");
			const band = Promise.all([
				1,
				2,
				3
			].map((level) => {
				return fetchHourlyPrices({ data: {
					server,
					itemId,
					locations: ["Black Market"],
					quality: level
				} }).catch(() => ({
					series: [],
					fetchedAt: 0
				}));
			}));
			Promise.all([pending, band]).then(([result, histories]) => {
				if (cancel) return;
				filled.current = result.series.length > 0;
				setSeries(result.series);
				setAt(result.fetchedAt);
				setError("");
				let sold = 0;
				let any = false;
				for (const history of histories) {
					const day = soldInDay(history.series.find((entry) => entry.city === "Black Market")?.points ?? []);
					if (day == null) continue;
					any = true;
					sold += day;
				}
				setBandSold(any ? sold : null);
			}).catch((err) => {
				if (cancel || filled.current) return;
				setError(err instanceof Error ? err.message : "Could not load hourly prices");
			}).finally(() => {
				if (!cancel) setLoading(false);
			});
		};
		const start = window.setTimeout(load, 4e3);
		const timer = window.setInterval(load, 6e4);
		return () => {
			cancel = true;
			window.clearTimeout(start);
			window.clearInterval(timer);
		};
	}, [
		server,
		itemId,
		quality
	]);
	const lastByCity = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const entry of series) {
			const point = entry.points[entry.points.length - 1];
			if (point) map.set(entry.city, point);
		}
		return map;
	}, [series]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: loading ? "Loading the data project…" : at ? `Updated ${hourLabel(new Date(at).toISOString())}` : itemName
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-ember",
				children: error
			}) : null,
			!error && !loading && series.length === 0 && !book[itemId] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "No price for this item yet."
			}) : null,
			series.length > 0 || book[itemId] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CityGrid, {
				itemId,
				quality,
				side,
				usedCity,
				book,
				series,
				bandSold,
				lastByCity,
				onUse,
				cities
			}) : null
		]
	});
}
function CityGrid({ itemId, quality, side, usedCity, book, series, bandSold, lastByCity, onUse, cities }) {
	const rows = cities.map((city) => {
		const quote = book[itemId]?.[city]?.[String(quality)];
		const sell = quote && quote.sell > 0 ? quote.sell : null;
		const buy = quote && quote.buy > 0 ? quote.buy : null;
		return {
			city,
			sell,
			buy,
			price: side === "sell" ? sell : buy,
			sellAge: priceAge(quote?.sellDate),
			buyAge: priceAge(quote?.buyDate)
		};
	});
	const lowestSell = rows.reduce((best, row) => {
		if (row.sell == null) return best;
		if (best == null || row.sell < best) return row.sell;
		return best;
	}, null);
	const highestSell = rows.reduce((best, row) => {
		if (row.sell == null) return best;
		if (best == null || row.sell > best) return row.sell;
		return best;
	}, null);
	const split = lowestSell != null && highestSell != null && lowestSell !== highestSell;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-3 grid grid-cols-2 gap-2",
		children: rows.map((row) => {
			const last = lastByCity.get(row.city);
			const own = soldInDay(series.find((entry) => entry.city === row.city)?.points ?? []);
			const sold = row.city === "Black Market" ? bandSold : own;
			const using = usedCity === row.city;
			const cheap = split && row.sell === lowestSell;
			const rich = split && row.sell === highestSell;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-start gap-2 rounded-lg border border-line px-2 py-1.5 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onUse(row.city, row.price),
					"aria-label": cheap ? `Lowest price is ${row.city}` : rich ? `Highest price is ${row.city}` : `Use ${row.city}`,
					className: "mt-0.5 grid size-8 shrink-0 place-items-center rounded-md border " + (cheap ? "border-sage text-sage " : rich ? "border-ember text-ember " : using ? "border-brass text-brass " : "border-line text-muted "),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "inline-flex items-center gap-1.5 text-parchment",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-block size-2 shrink-0 rounded-full",
									style: { background: STROKE[row.city] }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: row.city
								}),
								cheap ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sage",
									children: "lowest"
								}) : null,
								rich ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-ember",
									children: "highest"
								}) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "tabular-nums text-muted",
							children: [
								row.sell != null ? `sell ${silver(row.sell)}${row.sellAge ? ` · ${row.sellAge}` : ""}` : "sell —",
								" · ",
								row.buy != null ? `buy ${silver(row.buy)}${row.buyAge ? ` · ${row.buyAge}` : ""}` : "buy —"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "tabular-nums text-muted",
							children: [sold == null ? "No sales recorded" : `${exact(sold)} sold / day${row.city === "Black Market" ? " · N/G/O" : ""}`, row.price == null && last ? ` · last ${silver(last.price)}` : ""]
						})
					]
				})]
			}, row.city);
		})
	});
}
var GROUPS = [
	"all",
	"refine",
	"weapon",
	"armor",
	"offhand",
	"mount",
	"accessory",
	"tool",
	"gather",
	"food",
	"potion"
];
var TIERS$2 = [
	2,
	3,
	4,
	5,
	6,
	7,
	8
];
function Chip({ on, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: "h-11 shrink-0 rounded-full border px-3 text-sm " + (on ? "border-brass text-brass" : "border-line text-muted"),
		children
	});
}
function ItemPicker({ onPick, compact }) {
	const [query, setQuery] = (0, import_react.useState)("");
	const [group, setGroup] = (0, import_react.useState)("all");
	const [station, setStation] = (0, import_react.useState)("");
	const [line, setLine] = (0, import_react.useState)("");
	const [tier, setTier] = (0, import_react.useState)(0);
	const forge = group === "weapon" || group === "armor";
	const split = forge || group === "offhand" || group === "tool" || group === "gather" || group === "mount" || group === "refine";
	const lines = (0, import_react.useMemo)(() => {
		const book = group === "weapon" ? WEAPON_LINE : group === "armor" ? ARMOR_LINE : group === "offhand" ? OFFHAND_LINE : group === "tool" ? TOOL_LINE : group === "gather" ? GATHER_LINE : group === "mount" ? MOUNT_LINE : group === "refine" ? REFINE_LINE : null;
		if (!book) return [];
		return Object.entries(book).filter(([, entry]) => !forge || !station || !("station" in entry) || entry.station === station).map(([id, entry]) => ({
			id,
			label: entry.label
		}));
	}, [
		group,
		station,
		forge
	]);
	const catalogRev = useForge((s) => s.catalogRev);
	const hits = (0, import_react.useMemo)(() => searchItems(query, group, split ? {
		station: forge ? station : "",
		line,
		tier: tier || void 0
	} : void 0), [
		query,
		group,
		split,
		forge,
		station,
		line,
		tier,
		catalogRev
	]);
	const sections = (0, import_react.useMemo)(() => {
		const slotOrder = Object.keys(ARMOR_LINE);
		const buckets = /* @__PURE__ */ new Map();
		for (const item of hits) {
			const slot = group === "armor" ? item.category : "";
			const key = group === "armor" ? `${item.tier}|${slot}` : String(item.tier);
			const title = group === "armor" ? `Tier ${item.tier} · ${ARMOR_LINE[item.category]?.label ?? "Armor"}` : `Tier ${item.tier}`;
			const bucket = buckets.get(key) ?? {
				title,
				rows: []
			};
			bucket.rows.push(item);
			bucket.rows.sort((a, b) => a.name.localeCompare(b.name));
			buckets.set(key, bucket);
		}
		return [...buckets.entries()].sort((a, b) => {
			const [tierA, slotA = ""] = a[0].split("|");
			const [tierB, slotB = ""] = b[0].split("|");
			const byTier = Number(tierA) - Number(tierB);
			if (byTier) return byTier;
			return slotOrder.indexOf(slotA) - slotOrder.indexOf(slotB);
		}).map(([, bucket]) => bucket);
	}, [hits, group]);
	function pickGroup(id) {
		setGroup(id);
		setStation("");
		setLine("");
		setTier(0);
	}
	function pickStation(id) {
		setStation(id);
		if (group === "weapon" && line && WEAPON_LINE[line]?.station !== id && id) setLine("");
		if (group === "armor" && line && ARMOR_LINE[line]?.station !== id && id) setLine("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: fieldClass,
				value: query,
				placeholder: "Search broadsword, steel bar, stew…",
				onChange: (event) => setQuery(event.target.value),
				"aria-label": "Search recipes"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2 overflow-x-auto pb-1",
				children: GROUPS.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					on: group === id,
					onClick: () => pickGroup(id),
					children: id === "all" ? "All" : GROUP_LABEL[id]
				}, id))
			}),
			split ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				forge ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 overflow-x-auto pb-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						on: station === "",
						onClick: () => pickStation(""),
						children: "All stations"
					}), FORGE_STATIONS.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						on: station === id,
						onClick: () => pickStation(station === id ? "" : id),
						children: id
					}, id))]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 overflow-x-auto pb-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						on: line === "",
						onClick: () => setLine(""),
						children: group === "armor" ? "All armor" : group === "offhand" ? "All off-hands" : group === "tool" ? "All tools" : group === "gather" ? "All gathering gear" : group === "mount" ? "All mounts" : group === "refine" ? "All refining" : "All weapons"
					}), lines.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						on: line === entry.id,
						onClick: () => setLine(line === entry.id ? "" : entry.id),
						children: entry.label
					}, entry.id))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 overflow-x-auto pb-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						on: tier === 0,
						onClick: () => setTier(0),
						children: "All tiers"
					}), TIERS$2.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						on: tier === id,
						onClick: () => setTier(tier === id ? 0 : id),
						children: `T${id}`
					}, id))]
				})
			] }) : null,
			hits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: split && !query.trim() && !station && !line && !tier ? group === "armor" ? "Pick a tier, or Helmets, Armor, and Boots for plate, leather, and cloth." : group === "offhand" ? "Pick a tier, or Shields, Torches, or Tomes." : group === "tool" ? "Pick a tier, or a tool such as Pickaxes or Sickles." : group === "gather" ? "Pick a tier, or a set such as Miner or Lumberjack." : group === "mount" ? "Pick a tier, or Riding Horses, Oxen, or Rare mounts. Saddling is the craft." : group === "refine" ? "Pick a tier, or Metal bars, Planks, Leather, Cloth, or Stone blocks." : "Pick a tier, or a weapon line such as Swords or Bows." : query.trim() || group !== "all" ? "No recipes match." : "Type a name, or pick a category."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: compact ? "flex flex-col" : "flex max-h-80 flex-col overflow-auto rounded-lg border border-line",
				children: sections.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [split && sections.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "border-b border-line bg-panel px-3 py-2 text-xs font-semibold tracking-wide text-brass uppercase",
					children: section.title
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: section.rows.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onPick(item.id),
					className: "flex w-full items-center gap-3 border-b border-line px-3 py-2 text-left last:border-b-0 hover:bg-panel-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIcon, {
							id: item.id,
							size: 44
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1 text-parchment",
							children: [
								item.name,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted",
									children: [
										"[",
										item.tier,
										".0]"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-0.5 block text-xs text-muted",
									children: item.station
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 text-xs text-muted",
							children: gearLineLabel(item) ?? GROUP_LABEL[item.group]
						})
					]
				}) }, item.id)) })] }, section.title))
			})
		]
	});
}
function lookup(book, id, city, quality, side, override) {
	if (override != null && Number.isFinite(override)) return {
		price: override,
		from: null
	};
	return {
		price: moneySide(readQuote(book, id, city, quality), side),
		from: null
	};
}
function buyPlace(book, id, city, quality, side) {
	return lookup(book, id, city, quality, side, null).from || city;
}
function evaluateLine(line, state) {
	const item = getItem(line.itemId);
	if (!item) return null;
	const raw = variantOf(item, line.enchant, line.route);
	const variant = upgradeSource(item, raw, line.upgradeFrom === "craft" ? "craft" : "buy");
	const buySide = state.buyMode === "instant" ? "sell" : "buy";
	const sellSide = state.sellMode === "instant" ? "buy" : "sell";
	const productId = marketId(item.id, variant.enchant);
	const sellAt = line.sellAt || state.sellCity;
	const productSide = sellSide;
	const product = lookup(state.prices, productId, sellAt, state.quality, productSide, line.productOverride);
	const notes = [];
	if (product.from) notes.push(`${item.name} from ${product.from}`);
	const buyAt = line.shopCity || state.buyCity;
	const boughtIn = (id) => {
		const city = line.matCities?.[id] || buyAt;
		return city === "Black Market" ? CRAFT_CITIES[0] : city;
	};
	const matLook = (id, city, side, quality = 1) => {
		const found = lookup(state.prices, id, city, quality, side, line.matOverrides[id] ?? null);
		if (found.from) notes.push(`${id} from ${found.from}`);
		return found.price;
	};
	const baseId = line.route === "upgrade" && line.upgradeFrom !== "craft" ? raw.mats.find((mat) => !/RUNE|SOUL|RELIC/.test(mat.id))?.id : void 0;
	const journalFills = (line.journal ? [item.tier].filter((tier) => tier >= 2 && tier <= 8) : []).flatMap((tier) => {
		const journal = journalFor(item.journal, tier);
		if (!journal) return [];
		return [{
			tier,
			fame: journal.fame,
			empty: matLook(`${journal.id}_EMPTY`, boughtIn(`${journal.id}_EMPTY`), line.matModes?.[`${journal.id}_EMPTY`] ?? buySide),
			full: matLook(`${journal.id}_FULL`, line.matCities?.[`${journal.id}_FULL`] || sellAt, sellSide)
		}];
	});
	return {
		math: craftMath({
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
			itemId: item.id,
			focusOverride: line.focusOverride,
			premium: state.premium,
			buyMode: state.buyMode,
			sellMode: state.sellMode,
			productSellMode: state.sellMode,
			leftover: state.leftover,
			stationRate: state.stationRate,
			productUnit: product.price,
			matUnit: (id) => matLook(id, boughtIn(id), line.matModes?.[id] ?? buySide, id === baseId ? state.quality : 1),
			matSellUnit: (id) => matLook(id, sellAt, sellSide),
			journalFills,
			flip: false
		}),
		stoodIn: notes
	};
}
function Bench() {
	const state = useForge();
	const line = state.lines.find((entry) => entry.uid === state.active) ?? state.lines[0];
	const item = line ? getItem(line.itemId) : void 0;
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [picking, setPicking] = (0, import_react.useState)(false);
	const [merged, setMerged] = (0, import_react.useState)([]);
	const evaluated = (0, import_react.useMemo)(() => line ? evaluateLine(line, state) : null, [line, state]);
	const math = evaluated?.math ?? null;
	const variant = item && line ? upgradeSource(item, variantOf(item, line.enchant, line.route), line.upgradeFrom === "craft" ? "craft" : "buy") : void 0;
	const journal = item ? journalFor(item.journal, item.tier) : void 0;
	const buySide = state.buyMode === "instant" ? "sell" : "buy";
	const sellSide = state.sellMode === "instant" ? "buy" : "sell";
	const buyAt = line ? line.shopCity || state.buyCity : state.buyCity;
	const sellAt = line?.sellAt || state.sellCity;
	const fullJournal = journal && line ? lookup(state.prices, `${journal.id}_FULL`, line.matCities?.[`${journal.id}_FULL`] || sellAt, 1, sellSide, line.matOverrides[`${journal.id}_FULL`] ?? null) : {
		price: null,
		from: null
	};
	const hasUpgrade = (item && line ? item.variants.filter((entry) => entry.enchant === (variant?.enchant ?? line.enchant)) : []).some((entry) => entry.route === "upgrade");
	const autoCities = (0, import_react.useRef)("");
	const favorKey = (0, import_react.useRef)("");
	(0, import_react.useEffect)(() => {
		if (!line) return;
		const key = `${line.uid}|${line.itemId}|${line.place}`;
		if (favorKey.current === key) return;
		favorKey.current = key;
		const crafted = getItem(line.itemId);
		if (!crafted) return;
		const biome = bonusBiome(crafted.category);
		if (!biome) return;
		if (line.place === "hideout") {
			if (line.hoBiome === biome) return;
			state.patchLine(line.uid, { hoBiome: biome });
			return;
		}
		const city = biomeById(biome).city;
		if (line.city === city) return;
		state.patchLine(line.uid, { city });
	}, [line, state]);
	(0, import_react.useEffect)(() => {
		if (!item || !line || !variant) return;
		const productId = marketId(item.id, variant.enchant);
		const key = `${line.uid}|${productId}|${state.quality}`;
		if (autoCities.current === key) return;
		const priced = (id, quality) => {
			let low = null;
			let high = null;
			for (const city of MARKETS) {
				const sell = moneySide(readQuote(state.prices, id, city, quality), "sell");
				if (sell == null) continue;
				if (city !== "Black Market" && (!low || sell < low.price)) low = {
					city,
					price: sell
				};
				if (!high || sell > high.price) high = {
					city,
					price: sell
				};
			}
			return {
				low,
				high
			};
		};
		const product = priced(productId, state.quality);
		if (!product.low || !product.high) return;
		const matCities = { ...line.matCities };
		for (const mat of variant.mats) {
			const row = priced(mat.id, 1);
			if (row.low) matCities[mat.id] = row.low.city;
		}
		autoCities.current = key;
		state.patch({ buyCity: product.low.city });
		state.patchLine(line.uid, {
			shopCity: product.low.city,
			matCities
		});
	}, [
		item,
		line,
		variant,
		state
	]);
	const shops = (0, import_react.useMemo)(() => {
		return state.lines.flatMap((entry) => {
			const result = evaluateLine(entry, state);
			if (!result) return [];
			const named = getItem(entry.itemId);
			const rows = /* @__PURE__ */ new Map();
			let weight = 0;
			for (const mat of result.math.consumed) {
				const picked = entry.matCities?.[mat.id] || entry.shopCity || state.buyCity;
				const chosen = picked === "Black Market" ? CRAFT_CITIES[0] : picked;
				const side = entry.matModes?.[mat.id] ?? (state.buyMode === "instant" ? "sell" : "buy");
				const city = buyPlace(state.prices, mat.id, chosen, 1, side);
				const key = `${mat.id}|${city}`;
				const current = rows.get(key) ?? {
					id: mat.id,
					city,
					qty: 0,
					cost: 0
				};
				const cost = current.cost == null || mat.cost == null ? null : current.cost + mat.cost;
				rows.set(key, {
					id: mat.id,
					city,
					qty: current.qty + mat.qty,
					cost
				});
				weight += mat.qty * matWeight(mat.id);
			}
			if (!entry.flip && entry.journal) {
				const side = state.buyMode === "instant" ? "sell" : "buy";
				for (const fill of result.math.journalRows) {
					const book = named ? journalFor(named.journal, fill.tier) : void 0;
					if (!book) continue;
					const id = `${book.id}_EMPTY`;
					const picked = entry.matCities?.[id] || entry.shopCity || state.buyCity;
					const chosen = picked === "Black Market" ? CRAFT_CITIES[0] : picked;
					const city = buyPlace(state.prices, id, chosen, 1, side);
					const key = `${id}|${city}`;
					const current = rows.get(key) ?? {
						id,
						city,
						qty: 0,
						cost: 0
					};
					rows.set(key, {
						id,
						city,
						qty: current.qty + fill.count,
						cost: current.cost
					});
				}
			}
			return [{
				uid: entry.uid,
				itemId: entry.itemId,
				enchant: entry.enchant,
				name: named ? `${named.name} .${entry.enchant}` : "Recipe",
				weight,
				rows: [...rows.values()].sort((a, b) => b.qty - a.qty)
			}];
		});
	}, [state]);
	const listShops = (0, import_react.useMemo)(() => {
		const picked = shops.filter((craft) => merged.includes(craft.uid));
		if (picked.length < 2) return shops;
		const rows = /* @__PURE__ */ new Map();
		let weight = 0;
		for (const craft of picked) {
			weight += craft.weight;
			for (const row of craft.rows) {
				const key = `${row.id}|${row.city}`;
				const current = rows.get(key);
				if (!current) {
					rows.set(key, { ...row });
					continue;
				}
				rows.set(key, {
					...current,
					qty: current.qty + row.qty,
					cost: current.cost == null || row.cost == null ? null : current.cost + row.cost
				});
			}
		}
		return [{
			uid: picked.map((craft) => craft.uid).join("|"),
			itemId: void 0,
			enchant: 0,
			name: picked.map((craft) => craft.name).join(" + "),
			weight,
			rows: [...rows.values()].sort((a, b) => b.qty - a.qty)
		}, ...shops.filter((craft) => !merged.includes(craft.uid))];
	}, [shops, merged]);
	const plan = (0, import_react.useMemo)(() => {
		return { rows: state.lines.map((entry) => {
			const result = evaluateLine(entry, state);
			const named = getItem(entry.itemId);
			return {
				uid: entry.uid,
				name: named ? `${named.name} .${entry.enchant}` : "Recipe",
				profit: result?.math.profit ?? null
			};
		}) };
	}, [state]);
	if (!line || !item || !variant || !math) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "That recipe is no longer in the desk."
	});
	const productId = marketId(item.id, variant.enchant);
	const itemSide = sellSide;
	const profitClass = math.profit == null ? "text-parchment" : math.profit >= 0 ? "text-sage" : "text-ember";
	const mergeRows = plan.rows.filter((row) => merged.includes(row.uid));
	const mergeTotal = mergeRows.length > 0 && mergeRows.every((row) => row.profit != null) ? mergeRows.reduce((sum, row) => sum + (row.profit ?? 0), 0) : null;
	const focused = evaluateLine({
		...line,
		focus: true
	}, state);
	const plain = evaluateLine({
		...line,
		focus: false
	}, state);
	const focusEach = focused?.math.focusEach ?? 0;
	const focusBatch = focusEach * line.runs;
	const focusGain = focused?.math.profit != null && plain?.math.profit != null ? focused.math.profit - plain.math.profit : null;
	const perFocus = focusGain != null && focusBatch > 0 ? focusGain / focusBatch : null;
	const fromPool = perFocus == null ? null : perFocus * 1e4;
	async function copyList() {
		const text = listShops.map((craft) => [`${craft.name}`, ...craft.rows.map((row) => `${Math.ceil(row.qty)}  ${matName(row.id)}  · ${row.city}`)].join("\n")).join("\n\n");
		try {
			await navigator.clipboard.writeText(text);
		} catch {
			return;
		}
		setCopied(true);
		window.setTimeout(() => setCopied(false), 1600);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-section",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 overflow-x-auto pb-1",
				children: [state.lines.map((entry) => {
					const named = getItem(entry.itemId);
					const on = entry.uid === line.uid;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => state.setActive(entry.uid),
						className: "inline-flex h-11 shrink-0 items-center gap-2 rounded-full border px-2 text-sm " + (on ? "border-brass text-brass" : "border-line text-muted"),
						children: [named ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIcon, {
							id: named.id,
							enchant: entry.enchant,
							size: 28
						}) : null, named ? `${named.name} [${named.tier}.${entry.enchant}]` : "Recipe"]
					}, entry.uid);
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setPicking((open) => !open),
					className: "h-11 shrink-0 rounded-full border border-line px-3 text-sm text-parchment",
					children: "Add craft"
				})]
			}),
			picking ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "rounded-lg border border-line bg-panel p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemPicker, { onPick: (id) => {
					state.addLine(id);
					setPicking(false);
				} })
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 lg:grid lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 flex-col gap-4 lg:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-lg border border-line bg-panel p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIcon, {
											id: item.id,
											enchant: variant.enchant,
											quality: state.quality,
											size: 56
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
											className: "font-display text-2xl text-parchment",
											children: [
												item.name,
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-muted",
													children: [
														"[",
														item.tier,
														".",
														variant.enchant,
														"]"
													]
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 text-sm text-muted",
											children: [
												"T",
												item.tier,
												".",
												variant.enchant,
												" · ",
												item.station,
												item.study ? " · can be studied" : " · no studying"
											]
										})] })]
									}), state.lines.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => state.removeLine(line.uid),
										className: "inline-flex h-11 w-11 items-center justify-center rounded-lg border border-line text-muted",
										"aria-label": "Remove craft",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
									}) : null]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
											label: "Enchant",
											value: String(line.enchant),
											onChange: (value) => {
												const enchant = Number(value);
												const next = variantOf(item, enchant, line.route);
												state.patchLine(line.uid, {
													enchant,
													route: next.route
												});
											},
											options: enchantsOf(item).map((enchant) => ({
												value: String(enchant),
												label: `.${enchant}`
											}))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
											label: "Route",
											value: variant.route,
											onChange: (value) => state.patchLine(line.uid, { route: value }),
											options: [{
												value: "direct",
												label: "Direct craft"
											}, ...hasUpgrade || line.route === "upgrade" ? [{
												value: "upgrade",
												label: "Upgrade"
											}] : []]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
											label: "Runs",
											min: 0,
											value: line.runs,
											onChange: (runs) => state.patchLine(line.uid, { runs })
										}),
										variant.route === "upgrade" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
											label: "Base item",
											value: line.upgradeFrom === "craft" ? "craft" : "buy",
											onChange: (value) => state.patchLine(line.uid, { upgradeFrom: value === "craft" ? "craft" : "buy" }),
											options: [{
												value: "buy",
												label: "Buy from market"
											}, {
												value: "craft",
												label: "Craft it"
											}]
										}) : null
									]
								}),
								variant.route === "upgrade" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-3 flex flex-col gap-1 text-sm",
									children: variant.mats.filter((mat) => /RUNE|SOUL|RELIC/.test(mat.id)).map((mat) => {
										const qty = math.consumed.find((row) => row.id === mat.id)?.qty ?? mat.qty * line.runs;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-center justify-between gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-2 text-parchment",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIcon, {
														id: mat.id,
														size: 32
													}),
													matName(mat.id),
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-muted",
														children: [
															"[",
															itemMark(mat.id),
															"]"
														]
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "tabular-nums text-muted",
												children: [
													exact(qty),
													" for ",
													exact(line.runs),
													" · ",
													exact(mat.qty),
													" each"
												]
											})]
										}, mat.id);
									})
								}) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-lg border border-line bg-panel p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-semibold tracking-wide text-brass uppercase",
									children: "Station"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 grid grid-cols-2 gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
											label: "Where",
											value: line.place,
											onChange: (place) => {
												const biome = bonusBiome(item.category);
												const city = biome ? biomeById(biome).city : line.city;
												if (place === "hideout") {
													state.patchLine(line.uid, {
														place: "hideout",
														hoRegion: "outlands",
														city,
														...biome ? { hoBiome: biome } : {}
													});
													return;
												}
												state.patchLine(line.uid, {
													place,
													city
												});
											},
											options: [
												{
													value: "city",
													label: "Royal city"
												},
												{
													value: "island",
													label: "Island"
												},
												{
													value: "hideout",
													label: "Hideout"
												}
											]
										}),
										line.place === "hideout" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
											label: "Region",
											value: line.hoRegion ?? "outlands",
											onChange: (hoRegion) => state.patchLine(line.uid, {
												hoRegion,
												...hoRegion === "roads" ? { hoQuality: 1 } : {}
											}),
											options: [{
												value: "outlands",
												label: "Outlands"
											}, {
												value: "roads",
												label: "Roads of Avalon"
											}]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
											label: line.place === "island" ? "Island city" : "Craft city",
											value: line.city,
											onChange: (city) => state.patchLine(line.uid, { city }),
											options: CRAFT_CITIES.map((city) => ({
												value: city,
												label: city
											}))
										}),
										line.place === "hideout" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
											label: "City",
											value: line.hoBiome ?? "forest",
											onChange: (hoBiome) => state.patchLine(line.uid, { hoBiome }),
											options: HO_BIOMES.map((biome) => ({
												value: biome.id,
												label: biome.label
											}))
										}) : null,
										line.place === "hideout" && biomeById(line.hoBiome).kind === "hideout" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
											label: "Map quality",
											value: String(line.hoRegion === "roads" ? 1 : line.hoQuality ?? 4),
											onChange: (value) => state.patchLine(line.uid, { hoQuality: Number(value) }),
											options: (line.hoRegion === "roads" ? [1] : [
												1,
												2,
												3,
												4,
												5,
												6
											]).map((quality) => ({
												value: String(quality),
												label: line.hoRegion === "roads" ? "Q1 (Roads)" : `Q${quality}`
											}))
										}) : null,
										line.place === "hideout" && biomeById(line.hoBiome).kind === "hideout" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
											label: "Hideout level",
											value: String(Math.min(9, Math.max(1, Math.round(line.power || 1)))),
											onChange: (value) => state.patchLine(line.uid, { power: Number(value) }),
											options: [
												1,
												2,
												3,
												4,
												5,
												6,
												7,
												8,
												9
											].map((level) => ({
												value: String(level),
												label: String(level)
											}))
										}) : null,
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
											label: "Daily bonus",
											value: String(line.daily),
											onChange: (value) => state.patchLine(line.uid, { daily: Number(value) }),
											options: [
												{
													value: "0",
													label: "None"
												},
												{
													value: "10",
													label: "+10%"
												},
												{
													value: "20",
													label: "+20%"
												}
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
											label: "Extra bonus",
											value: line.extra,
											onChange: (extra) => state.patchLine(line.uid, { extra })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
											label: "Fee / 100 nutrition",
											min: 0,
											value: state.stationRate,
											onChange: (stationRate) => state.patch({ stationRate })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
											label: "Base focus override",
											min: 0,
											value: line.focusOverride ?? variant.focus,
											onChange: (focusOverride) => state.patchLine(line.uid, { focusOverride })
										})
									]
								}),
								line.place === "hideout" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-xs text-muted",
									children: biomeById(line.hoBiome).kind === "city" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										biomeById(line.hoBiome).label,
										" is a city station, not a hideout.",
										" ",
										biomeById(line.hoBiome).favors,
										". Map quality and hideout level do not apply. Food is Caerleon. Bags and capes are Brecilien."
									] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										biomeById(line.hoBiome).label,
										" favors ",
										biomeById(line.hoBiome).favors.toLowerCase(),
										".",
										" ",
										biomeFavors(line.hoBiome, item.category) ? item.group === "refine" ? "This refine gets the hideout base plus level. Map quality does not change refining." : `This craft uses the ${line.hoRegion === "roads" ? "Roads Q1" : `${biomeById(line.hoBiome).label} Q${line.hoQuality ?? 4}`} specialty, then hideout level.` : "This item is not a specialty here, so only hideout level applies."
									] })
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex flex-wrap gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
										on: line.focus,
										onClick: () => state.patchLine(line.uid, { focus: !line.focus }),
										children: "Use focus"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
										on: state.premium,
										onClick: () => state.patch({ premium: !state.premium }),
										children: "Premium"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
											label: "Mastery",
											min: 0,
											value: line.mastery,
											onChange: (mastery) => state.patchLine(line.uid, { mastery })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
											label: "Specialist",
											min: 0,
											value: line.specialist,
											onChange: (specialist) => state.patchLine(line.uid, { specialist })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
											label: "Other specs",
											min: 0,
											value: line.siblings,
											onChange: (siblings) => state.patchLine(line.uid, { siblings })
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-xs text-muted",
									children: [
										"Efficiency ",
										exact(math.efficiency),
										" · focus ",
										exact(math.focusEach),
										" each · ",
										exact(math.focusTotal),
										" for the batch.",
										(() => {
											const group = specGroupBonus(item.id, item.category);
											const quality = group.quality ? ` and ${group.quality.toLocaleString("en-US", { maximumFractionDigits: 4 })} quality` : "";
											return ` Own specialist is ${exact(250 + group.focus)} focus per level. Mastery is 30. Each other spec adds ${exact(group.focus)} focus${quality}.`;
										})()
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-lg border border-line bg-panel p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-sm font-semibold tracking-wide text-brass uppercase",
										children: "Markets"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => void state.loadPrices(),
										className: "inline-flex h-11 items-center gap-2 rounded-lg bg-brass px-3 text-sm font-semibold text-ink",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4 " + (state.loading ? "animate-spin" : "") }), state.loading && state.priceAt == null ? "Loading" : "Live prices"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-xs text-muted",
									children: [state.priceAt ? `Live order book, refreshed ${new Date(state.priceAt).toLocaleTimeString()}. It checks again every minute.` : "Fetching the live order book.", state.loading && state.priceAt != null ? " Updating." : ""]
								}),
								state.priceError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-ember",
									children: state.priceError
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 grid grid-cols-2 gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
											label: "Buy as",
											value: state.buyMode,
											onChange: (buyMode) => state.patch({ buyMode }),
											options: [{
												value: "instant",
												label: "Instant (sell orders)"
											}, {
												value: "order",
												label: "Buy order + 2.5%"
											}]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
											label: "Sell as",
											value: state.sellMode,
											onChange: (sellMode) => state.patch({ sellMode }),
											options: [
												{
													value: "order",
													label: "Sell order, tax + 2.5%"
												},
												{
													value: "instant",
													label: "Instant, tax only"
												},
												{
													value: "notax",
													label: "No tax"
												}
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
											label: "Product quality",
											value: String(state.quality),
											onChange: (value) => state.patch({ quality: Number(value) }),
											options: [
												{
													value: "1",
													label: "Normal"
												},
												{
													value: "2",
													label: "Good"
												},
												{
													value: "3",
													label: "Outstanding"
												},
												{
													value: "4",
													label: "Excellent"
												},
												{
													value: "5",
													label: "Masterpiece"
												}
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
											label: "Returns",
											value: state.leftover,
											onChange: (leftover) => state.patch({ leftover }),
											options: [{
												value: "reuse",
												label: "Reuse, sell the last return"
											}, {
												value: "sell",
												label: "Sell every return"
											}]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											className: "text-base font-semibold text-parchment",
											children: [
												"Input materials (",
												variant.mats.length,
												")"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-3 grid gap-3 md:grid-cols-2",
											children: variant.mats.map((mat) => {
												const side = line.matModes?.[mat.id] ?? buySide;
												const picked = line.matCities?.[mat.id] || buyAt;
												const city = picked === "Black Market" ? CRAFT_CITIES[0] : picked;
												const quality = variant.route === "upgrade" && line.upgradeFrom !== "craft" && !/RUNE|SOUL|RELIC/.test(mat.id) ? state.quality : 1;
												const quote = lookup(state.prices, mat.id, city, quality, side, null);
												const quoteRow = readQuote(state.prices, mat.id, city, quality);
												const bought = math?.consumed.find((row) => row.id === mat.id);
												const left = math?.leftovers.find((row) => row.id === mat.id);
												return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatCard, {
													name: matName(mat.id),
													itemId: mat.id,
													prices: state.prices,
													amount: bought?.qty ?? mat.qty * line.runs,
													leftover: left?.qty ?? 0,
													city,
													side,
													market: quoteRow?.type === "EMV" && quoteRow.value ? quoteRow.value : quote.price,
													age: quoteNote(quoteRow, side),
													quality,
													userPrice: line.matOverrides[mat.id] ?? null,
													total: bought?.cost ?? null,
													onCity: (next) => state.patchLine(line.uid, { matCities: {
														...line.matCities,
														[mat.id]: next
													} }),
													onSide: (next) => state.patchLine(line.uid, { matModes: {
														...line.matModes,
														[mat.id]: next
													} }),
													onPrice: (value) => state.setMatOverride(line.uid, mat.id, value)
												}, mat.id);
											})
										}),
										line.route !== "upgrade" || variant.enchant < 1 ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-3 text-xs text-muted",
											children: [
												".",
												variant.enchant,
												" includes every stone up to here.",
												variant.enchant >= 1 ? " Runes for .1." : "",
												variant.enchant >= 2 ? " Souls for .2." : "",
												variant.enchant >= 3 ? " Relics for .3." : "",
												" Plus the flat item."
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex flex-col gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "text-base font-semibold text-parchment",
												children: "Journal and sell price"
											}), journal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => state.patchLine(line.uid, {
													journal: !line.journal,
													journalTier: item.tier,
													journalTiers: line.journal ? [] : [item.tier]
												}),
												className: "h-11 rounded-lg border px-3 text-sm " + (line.journal ? "border-brass text-brass" : "border-line text-muted"),
												children: line.journal ? "Journal added" : "Add journal"
											}) : null]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HourlyChart, {
											server: state.server,
											itemId: productId,
											itemName: `${item.name} .${variant.enchant}`,
											quality: state.quality,
											side: itemSide,
											usedCity: sellAt,
											onUse: (city, price) => {
												state.patch({ sellCity: city });
												state.patchLine(line.uid, {
													sellAt: city,
													productOverride: price
												});
											}
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceRow, {
											role: "Item price",
											name: `${item.name} .${variant.enchant}`,
											market: lookup(state.prices, productId, sellAt, state.quality, itemSide, null).price,
											hint: lookup(state.prices, productId, sellAt, state.quality, itemSide, null).from,
											value: line.productOverride,
											onChange: (productOverride) => state.patchLine(line.uid, { productOverride }),
											cityLabel: "Sell in",
											city: sellAt,
											cities: liveSellOptions(state.prices, productId, state.quality),
											onCity: (city) => {
												state.patch({ sellCity: city });
												state.patchLine(line.uid, {
													sellAt: city,
													productOverride: null
												});
											},
											priceBox: false,
											manual: true,
											emv: royalEmv(state.prices, productId, state.quality, "sell")
										}),
										line.journal && journal ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid gap-3 md:grid-cols-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatCard, {
												name: `${journal.name} (Empty)`,
												itemId: `${journal.id}_EMPTY`,
												prices: state.prices,
												amount: math?.journalRows[0]?.count ?? 0,
												leftover: 0,
												city: (() => {
													const picked = line.matCities?.[`${journal.id}_EMPTY`] || buyAt;
													return picked === "Black Market" ? CRAFT_CITIES[0] : picked;
												})(),
												side: line.matModes?.[`${journal.id}_EMPTY`] ?? buySide,
												market: lookup(state.prices, `${journal.id}_EMPTY`, line.matCities?.[`${journal.id}_EMPTY`] || buyAt, 1, line.matModes?.[`${journal.id}_EMPTY`] ?? buySide, null).price,
												age: orderAge((line.matModes?.[`${journal.id}_EMPTY`] ?? buySide) === "sell" ? readQuote(state.prices, `${journal.id}_EMPTY`, line.matCities?.[`${journal.id}_EMPTY`] || buyAt, 1)?.sellDate : readQuote(state.prices, `${journal.id}_EMPTY`, line.matCities?.[`${journal.id}_EMPTY`] || buyAt, 1)?.buyDate),
												userPrice: line.matOverrides[`${journal.id}_EMPTY`] ?? null,
												total: (() => {
													const price = lookup(state.prices, `${journal.id}_EMPTY`, line.matCities?.[`${journal.id}_EMPTY`] || buyAt, 1, line.matModes?.[`${journal.id}_EMPTY`] ?? buySide, line.matOverrides[`${journal.id}_EMPTY`] ?? null).price;
													return price == null || !math?.journalRows[0] ? null : price * math.journalRows[0].count;
												})(),
												onCity: (next) => state.patchLine(line.uid, { matCities: {
													...line.matCities,
													[`${journal.id}_EMPTY`]: next
												} }),
												onSide: (next) => state.patchLine(line.uid, { matModes: {
													...line.matModes,
													[`${journal.id}_EMPTY`]: next
												} }),
												onPrice: (value) => state.setMatOverride(line.uid, `${journal.id}_EMPTY`, value)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceRow, {
												role: "Full journal price",
												name: "Full",
												market: fullJournal.price,
												hint: fullJournal.from,
												value: line.matOverrides[`${journal.id}_FULL`] ?? null,
												onChange: (value) => state.setMatOverride(line.uid, `${journal.id}_FULL`, value),
												cityLabel: "Sell in",
												city: line.matCities?.[`${journal.id}_FULL`] || sellAt,
												cities: citiesWith(state.prices, `${journal.id}_FULL`, 1, sellSide, line.matCities?.[`${journal.id}_FULL`] || sellAt),
												age: quoteAge(state.prices, `${journal.id}_FULL`, line.matCities?.[`${journal.id}_FULL`] || sellAt, 1, sellSide),
												onCity: (next) => state.patchLine(line.uid, { matCities: {
													...line.matCities,
													[`${journal.id}_FULL`]: next
												} })
											})]
										}) : null
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-xs text-muted",
									children: "Prices are the cheapest sell and the highest buy on the Albion Online Data Project order book. A typed number overrides that quote and stops following the market. Tax is 4% with Premium and 8% without, including the Black Market. Sell orders also pay a 2.5% setup fee. Direct trades use “No tax”."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "rounded-lg border border-line bg-panel p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-semibold tracking-wide text-brass uppercase",
									children: "Shopping list"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => void copyList(),
									className: "h-11 rounded-lg border border-line px-3 text-sm",
									children: copied ? "Copied" : "Copy"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 overflow-x-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid min-w-[40rem] grid-cols-[minmax(8rem,1fr)_minmax(14rem,1.4fr)_9rem] gap-x-3 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "border-b border-line py-2 text-xs tracking-wide text-muted uppercase",
											children: "Craft"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "border-b border-line py-2 text-xs tracking-wide text-muted uppercase",
											children: "Buy"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "border-b border-line py-2 text-right text-xs tracking-wide text-muted uppercase",
											children: "Combined price"
										}),
										Array.from({ length: Math.max(10, listShops.length) }, (_, index) => listShops[index] ?? null).flatMap((craft, index) => {
											const combined = craft?.rows.every((row) => row.cost != null) ? craft.rows.reduce((sum, row) => sum + (row.cost ?? 0), 0) : null;
											return [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "flex items-center gap-2 border-b border-line py-2 text-parchment",
													children: [craft?.itemId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIcon, {
														id: craft.itemId,
														enchant: craft.enchant,
														quality: state.quality,
														size: 36
													}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [craft ? craft.name : "—", craft ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "mt-1 block text-xs text-muted",
														children: [
															"about ",
															exact(craft.weight),
															" kg"
														]
													}) : null] })]
												}, `name-${craft?.uid ?? index}`),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
													className: "border-b border-line py-2",
													children: [
														craft?.rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
															className: "flex items-center justify-between gap-3 py-0.5",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "flex min-w-0 items-center gap-2",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIcon, {
																	id: row.id,
																	size: 32
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
																	matName(row.id),
																	" ",
																	itemMark(row.id) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																		className: "text-muted",
																		children: [
																			"[",
																			itemMark(row.id),
																			"]"
																		]
																	}) : null,
																	/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																		className: "ml-2 text-muted",
																		children: ["buy ", Math.ceil(row.qty)]
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "ml-2 text-brass",
																		children: row.city
																	})
																] })]
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "tabular-nums text-muted",
																children: silver(row.cost)
															})]
														}, `${craft.uid}|${row.id}|${row.city}`)),
														craft && craft.rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
															className: "text-muted",
															children: "No materials"
														}) : null,
														!craft ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
															className: "text-muted",
															children: "—"
														}) : null
													]
												}, `buy-${craft?.uid ?? index}`),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "border-b border-line py-2 text-right tabular-nums text-parchment",
													children: craft ? silver(combined) : "—"
												}, `sum-${craft?.uid ?? index}`)
											];
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "col-span-2 py-2 text-parchment",
											children: "All crafts"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "py-2 text-right tabular-nums text-parchment",
											children: silver(listShops.every((craft) => craft.rows.every((row) => row.cost != null)) ? listShops.reduce((sum, craft) => sum + craft.rows.reduce((rowSum, row) => rowSum + (row.cost ?? 0), 0), 0) : null)
										})
									]
								})
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "order-first self-start lg:sticky lg:top-40 lg:z-20 lg:order-none",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-lg border border-line bg-panel p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: "Batch profit"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setMerged((ids) => ids.includes(line.uid) ? ids.filter((id) => id !== line.uid) : [...ids, line.uid]),
									className: "h-11 rounded-lg border px-3 text-sm " + (merged.includes(line.uid) ? "border-brass text-brass" : "border-line text-muted"),
									children: merged.includes(line.uid) ? "In merge" : "Add to merge"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-sans text-4xl font-semibold tabular-nums tracking-tight " + profitClass,
								children: silver(math.profit)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-muted",
								children: [math.profit == null ? `Need prices${math.missing.length ? ` for ${[...new Set(math.missing)].map((id) => id === "product" ? "the item" : id === "journal" ? "the journal" : matName(id)).join(", ")}` : ""}` : `${silver(math.profit / Math.max(1, math.items))} each · ${math.margin == null ? "—" : pct(math.margin)} margin`, evaluated?.stoodIn.length ? " · a missing city quote was filled from another market" : ""]
							}),
							mergeRows.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 border-t border-line pt-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted",
										children: "Merged profit"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-2xl font-semibold tabular-nums " + (mergeTotal == null ? "text-parchment" : mergeTotal >= 0 ? "text-sage" : "text-ember"),
										children: silver(mergeTotal)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-2 flex flex-col",
										children: mergeRows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-baseline justify-between gap-3 py-1 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => state.setActive(row.uid),
												className: row.uid === line.uid ? "text-brass" : "text-parchment",
												children: row.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "tabular-nums text-muted",
												children: silver(row.profit)
											})]
										}, row.uid))
									})
								]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Return rate",
										value: pct(math.rrr)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Material",
										value: silver(math.materialCost)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Station fee",
										value: silver(math.fee)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Revenue",
										value: silver(math.revenue)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Returns sold",
										value: silver(math.leftoverValue)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Item value",
										value: exact(variant.value)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Nutrition",
										value: exact(math.nutrition)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Fame",
										value: exact(math.fameTotal)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Focus each",
										value: focusEach > 0 ? exact(focusEach) : "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Focus for batch",
										value: focusBatch > 0 ? exact(focusBatch) : "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Silver / focus",
										value: silver(perFocus)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Study fame / item",
										value: item.study ? exact(math.studyEach) : "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Journals",
										value: math.journalRows.length ? math.journalRows.map((row) => `T${row.tier} ${exact(row.count)}`).join(" · ") : "Off"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Journal profit",
										value: math.journalRows.length ? silver(math.journalProfit) : "—"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 text-xs text-muted",
								children: [
									focusEach <= 0 ? "This craft has no focus cost." : line.focus ? "This profit includes the focus return bonus." : "This profit does not spend focus.",
									" ",
									focusGain == null ? "Need prices to value the focus." : `Using focus ${focusGain >= 0 ? "adds" : "loses"} ${silver(Math.abs(focusGain))} on this batch, ${silver(perFocus)} per focus. 10,000 focus is about ${silver(fromPool)}.`
								]
							})
						]
					})
				})]
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "tabular-nums text-parchment",
			children: value
		})]
	});
}
function MatCard({ name, itemId, prices, amount, leftover, city, side, market, age, quality = 1, userPrice, total, onCity, onSide, onPrice }) {
	const kind = side === "sell" ? "Sell order" : "Buy order";
	const emv = royalEmv(prices, itemId, quality, side);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-lg border border-line bg-ink p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
				className: "flex items-center gap-2 text-sm font-medium text-parchment",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIcon, {
					id: itemId,
					quality,
					size: 40
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					name,
					" ",
					itemMark(itemId) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted",
						children: [
							"[",
							itemMark(itemId),
							"]"
						]
					}) : null
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-parchment",
				children: [
					"Amount: ",
					exact(amount),
					leftover > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted",
						children: [
							" (",
							exact(leftover),
							" leftover)"
						]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-3 block text-xs text-muted",
				children: ["Buy location", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					className: fieldClass + " mt-1",
					value: CRAFT_CITIES.includes(city) ? city : CRAFT_CITIES[0],
					onChange: (event) => onCity(event.target.value),
					children: CRAFT_CITIES.map((marketCity) => {
						const quote = readQuote(prices, itemId, marketCity, quality);
						const price = moneySide(quote, side);
						const stamp = orderAge(side === "sell" ? quote?.sellDate : quote?.buyDate);
						const label = price == null ? `${marketCity} Market` : `${marketCity} Market · ${silver(price)}${stamp ? ` · ${stamp}` : ""}`;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: marketCity,
							children: label
						}, marketCity);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmvSelect, {
				emv,
				value: userPrice,
				onPick: onPrice
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-2 block text-xs text-muted",
				children: ["Price type", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: fieldClass + " mt-1",
					value: side,
					onChange: (event) => onSide(event.target.value === "buy" ? "buy" : "sell"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "sell",
						children: "Sell order"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "buy",
						children: "Buy order"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-2 block text-xs text-muted",
				children: ["User price", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass + " mt-1",
					inputMode: "decimal",
					placeholder: "0",
					value: userPrice ?? "",
					onChange: (event) => onPrice(event.target.value.trim() === "" ? null : Number(event.target.value))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: market == null ? `${kind}: no data` : `${kind}${age ? ` (${age})` : ""}: ${silver(market)}`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 flex items-baseline justify-between gap-3 border-t border-line pt-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted",
					children: "Total cost"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-lg font-semibold tabular-nums text-parchment",
					children: silver(total)
				})]
			})
		]
	});
}
function royalEmv(book, id, quality, side) {
	const samples = [
		"Thetford",
		"Lymhurst",
		"Bridgewatch",
		"Martlock",
		"Fort Sterling"
	].map((city) => moneySide(readQuote(book, id, city, quality), side)).filter((price) => price != null);
	if (!samples.length) return null;
	return samples.reduce((sum, price) => sum + price, 0) / samples.length;
}
function EmvSelect({ emv, value, onPick }) {
	const usingEmv = value != null && emv != null && value === emv;
	const usingCustom = value != null && !usingEmv;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "mt-2 block text-xs text-muted",
		children: ["EMV price", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
			className: fieldClass + " mt-1",
			value: usingEmv ? "emv" : usingCustom ? "custom" : "city",
			onChange: (event) => {
				if (event.target.value === "emv" && emv != null) onPick(emv);
				else if (event.target.value === "city") onPick(null);
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "city",
					children: "City price"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "emv",
					disabled: emv == null,
					children: emv == null ? "EMV · no royal prices" : `EMV · ${silver(emv)}`
				}),
				usingCustom ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
					value: "custom",
					children: ["Manual · ", silver(value)]
				}) : null
			]
		})]
	});
}
function liveSellOptions(book, id, quality) {
	return MARKETS.map((city) => {
		const quote = readQuote(book, id, city, quality);
		const price = quote?.type === "EMV" && quote.value ? quote.value : moneySide(quote, "sell");
		const note = quoteNote(quote, "sell");
		if (price == null) return {
			value: city,
			label: `${city} · no sell order`
		};
		return {
			value: city,
			label: note === "No data" ? `${city} · —` : `${city} · ${silver(price)} · ${note}`
		};
	});
}
function citiesWith(book, id, quality, side, current, places = MARKETS) {
	const listed = places.filter((city) => moneySide(readQuote(book, id, city, quality), side) != null);
	const cities = listed.length ? [...listed] : [...places];
	if (!cities.includes(current)) cities.unshift(current);
	return cities.map((city) => {
		const quote = readQuote(book, id, city, quality);
		const price = quote?.type === "EMV" && quote.value ? quote.value : moneySide(quote, side);
		const note = quoteNote(quote, side);
		if (price == null) return {
			value: city,
			label: note === "No data" ? `${city} · —` : city
		};
		return {
			value: city,
			label: `${city} · ${silver(price)} · ${note}`
		};
	});
}
function quoteAge(book, id, city, quality, side) {
	return quoteNote(readQuote(book, id, city, quality), side);
}
function PriceRow({ role, name, market, hint, value, onChange, cityLabel, city, cities, onCity, age, priceBox = true, manual = false, emv }) {
	const locked = value != null && market != null && value === market;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-w-0 flex-col gap-1 text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted",
				children: role
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "truncate text-parchment",
				children: [name, hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "ml-2 text-xs text-muted",
					children: ["using ", hint]
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
				label: cityLabel,
				value: city,
				onChange: onCity,
				options: cities
			}),
			emv !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmvSelect, {
				emv,
				value,
				onPick: onChange
			}) : null,
			manual ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "text-xs text-muted",
				children: ["Manual price", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: fieldClass + " mt-1",
					inputMode: "decimal",
					placeholder: market == null ? "Leave empty for the live price" : `Live ${silver(market)}`,
					value: value ?? "",
					onChange: (event) => onChange(event.target.value.trim() === "" ? null : Number(event.target.value)),
					"aria-label": `Manual price for ${name}`
				})]
			}) : null,
			priceBox ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-2",
				children: [market == null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceTag, {
					price: 0,
					updatedAt: null,
					type: "None"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tabular-nums text-base text-parchment",
					children: silver(market)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-xs text-muted",
					children: age || "No data"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: market == null,
					onClick: () => market != null && onChange(market),
					"aria-label": `Put ${role} into the box`,
					className: "grid size-8 shrink-0 place-items-center rounded-md border " + (locked ? "border-brass text-brass" : "border-line text-muted"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: fieldClass,
				inputMode: "decimal",
				placeholder: "Type a price to override",
				value: value ?? "",
				onChange: (event) => onChange(event.target.value === "" ? null : Number(event.target.value)),
				"aria-label": `${role}: ${name}`
			})] }) : null
		]
	});
}
var TOOLS = [
	{
		id: "bench",
		title: "Add Craft",
		note: "Calculate material cost, returns, and profit.",
		icon: Hammer
	},
	{
		id: "flip",
		title: "Flipping",
		note: "Compare cities and the silver left after tax.",
		icon: Repeat
	},
	{
		id: "farm",
		title: "Farming and Breeding",
		note: "See seed yield, offspring, and focus spent.",
		icon: Sprout
	},
	{
		id: "labor",
		title: "Laborers",
		note: "Check journals, house tier, and the return.",
		icon: Users
	},
	{
		id: "recent",
		title: "Recent",
		note: "Reopen a craft you already priced.",
		icon: Clock
	}
];
function Dashboard({ onOpen }) {
	const [latest, setLatest] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		fetch(`/changelog.json`).then((res) => res.ok ? res.json() : null).then((data) => {
			const entry = data?.entries?.[0];
			if (entry?.title) setLatest({
				title: entry.title,
				bullets: entry.bullets ?? []
			});
		}).catch(() => void 0);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-section",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-section",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "HEARTHFORGE TOOLKIT"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "page-title",
						children: "Albion economy tools for informed silver decisions."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "lead",
						children: "Craft, flip, farm, and run laborers from the same Asia prices. Check the cost before you spend the silver."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-section lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-lg border border-line bg-panel p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl text-parchment",
								children: "How to start"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "lead",
								children: "Pick a tool, set the city, and read the profit before you commit materials or focus."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-6 flex flex-wrap gap-3",
								children: TOOLS.slice(0, 3).map((tool) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => onOpen(tool.id),
									className: "h-11 rounded-full border border-line px-4 text-sm text-parchment",
									children: tool.title
								}, tool.id))
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-lg border border-line bg-panel p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl text-parchment",
							children: "Latest updates"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "thin-scroll mt-6 max-h-52 overflow-y-auto pr-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold text-parchment",
								children: latest?.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-4 list-disc space-y-4 pl-5 text-sm leading-relaxed text-muted",
								children: (latest?.bullets ?? []).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
							})]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: TOOLS.map((tool) => {
					const Icon = tool.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onOpen(tool.id),
						className: "rounded-lg border border-line bg-panel p-6 text-left transition duration-150 hover:-translate-y-0.5 hover:border-brass",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5 text-brass" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 font-semibold text-parchment",
								children: tool.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-muted",
								children: tool.note
							})
						]
					}, tool.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-section lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold text-parchment",
						children: "Market context"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm leading-relaxed text-muted",
						children: "Prices are Asia sell orders. An empty city falls back to Albion Free Market, then the last daily average. The age sits next to the number."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold text-parchment",
						children: "Character settings"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm leading-relaxed text-muted",
						children: "Premium, station, and mastery change the result. Specialization counts double when focus is spent on a crop or an animal."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold text-parchment",
						children: "Production planning"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm leading-relaxed text-muted",
						children: "A craft shows the materials to buy, the silver back from returns, and the profit after tax. Journals are included only when their prices are known."
					})] })
				]
			})
		]
	});
}
var aog_animals_default = /*#__PURE__*/ JSON.parse("[{\"id\":\"T3_FARM_CHICKEN_BABY\",\"name\":\"Baby Chickens\",\"foodId\":\"T3_WHEAT\",\"foodName\":\"Wheat\",\"totalFood\":9,\"perCycle\":9,\"cycles\":1,\"offspring\":60,\"nurtured\":140,\"grownId\":\"T3_FARM_CHICKEN_GROWN\",\"grownName\":\"Chicken\",\"tier\":3,\"group\":\"farm\",\"hours\":44.0,\"nutrition\":864,\"fame\":100},{\"id\":\"T3_FARM_HORSE_BABY\",\"name\":\"Journeyman's Foal\",\"foodId\":\"T1_CARROT\",\"foodName\":\"Carrot\",\"totalFood\":9,\"perCycle\":9,\"cycles\":1,\"offspring\":84,\"nurtured\":104,\"grownId\":\"T3_FARM_HORSE_GROWN\",\"grownName\":\"Journeyman's Horse\",\"tier\":3,\"group\":\"saddled\",\"hours\":44.0,\"nutrition\":480,\"fame\":100},{\"id\":\"T3_FARM_OX_BABY\",\"name\":\"Journeyman's Ox Calf\",\"foodId\":\"T1_CARROT\",\"foodName\":\"Carrot\",\"totalFood\":9,\"perCycle\":9,\"cycles\":1,\"offspring\":84,\"nurtured\":104,\"grownId\":\"T3_FARM_OX_GROWN\",\"grownName\":\"Journeyman's Ox\",\"tier\":3,\"group\":\"saddled\",\"hours\":44.0,\"nutrition\":480,\"fame\":100},{\"id\":\"T4_FARM_GIANTSTAG_BABY\",\"name\":\"Adept's Fawn\",\"foodId\":\"T1_CARROT\",\"foodName\":\"Carrot\",\"totalFood\":32,\"perCycle\":16,\"cycles\":2,\"offspring\":0,\"nurtured\":35,\"grownId\":\"T4_FARM_GIANTSTAG_GROWN\",\"grownName\":\"Adept's Tame Giant Stag\",\"tier\":4,\"group\":\"rare\",\"hours\":92.0,\"nutrition\":768,\"fame\":200},{\"id\":\"T4_FARM_GOAT_BABY\",\"name\":\"Kid\",\"foodId\":\"T4_TURNIP\",\"foodName\":\"Turnip\",\"totalFood\":9,\"perCycle\":9,\"cycles\":1,\"offspring\":73.33,\"nurtured\":126.33,\"grownId\":\"T4_FARM_GOAT_GROWN\",\"grownName\":\"Goat\",\"tier\":4,\"group\":\"farm\",\"hours\":44.0,\"nutrition\":864,\"fame\":100},{\"id\":\"T4_FARM_HORSE_BABY\",\"name\":\"Adept's Foal\",\"foodId\":\"T1_CARROT\",\"foodName\":\"Carrot\",\"totalFood\":32,\"perCycle\":16,\"cycles\":2,\"offspring\":78.67,\"nurtured\":105.67,\"grownId\":\"T4_FARM_HORSE_GROWN\",\"grownName\":\"Adept's Horse\",\"tier\":4,\"group\":\"saddled\",\"hours\":92.0,\"nutrition\":768,\"fame\":200},{\"id\":\"T4_FARM_OX_BABY\",\"name\":\"Adept's Ox Calf\",\"foodId\":\"T1_CARROT\",\"foodName\":\"Carrot\",\"totalFood\":32,\"perCycle\":16,\"cycles\":2,\"offspring\":78.67,\"nurtured\":105.67,\"grownId\":\"T4_FARM_OX_GROWN\",\"grownName\":\"Adept's Ox\",\"tier\":4,\"group\":\"saddled\",\"hours\":92.0,\"nutrition\":768,\"fame\":200},{\"id\":\"T5_FARM_COUGAR_BABY\",\"name\":\"Swiftclaw Cub\",\"foodId\":\"T3_MEAT\",\"foodName\":\"Chicken Meat\",\"totalFood\":87,\"perCycle\":29,\"cycles\":3,\"offspring\":0,\"nurtured\":30,\"grownId\":\"T5_FARM_COUGAR_GROWN\",\"grownName\":\"Tame Swiftclaw\",\"tier\":5,\"group\":\"rare\",\"hours\":140.0,\"nutrition\":1488,\"fame\":300},{\"id\":\"T5_FARM_DIREBEAR_FW_FORTSTERLING_BABY\",\"name\":\"Winter Bear Cub\",\"foodId\":\"T3_MEAT\",\"foodName\":\"Raw Chicken\",\"totalFood\":87,\"perCycle\":29,\"cycles\":3,\"offspring\":0,\"nurtured\":30,\"grownId\":\"T5_FARM_DIREBEAR_FW_FORTSTERLING_GROWN\",\"grownName\":\"Tame Winter Bear\",\"tier\":5,\"group\":\"rare\",\"hours\":140.0,\"nutrition\":1488,\"fame\":300},{\"id\":\"T5_FARM_DIREBOAR_FW_LYMHURST_BABY\",\"name\":\"Wild Boarlet\",\"foodId\":\"T3_MEAT\",\"foodName\":\"Raw Chicken\",\"totalFood\":87,\"perCycle\":29,\"cycles\":3,\"offspring\":0,\"nurtured\":30,\"grownId\":\"T5_FARM_DIREBOAR_FW_LYMHURST_GROWN\",\"grownName\":\"Tame Wild Boar\",\"tier\":5,\"group\":\"rare\",\"hours\":140.0,\"nutrition\":1488,\"fame\":300},{\"id\":\"T5_FARM_GREYWOLF_FW_CAERLEON_BABY\",\"name\":\"Caerleon Greywolf Pup\",\"foodId\":\"T3_MEAT\",\"foodName\":\"Raw Chicken\",\"totalFood\":87,\"perCycle\":29,\"cycles\":3,\"offspring\":0,\"nurtured\":30,\"grownId\":\"T5_FARM_GREYWOLF_FW_CAERLEON_GROWN\",\"grownName\":\"Tame Greywolf\",\"tier\":5,\"group\":\"rare\",\"hours\":140.0,\"nutrition\":1488,\"fame\":300},{\"id\":\"T5_FARM_GOOSE_BABY\",\"name\":\"Gosling\",\"foodId\":\"T5_CABBAGE\",\"foodName\":\"Cabbage\",\"totalFood\":9,\"perCycle\":9,\"cycles\":1,\"offspring\":80,\"nurtured\":120,\"grownId\":\"T5_FARM_GOOSE_GROWN\",\"grownName\":\"Goose\",\"tier\":5,\"group\":\"farm\",\"hours\":44.0,\"nutrition\":864,\"fame\":100},{\"id\":\"T5_FARM_HORSE_BABY\",\"name\":\"Expert's Foal\",\"foodId\":\"T1_CARROT\",\"foodName\":\"Carrot\",\"totalFood\":93,\"perCycle\":31,\"cycles\":3,\"offspring\":78.67,\"nurtured\":105.67,\"grownId\":\"T5_FARM_HORSE_GROWN\",\"grownName\":\"Expert's Horse\",\"tier\":5,\"group\":\"saddled\",\"hours\":140.0,\"nutrition\":1488,\"fame\":300},{\"id\":\"T5_FARM_MOABIRD_FW_BRIDGEWATCH_BABY\",\"name\":\"Baby Moabird\",\"foodId\":\"T1_CARROT\",\"foodName\":\"Carrots\",\"totalFood\":93,\"perCycle\":31,\"cycles\":3,\"offspring\":0,\"nurtured\":30,\"grownId\":\"T5_FARM_MOABIRD_FW_BRIDGEWATCH_GROWN\",\"grownName\":\"Tame Moabird\",\"tier\":5,\"group\":\"rare\",\"hours\":140.0,\"nutrition\":1488,\"fame\":300},{\"id\":\"T5_FARM_OWL_FW_BRECILIEN_BABY\",\"name\":\"Mystic Owlet\",\"foodId\":\"T3_MEAT\",\"foodName\":\"Raw Chicken\",\"totalFood\":87,\"perCycle\":29,\"cycles\":3,\"offspring\":0,\"nurtured\":30,\"grownId\":\"T5_FARM_OWL_FW_BRECILIEN_GROWN\",\"grownName\":\"Tame Mystic Owl\",\"tier\":5,\"group\":\"rare\",\"hours\":140.0,\"nutrition\":1488,\"fame\":300},{\"id\":\"T5_FARM_OX_BABY\",\"name\":\"Expert's Ox Calf\",\"foodId\":\"T1_CARROT\",\"foodName\":\"Carrot\",\"totalFood\":93,\"perCycle\":31,\"cycles\":3,\"offspring\":78.67,\"nurtured\":105.67,\"grownId\":\"T5_FARM_OX_GROWN\",\"grownName\":\"Expert's Ox\",\"tier\":5,\"group\":\"saddled\",\"hours\":140.0,\"nutrition\":1488,\"fame\":300},{\"id\":\"T5_FARM_RAM_FW_MARTLOCK_BABY\",\"name\":\"Bighorn Ram Lamb\",\"foodId\":\"T1_CARROT\",\"foodName\":\"Carrots\",\"totalFood\":93,\"perCycle\":31,\"cycles\":3,\"offspring\":0,\"nurtured\":30,\"grownId\":\"T5_FARM_RAM_FW_MARTLOCK_GROWN\",\"grownName\":\"Tame Bighorn Ram\",\"tier\":5,\"group\":\"rare\",\"hours\":140.0,\"nutrition\":1488,\"fame\":300},{\"id\":\"T5_FARM_SPIDER_HELL_BABY\",\"name\":\"Hellspinner Baby\",\"foodId\":\"T3_MEAT\",\"foodName\":\"Raw Chicken\",\"totalFood\":87,\"perCycle\":29,\"cycles\":3,\"offspring\":0,\"nurtured\":30,\"grownId\":\"T5_FARM_SPIDER_HELL_GROWN\",\"grownName\":\"Tame Hellspinner\",\"tier\":5,\"group\":\"rare\",\"hours\":140.0,\"nutrition\":1488,\"fame\":300},{\"id\":\"T5_FARM_SWAMPDRAGON_FW_THETFORD_BABY\",\"name\":\"Baby Swamp Salamander\",\"foodId\":\"T3_MEAT\",\"foodName\":\"Raw Chicken\",\"totalFood\":87,\"perCycle\":29,\"cycles\":3,\"offspring\":0,\"nurtured\":30,\"grownId\":\"T5_FARM_SWAMPDRAGON_FW_THETFORD_GROWN\",\"grownName\":\"Tame Swamp Salamander\",\"tier\":5,\"group\":\"rare\",\"hours\":140.0,\"nutrition\":1488,\"fame\":300},{\"id\":\"T6_FARM_DIREWOLF_BABY\",\"name\":\"Direwolf Pup\",\"foodId\":\"T3_MEAT\",\"foodName\":\"Chicken Meat\",\"totalFood\":259,\"perCycle\":64,\"cycles\":4,\"offspring\":0,\"nurtured\":24,\"grownId\":\"T6_FARM_DIREWOLF_GROWN\",\"grownName\":\"Tame Direwolf\",\"tier\":6,\"group\":\"rare\",\"hours\":188.0,\"nutrition\":3312,\"fame\":400},{\"id\":\"T6_FARM_GIANTSTAG_BABY\",\"name\":\"Master's Fawn\",\"foodId\":\"T1_CARROT\",\"foodName\":\"Carrots\",\"totalFood\":276,\"perCycle\":69,\"cycles\":4,\"offspring\":0,\"nurtured\":24,\"grownId\":\"T6_FARM_GIANTSTAG_GROWN\",\"grownName\":\"Master's Tame Giant Stag\",\"tier\":6,\"group\":\"rare\",\"hours\":188.0,\"nutrition\":3312,\"fame\":400},{\"id\":\"T6_FARM_HORSE_BABY\",\"name\":\"Master's Foal\",\"foodId\":\"T1_CARROT\",\"foodName\":\"Carrots\",\"totalFood\":276,\"perCycle\":69,\"cycles\":4,\"offspring\":81.04,\"nurtured\":105.04,\"grownId\":\"T6_FARM_HORSE_GROWN\",\"grownName\":\"Master's Horse\",\"tier\":6,\"group\":\"saddled\",\"hours\":188.0,\"nutrition\":3312,\"fame\":400},{\"id\":\"T6_FARM_GIANTSTAG_MOOSE_BABY\",\"name\":\"Moose Calf\",\"foodId\":\"T1_CARROT\",\"foodName\":\"Carrot\",\"totalFood\":259,\"perCycle\":64,\"cycles\":4,\"offspring\":0,\"nurtured\":24,\"grownId\":\"T6_FARM_GIANTSTAG_MOOSE_GROWN\",\"grownName\":\"Tame Moose\",\"tier\":6,\"group\":\"rare\",\"hours\":188.0,\"nutrition\":3312,\"fame\":400},{\"id\":\"T6_FARM_OX_BABY\",\"name\":\"Master's Ox Calf\",\"foodId\":\"T1_CARROT\",\"foodName\":\"Carrot\",\"totalFood\":276,\"perCycle\":69,\"cycles\":4,\"offspring\":81.04,\"nurtured\":105.04,\"grownId\":\"T6_FARM_OX_GROWN\",\"grownName\":\"Master's Ox\",\"tier\":6,\"group\":\"saddled\",\"hours\":188.0,\"nutrition\":3312,\"fame\":400},{\"id\":\"T6_FARM_SHEEP_BABY\",\"name\":\"Lamb\",\"foodId\":\"T6_POTATO\",\"foodName\":\"Potato\",\"totalFood\":9,\"perCycle\":9,\"cycles\":1,\"offspring\":86.67,\"nurtured\":113.67,\"grownId\":\"T6_FARM_SHEEP_GROWN\",\"grownName\":\"Sheep\",\"tier\":6,\"group\":\"farm\",\"hours\":44.0,\"nutrition\":864,\"fame\":100},{\"id\":\"T7_FARM_DIREBOAR_BABY\",\"name\":\"Direboar Piglet\",\"foodId\":\"T3_MEAT\",\"foodName\":\"Chicken Meat\",\"totalFood\":765,\"perCycle\":153,\"cycles\":5,\"offspring\":0,\"nurtured\":20,\"grownId\":\"T7_FARM_DIREBOAR_GROWN\",\"grownName\":\"Tame Direboar\",\"tier\":7,\"group\":\"rare\",\"hours\":236.0,\"nutrition\":7920,\"fame\":500},{\"id\":\"T7_FARM_HORSE_BABY\",\"name\":\"Grandmaster's Foal\",\"foodId\":\"T1_CARROT\",\"foodName\":\"Carrots\",\"totalFood\":825,\"perCycle\":165,\"cycles\":5,\"offspring\":84.2,\"nurtured\":104.2,\"grownId\":\"T7_FARM_HORSE_GROWN\",\"grownName\":\"Grandmaster's Horse\",\"tier\":7,\"group\":\"saddled\",\"hours\":236.0,\"nutrition\":7920,\"fame\":500},{\"id\":\"T7_FARM_OX_BABY\",\"name\":\"Grandmaster's Ox Calf\",\"foodId\":\"T1_CARROT\",\"foodName\":\"Carrot\",\"totalFood\":825,\"perCycle\":165,\"cycles\":5,\"offspring\":84.2,\"nurtured\":104.2,\"grownId\":\"T7_FARM_OX_GROWN\",\"grownName\":\"Grandmaster's Ox\",\"tier\":7,\"group\":\"saddled\",\"hours\":236.0,\"nutrition\":7920,\"fame\":500},{\"id\":\"T7_FARM_PIG_BABY\",\"name\":\"Piglet\",\"foodId\":\"T7_CORN\",\"foodName\":\"Corn\",\"totalFood\":9,\"perCycle\":9,\"cycles\":1,\"offspring\":91.11,\"nurtured\":109.11,\"grownId\":\"T7_FARM_PIG_GROWN\",\"grownName\":\"Pig\",\"tier\":7,\"group\":\"farm\",\"hours\":44.0,\"nutrition\":864,\"fame\":100},{\"id\":\"T7_FARM_SWAMPDRAGON_BABY\",\"name\":\"Swamp Dragon Pup\",\"foodId\":\"T3_MEAT\",\"foodName\":\"Chicken Meat\",\"totalFood\":765,\"perCycle\":153,\"cycles\":5,\"offspring\":0,\"nurtured\":20,\"grownId\":\"T7_FARM_SWAMPDRAGON_GROWN\",\"grownName\":\"Tame Swamp Dragon\",\"tier\":7,\"group\":\"rare\",\"hours\":236.0,\"nutrition\":7920,\"fame\":500},{\"id\":\"T8_FARM_COW_BABY\",\"name\":\"Calf\",\"foodId\":\"T8_PUMPKIN\",\"foodName\":\"Pumpkin\",\"totalFood\":9,\"perCycle\":9,\"cycles\":1,\"offspring\":93.33,\"nurtured\":106.33,\"grownId\":\"T8_FARM_COW_GROWN\",\"grownName\":\"Cow\",\"tier\":8,\"group\":\"farm\",\"hours\":44.0,\"nutrition\":864,\"fame\":100},{\"id\":\"T8_FARM_DIREBEAR_BABY\",\"name\":\"Direbear Cub\",\"foodId\":\"T3_MEAT\",\"foodName\":\"Raw Chicken\",\"totalFood\":2280,\"perCycle\":380,\"cycles\":6,\"offspring\":0,\"nurtured\":15,\"grownId\":\"T8_FARM_DIREBEAR_GROWN\",\"grownName\":\"Tame Direbear\",\"tier\":8,\"group\":\"rare\",\"hours\":284.0,\"nutrition\":19728,\"fame\":600},{\"id\":\"T8_FARM_DIREBEAR_FW_FORTSTERLING_BABY\",\"name\":\"Elite Winter Bear Cub\",\"foodId\":\"T3_MEAT\",\"foodName\":\"Raw Chicken\",\"totalFood\":2280,\"perCycle\":380,\"cycles\":6,\"offspring\":0,\"nurtured\":15,\"grownId\":\"T8_FARM_DIREBEAR_FW_FORTSTERLING_GROWN\",\"grownName\":\"Tame Elite Winter Bear\",\"tier\":8,\"group\":\"rare\",\"hours\":284.0,\"nutrition\":19728,\"fame\":600},{\"id\":\"T8_FARM_DIREBOAR_FW_LYMHURST_BABY\",\"name\":\"Elite Wild Boarlet\",\"foodId\":\"T3_MEAT\",\"foodName\":\"Raw Chicken\",\"totalFood\":2280,\"perCycle\":380,\"cycles\":6,\"offspring\":0,\"nurtured\":15,\"grownId\":\"T8_FARM_DIREBOAR_FW_LYMHURST_GROWN\",\"grownName\":\"Tame Elite Wild Boar\",\"tier\":8,\"group\":\"rare\",\"hours\":284.0,\"nutrition\":19728,\"fame\":600},{\"id\":\"T8_FARM_DIREWOLF_BABY\",\"name\":\"Ghostwolf Pup\",\"foodId\":\"T3_MEAT\",\"foodName\":\"Raw Chicken\",\"totalFood\":2280,\"perCycle\":380,\"cycles\":6,\"offspring\":0,\"nurtured\":15,\"grownId\":\"T8_FARM_DIREWOLF_GROWN\",\"grownName\":\"Tame Ghostwolf\",\"tier\":8,\"group\":\"rare\",\"hours\":284.0,\"nutrition\":19728,\"fame\":600},{\"id\":\"T8_FARM_GREYWOLF_FW_CAERLEON_BABY\",\"name\":\"Elite Greywolf Pup\",\"foodId\":\"T3_MEAT\",\"foodName\":\"Raw Chicken\",\"totalFood\":2280,\"perCycle\":380,\"cycles\":6,\"offspring\":0,\"nurtured\":15,\"grownId\":\"T8_FARM_GREYWOLF_FW_CAERLEON_GROWN\",\"grownName\":\"Tame Elite Greywolf\",\"tier\":8,\"group\":\"rare\",\"hours\":284.0,\"nutrition\":19728,\"fame\":600},{\"id\":\"T8_FARM_HORSE_BABY\",\"name\":\"Elder's Foal\",\"foodId\":\"T1_CARROT\",\"foodName\":\"Carrots\",\"totalFood\":2466,\"perCycle\":411,\"cycles\":6,\"offspring\":87.36,\"nurtured\":103.36,\"grownId\":\"T8_FARM_HORSE_GROWN\",\"grownName\":\"Elder's Horse\",\"tier\":8,\"group\":\"saddled\",\"hours\":284.0,\"nutrition\":19728,\"fame\":600},{\"id\":\"T8_FARM_MAMMOTH_BABY\",\"name\":\"Mammoth Calf\",\"foodId\":\"T1_CARROT\",\"foodName\":\"Carrot\",\"totalFood\":2466,\"perCycle\":411,\"cycles\":6,\"offspring\":0,\"nurtured\":15,\"grownId\":\"T8_FARM_MAMMOTH_GROWN\",\"grownName\":\"Tame Mammoth\",\"tier\":8,\"group\":\"rare\",\"hours\":284.0,\"nutrition\":19728,\"fame\":600},{\"id\":\"T8_FARM_MOABIRD_FW_BRIDGEWATCH_BABY\",\"name\":\"Baby Elite Terrorbird\",\"foodId\":\"T1_CARROT\",\"foodName\":\"Carrots\",\"totalFood\":2466,\"perCycle\":411,\"cycles\":6,\"offspring\":0,\"nurtured\":15,\"grownId\":\"T8_FARM_MOABIRD_FW_BRIDGEWATCH_GROWN\",\"grownName\":\"Tame Elite Terrorbird\",\"tier\":8,\"group\":\"rare\",\"hours\":284.0,\"nutrition\":19728,\"fame\":600},{\"id\":\"T8_FARM_OWL_FW_BRECILIEN_BABY\",\"name\":\"Elite Mystic Owlet\",\"foodId\":\"T3_MEAT\",\"foodName\":\"Raw Chicken\",\"totalFood\":2280,\"perCycle\":380,\"cycles\":6,\"offspring\":0,\"nurtured\":15,\"grownId\":\"T8_FARM_OWL_FW_BRECILIEN_GROWN\",\"grownName\":\"Tame Elite Mystic Owl\",\"tier\":8,\"group\":\"rare\",\"hours\":284.0,\"nutrition\":19728,\"fame\":600},{\"id\":\"T8_FARM_OX_BABY\",\"name\":\"Elder's Ox Calf\",\"foodId\":\"T1_CARROT\",\"foodName\":\"Carrot\",\"totalFood\":2466,\"perCycle\":411,\"cycles\":6,\"offspring\":87.36,\"nurtured\":103.36,\"grownId\":\"T8_FARM_OX_GROWN\",\"grownName\":\"Elder's Ox\",\"tier\":8,\"group\":\"saddled\",\"hours\":284.0,\"nutrition\":19728,\"fame\":600},{\"id\":\"T8_FARM_RABBIT_EASTER_BABY\",\"name\":\"Vibrant Spring Cottontail Egg\",\"foodId\":\"UNIQUE_CONSUMABLE_EVENT_EASTER_2020_CHOCOLATE\",\"foodName\":\"Chocolate\",\"totalFood\":500,\"perCycle\":500,\"cycles\":1,\"offspring\":0,\"nurtured\":10,\"grownId\":\"T8_FARM_RABBIT_EASTER_GROWN\",\"grownName\":\"Tame Spring Cottontail\",\"tier\":8,\"group\":\"rare\",\"hours\":44.0,\"nutrition\":500,\"fame\":100},{\"id\":\"T8_FARM_RAM_FW_MARTLOCK_BABY\",\"name\":\"Elite Bighorn Ram Lamb\",\"foodId\":\"T1_CARROT\",\"foodName\":\"Carrots\",\"totalFood\":2466,\"perCycle\":411,\"cycles\":6,\"offspring\":0,\"nurtured\":15,\"grownId\":\"T8_FARM_RAM_FW_MARTLOCK_GROWN\",\"grownName\":\"Tame Elite Bighorn Ram\",\"tier\":8,\"group\":\"rare\",\"hours\":284.0,\"nutrition\":19728,\"fame\":600},{\"id\":\"T8_FARM_SPIDER_HELL_BABY\",\"name\":\"Soulspinner Baby\",\"foodId\":\"T3_MEAT\",\"foodName\":\"Raw Chicken\",\"totalFood\":2280,\"perCycle\":380,\"cycles\":6,\"offspring\":0,\"nurtured\":15,\"grownId\":\"T8_FARM_SPIDER_HELL_GROWN\",\"grownName\":\"Tame Soulspinner\",\"tier\":8,\"group\":\"rare\",\"hours\":284.0,\"nutrition\":19728,\"fame\":600},{\"id\":\"T8_FARM_SWAMPDRAGON_FW_THETFORD_BABY\",\"name\":\"Baby Elite Swamp Salamander\",\"foodId\":\"T3_MEAT\",\"foodName\":\"Raw Chicken\",\"totalFood\":2280,\"perCycle\":380,\"cycles\":6,\"offspring\":0,\"nurtured\":15,\"grownId\":\"T8_FARM_SWAMPDRAGON_FW_THETFORD_GROWN\",\"grownName\":\"Tame Elite Swamp Salamander\",\"tier\":8,\"group\":\"rare\",\"hours\":284.0,\"nutrition\":19728,\"fame\":600}]");
var FARM_ROWS = [
	{
		id: "T1_FARM_CARROT_SEED",
		name: "Carrot Seeds",
		group: "crop",
		place: "farm",
		tier: 1,
		actions: 1,
		growHours: 22,
		nutritionMax: 0,
		secondsPerNutrition: 0,
		food: "",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: 0,
		careBonus: 2
	},
	{
		id: "T2_FARM_BEAN_SEED",
		name: "Bean Seeds",
		group: "crop",
		place: "farm",
		tier: 2,
		actions: 1,
		growHours: 22,
		nutritionMax: 0,
		secondsPerNutrition: 0,
		food: "",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: .3333,
		careBonus: 1.3333
	},
	{
		id: "T3_FARM_WHEAT_SEED",
		name: "Wheat Seeds",
		group: "crop",
		place: "farm",
		tier: 3,
		actions: 1,
		growHours: 22,
		nutritionMax: 0,
		secondsPerNutrition: 0,
		food: "",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: .6,
		careBonus: .8
	},
	{
		id: "T4_FARM_TURNIP_SEED",
		name: "Turnip Seeds",
		group: "crop",
		place: "farm",
		tier: 4,
		actions: 1,
		growHours: 22,
		nutritionMax: 0,
		secondsPerNutrition: 0,
		food: "",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: .7333,
		careBonus: .5333
	},
	{
		id: "T5_FARM_CABBAGE_SEED",
		name: "Cabbage Seeds",
		group: "crop",
		place: "farm",
		tier: 5,
		actions: 1,
		growHours: 22,
		nutritionMax: 0,
		secondsPerNutrition: 0,
		food: "",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: .8,
		careBonus: .4
	},
	{
		id: "T6_FARM_POTATO_SEED",
		name: "Potato Seeds",
		group: "crop",
		place: "farm",
		tier: 6,
		actions: 1,
		growHours: 22,
		nutritionMax: 0,
		secondsPerNutrition: 0,
		food: "",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: .8667,
		careBonus: .2667
	},
	{
		id: "T7_FARM_CORN_SEED",
		name: "Corn Seeds",
		group: "crop",
		place: "farm",
		tier: 7,
		actions: 1,
		growHours: 22,
		nutritionMax: 0,
		secondsPerNutrition: 0,
		food: "",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: .9111,
		careBonus: .1778
	},
	{
		id: "T8_FARM_PUMPKIN_SEED",
		name: "Pumpkin Seeds",
		group: "crop",
		place: "farm",
		tier: 8,
		actions: 1,
		growHours: 22,
		nutritionMax: 0,
		secondsPerNutrition: 0,
		food: "",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: .9333,
		careBonus: .1333
	},
	{
		id: "T2_FARM_AGARIC_SEED",
		name: "Arcane Agaric Seeds",
		group: "herb",
		place: "herbgarden",
		tier: 2,
		actions: 1,
		growHours: 22,
		nutritionMax: 0,
		secondsPerNutrition: 0,
		food: "",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: .3333,
		careBonus: 1.3333
	},
	{
		id: "T3_FARM_COMFREY_SEED",
		name: "Brightleaf Comfrey Seeds",
		group: "herb",
		place: "herbgarden",
		tier: 3,
		actions: 1,
		growHours: 22,
		nutritionMax: 0,
		secondsPerNutrition: 0,
		food: "",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: .6,
		careBonus: .8
	},
	{
		id: "T4_FARM_BURDOCK_SEED",
		name: "Crenellated Burdock Seeds",
		group: "herb",
		place: "herbgarden",
		tier: 4,
		actions: 1,
		growHours: 22,
		nutritionMax: 0,
		secondsPerNutrition: 0,
		food: "",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: .7333,
		careBonus: .5333
	},
	{
		id: "T5_FARM_TEASEL_SEED",
		name: "Dragon Teasel Seeds",
		group: "herb",
		place: "herbgarden",
		tier: 5,
		actions: 1,
		growHours: 22,
		nutritionMax: 0,
		secondsPerNutrition: 0,
		food: "",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: .8,
		careBonus: .4
	},
	{
		id: "T6_FARM_FOXGLOVE_SEED",
		name: "Elusive Foxglove Seeds",
		group: "herb",
		place: "herbgarden",
		tier: 6,
		actions: 1,
		growHours: 22,
		nutritionMax: 0,
		secondsPerNutrition: 0,
		food: "",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: .8667,
		careBonus: .2667
	},
	{
		id: "T7_FARM_MULLEIN_SEED",
		name: "Firetouched Mullein Seeds",
		group: "herb",
		place: "herbgarden",
		tier: 7,
		actions: 1,
		growHours: 22,
		nutritionMax: 0,
		secondsPerNutrition: 0,
		food: "",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: .9111,
		careBonus: .1778
	},
	{
		id: "T8_FARM_YARROW_SEED",
		name: "Ghoul Yarrow Seeds",
		group: "herb",
		place: "herbgarden",
		tier: 8,
		actions: 1,
		growHours: 22,
		nutritionMax: 0,
		secondsPerNutrition: 0,
		food: "",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: .9333,
		careBonus: .1333
	},
	{
		id: "T3_FARM_CHICKEN_BABY",
		name: "Baby Chickens",
		group: "breed",
		place: "pasture",
		tier: 3,
		actions: 1,
		growHours: 44,
		nutritionMax: 864,
		secondsPerNutrition: 183.34,
		food: "plants",
		favorite: "T3_WHEAT",
		favoriteName: "Sheaf of Wheat",
		favoriteBonus: 1,
		baseYield: .6,
		careBonus: .8
	},
	{
		id: "T3_FARM_HORSE_BABY",
		name: "Journeyman's Foal",
		group: "breed",
		place: "pasture",
		tier: 3,
		actions: 1,
		growHours: 44,
		nutritionMax: 480,
		secondsPerNutrition: 330,
		food: "plants",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: .84,
		careBonus: .2
	},
	{
		id: "T3_FARM_OX_BABY",
		name: "Journeyman's Ox Calf",
		group: "breed",
		place: "pasture",
		tier: 3,
		actions: 1,
		growHours: 44,
		nutritionMax: 480,
		secondsPerNutrition: 330,
		food: "plants",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: .84,
		careBonus: .2
	},
	{
		id: "T4_FARM_GIANTSTAG_BABY",
		name: "Adept's Fawn",
		group: "breed",
		place: "pasture",
		tier: 4,
		actions: 2,
		growHours: 92,
		nutritionMax: 768,
		secondsPerNutrition: 230,
		food: "plants",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: 0,
		careBonus: .175
	},
	{
		id: "T4_FARM_HORSE_BABY",
		name: "Adept's Foal",
		group: "breed",
		place: "pasture",
		tier: 4,
		actions: 2,
		growHours: 92,
		nutritionMax: 768,
		secondsPerNutrition: 230,
		food: "plants",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: .7867,
		careBonus: .1333
	},
	{
		id: "T4_FARM_OX_BABY",
		name: "Adept's Ox Calf",
		group: "breed",
		place: "pasture",
		tier: 4,
		actions: 2,
		growHours: 92,
		nutritionMax: 768,
		secondsPerNutrition: 230,
		food: "plants",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: .7867,
		careBonus: .1333
	},
	{
		id: "T4_FARM_GOAT_BABY",
		name: "Kid",
		group: "breed",
		place: "pasture",
		tier: 4,
		actions: 1,
		growHours: 44,
		nutritionMax: 864,
		secondsPerNutrition: 183.34,
		food: "plants",
		favorite: "T4_TURNIP",
		favoriteName: "Turnips",
		favoriteBonus: 1,
		baseYield: .7333,
		careBonus: .5333
	},
	{
		id: "T5_FARM_HORSE_BABY",
		name: "Expert's Foal",
		group: "breed",
		place: "pasture",
		tier: 5,
		actions: 3,
		growHours: 140,
		nutritionMax: 1488,
		secondsPerNutrition: 116.67,
		food: "plants",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: .7867,
		careBonus: .0889
	},
	{
		id: "T5_FARM_OX_BABY",
		name: "Expert's Ox Calf",
		group: "breed",
		place: "pasture",
		tier: 5,
		actions: 3,
		growHours: 140,
		nutritionMax: 1488,
		secondsPerNutrition: 116.67,
		food: "plants",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: .7867,
		careBonus: .0889
	},
	{
		id: "T5_FARM_GOOSE_BABY",
		name: "Gosling",
		group: "breed",
		place: "pasture",
		tier: 5,
		actions: 1,
		growHours: 44,
		nutritionMax: 864,
		secondsPerNutrition: 183.34,
		food: "plants",
		favorite: "T5_CABBAGE",
		favoriteName: "Cabbage",
		favoriteBonus: 1,
		baseYield: .8,
		careBonus: .4
	},
	{
		id: "T6_FARM_SHEEP_BABY",
		name: "Lamb",
		group: "breed",
		place: "pasture",
		tier: 6,
		actions: 1,
		growHours: 44,
		nutritionMax: 864,
		secondsPerNutrition: 183.34,
		food: "plants",
		favorite: "T6_POTATO",
		favoriteName: "Potatoes",
		favoriteBonus: 1,
		baseYield: .8667,
		careBonus: .2667
	},
	{
		id: "T6_FARM_GIANTSTAG_BABY",
		name: "Master's Fawn",
		group: "breed",
		place: "pasture",
		tier: 6,
		actions: 4,
		growHours: 188,
		nutritionMax: 3312,
		secondsPerNutrition: 52.22,
		food: "plants",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: 0,
		careBonus: .06
	},
	{
		id: "T6_FARM_HORSE_BABY",
		name: "Master's Foal",
		group: "breed",
		place: "pasture",
		tier: 6,
		actions: 4,
		growHours: 188,
		nutritionMax: 3312,
		secondsPerNutrition: 52.22,
		food: "plants",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: .8104,
		careBonus: .0593
	},
	{
		id: "T6_FARM_OX_BABY",
		name: "Master's Ox Calf",
		group: "breed",
		place: "pasture",
		tier: 6,
		actions: 4,
		growHours: 188,
		nutritionMax: 3312,
		secondsPerNutrition: 52.22,
		food: "plants",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: .8104,
		careBonus: .0593
	},
	{
		id: "T6_FARM_GIANTSTAG_MOOSE_BABY",
		name: "Moose Calf",
		group: "breed",
		place: "pasture",
		tier: 6,
		actions: 4,
		growHours: 188,
		nutritionMax: 3312,
		secondsPerNutrition: 52.22,
		food: "plants",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: 0,
		careBonus: .06
	},
	{
		id: "T7_FARM_HORSE_BABY",
		name: "Grandmaster's Foal",
		group: "breed",
		place: "pasture",
		tier: 7,
		actions: 5,
		growHours: 236,
		nutritionMax: 7920,
		secondsPerNutrition: 21.85,
		food: "plants",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: .842,
		careBonus: .0395
	},
	{
		id: "T7_FARM_OX_BABY",
		name: "Grandmaster's Ox Calf",
		group: "breed",
		place: "pasture",
		tier: 7,
		actions: 5,
		growHours: 236,
		nutritionMax: 7920,
		secondsPerNutrition: 21.85,
		food: "plants",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: .842,
		careBonus: .0395
	},
	{
		id: "T7_FARM_PIG_BABY",
		name: "Piglet",
		group: "breed",
		place: "pasture",
		tier: 7,
		actions: 1,
		growHours: 44,
		nutritionMax: 864,
		secondsPerNutrition: 183.34,
		food: "plants",
		favorite: "T7_CORN",
		favoriteName: "Bunch of Corn",
		favoriteBonus: 1,
		baseYield: .9111,
		careBonus: .1778
	},
	{
		id: "T8_FARM_COW_BABY",
		name: "Calf",
		group: "breed",
		place: "pasture",
		tier: 8,
		actions: 1,
		growHours: 44,
		nutritionMax: 864,
		secondsPerNutrition: 183.34,
		food: "plants",
		favorite: "T8_PUMPKIN",
		favoriteName: "Pumpkin",
		favoriteBonus: 1,
		baseYield: .9333,
		careBonus: .1333
	},
	{
		id: "T8_FARM_HORSE_BABY",
		name: "Elder's Foal",
		group: "breed",
		place: "pasture",
		tier: 8,
		actions: 6,
		growHours: 284,
		nutritionMax: 19728,
		secondsPerNutrition: 8.77,
		food: "plants",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: .8736,
		careBonus: .0263
	},
	{
		id: "T8_FARM_OX_BABY",
		name: "Elder's Ox Calf",
		group: "breed",
		place: "pasture",
		tier: 8,
		actions: 6,
		growHours: 284,
		nutritionMax: 19728,
		secondsPerNutrition: 8.77,
		food: "plants",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: .8736,
		careBonus: .0263
	},
	{
		id: "T5_FARM_MOABIRD_FW_BRIDGEWATCH_BABY",
		name: "Baby Moabird",
		group: "breed",
		place: "kennel",
		tier: 5,
		actions: 3,
		growHours: 140,
		nutritionMax: 1488,
		secondsPerNutrition: 116.67,
		food: "plants",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: 0,
		careBonus: .1
	},
	{
		id: "T5_FARM_SWAMPDRAGON_FW_THETFORD_BABY",
		name: "Baby Swamp Salamander",
		group: "breed",
		place: "kennel",
		tier: 5,
		actions: 3,
		growHours: 140,
		nutritionMax: 1488,
		secondsPerNutrition: 116.67,
		food: "meat",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: 0,
		careBonus: .1
	},
	{
		id: "T5_FARM_RAM_FW_MARTLOCK_BABY",
		name: "Bighorn Ram Lamb",
		group: "breed",
		place: "kennel",
		tier: 5,
		actions: 3,
		growHours: 140,
		nutritionMax: 1488,
		secondsPerNutrition: 116.67,
		food: "plants",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: 0,
		careBonus: .1
	},
	{
		id: "T5_FARM_GREYWOLF_FW_CAERLEON_BABY",
		name: "Caerleon Greywolf Pup",
		group: "breed",
		place: "kennel",
		tier: 5,
		actions: 3,
		growHours: 140,
		nutritionMax: 1488,
		secondsPerNutrition: 116.67,
		food: "meat",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: 0,
		careBonus: .1
	},
	{
		id: "T5_FARM_SPIDER_HELL_BABY",
		name: "Hellspinner Baby",
		group: "breed",
		place: "kennel",
		tier: 5,
		actions: 3,
		growHours: 140,
		nutritionMax: 1488,
		secondsPerNutrition: 116.67,
		food: "meat",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: 0,
		careBonus: .1
	},
	{
		id: "T5_FARM_OWL_FW_BRECILIEN_BABY",
		name: "Mystic Owlet",
		group: "breed",
		place: "kennel",
		tier: 5,
		actions: 3,
		growHours: 140,
		nutritionMax: 1488,
		secondsPerNutrition: 116.67,
		food: "meat",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: 0,
		careBonus: .1
	},
	{
		id: "T5_FARM_COUGAR_BABY",
		name: "Swiftclaw Cub",
		group: "breed",
		place: "kennel",
		tier: 5,
		actions: 3,
		growHours: 140,
		nutritionMax: 1488,
		secondsPerNutrition: 116.67,
		food: "meat",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: 0,
		careBonus: .1
	},
	{
		id: "T5_FARM_DIREBOAR_FW_LYMHURST_BABY",
		name: "Wild Boarlet",
		group: "breed",
		place: "kennel",
		tier: 5,
		actions: 3,
		growHours: 140,
		nutritionMax: 1488,
		secondsPerNutrition: 116.67,
		food: "meat",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: 0,
		careBonus: .1
	},
	{
		id: "T5_FARM_DIREBEAR_FW_FORTSTERLING_BABY",
		name: "Winter Bear Cub",
		group: "breed",
		place: "kennel",
		tier: 5,
		actions: 3,
		growHours: 140,
		nutritionMax: 1488,
		secondsPerNutrition: 116.67,
		food: "meat",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: 0,
		careBonus: .1
	},
	{
		id: "T6_FARM_DIREWOLF_BABY",
		name: "Direwolf Pup",
		group: "breed",
		place: "kennel",
		tier: 6,
		actions: 4,
		growHours: 188,
		nutritionMax: 3312,
		secondsPerNutrition: 52.22,
		food: "meat",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: 0,
		careBonus: .06
	},
	{
		id: "T7_FARM_DIREBOAR_BABY",
		name: "Direboar Piglet",
		group: "breed",
		place: "kennel",
		tier: 7,
		actions: 5,
		growHours: 236,
		nutritionMax: 7920,
		secondsPerNutrition: 21.85,
		food: "meat",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: 0,
		careBonus: .04
	},
	{
		id: "T7_FARM_SWAMPDRAGON_BABY",
		name: "Swamp Dragon Pup",
		group: "breed",
		place: "kennel",
		tier: 7,
		actions: 5,
		growHours: 236,
		nutritionMax: 7920,
		secondsPerNutrition: 21.85,
		food: "meat",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: 0,
		careBonus: .04
	},
	{
		id: "T8_FARM_SWAMPDRAGON_FW_THETFORD_BABY",
		name: "Baby Elite Swamp Salamander",
		group: "breed",
		place: "kennel",
		tier: 8,
		actions: 6,
		growHours: 284,
		nutritionMax: 19728,
		secondsPerNutrition: 8.77,
		food: "meat",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: 0,
		careBonus: .025
	},
	{
		id: "T8_FARM_MOABIRD_FW_BRIDGEWATCH_BABY",
		name: "Baby Elite Terrorbird",
		group: "breed",
		place: "kennel",
		tier: 8,
		actions: 6,
		growHours: 284,
		nutritionMax: 19728,
		secondsPerNutrition: 8.77,
		food: "plants",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: 0,
		careBonus: .025
	},
	{
		id: "T8_FARM_DIREBEAR_BABY",
		name: "Direbear Cub",
		group: "breed",
		place: "kennel",
		tier: 8,
		actions: 6,
		growHours: 284,
		nutritionMax: 19728,
		secondsPerNutrition: 8.77,
		food: "meat",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: 0,
		careBonus: .025
	},
	{
		id: "T8_FARM_RABBIT_EASTER_BABY_DARK",
		name: "Eerie Cottontail Egg",
		group: "breed",
		place: "kennel",
		tier: 8,
		actions: 1,
		growHours: 44,
		nutritionMax: 19728,
		secondsPerNutrition: 8.03,
		food: "meat",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: 0,
		careBonus: .1
	},
	{
		id: "T8_FARM_RAM_FW_MARTLOCK_BABY",
		name: "Elite Bighorn Ram Lamb",
		group: "breed",
		place: "kennel",
		tier: 8,
		actions: 6,
		growHours: 284,
		nutritionMax: 19728,
		secondsPerNutrition: 8.77,
		food: "plants",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: 0,
		careBonus: .025
	},
	{
		id: "T8_FARM_GREYWOLF_FW_CAERLEON_BABY",
		name: "Elite Greywolf Pup",
		group: "breed",
		place: "kennel",
		tier: 8,
		actions: 6,
		growHours: 284,
		nutritionMax: 19728,
		secondsPerNutrition: 8.77,
		food: "meat",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: 0,
		careBonus: .025
	},
	{
		id: "T8_FARM_OWL_FW_BRECILIEN_BABY",
		name: "Elite Mystic Owlet",
		group: "breed",
		place: "kennel",
		tier: 8,
		actions: 6,
		growHours: 284,
		nutritionMax: 19728,
		secondsPerNutrition: 8.77,
		food: "meat",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: 0,
		careBonus: .025
	},
	{
		id: "T8_FARM_DIREBOAR_FW_LYMHURST_BABY",
		name: "Elite Wild Boarlet",
		group: "breed",
		place: "kennel",
		tier: 8,
		actions: 6,
		growHours: 284,
		nutritionMax: 19728,
		secondsPerNutrition: 8.77,
		food: "meat",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: 0,
		careBonus: .025
	},
	{
		id: "T8_FARM_DIREBEAR_FW_FORTSTERLING_BABY",
		name: "Elite Winter Bear Cub",
		group: "breed",
		place: "kennel",
		tier: 8,
		actions: 6,
		growHours: 284,
		nutritionMax: 19728,
		secondsPerNutrition: 8.77,
		food: "meat",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: 0,
		careBonus: .025
	},
	{
		id: "T8_FARM_DRAKE_BABY",
		name: "Firewing Drake Egg",
		group: "breed",
		place: "kennel",
		tier: 8,
		actions: 14,
		growHours: 668,
		nutritionMax: 147696,
		secondsPerNutrition: 1.17,
		food: "mount",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: 0,
		careBonus: .004
	},
	{
		id: "T8_FARM_DIREWOLF_BABY",
		name: "Ghostwolf Pup",
		group: "breed",
		place: "kennel",
		tier: 8,
		actions: 6,
		growHours: 284,
		nutritionMax: 19728,
		secondsPerNutrition: 8.77,
		food: "meat",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: 0,
		careBonus: .025
	},
	{
		id: "T8_FARM_MAMMOTH_BABY",
		name: "Mammoth Calf",
		group: "breed",
		place: "kennel",
		tier: 8,
		actions: 6,
		growHours: 284,
		nutritionMax: 19728,
		secondsPerNutrition: 8.77,
		food: "plants",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: 0,
		careBonus: .025
	},
	{
		id: "T8_FARM_SPIDER_HELL_BABY",
		name: "Soulspinner Baby",
		group: "breed",
		place: "kennel",
		tier: 8,
		actions: 6,
		growHours: 284,
		nutritionMax: 19728,
		secondsPerNutrition: 8.77,
		food: "meat",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: 0,
		careBonus: .025
	},
	{
		id: "T8_FARM_RABBIT_EASTER_BABY",
		name: "Vibrant Spring Cottontail Egg",
		group: "breed",
		place: "kennel",
		tier: 8,
		actions: 1,
		growHours: 44,
		nutritionMax: 500,
		secondsPerNutrition: 316.8,
		food: "chocolate",
		favorite: "",
		favoriteName: "",
		favoriteBonus: 0,
		baseYield: 0,
		careBonus: .1
	}
];
var ISLAND_CITIES = [
	"Thetford",
	"Lymhurst",
	"Bridgewatch",
	"Martlock",
	"Fort Sterling",
	"Caerleon",
	"Brecilien"
];
/** Royal island +10%. Animal rows use the grown animal, which is the egg or milk bonus. */
var ISLAND_BONUS = {
	T1_FARM_CARROT_SEED: ["Lymhurst", "Brecilien"],
	T2_FARM_BEAN_SEED: ["Bridgewatch", "Brecilien"],
	T3_FARM_WHEAT_SEED: ["Martlock", "Brecilien"],
	T4_FARM_TURNIP_SEED: ["Fort Sterling", "Brecilien"],
	T5_FARM_CABBAGE_SEED: ["Thetford", "Brecilien"],
	T6_FARM_POTATO_SEED: ["Martlock", "Brecilien"],
	T7_FARM_CORN_SEED: ["Bridgewatch", "Brecilien"],
	T8_FARM_PUMPKIN_SEED: ["Lymhurst", "Brecilien"],
	T2_FARM_AGARIC_SEED: ["Thetford"],
	T3_FARM_COMFREY_SEED: ["Caerleon"],
	T4_FARM_BURDOCK_SEED: ["Lymhurst"],
	T5_FARM_TEASEL_SEED: ["Bridgewatch", "Caerleon"],
	T6_FARM_FOXGLOVE_SEED: ["Martlock"],
	T7_FARM_MULLEIN_SEED: ["Thetford", "Caerleon"],
	T8_FARM_YARROW_SEED: ["Fort Sterling"],
	T3_FARM_CHICKEN_BABY: ["Fort Sterling"],
	T4_FARM_GOAT_BABY: ["Bridgewatch"],
	T5_FARM_GOOSE_BABY: ["Lymhurst"],
	T6_FARM_SHEEP_BABY: ["Fort Sterling"],
	T8_FARM_COW_BABY: ["Martlock"]
};
function npcSeedPrice(tier) {
	return {
		1: 2e3,
		2: 3e3,
		3: 5e3,
		4: 7500,
		5: 1e4,
		6: 15e3,
		7: 22500,
		8: 3e4
	}[tier] ?? 0;
}
/** Grown item. The seed return tables use the same rates as the farming profit calculator. */
var CROP_PRODUCT = {
	T1_FARM_CARROT_SEED: {
		id: "T1_CARROT",
		name: "Carrot"
	},
	T2_FARM_BEAN_SEED: {
		id: "T2_BEAN",
		name: "Bean"
	},
	T3_FARM_WHEAT_SEED: {
		id: "T3_WHEAT",
		name: "Wheat"
	},
	T4_FARM_TURNIP_SEED: {
		id: "T4_TURNIP",
		name: "Turnip"
	},
	T5_FARM_CABBAGE_SEED: {
		id: "T5_CABBAGE",
		name: "Cabbage"
	},
	T6_FARM_POTATO_SEED: {
		id: "T6_POTATO",
		name: "Potatoes"
	},
	T7_FARM_CORN_SEED: {
		id: "T7_CORN",
		name: "Bunch of Corn"
	},
	T8_FARM_PUMPKIN_SEED: {
		id: "T8_PUMPKIN",
		name: "Pumpkin"
	},
	T2_FARM_AGARIC_SEED: {
		id: "T2_AGARIC",
		name: "Arcane Agaric"
	},
	T3_FARM_COMFREY_SEED: {
		id: "T3_COMFREY",
		name: "Brightleaf Comfrey"
	},
	T4_FARM_BURDOCK_SEED: {
		id: "T4_BURDOCK",
		name: "Crenellated Burdock"
	},
	T5_FARM_TEASEL_SEED: {
		id: "T5_TEASEL",
		name: "Dragon Teasel"
	},
	T6_FARM_FOXGLOVE_SEED: {
		id: "T6_FOXGLOVE",
		name: "Elusive Foxglove"
	},
	T7_FARM_MULLEIN_SEED: {
		id: "T7_MULLEIN",
		name: "Firetouched Mullein"
	},
	T8_FARM_YARROW_SEED: {
		id: "T8_YARROW",
		name: "Ghoul Yarrow"
	}
};
/** Average produce is 4.5. Premium doubles it. A matching island adds 10% to produce only. */
function produceEach(premium, islandBonus) {
	return 4.5 * (premium ? 2 : 1) * (islandBonus ? 1.1 : 1);
}
function farmProfit(row, count, premium, islandBonus, seedPrice, productPrice, wormPrice, focusEach) {
	const plants = Math.max(1, Math.floor(count));
	const grown = produceEach(premium, islandBonus);
	const watered = row.baseYield + row.careBonus * row.actions;
	const unwateredReplace = seedPrice * Math.max(0, 1 - row.baseYield);
	const wateredShort = Math.max(0, 1 - watered);
	const surplus = Math.max(0, watered - 1);
	const worms = .1 * wormPrice;
	const crop = grown * productPrice;
	const unwateredEach = crop + worms - unwateredReplace;
	const wateredEach = crop + worms + surplus * seedPrice - seedPrice * wateredShort;
	const gain = wateredEach - unwateredEach;
	return {
		grown,
		watered,
		unwateredReplace,
		surplus,
		unwateredEach,
		wateredEach,
		unwateredPlot: unwateredEach * plants,
		wateredPlot: wateredEach * plants,
		perFocus: focusEach > 0 ? gain / focusEach : 0
	};
}
function islandCities(id) {
	return ISLAND_BONUS[id] ?? [];
}
function farmFocusCost(farming, spec) {
	return Math.round(1e3 * Math.pow(.5, (Math.max(0, Math.min(100, farming)) + Math.max(0, Math.min(100, spec)) * 2) / 100));
}
var CROPS = FARM_ROWS.filter((row) => row.group === "crop" || row.group === "herb");
function FarmLab() {
	const [kind, setKind] = (0, import_react.useState)("farm");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-section",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeButton, {
				on: kind === "farm",
				title: "Farming",
				note: "Crops and herbs",
				onClick: () => setKind("farm")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeButton, {
				on: kind === "breed",
				title: "Animals",
				note: "Pasture, mounts, and kennels",
				onClick: () => setKind("breed")
			})]
		}), kind === "farm" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CropBoard, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimalBoard, {})]
	});
}
function CropBoard() {
	const [island, setIsland] = (0, import_react.useState)("Lymhurst");
	const [seedCity, setSeedCity] = (0, import_react.useState)("Fort Sterling");
	const [sellCity, setSellCity] = (0, import_react.useState)("Fort Sterling");
	const [premium, setPremium] = (0, import_react.useState)(true);
	const [cityBonus, setCityBonus] = (0, import_react.useState)(true);
	const [sellOrder, setSellOrder] = (0, import_react.useState)(true);
	const [buyOrder, setBuyOrder] = (0, import_react.useState)(true);
	const [merchant, setMerchant] = (0, import_react.useState)(false);
	const [watered, setWatered] = (0, import_react.useState)({});
	const [showYield, setShowYield] = (0, import_react.useState)(true);
	const [labels, setLabels] = (0, import_react.useState)(false);
	const [discount, setDiscount] = (0, import_react.useState)(0);
	const [worms, setWorms] = (0, import_react.useState)(0);
	const [specs, setSpecs] = (0, import_react.useState)({});
	const [cropMastery, setCropMastery] = (0, import_react.useState)(0);
	const [herbMastery, setHerbMastery] = (0, import_react.useState)(0);
	const [edit, setEdit] = (0, import_react.useState)(null);
	const [volume, setVolume] = (0, import_react.useState)(9);
	const [tab, setTab] = (0, import_react.useState)("all");
	const [sort, setSort] = (0, import_react.useState)("tier");
	const [book, setBook] = (0, import_react.useState)({});
	const [sold, setSold] = (0, import_react.useState)({});
	const [typed, setTyped] = (0, import_react.useState)({});
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [note, setNote] = (0, import_react.useState)("Prices come from the Asia data project. An empty city falls back to Albion Free Market.");
	const rows = (0, import_react.useMemo)(() => {
		const list = CROPS.filter((row) => tab === "all" || row.group === tab).map((row) => {
			const product = CROP_PRODUCT[row.id];
			const spec = specs[row.id] ?? 0;
			const watering = Boolean(watered[row.id]);
			const focusEach = farmFocusCost(row.group === "herb" ? herbMastery : cropMastery, spec);
			const bonus = cityBonus && islandCities(row.id).includes(island);
			const seedLive = quote(book, row.id, seedCity);
			const productLive = quote(book, product.id, sellCity);
			const seedUnit = merchant ? npcSeedPrice(row.tier) * (1 - Math.min(100, Math.max(0, discount)) / 100) : typed[row.id] ?? seedLive?.sell ?? 0;
			const productUnit = typed[product.id] ?? productLive?.sell ?? 0;
			const seedPay = merchant ? seedUnit : buyOrder ? seedUnit * (1 + SETUP_FEE) : seedUnit;
			const productNet = netSell(productUnit, premium, sellOrder);
			return {
				row,
				product,
				bonus,
				seedLive,
				productLive,
				priced: seedPay > 0 && productNet > 0 ? farmProfit(row, volume, premium, bonus, seedPay, productNet, worms, watering ? focusEach : 0) : null,
				watering,
				focusEach
			};
		});
		const rank = (row) => (row.watering ? row.priced?.wateredPlot : row.priced?.unwateredPlot) ?? Number.NEGATIVE_INFINITY;
		if (sort === "profit") list.sort((a, b) => rank(b) - rank(a));
		else if (sort === "name") list.sort((a, b) => a.row.name.localeCompare(b.row.name));
		else if (sort === "tier-desc") list.sort((a, b) => b.row.tier - a.row.tier);
		else list.sort((a, b) => a.row.tier - b.row.tier);
		return list;
	}, [
		book,
		buyOrder,
		cityBonus,
		cropMastery,
		discount,
		herbMastery,
		island,
		merchant,
		premium,
		seedCity,
		sellCity,
		sellOrder,
		sort,
		specs,
		tab,
		typed,
		volume,
		watered,
		worms
	]);
	async function load() {
		setLoading(true);
		setNote("Fetching live prices…");
		const ids = [...new Set(CROPS.flatMap((row) => [row.id, CROP_PRODUCT[row.id].id]))];
		try {
			const next = await pullPrices(ids, [seedCity, sellCity]);
			const history = await pullHistory(ids, [seedCity, sellCity], sellCity);
			setBook(applyAverage(next, history.fill, ids));
			setSold(history.sold);
			setNote("Sell orders first. An empty order uses Albion Free Market, then the latest daily average.");
		} catch (error) {
			setNote(error instanceof Error ? error.message : "Could not load prices");
		} finally {
			setLoading(false);
		}
	}
	const cropRows = CROPS.filter((row) => row.group === "crop");
	const herbRows = CROPS.filter((row) => row.group === "herb");
	const cropSum = cropRows.reduce((sum, row) => sum + (specs[row.id] ?? 0), 0);
	const herbSum = herbRows.reduce((sum, row) => sum + (specs[row.id] ?? 0), 0);
	const sellPct = premium ? "6.5%" : "10.5%";
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MasteryBar, {
					title: "Crop Farmer",
					value: cropSum,
					max: 800,
					open: edit === "crop",
					onEdit: () => setEdit(edit === "crop" ? null : "crop")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MasteryBar, {
					title: "Herbalist",
					value: herbSum,
					max: 700,
					open: edit === "herb",
					onEdit: () => setEdit(edit === "herb" ? null : "herb")
				})]
			}),
			edit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2 rounded-lg border border-line bg-panel p-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: edit === "crop" ? "Crop Farmer mastery" : "Herbalist mastery",
					min: 0,
					value: edit === "crop" ? cropMastery : herbMastery,
					onChange: (value) => edit === "crop" ? setCropMastery(Math.min(100, value)) : setHerbMastery(Math.min(100, value))
				}), (edit === "crop" ? cropRows : herbRows).map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: row.name.replace(" Seeds", ""),
					min: 0,
					value: specs[row.id] ?? 0,
					onChange: (value) => setSpecs({
						...specs,
						[row.id]: Math.min(100, value)
					})
				}, row.id))]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-x-3 gap-y-4 rounded-lg border border-line bg-panel p-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm text-muted",
						children: ["Earthworm price", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "mt-1 h-10 w-full rounded-lg border border-line bg-ink px-2 tabular-nums text-parchment",
							type: "number",
							min: 0,
							value: worms || "",
							placeholder: "0",
							onChange: (event) => setWorms(Number(event.target.value))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						label: "City bonus (+10%)",
						on: cityBonus,
						text: "Enabled",
						onClick: () => setCityBonus((on) => !on)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						label: "Premium",
						on: premium,
						text: "Enabled",
						onClick: () => setPremium((on) => !on)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						label: "Item labels",
						on: labels,
						text: "Enabled",
						onClick: () => setLabels((on) => !on)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						label: "Buy from merchant",
						on: merchant,
						text: "Enabled",
						onClick: () => setMerchant((on) => !on)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						label: `Sell order (+${sellPct})`,
						on: sellOrder,
						text: "Include taxes",
						onClick: () => setSellOrder((on) => !on)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm text-muted",
						children: ["Sort by", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "mt-1 h-10 w-full rounded-lg border border-line bg-ink px-2 text-parchment",
							value: sort,
							onChange: (event) => setSort(event.target.value),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "tier",
									children: "T1 → T8"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "tier-desc",
									children: "T8 → T1"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "profit",
									children: "Profit"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "name",
									children: "Name"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						label: "Seed yield details",
						on: showYield,
						text: "Enabled",
						onClick: () => setShowYield((on) => !on)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm text-muted",
						children: ["Global discount (%)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "mt-1 h-10 w-full rounded-lg border border-line bg-ink px-2 tabular-nums text-parchment",
							type: "number",
							min: 0,
							max: 100,
							value: discount || "",
							placeholder: "0",
							onChange: (event) => setDiscount(Math.min(100, Number(event.target.value)))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						label: "Buy order (+2.5%)",
						on: buyOrder,
						text: "Include taxes",
						onClick: () => setBuyOrder((on) => !on)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						label: "Island",
						value: island,
						onChange: (value) => setIsland(value),
						options: cityOptions()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						label: "Buy seeds from",
						value: seedCity,
						onChange: (value) => setSeedCity(value),
						options: cityOptions()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						label: "Sell products to",
						value: sellCity,
						onChange: (value) => setSellCity(value),
						options: cityOptions()
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void load(),
						className: "h-11 rounded-lg bg-brass px-3 text-sm font-semibold text-ink",
						children: loading ? "Loading" : "Fetch latest prices"
					}),
					[
						"all",
						"crop",
						"herb"
					].map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTab(id),
						className: "h-11 rounded-lg px-3 text-sm " + (tab === id ? "bg-brass text-ink" : "border border-line text-parchment"),
						children: id === "all" ? "Crops and herbs" : id === "crop" ? "Crops" : "Herbs"
					}, id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm text-muted",
						children: ["Plot size", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "ml-2 h-11 w-16 rounded-lg border border-line bg-ink px-2 tabular-nums text-parchment",
							type: "number",
							min: 1,
							value: volume,
							onChange: (event) => setVolume(Math.max(1, Number(event.target.value)))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted",
				children: [note, " Watering only changes the seeds that come back."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3",
				children: rows.map(({ row, product, bonus, seedLive, productLive, priced, watering, focusEach }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-lg border border-line bg-panel p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIcon, {
									id: row.id,
									size: 40
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate font-semibold text-parchment",
										children: labels ? row.name : `T${row.tier}`
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted",
										children: bonus ? "Island +10%" : "No city bonus"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setWatered((current) => ({
										...current,
										[row.id]: !watering
									})),
									className: "h-10 shrink-0 rounded-lg px-3 text-sm " + (watering ? "bg-brass text-ink" : "border border-line text-parchment"),
									children: watering ? "Watered" : "Water"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-right text-sm font-semibold tabular-nums " + (priced && (watering ? priced.wateredPlot : priced.unwateredPlot) < 0 ? "text-ember" : "text-sage"),
							children: [priced ? silver(watering ? priced.wateredPlot : priced.unwateredPlot) : "No data", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-2 text-xs font-normal text-muted",
								children: "plot"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 grid grid-cols-2 gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
									label: "Seed price",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceBox, {
										id: row.id,
										live: merchant ? npcSeedPrice(row.tier) : seedLive?.sell,
										typed,
										setTyped
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted",
										children: merchant ? "Merchant" : sourceLabel(seedLive)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
									label: "Product price",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "mb-1 flex items-center gap-1 text-xs text-muted",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIcon, {
												id: product.id,
												size: 20
											}), labels ? product.name : "Crop"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceBox, {
											id: product.id,
											live: productLive?.sell,
											typed,
											setTyped
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted",
											children: sourceLabel(productLive)
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Sold / day",
									children: sold[liveId(product.id)] ? exact(sold[liveId(product.id)]) : "—"
								}),
								watering ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Specialization",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: "h-11 w-full rounded-md border border-line bg-ink px-2 tabular-nums",
										type: "number",
										min: 0,
										max: 100,
										value: specs[row.id] || "",
										placeholder: "0",
										onChange: (event) => setSpecs({
											...specs,
											[row.id]: Math.min(100, Math.max(0, Number(event.target.value)))
										})
									})
								}) : null,
								watering ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Focus spent",
									children: exact(focusEach * volume)
								}) : null,
								showYield ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Seed yield",
									children: watering ? `${((row.baseYield + row.careBonus) * 100).toFixed(2)}%` : `${(row.baseYield * 100).toFixed(2)}%`
								}) : null
							]
						})
					]
				}, row.id))
			})
		]
	});
}
function AnimalBoard() {
	const [babyCity, setBabyCity] = (0, import_react.useState)("Fort Sterling");
	const [foodCity, setFoodCity] = (0, import_react.useState)("Fort Sterling");
	const [sellCity, setSellCity] = (0, import_react.useState)("Fort Sterling");
	const [premium, setPremium] = (0, import_react.useState)(true);
	const [sellOrder, setSellOrder] = (0, import_react.useState)(true);
	const [buyOrder, setBuyOrder] = (0, import_react.useState)(true);
	const [nurtured, setNurtured] = (0, import_react.useState)({});
	const [labels, setLabels] = (0, import_react.useState)(false);
	const [details, setDetails] = (0, import_react.useState)(true);
	const [showFarm, setShowFarm] = (0, import_react.useState)(true);
	const [showSaddled, setShowSaddled] = (0, import_react.useState)(true);
	const [showRare, setShowRare] = (0, import_react.useState)(true);
	const [mastery, setMastery] = (0, import_react.useState)(0);
	const [specs, setSpecs] = (0, import_react.useState)({});
	const [editMastery, setEditMastery] = (0, import_react.useState)(false);
	const [volume, setVolume] = (0, import_react.useState)(1);
	const [sort, setSort] = (0, import_react.useState)("tier");
	const [book, setBook] = (0, import_react.useState)({});
	const [sold, setSold] = (0, import_react.useState)({});
	const [typed, setTyped] = (0, import_react.useState)({});
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [note, setNote] = (0, import_react.useState)("Sell orders first. An empty order uses Albion Free Market, then the latest daily average.");
	const rows = (0, import_react.useMemo)(() => {
		const list = aog_animals_default.filter((row) => row.group === "farm" ? showFarm : row.group === "saddled" ? showSaddled : showRare).map((row) => {
			const babyLive = quote(book, row.id, babyCity);
			const foodLive = quote(book, row.foodId, foodCity);
			const grownLive = quote(book, row.grownId, sellCity);
			const baby = typed[row.id] ?? babyLive?.sell ?? 0;
			const food = typed[row.foodId] ?? foodLive?.sell ?? 0;
			const grown = typed[row.grownId] ?? grownLive?.sell ?? 0;
			const spec = specs[row.id] ?? 0;
			const each = farmFocusCost(mastery, spec);
			const care = Boolean(nurtured[row.id]);
			const growCost = (buyOrder ? baby * (1 + SETUP_FEE) : baby) + (buyOrder ? food * (1 + SETUP_FEE) : food) * row.totalFood;
			const known = baby > 0 && food > 0 && grown > 0;
			const chance = (care ? row.nurtured : row.offspring) / 100;
			return {
				row,
				babyLive,
				foodLive,
				grownLive,
				profitEach: known ? netSell(grown, premium, sellOrder) + chance * netSell(baby, premium, sellOrder) - growCost : null,
				care,
				focusSpent: each * row.cycles * volume
			};
		});
		if (sort === "profit") list.sort((a, b) => (b.profitEach ?? Number.NEGATIVE_INFINITY) - (a.profitEach ?? Number.NEGATIVE_INFINITY));
		else if (sort === "tier-desc") list.sort((a, b) => b.row.tier - a.row.tier || a.row.name.localeCompare(b.row.name));
		else if (sort === "name") list.sort((a, b) => a.row.name.localeCompare(b.row.name));
		else list.sort((a, b) => a.row.tier - b.row.tier || a.row.name.localeCompare(b.row.name));
		return list;
	}, [
		babyCity,
		book,
		buyOrder,
		foodCity,
		mastery,
		nurtured,
		premium,
		sellCity,
		sellOrder,
		showFarm,
		showRare,
		showSaddled,
		sort,
		specs,
		typed,
		volume
	]);
	async function load() {
		setLoading(true);
		setNote("Fetching live prices…");
		const ids = [...new Set(aog_animals_default.flatMap((row) => [
			row.id,
			row.foodId,
			row.grownId
		]))];
		try {
			const quotes = await pullPrices(ids, [
				babyCity,
				foodCity,
				sellCity
			]);
			const history = await pullHistory(ids, [
				babyCity,
				foodCity,
				sellCity
			], sellCity);
			setBook(applyAverage(quotes, history.fill, ids));
			setSold(history.sold);
			setNote("Sell orders first. An empty order uses Albion Free Market, then the latest daily average.");
		} catch (error) {
			setNote(error instanceof Error ? error.message : "Could not load prices");
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const sellPct = premium ? "6.5%" : "10.5%";
	const specSum = aog_animals_default.reduce((sum, row) => sum + (specs[row.id] ?? 0), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MasteryBar, {
				title: "Animal Breeder",
				value: specSum,
				max: aog_animals_default.length * 100,
				open: editMastery,
				onEdit: () => setEditMastery((open) => !open)
			}),
			editMastery ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 rounded-lg border border-line bg-panel p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
					label: "Animal Breeder mastery",
					min: 0,
					value: mastery,
					onChange: (value) => setMastery(Math.min(100, value))
				}), [
					["farm", "Pasture"],
					["saddled", "Horses and oxen"],
					["rare", "Rare mounts"]
				].map(([id, title]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "sm:col-span-2 text-sm font-semibold text-parchment",
						children: title
					}), aog_animals_default.filter((row) => row.group === id).map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: row.name,
						min: 0,
						value: specs[row.id] ?? 0,
						onChange: (value) => setSpecs({
							...specs,
							[row.id]: Math.min(100, value)
						})
					}, row.id))]
				}, id))]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-x-3 gap-y-4 rounded-lg border border-line bg-panel p-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm text-parchment",
						children: ["Sort by", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "mt-1 h-10 w-full rounded-lg border border-line bg-ink px-2",
							value: sort,
							onChange: (event) => setSort(event.target.value),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "tier",
									children: "T1 → T8"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "tier-desc",
									children: "T8 → T1"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "profit",
									children: "Profit"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "name",
									children: "Name"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						label: "Farm animals",
						on: showFarm,
						text: "Show animals",
						onClick: () => setShowFarm((on) => !on)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						label: "Rare animals",
						on: showRare,
						text: "Show animals",
						onClick: () => setShowRare((on) => !on)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						label: "Item labels",
						on: labels,
						text: "Enabled",
						onClick: () => setLabels((on) => !on)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						label: `Sell order (+${sellPct})`,
						on: sellOrder,
						text: "Include taxes",
						onClick: () => setSellOrder((on) => !on)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						label: "Premium",
						on: premium,
						text: "Enabled",
						onClick: () => setPremium((on) => !on)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						label: "Saddled animals",
						on: showSaddled,
						text: "Show animals",
						onClick: () => setShowSaddled((on) => !on)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						label: "Breeding details",
						on: details,
						text: "Enabled",
						onClick: () => setDetails((on) => !on)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						label: "Buy order (+2.5%)",
						on: buyOrder,
						text: "Include taxes",
						onClick: () => setBuyOrder((on) => !on)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-line bg-panel p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-sm font-semibold text-parchment",
					children: "Prices"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							label: "Buy baby animals from",
							value: babyCity,
							onChange: (value) => setBabyCity(value),
							options: cityOptions()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							label: "Buy food from",
							value: foodCity,
							onChange: (value) => setFoodCity(value),
							options: cityOptions()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							label: "Sell grown animals to",
							value: sellCity,
							onChange: (value) => setSellCity(value),
							options: cityOptions()
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => void load(),
					className: "h-11 rounded-lg bg-brass px-3 text-sm font-semibold text-ink",
					children: loading ? "Loading" : "Fetch latest prices"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm text-muted",
					children: ["Count", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "ml-2 h-11 w-16 rounded-lg border border-line bg-ink px-2 tabular-nums text-parchment",
						type: "number",
						min: 1,
						value: volume,
						onChange: (event) => setVolume(Math.max(1, Number(event.target.value)))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: note
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3",
				children: rows.map(({ row, babyLive, foodLive, grownLive, profitEach, care, focusSpent }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-lg border border-line bg-panel p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIcon, {
									id: row.id,
									size: 40
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate font-semibold text-parchment",
										children: labels ? row.name : `T${row.tier}`
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-xs text-muted",
										children: labels ? row.grownName : "Grown animal"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setNurtured((current) => ({
										...current,
										[row.id]: !care
									})),
									className: "h-10 shrink-0 rounded-lg px-3 text-sm " + (care ? "bg-brass text-ink" : "border border-line text-parchment"),
									children: care ? "Nurtured" : "Nurture"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-right text-sm font-semibold tabular-nums " + (profitEach != null && profitEach < 0 ? "text-ember" : "text-sage"),
							children: [profitEach == null ? "No data" : silver(profitEach * volume), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-2 text-xs font-normal text-muted",
								children: care ? `${row.nurtured}%` : `${row.offspring}% offspring`
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 grid grid-cols-2 gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
									label: "Baby price",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceBox, {
										id: row.id,
										live: babyLive?.sell,
										typed,
										setTyped
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted",
										children: sourceLabel(babyLive)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
									label: "Grown price",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "mb-1 flex items-center gap-1 text-xs text-muted",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIcon, {
												id: row.grownId,
												size: 20
											}), sold[liveId(row.grownId)] ? `${exact(sold[liveId(row.grownId)])} / day` : "Sold / day —"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceBox, {
											id: row.grownId,
											live: grownLive?.sell,
											typed,
											setTyped
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted",
											children: sourceLabel(grownLive)
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
									label: labels ? row.foodName : "Food price",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "mb-1 flex items-center gap-1 text-xs text-muted",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIcon, {
													id: row.foodId,
													size: 20
												}),
												exact(row.totalFood),
												" food"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceBox, {
											id: row.foodId,
											live: foodLive?.sell,
											typed,
											setTyped
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted",
											children: sourceLabel(foodLive)
										})
									]
								}),
								care ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Specialization",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: "h-11 w-full rounded-md border border-line bg-ink px-2 tabular-nums",
										type: "number",
										min: 0,
										max: 100,
										value: specs[row.id] || "",
										placeholder: "0",
										onChange: (event) => setSpecs({
											...specs,
											[row.id]: Math.min(100, Math.max(0, Number(event.target.value)))
										})
									})
								}) : null,
								care ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Focus spent",
									children: exact(focusSpent)
								}) : null,
								details ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
									label: "Raise",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: span(row.hours) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted",
											children: care ? `${row.nurtured}% nurtured` : `${row.offspring}% offspring`
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted",
											children: [
												exact(row.perCycle),
												" × ",
												exact(row.cycles),
												" feeds"
											]
										})
									]
								}) : null
							]
						})
					]
				}, row.id))
			})
		]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 tabular-nums text-parchment",
			children
		})]
	});
}
function MasteryBar({ title, value, max, open, onEdit }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-2 rounded-lg border border-line bg-panel px-3 py-2 sm:flex-row sm:items-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "min-w-0 flex-1 text-base font-semibold text-parchment",
			children: [
				title,
				" (",
				exact(value),
				"/",
				exact(max),
				")"
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onEdit,
			className: "h-9 rounded-md bg-brass px-3 text-sm font-semibold text-ink",
			children: open ? "Close" : "Edit masteries"
		})]
	});
}
function Switch({ label, on, text, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-parchment",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick,
			className: "mt-1 flex items-center gap-2 text-sm text-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "relative h-6 w-11 shrink-0 rounded-full " + (on ? "bg-brass" : "bg-panel-2"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-0.5 size-5 rounded-full bg-parchment " + (on ? "left-5" : "left-0.5") })
			}), text]
		})]
	});
}
function ModeButton({ on, title, note, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "rounded-lg border px-3 py-3 text-left " + (on ? "border-brass bg-panel" : "border-line bg-ink"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-xl text-parchment",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: note
		})]
	});
}
function PriceBox({ id, live, typed, setTyped }) {
	const value = typed[id] ?? live ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: "h-11 w-full rounded-md border border-line bg-ink px-2 tabular-nums",
		type: "number",
		min: 0,
		value: value || "",
		placeholder: "0",
		onChange: (event) => setTyped({
			...typed,
			[id]: Number(event.target.value)
		})
	});
}
function cityOptions() {
	return ISLAND_CITIES.map((name) => ({
		value: name,
		label: name
	}));
}
function quote(book, id, city) {
	return book[id]?.[city]?.["1"] ?? book[liveId(id)]?.[city]?.["1"];
}
function sourceLabel(row) {
	if (!row) return "No data";
	if (row.type) return quoteNote(row);
	if (!row.sell) return "No data";
	if (row.buyDate === "avg") return `Average · ${row.sellDate ? row.sellDate : "daily"}`;
	return row.sellDate === "afm" ? "Free Market" : "Data Project";
}
function netSell(price, premium, sellOrder) {
	const tax = premium ? TAX_PREMIUM : TAX_STANDARD;
	const setup = sellOrder ? SETUP_FEE : 0;
	return price * (1 - tax - setup);
}
async function pullPrices(itemIds, locations) {
	const request = {
		server: "asia",
		itemIds,
		locations: [...new Set(locations)],
		qualities: [1]
	};
	try {
		return (await fetchMarketPrices({ data: request })).quotes;
	} catch {
		return (await loadMarketPrices(request)).quotes;
	}
}
async function pullHistory(ids, cities, soldCity) {
	const sold = {};
	const fill = [];
	const loc = [...new Set(cities)].map((city) => encodeURIComponent(city)).join(",");
	for (let index = 0; index < ids.length; index += 15) {
		const chunk = ids.slice(index, index + 15).map(liveId);
		const url = marketStatsUrl("history", chunk.join(","), `locations=${loc}&qualities=1&time-scale=24`);
		const res = await fetch(url, {
			headers: {
				Accept: "application/json",
				"Accept-Encoding": "gzip, deflate"
			},
			signal: AbortSignal.timeout(12e3)
		}).catch(() => null);
		if (!res?.ok) continue;
		const body = await res.json().catch(() => null);
		if (!Array.isArray(body)) continue;
		for (const row of body) {
			const day = lastDay(row.data);
			if (!row.item_id || !row.location || !day || day.avg <= 0) continue;
			fill.push({
				id: row.item_id,
				city: row.location,
				price: day.avg,
				time: day.time
			});
			if (row.location === soldCity && day.count > 0) sold[row.item_id] = day.count;
		}
	}
	return {
		sold,
		fill
	};
}
function applyAverage(book, fill, ids) {
	const alias = new Map(ids.map((id) => [liveId(id), id]));
	const next = { ...book };
	for (const row of fill) {
		const id = alias.get(row.id) ?? row.id;
		const item = { ...next[id] ?? {} };
		const city = { ...item[row.city] ?? {} };
		const prev = city["1"];
		if (prev?.sell && prev.sell > 0) {
			item[row.city] = city;
			next[id] = item;
			continue;
		}
		city["1"] = {
			sell: row.price,
			buy: prev?.buy || 0,
			sellDate: row.time,
			buyDate: prev?.buy ? prev.buyDate : "avg",
			sellStock: prev?.sellStock,
			buyStock: prev?.buyStock
		};
		item[row.city] = city;
		next[id] = item;
	}
	return next;
}
function lastDay(data) {
	if (!data) return null;
	if (Array.isArray(data)) {
		const point = data[data.length - 1];
		if (!point) return null;
		return {
			count: point.item_count || 0,
			avg: point.avg_price || 0,
			time: point.timestamp || ""
		};
	}
	const last = (data.item_count?.length ?? 0) - 1;
	if (last < 0) return null;
	return {
		count: data.item_count?.[last] || 0,
		avg: data.prices_avg?.[last] || 0,
		time: data.timestamps?.[last] || ""
	};
}
function span(hours) {
	const total = Math.round(hours);
	const days = Math.floor(total / 24);
	const rest = total % 24;
	if (!days) return rest === 1 ? "1 hour" : `${rest} hours`;
	if (!rest) return days === 1 ? "1 day" : `${days} days`;
	return `${days}d ${rest}h`;
}
var TIERS$1 = [
	4,
	5,
	6,
	7,
	8
];
var ENCHANTS = [
	0,
	1,
	2,
	3,
	4
];
var SAVE_KEY = "hearthforge-flips";
var SECTIONS = [
	{
		id: "head",
		label: "Head",
		lines: [
			{
				id: "cloth_helmet",
				label: "Cloth Helmet"
			},
			{
				id: "leather_helmet",
				label: "Leather Helmet"
			},
			{
				id: "plate_helmet",
				label: "Plate Helmet"
			}
		]
	},
	{
		id: "body",
		label: "Armor",
		lines: [
			{
				id: "cloth_armor",
				label: "Cloth Armor"
			},
			{
				id: "leather_armor",
				label: "Leather Armor"
			},
			{
				id: "plate_armor",
				label: "Plate Armor"
			}
		]
	},
	{
		id: "feet",
		label: "Shoes",
		lines: [
			{
				id: "cloth_shoes",
				label: "Cloth Shoes"
			},
			{
				id: "leather_shoes",
				label: "Leather Shoes"
			},
			{
				id: "plate_shoes",
				label: "Plate Shoes"
			}
		]
	},
	{
		id: "weapon",
		label: "Weapons",
		lines: Object.entries(WEAPON_LINE).map(([id, line]) => ({
			id,
			label: line.label
		}))
	},
	{
		id: "offhand",
		label: "Off-hands",
		lines: [
			{
				id: "shield",
				label: "Shield"
			},
			{
				id: "torch",
				label: "Torch"
			},
			{
				id: "tome",
				label: "Tome"
			}
		]
	},
	{
		id: "accessory",
		label: "Bags & capes",
		lines: [{
			id: "bag",
			label: "Bag"
		}, {
			id: "cape",
			label: "Cape"
		}]
	},
	{
		id: "tool",
		label: "Tools",
		lines: [
			{
				id: "axe",
				label: "Axe"
			},
			{
				id: "pick",
				label: "Pickaxe"
			},
			{
				id: "sickle",
				label: "Sickle"
			},
			{
				id: "knife",
				label: "Skinning Knife"
			},
			{
				id: "hammer",
				label: "Stone Hammer"
			},
			{
				id: "fishingrod",
				label: "Fishing Rod"
			},
			{
				id: "siegehammer",
				label: "Siege Hammer"
			}
		]
	}
];
function loadSaved() {
	try {
		const raw = JSON.parse(localStorage.getItem(SAVE_KEY) || "[]");
		return Array.isArray(raw) ? raw : [];
	} catch {
		return [];
	}
}
function order(book, id, city, quality, side) {
	const quote = book[id]?.[city]?.[String(quality)] ?? book[liveId(id)]?.[city]?.[String(quality)];
	const price = side === "sell" ? quote?.sell : quote?.buy;
	return price && price > 0 ? price : null;
}
function pickKey(tier, enchant) {
	return `${tier}.${enchant}`;
}
function FlipLab() {
	const server = useForge((s) => s.server);
	const premium = useForge((s) => s.premium);
	const patch = useForge((s) => s.patch);
	const [picks, setPicks] = (0, import_react.useState)(["8.0"]);
	const [quality, setQuality] = (0, import_react.useState)(1);
	const [dealPath, setDealPath] = (0, import_react.useState)("listed");
	const [fromEnchant, setFromEnchant] = (0, import_react.useState)(0);
	const [query, setQuery] = (0, import_react.useState)("");
	const [saved, setSaved] = (0, import_react.useState)(loadSaved);
	const [book, setBook] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [rank, setRank] = (0, import_react.useState)("profit");
	const [page, setPage] = (0, import_react.useState)(0);
	const [picked, setPicked] = (0, import_react.useState)({});
	const [amounts, setAmounts] = (0, import_react.useState)({});
	const [planned, setPlanned] = (0, import_react.useState)(false);
	const [fetchedAt, setFetchedAt] = (0, import_react.useState)(null);
	const [pulse, setPulse] = (0, import_react.useState)(0);
	const [now, setNow] = (0, import_react.useState)(() => Date.now());
	const pickSet = (0, import_react.useMemo)(() => new Set(picks), [picks]);
	const tiers = (0, import_react.useMemo)(() => [...new Set(picks.map((pick) => Number(pick.split(".")[0])))], [picks]);
	(0, import_react.useEffect)(() => {
		localStorage.setItem(SAVE_KEY, JSON.stringify(saved));
	}, [saved]);
	(0, import_react.useEffect)(() => {
		if (!picks.length) return;
		let cancel = false;
		const timer = window.setTimeout(() => {
			(async () => {
				const pool = items.filter((item) => tiers.includes(item.tier) && gearLine(item));
				const ids = /* @__PURE__ */ new Set();
				for (const tier of tiers) {
					ids.add(`T${tier}_RUNE`);
					ids.add(`T${tier}_SOUL`);
					ids.add(`T${tier}_RELIC`);
				}
				for (const item of pool) for (const enchant of ENCHANTS) {
					if (!pickSet.has(pickKey(item.tier, enchant))) continue;
					ids.add(marketId(item.id, enchant));
					if (enchant > 1 && enchant < 4) ids.add(marketId(item.id, 1));
					if (enchant > 2 && enchant < 4) ids.add(marketId(item.id, 2));
					if (enchant > 0 && enchant < 4) ids.add(marketId(item.id, 0));
				}
				const idList = [...ids];
				if (!idList.length) return;
				const places = [...MARKETS];
				setLoading(true);
				setError("");
				try {
					const next = {};
					let got = 0;
					for (let index = 0; index < idList.length; index += 80) {
						const chunk = idList.slice(index, index + 80);
						const stones = chunk.filter((id) => /RUNE|SOUL|RELIC/.test(id));
						const gear = chunk.filter((id) => !/RUNE|SOUL|RELIC/.test(id));
						const requests = [...gear.length ? [{
							server,
							itemIds: gear,
							locations: places,
							qualities: [quality]
						}] : [], ...stones.length ? [{
							server,
							itemIds: stones,
							locations: places,
							qualities: [1]
						}] : []];
						for (const request of requests) {
							const marketBase = marketApiBase();
							const result = await fetchMarketPrices({ data: request });
							if (!marketBase) throw new Error("missing market base");
							Object.assign(next, result.quotes);
							got += Object.keys(result.quotes).length;
							if (cancel) return;
							if (Object.keys(result.quotes).length) setBook((prev) => ({
								...prev ?? {},
								...next
							}));
						}
					}
					if (!cancel) {
						setFetchedAt(Date.now());
						setError(got ? "" : "No live prices for these cities yet. Press Live prices to try again.");
					}
				} catch (err) {
					const message = err instanceof Error ? err.message : "Could not load flip prices";
					if (!cancel && !/busy|retry in a minute/i.test(message)) setError(message);
				} finally {
					if (!cancel) setLoading(false);
				}
			})();
		}, 250);
		return () => {
			cancel = true;
			window.clearTimeout(timer);
		};
	}, [
		server,
		quality,
		pickSet,
		tiers,
		picks.length,
		pulse
	]);
	(0, import_react.useEffect)(() => {
		setPage(0);
	}, [
		rank,
		quality,
		picks
	]);
	(0, import_react.useEffect)(() => {
		const timer = window.setInterval(() => setNow(Date.now()), 1e3);
		return () => window.clearInterval(timer);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!fetchedAt) return;
		const wait = Math.max(1e3, fetchedAt + 6e4 - Date.now());
		const timer = window.setTimeout(() => setPulse((value) => value + 1), wait);
		return () => window.clearTimeout(timer);
	}, [fetchedAt]);
	function hasPrice(item, enchant) {
		if (!book || !pickSet.has(pickKey(item.tier, enchant))) return false;
		const id = marketId(item.id, enchant);
		const quotes = book[id] ?? book[liveId(id)];
		if (!quotes) return false;
		return Object.values(quotes).some((cities) => {
			const quote = cities[String(quality)];
			return Boolean(quote && ((quote.sell || 0) > 0 || (quote.buy || 0) > 0));
		});
	}
	function pricedEnchants(item) {
		return ENCHANTS.filter((enchant) => hasPrice(item, enchant));
	}
	function variants(item) {
		const selected = pricedEnchants(item).length;
		return {
			selected,
			total: selected
		};
	}
	function itemsFor(line, needle) {
		return items.filter((item) => {
			if (gearLine(item) !== line) return false;
			if (!tiers.includes(item.tier)) return false;
			if (needle && !item.name.toLowerCase().includes(needle)) return false;
			return pricedEnchants(item).length > 0;
		});
	}
	const needle = query.trim().toLowerCase();
	const tree = SECTIONS.map((section) => {
		const lines = section.lines.map((line) => {
			const rows = itemsFor(line.id, needle);
			const selected = rows.reduce((sum, item) => sum + variants(item).selected, 0);
			const total = rows.reduce((sum, item) => sum + variants(item).total, 0);
			return {
				...line,
				rows,
				selected,
				total
			};
		}).filter((line) => line.rows.length);
		return {
			...section,
			lines,
			selected: lines.reduce((sum, line) => sum + line.selected, 0),
			total: lines.reduce((sum, line) => sum + line.total, 0)
		};
	}).filter((section) => section.lines.length);
	const shownCount = tree.reduce((sum, section) => sum + section.lines.reduce((inner, line) => inner + line.rows.length, 0), 0);
	const left = fetchedAt ? Math.max(0, Math.ceil((fetchedAt + 6e4 - now) / 1e3)) : 0;
	const leftLabel = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
	function togglePick(key) {
		setPicks((current) => current.includes(key) ? current.filter((pick) => pick !== key) : [...current, key]);
	}
	function saveRoute() {
		const next = {
			id: `${Date.now()}`,
			name: "All cities",
			buy: "all",
			sell: "all",
			picks: [...picks]
		};
		setSaved((current) => [next, ...current].slice(0, 12));
	}
	function flipDeal(item, enchant) {
		if (!book) return null;
		const upgrade = dealPath === "upgrade" && enchant > fromEnchant && enchant < 4;
		const stones = upgrade ? enchantStones(item, enchant).filter((stone) => {
			return (stone.id.includes("RELIC") ? 3 : stone.id.includes("SOUL") ? 2 : 1) > fromEnchant;
		}) : [];
		const marketOnly = !upgrade || stones.length === 0;
		const buyId = marketOnly ? marketId(item.id, enchant) : marketId(item.id, fromEnchant);
		const sellId = marketId(item.id, enchant);
		let best = null;
		for (const buyCity of MARKETS) {
			const buyPrice = order(book, buyId, buyCity, quality, "sell");
			if (buyPrice == null) continue;
			let extra = 0;
			let missingStone = false;
			for (const stone of marketOnly ? [] : stones) {
				const unit = order(book, stone.id, buyCity, 1, "sell");
				if (unit == null) {
					missingStone = true;
					break;
				}
				extra += stackBuy(unit, stone.qty, "instant").cost;
			}
			if (missingStone) continue;
			for (const sellCity of MARKETS) {
				if (sellCity === buyCity) continue;
				const sellPrice = order(book, sellId, sellCity, quality, "buy");
				if (sellPrice == null) continue;
				const bought = stackBuy(buyPrice, 1, "instant");
				const sold = stackSell(sellPrice, 1, "instant", premium);
				const investment = bought.cost + extra;
				const fee = sold.tax + sold.setup;
				const profit = sold.net - investment;
				const roi = investment > 0 ? profit / investment : 0;
				const quote = book[buyId]?.[buyCity]?.[String(quality)] || book[liveId(buyId)]?.[buyCity]?.[String(quality)];
				const stamp = quote?.type === "EMV" ? "EMV" : quote?.type === "None" || !quote ? "No data" : formatTimeAgo(quote.updatedAt || quote.sellDate || null);
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
					sellCity
				};
				if (!best || (rank === "roi" ? next.roi > best.roi : next.profit > best.profit)) best = next;
			}
		}
		return best;
	}
	const flips = tree.flatMap((section) => section.lines.flatMap((line) => line.rows)).flatMap((item) => pricedEnchants(item).flatMap((enchant) => {
		const deal = flipDeal(item, enchant);
		return deal ? [{
			id: item.id,
			name: item.name,
			tier: item.tier,
			enchant,
			...deal
		}] : [];
	})).sort((a, b) => rank === "roi" ? b.roi - a.roi : b.profit - a.profit).slice(0, 100);
	const pageCount = Math.max(1, Math.ceil(flips.length / 20));
	const safePage = Math.min(page, pageCount - 1);
	const view = flips.slice(safePage * 20, safePage * 20 + 20);
	function rowMoney(row, count) {
		const sold = stackSell(row.sell, count, "instant", premium);
		const investment = stackBuy(row.buy, count, "instant").cost + row.extra * count;
		const tax = sold.tax;
		const profit = sold.net - investment;
		return {
			investment,
			tax,
			profit,
			roi: investment > 0 ? profit / investment : 0
		};
	}
	const targetEnchant = picks.reduce((highest, pick) => Math.max(highest, Number(pick.split(".")[1]) || 0), 0);
	const startOptions = [
		0,
		1,
		2
	].filter((start) => start < targetEnchant && targetEnchant < 4);
	const taxRate = premium ? TAX_PREMIUM : TAX_STANDARD;
	function pathLabel(tier, enchant, from) {
		if (from == null) return `T${tier}.${enchant}`;
		return `T${tier}.${from} to T${tier}.${enchant}`;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col overflow-hidden rounded-lg border border-line bg-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-b border-line bg-panel px-3 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mr-2 text-xs text-muted",
						children: "Best flip"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setRank("profit"),
						className: "h-10 rounded-md border px-3 text-sm " + (rank === "profit" ? "border-brass bg-brass text-ink" : "border-line text-muted"),
						children: "Best profit"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setRank("roi"),
						className: "h-10 rounded-md border px-3 text-sm " + (rank === "roi" ? "border-brass bg-brass text-ink" : "border-line text-muted"),
						children: "Best ROI"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => patch({ premium: true }),
						className: "h-10 rounded-md border px-3 text-sm " + (premium ? "border-brass bg-brass text-ink" : "border-line text-muted"),
						children: "Premium"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => patch({ premium: false }),
						className: "h-10 rounded-md border px-3 text-sm " + (!premium ? "border-brass bg-brass text-ink" : "border-line text-muted"),
						children: "No premium"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "ml-auto text-xs text-muted",
						children: [flips.length, " of the top 100"]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs text-muted",
				children: [
					"Sell tax is ",
					pct(taxRate),
					" ",
					premium ? "with premium" : "without premium",
					", including the Black Market. It is taken off the sell price before profit. No setup fee, because the flip sells into a buy order."
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-0 flex-1 flex-col lg:flex-row",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "flex w-full shrink-0 flex-col border-b border-line bg-panel lg:w-64 lg:border-r lg:border-b-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-b border-line px-3 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-semibold tracking-wide text-muted uppercase",
							children: "Flip route"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-[12px] text-muted",
							children: "All cities are compared. Each row shows the city to buy in."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-b border-line px-3 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center justify-between",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] font-semibold tracking-wide text-muted uppercase",
									children: "Item filters"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-center justify-between text-[11px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted",
									children: "Tier & enchantment"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-brass",
									onClick: () => setPicks(picks.length === TIERS$1.length * ENCHANTS.length ? [] : TIERS$1.flatMap((tier) => ENCHANTS.map((enchant) => pickKey(tier, enchant)))),
									children: picks.length === TIERS$1.length * ENCHANTS.length ? "Clear" : "Select all"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex flex-col gap-1",
								children: TIERS$1.map((tier) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-5 gap-1",
									children: ENCHANTS.map((enchant) => {
										const key = pickKey(tier, enchant);
										const on = pickSet.has(key);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => togglePick(key),
											className: "h-7 rounded-md border text-[11px] " + (on ? "border-brass bg-brass text-ink" : "border-line bg-ink text-muted"),
											children: [
												tier,
												".",
												enchant
											]
										}, key);
									})
								}, tier))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-[11px] text-muted",
								children: [
									picks.length,
									" tier/enchant group",
									picks.length === 1 ? "" : "s",
									" selected"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setDealPath("listed"),
									className: "h-10 rounded-md border px-2 text-[11px] " + (dealPath === "listed" ? "border-brass bg-brass text-ink" : "border-line text-muted"),
									children: "Buy this enchant"
								}), startOptions.map((start) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setDealPath("upgrade");
										setFromEnchant(start);
									},
									className: "h-10 rounded-md border px-2 text-[11px] " + (dealPath === "upgrade" && fromEnchant === start ? "border-brass bg-brass text-ink" : "border-line text-muted"),
									children: ["Upgrade from .", start]
								}, start))]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-[11px] text-muted",
								children: dealPath === "listed" || !startOptions.length ? "Uses the live price of the enchant you pick." : `Buys the .${fromEnchant} item plus only the stones still needed, then sells the enchant you picked.`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-3 block text-[11px] text-muted",
								children: ["Quality", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "h-9 w-full rounded-md border border-line bg-ink px-2 text-sm text-parchment outline-none mt-1",
									value: quality,
									onChange: (event) => setQuality(Number(event.target.value)),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: 1,
											children: "Normal"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: 2,
											children: "Good"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: 3,
											children: "Outstanding"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: 4,
											children: "Excellent"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: 5,
											children: "Masterpiece"
										})
									]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-3 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-semibold tracking-wide text-muted uppercase",
								children: "Saved configs"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: saveRoute,
								"aria-label": "Save this route",
								className: "grid size-6 place-items-center rounded text-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
							})]
						}), saved.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 text-[12px] text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No saved configurations yet." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3",
								children: "Configurations are saved on this device."
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 flex flex-col gap-1",
							children: saved.map((config) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setPicks(config.picks),
								className: "w-full rounded-md px-2 py-1.5 text-left text-xs text-parchment hover:bg-panel-2",
								children: config.name
							}) }, config.id))
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 border-b border-line px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "relative min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: query,
								onChange: (event) => setQuery(event.target.value),
								placeholder: "Search flip items...",
								className: "h-10 w-full rounded-lg border border-line bg-ink pr-3 pl-9 text-sm text-parchment outline-none"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "shrink-0 text-xs text-muted",
							children: loading ? "Loading prices" : `${shownCount} with prices`
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3 border-b border-line px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [fetchedAt ? `Live order book, refreshed ${new Date(fetchedAt).toLocaleTimeString()}. Next check in ${leftLabel}.` : "Fetching the live order book.", loading && fetchedAt != null ? " Updating." : ""]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setPulse((value) => value + 1),
							className: "inline-flex h-11 items-center gap-2 rounded-lg bg-brass px-3 text-sm font-semibold text-ink",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4 " + (loading ? "animate-spin" : "") }), loading && fetchedAt == null ? "Loading" : "Live prices"]
						})]
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-4 py-2 text-sm text-ember",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "flex flex-col gap-2 p-3 md:hidden",
						children: [view.map((row) => {
							const key = `${row.id}|${row.enchant}`;
							const count = Math.max(1, amounts[key] ?? 1);
							const money = rowMoney(row, count);
							const on = Boolean(picked[key]);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-lg border border-line p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: on,
												onChange: () => setPicked((current) => ({
													...current,
													[key]: !current[key]
												})),
												"aria-label": `Pick ${row.name}`,
												className: "mt-1 size-5 accent-brass"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex min-w-0 flex-1 items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIcon, {
													id: row.id,
													enchant: row.enchant,
													quality,
													size: 40
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "min-w-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "font-medium text-parchment",
														children: [
															row.name,
															" ",
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: "text-muted",
																children: [
																	"[",
																	itemMark(row.id, row.enchant),
																	"]"
																]
															})
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-xs text-muted",
														children: [
															pathLabel(row.tier, row.enchant, row.from),
															" · ",
															row.age || "no age"
														]
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-right text-sm font-semibold tabular-nums " + (money.profit >= 0 ? "text-sage" : "text-ember"),
												children: [silver(money.profit), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "block text-xs font-normal text-muted",
													children: pct(money.roi)
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
										className: "mt-3 grid grid-cols-2 gap-2 text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
												className: "text-muted",
												children: ["Buy in ", row.buyCity]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
												className: "tabular-nums",
												children: silver(row.buy)
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
												className: "text-muted",
												children: ["Sell in ", row.sellCity]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
												className: "tabular-nums",
												children: silver(row.sell)
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
												className: "text-muted",
												children: "Investment"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
												className: "tabular-nums",
												children: silver(money.investment)
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", {
												className: "text-muted",
												children: ["Tax ", pct(taxRate)]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
												className: "tabular-nums",
												children: silver(money.tax)
											})] })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "mt-3 flex items-center justify-between gap-3 text-xs text-muted",
										children: ["Buy qty", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: count,
											inputMode: "numeric",
											onChange: (event) => setAmounts((current) => ({
												...current,
												[key]: Math.max(1, Number(event.target.value) || 1)
											})),
											className: "h-11 w-20 rounded-md border border-line bg-ink px-2 text-right text-base text-parchment tabular-nums"
										})]
									})
								]
							}, key);
						}), view.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "px-1 py-6 text-sm text-muted",
							children: "No priced flip for this route yet."
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden overflow-x-auto md:block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[980px] text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "text-[11px] tracking-wide text-muted uppercase",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-line",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "w-8 px-3 py-2" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-2 py-2 font-medium",
											children: "Item / tier / quality"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-2 py-2 font-medium",
											children: "Buy in"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-2 py-2 font-medium",
											children: "Sell in"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-2 py-2 font-medium",
											children: "Investment"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
											className: "px-2 py-2 font-medium",
											children: ["Tax ", pct(taxRate)]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-2 py-2 font-medium",
											children: "Profit"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-2 py-2 font-medium",
											children: "ROI"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-2 py-2 font-medium",
											children: "Volume 7d"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-2 py-2 font-medium",
											children: "Buy qty"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-2 py-2 font-medium",
											children: "Age"
										})
									]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: view.map((row) => {
								const key = `${row.id}|${row.enchant}`;
								const count = Math.max(1, amounts[key] ?? 1);
								const money = rowMoney(row, count);
								const on = Boolean(picked[key]);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-line",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: on,
												onChange: () => setPicked((current) => ({
													...current,
													[key]: !current[key]
												})),
												"aria-label": `Pick ${row.name}`,
												className: "size-4 accent-brass"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2 py-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIcon, {
													id: row.id,
													enchant: row.enchant,
													quality,
													size: 40
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "font-medium text-parchment",
													children: [
														row.name,
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-muted",
															children: [
																"[",
																itemMark(row.id, row.enchant),
																"]"
															]
														})
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-muted",
													children: pathLabel(row.tier, row.enchant, row.from)
												})] })]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-2 py-3 tabular-nums",
											children: [silver(row.buy), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-xs text-brass",
												children: row.buyCity
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-2 py-3 tabular-nums",
											children: [silver(row.sell), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-xs text-muted",
												children: row.sellCity
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2 py-3 tabular-nums",
											children: silver(money.investment)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2 py-3 tabular-nums text-muted",
											children: silver(money.tax)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2 py-3 font-semibold tabular-nums " + (money.profit >= 0 ? "text-sage" : "text-ember"),
											children: silver(money.profit)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2 py-3 tabular-nums",
											children: pct(money.roi)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2 py-3 text-muted",
											children: "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2 py-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												value: count,
												inputMode: "numeric",
												onChange: (event) => setAmounts((current) => ({
													...current,
													[key]: Math.max(1, Number(event.target.value) || 1)
												})),
												className: "h-9 w-16 rounded-md border border-line bg-ink px-2 text-right tabular-nums"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2 py-3 text-xs text-muted",
											children: row.age || "—"
										})
									]
								}, key);
							}) })]
						}), view.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-4 py-6 text-sm text-muted",
							children: "No priced flip for this route yet."
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3 border-t border-line px-3 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: safePage === 0,
									onClick: () => setPage(safePage - 1),
									className: "h-10 rounded-md border border-line px-3 text-sm disabled:opacity-40",
									children: "Prev"
								}),
								Array.from({ length: pageCount }, (_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setPage(index),
									className: "h-10 min-w-10 rounded-md border px-2 text-sm " + (index === safePage ? "border-brass bg-brass text-ink" : "border-line text-muted"),
									children: index + 1
								}, index)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: safePage >= pageCount - 1,
									onClick: () => setPage(safePage + 1),
									className: "h-10 rounded-md border border-line px-3 text-sm disabled:opacity-40",
									children: "Next"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setPlanned(true),
							className: "h-11 w-full rounded-md bg-brass px-3 text-sm font-semibold text-ink sm:w-auto",
							children: "Calculate picked flips"
						})]
					}),
					planned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-t border-line px-3 py-3 text-sm",
						children: (() => {
							const chosen = flips.filter((row) => picked[`${row.id}|${row.enchant}`]);
							if (!chosen.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted",
								children: "Pick at least one item."
							});
							const totals = chosen.reduce((sum, row) => {
								const money = rowMoney(row, Math.max(1, amounts[`${row.id}|${row.enchant}`] ?? 1));
								return {
									investment: sum.investment + money.investment,
									tax: sum.tax + money.tax,
									profit: sum.profit + money.profit
								};
							}, {
								investment: 0,
								tax: 0,
								profit: 0
							});
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								chosen.length,
								" picked · investment ",
								silver(totals.investment),
								" · tax ",
								silver(totals.tax),
								" · profit",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: totals.profit >= 0 ? "text-sage" : "text-ember",
									children: silver(totals.profit)
								}),
								" · ",
								pct(totals.investment > 0 ? totals.profit / totals.investment : 0),
								" ROI"
							] });
						})()
					}) : null
				]
			})]
		})]
	});
}
var labor_loot_default = {
	WARRIOR: {
		"2": {
			"amount": 38,
			"items": [
				{
					"id": "T2_METALBAR",
					"weight": 13223
				},
				{
					"id": "T2_METALBAR_LEVEL1@1",
					"weight": 700
				},
				{
					"id": "T2_METALBAR_LEVEL2@2",
					"weight": 70
				},
				{
					"id": "T2_METALBAR_LEVEL3@3",
					"weight": 7
				},
				{
					"id": "T2_PLANKS",
					"weight": 3778
				},
				{
					"id": "T2_PLANKS_LEVEL1@1",
					"weight": 200
				},
				{
					"id": "T2_PLANKS_LEVEL2@2",
					"weight": 20
				},
				{
					"id": "T2_PLANKS_LEVEL3@3",
					"weight": 2
				},
				{
					"id": "T2_CLOTH",
					"weight": 1889
				},
				{
					"id": "T2_CLOTH_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T2_CLOTH_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T2_CLOTH_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"3": {
			"amount": 24,
			"items": [
				{
					"id": "T3_METALBAR",
					"weight": 13223
				},
				{
					"id": "T3_METALBAR_LEVEL1@1",
					"weight": 700
				},
				{
					"id": "T3_METALBAR_LEVEL2@2",
					"weight": 70
				},
				{
					"id": "T3_METALBAR_LEVEL3@3",
					"weight": 7
				},
				{
					"id": "T3_PLANKS",
					"weight": 3778
				},
				{
					"id": "T3_PLANKS_LEVEL1@1",
					"weight": 200
				},
				{
					"id": "T3_PLANKS_LEVEL2@2",
					"weight": 20
				},
				{
					"id": "T3_PLANKS_LEVEL3@3",
					"weight": 2
				},
				{
					"id": "T3_CLOTH",
					"weight": 1889
				},
				{
					"id": "T3_CLOTH_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T3_CLOTH_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T3_CLOTH_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"4": {
			"amount": 16,
			"items": [
				{
					"id": "T4_METALBAR",
					"weight": 13223
				},
				{
					"id": "T4_METALBAR_LEVEL1@1",
					"weight": 700
				},
				{
					"id": "T4_METALBAR_LEVEL2@2",
					"weight": 70
				},
				{
					"id": "T4_METALBAR_LEVEL3@3",
					"weight": 7
				},
				{
					"id": "T4_PLANKS",
					"weight": 3778
				},
				{
					"id": "T4_PLANKS_LEVEL1@1",
					"weight": 200
				},
				{
					"id": "T4_PLANKS_LEVEL2@2",
					"weight": 20
				},
				{
					"id": "T4_PLANKS_LEVEL3@3",
					"weight": 2
				},
				{
					"id": "T4_CLOTH",
					"weight": 1889
				},
				{
					"id": "T4_CLOTH_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T4_CLOTH_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T4_CLOTH_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"5": {
			"amount": 8,
			"items": [
				{
					"id": "T5_METALBAR",
					"weight": 13223
				},
				{
					"id": "T5_METALBAR_LEVEL1@1",
					"weight": 700
				},
				{
					"id": "T5_METALBAR_LEVEL2@2",
					"weight": 70
				},
				{
					"id": "T5_METALBAR_LEVEL3@3",
					"weight": 7
				},
				{
					"id": "T5_PLANKS",
					"weight": 3778
				},
				{
					"id": "T5_PLANKS_LEVEL1@1",
					"weight": 200
				},
				{
					"id": "T5_PLANKS_LEVEL2@2",
					"weight": 20
				},
				{
					"id": "T5_PLANKS_LEVEL3@3",
					"weight": 2
				},
				{
					"id": "T5_CLOTH",
					"weight": 1889
				},
				{
					"id": "T5_CLOTH_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T5_CLOTH_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T5_CLOTH_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"6": {
			"amount": 5.3333,
			"items": [
				{
					"id": "T6_METALBAR",
					"weight": 13223
				},
				{
					"id": "T6_METALBAR_LEVEL1@1",
					"weight": 700
				},
				{
					"id": "T6_METALBAR_LEVEL2@2",
					"weight": 70
				},
				{
					"id": "T6_METALBAR_LEVEL3@3",
					"weight": 7
				},
				{
					"id": "T6_PLANKS",
					"weight": 3778
				},
				{
					"id": "T6_PLANKS_LEVEL1@1",
					"weight": 200
				},
				{
					"id": "T6_PLANKS_LEVEL2@2",
					"weight": 20
				},
				{
					"id": "T6_PLANKS_LEVEL3@3",
					"weight": 2
				},
				{
					"id": "T6_CLOTH",
					"weight": 1889
				},
				{
					"id": "T6_CLOTH_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T6_CLOTH_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T6_CLOTH_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"7": {
			"amount": 4.4,
			"items": [
				{
					"id": "T7_METALBAR",
					"weight": 13223
				},
				{
					"id": "T7_METALBAR_LEVEL1@1",
					"weight": 700
				},
				{
					"id": "T7_METALBAR_LEVEL2@2",
					"weight": 70
				},
				{
					"id": "T7_METALBAR_LEVEL3@3",
					"weight": 7
				},
				{
					"id": "T7_PLANKS",
					"weight": 3778
				},
				{
					"id": "T7_PLANKS_LEVEL1@1",
					"weight": 200
				},
				{
					"id": "T7_PLANKS_LEVEL2@2",
					"weight": 20
				},
				{
					"id": "T7_PLANKS_LEVEL3@3",
					"weight": 2
				},
				{
					"id": "T7_CLOTH",
					"weight": 1889
				},
				{
					"id": "T7_CLOTH_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T7_CLOTH_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T7_CLOTH_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"8": {
			"amount": 4.2,
			"items": [
				{
					"id": "T8_METALBAR",
					"weight": 13223
				},
				{
					"id": "T8_METALBAR_LEVEL1@1",
					"weight": 700
				},
				{
					"id": "T8_METALBAR_LEVEL2@2",
					"weight": 70
				},
				{
					"id": "T8_METALBAR_LEVEL3@3",
					"weight": 7
				},
				{
					"id": "T8_PLANKS",
					"weight": 3778
				},
				{
					"id": "T8_PLANKS_LEVEL1@1",
					"weight": 200
				},
				{
					"id": "T8_PLANKS_LEVEL2@2",
					"weight": 20
				},
				{
					"id": "T8_PLANKS_LEVEL3@3",
					"weight": 2
				},
				{
					"id": "T8_CLOTH",
					"weight": 1889
				},
				{
					"id": "T8_CLOTH_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T8_CLOTH_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T8_CLOTH_LEVEL3@3",
					"weight": 1
				}
			]
		}
	},
	HUNTER: {
		"2": {
			"amount": 38,
			"items": [
				{
					"id": "T2_LEATHER",
					"weight": 9445
				},
				{
					"id": "T2_LEATHER_LEVEL1@1",
					"weight": 500
				},
				{
					"id": "T2_LEATHER_LEVEL2@2",
					"weight": 50
				},
				{
					"id": "T2_LEATHER_LEVEL3@3",
					"weight": 5
				},
				{
					"id": "T2_PLANKS",
					"weight": 5667
				},
				{
					"id": "T2_PLANKS_LEVEL1@1",
					"weight": 300
				},
				{
					"id": "T2_PLANKS_LEVEL2@2",
					"weight": 30
				},
				{
					"id": "T2_PLANKS_LEVEL3@3",
					"weight": 3
				},
				{
					"id": "T2_METALBAR",
					"weight": 5667
				},
				{
					"id": "T2_METALBAR_LEVEL1@1",
					"weight": 300
				},
				{
					"id": "T2_METALBAR_LEVEL2@2",
					"weight": 30
				},
				{
					"id": "T2_METALBAR_LEVEL3@3",
					"weight": 3
				}
			]
		},
		"3": {
			"amount": 24,
			"items": [
				{
					"id": "T3_LEATHER",
					"weight": 9445
				},
				{
					"id": "T3_LEATHER_LEVEL1@1",
					"weight": 500
				},
				{
					"id": "T3_LEATHER_LEVEL2@2",
					"weight": 50
				},
				{
					"id": "T3_LEATHER_LEVEL3@3",
					"weight": 5
				},
				{
					"id": "T3_PLANKS",
					"weight": 5667
				},
				{
					"id": "T3_PLANKS_LEVEL1@1",
					"weight": 300
				},
				{
					"id": "T3_PLANKS_LEVEL2@2",
					"weight": 30
				},
				{
					"id": "T3_PLANKS_LEVEL3@3",
					"weight": 3
				},
				{
					"id": "T3_METALBAR",
					"weight": 5667
				},
				{
					"id": "T3_METALBAR_LEVEL1@1",
					"weight": 300
				},
				{
					"id": "T3_METALBAR_LEVEL2@2",
					"weight": 30
				},
				{
					"id": "T3_METALBAR_LEVEL3@3",
					"weight": 3
				}
			]
		},
		"4": {
			"amount": 16,
			"items": [
				{
					"id": "T4_LEATHER",
					"weight": 9445
				},
				{
					"id": "T4_LEATHER_LEVEL1@1",
					"weight": 500
				},
				{
					"id": "T4_LEATHER_LEVEL2@2",
					"weight": 50
				},
				{
					"id": "T4_LEATHER_LEVEL3@3",
					"weight": 5
				},
				{
					"id": "T4_PLANKS",
					"weight": 5667
				},
				{
					"id": "T4_PLANKS_LEVEL1@1",
					"weight": 300
				},
				{
					"id": "T4_PLANKS_LEVEL2@2",
					"weight": 30
				},
				{
					"id": "T4_PLANKS_LEVEL3@3",
					"weight": 3
				},
				{
					"id": "T4_METALBAR",
					"weight": 5667
				},
				{
					"id": "T4_METALBAR_LEVEL1@1",
					"weight": 300
				},
				{
					"id": "T4_METALBAR_LEVEL2@2",
					"weight": 30
				},
				{
					"id": "T4_METALBAR_LEVEL3@3",
					"weight": 3
				}
			]
		},
		"5": {
			"amount": 8,
			"items": [
				{
					"id": "T5_LEATHER",
					"weight": 9445
				},
				{
					"id": "T5_LEATHER_LEVEL1@1",
					"weight": 500
				},
				{
					"id": "T5_LEATHER_LEVEL2@2",
					"weight": 50
				},
				{
					"id": "T5_LEATHER_LEVEL3@3",
					"weight": 5
				},
				{
					"id": "T5_PLANKS",
					"weight": 5667
				},
				{
					"id": "T5_PLANKS_LEVEL1@1",
					"weight": 300
				},
				{
					"id": "T5_PLANKS_LEVEL2@2",
					"weight": 30
				},
				{
					"id": "T5_PLANKS_LEVEL3@3",
					"weight": 3
				},
				{
					"id": "T5_METALBAR",
					"weight": 5667
				},
				{
					"id": "T5_METALBAR_LEVEL1@1",
					"weight": 300
				},
				{
					"id": "T5_METALBAR_LEVEL2@2",
					"weight": 30
				},
				{
					"id": "T5_METALBAR_LEVEL3@3",
					"weight": 3
				}
			]
		},
		"6": {
			"amount": 5.3333,
			"items": [
				{
					"id": "T6_LEATHER",
					"weight": 9445
				},
				{
					"id": "T6_LEATHER_LEVEL1@1",
					"weight": 500
				},
				{
					"id": "T6_LEATHER_LEVEL2@2",
					"weight": 50
				},
				{
					"id": "T6_LEATHER_LEVEL3@3",
					"weight": 5
				},
				{
					"id": "T6_PLANKS",
					"weight": 5667
				},
				{
					"id": "T6_PLANKS_LEVEL1@1",
					"weight": 300
				},
				{
					"id": "T6_PLANKS_LEVEL2@2",
					"weight": 30
				},
				{
					"id": "T6_PLANKS_LEVEL3@3",
					"weight": 3
				},
				{
					"id": "T6_METALBAR",
					"weight": 5667
				},
				{
					"id": "T6_METALBAR_LEVEL1@1",
					"weight": 300
				},
				{
					"id": "T6_METALBAR_LEVEL2@2",
					"weight": 30
				},
				{
					"id": "T6_METALBAR_LEVEL3@3",
					"weight": 3
				}
			]
		},
		"7": {
			"amount": 4.4,
			"items": [
				{
					"id": "T7_LEATHER",
					"weight": 9445
				},
				{
					"id": "T7_LEATHER_LEVEL1@1",
					"weight": 500
				},
				{
					"id": "T7_LEATHER_LEVEL2@2",
					"weight": 50
				},
				{
					"id": "T7_LEATHER_LEVEL3@3",
					"weight": 5
				},
				{
					"id": "T7_PLANKS",
					"weight": 5667
				},
				{
					"id": "T7_PLANKS_LEVEL1@1",
					"weight": 300
				},
				{
					"id": "T7_PLANKS_LEVEL2@2",
					"weight": 30
				},
				{
					"id": "T7_PLANKS_LEVEL3@3",
					"weight": 3
				},
				{
					"id": "T7_METALBAR",
					"weight": 5667
				},
				{
					"id": "T7_METALBAR_LEVEL1@1",
					"weight": 300
				},
				{
					"id": "T7_METALBAR_LEVEL2@2",
					"weight": 30
				},
				{
					"id": "T7_METALBAR_LEVEL3@3",
					"weight": 3
				}
			]
		},
		"8": {
			"amount": 4.2,
			"items": [
				{
					"id": "T8_LEATHER",
					"weight": 9445
				},
				{
					"id": "T8_LEATHER_LEVEL1@1",
					"weight": 500
				},
				{
					"id": "T8_LEATHER_LEVEL2@2",
					"weight": 50
				},
				{
					"id": "T8_LEATHER_LEVEL3@3",
					"weight": 5
				},
				{
					"id": "T8_PLANKS",
					"weight": 5667
				},
				{
					"id": "T8_PLANKS_LEVEL1@1",
					"weight": 300
				},
				{
					"id": "T8_PLANKS_LEVEL2@2",
					"weight": 30
				},
				{
					"id": "T8_PLANKS_LEVEL3@3",
					"weight": 3
				},
				{
					"id": "T8_METALBAR",
					"weight": 5667
				},
				{
					"id": "T8_METALBAR_LEVEL1@1",
					"weight": 300
				},
				{
					"id": "T8_METALBAR_LEVEL2@2",
					"weight": 30
				},
				{
					"id": "T8_METALBAR_LEVEL3@3",
					"weight": 3
				}
			]
		}
	},
	MAGE: {
		"2": {
			"amount": 38,
			"items": [
				{
					"id": "T2_CLOTH",
					"weight": 9445
				},
				{
					"id": "T2_CLOTH_LEVEL1@1",
					"weight": 500
				},
				{
					"id": "T2_CLOTH_LEVEL2@2",
					"weight": 50
				},
				{
					"id": "T2_CLOTH_LEVEL3@3",
					"weight": 5
				},
				{
					"id": "T2_PLANKS",
					"weight": 7556
				},
				{
					"id": "T2_PLANKS_LEVEL1@1",
					"weight": 400
				},
				{
					"id": "T2_PLANKS_LEVEL2@2",
					"weight": 40
				},
				{
					"id": "T2_PLANKS_LEVEL3@3",
					"weight": 4
				},
				{
					"id": "T2_METALBAR",
					"weight": 1889
				},
				{
					"id": "T2_METALBAR_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T2_METALBAR_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T2_METALBAR_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"3": {
			"amount": 24,
			"items": [
				{
					"id": "T3_CLOTH",
					"weight": 9445
				},
				{
					"id": "T3_CLOTH_LEVEL1@1",
					"weight": 500
				},
				{
					"id": "T3_CLOTH_LEVEL2@2",
					"weight": 50
				},
				{
					"id": "T3_CLOTH_LEVEL3@3",
					"weight": 5
				},
				{
					"id": "T3_PLANKS",
					"weight": 7556
				},
				{
					"id": "T3_PLANKS_LEVEL1@1",
					"weight": 400
				},
				{
					"id": "T3_PLANKS_LEVEL2@2",
					"weight": 40
				},
				{
					"id": "T3_PLANKS_LEVEL3@3",
					"weight": 4
				},
				{
					"id": "T3_METALBAR",
					"weight": 1889
				},
				{
					"id": "T3_METALBAR_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T3_METALBAR_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T3_METALBAR_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"4": {
			"amount": 16,
			"items": [
				{
					"id": "T4_CLOTH",
					"weight": 9445
				},
				{
					"id": "T4_CLOTH_LEVEL1@1",
					"weight": 500
				},
				{
					"id": "T4_CLOTH_LEVEL2@2",
					"weight": 50
				},
				{
					"id": "T4_CLOTH_LEVEL3@3",
					"weight": 5
				},
				{
					"id": "T4_PLANKS",
					"weight": 7556
				},
				{
					"id": "T4_PLANKS_LEVEL1@1",
					"weight": 400
				},
				{
					"id": "T4_PLANKS_LEVEL2@2",
					"weight": 40
				},
				{
					"id": "T4_PLANKS_LEVEL3@3",
					"weight": 4
				},
				{
					"id": "T4_METALBAR",
					"weight": 1889
				},
				{
					"id": "T4_METALBAR_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T4_METALBAR_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T4_METALBAR_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"5": {
			"amount": 8,
			"items": [
				{
					"id": "T5_CLOTH",
					"weight": 9445
				},
				{
					"id": "T5_CLOTH_LEVEL1@1",
					"weight": 500
				},
				{
					"id": "T5_CLOTH_LEVEL2@2",
					"weight": 50
				},
				{
					"id": "T5_CLOTH_LEVEL3@3",
					"weight": 5
				},
				{
					"id": "T5_PLANKS",
					"weight": 7556
				},
				{
					"id": "T5_PLANKS_LEVEL1@1",
					"weight": 400
				},
				{
					"id": "T5_PLANKS_LEVEL2@2",
					"weight": 40
				},
				{
					"id": "T5_PLANKS_LEVEL3@3",
					"weight": 4
				},
				{
					"id": "T5_METALBAR",
					"weight": 1889
				},
				{
					"id": "T5_METALBAR_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T5_METALBAR_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T5_METALBAR_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"6": {
			"amount": 5.3333,
			"items": [
				{
					"id": "T6_CLOTH",
					"weight": 9445
				},
				{
					"id": "T6_CLOTH_LEVEL1@1",
					"weight": 500
				},
				{
					"id": "T6_CLOTH_LEVEL2@2",
					"weight": 50
				},
				{
					"id": "T6_CLOTH_LEVEL3@3",
					"weight": 5
				},
				{
					"id": "T6_PLANKS",
					"weight": 7556
				},
				{
					"id": "T6_PLANKS_LEVEL1@1",
					"weight": 400
				},
				{
					"id": "T6_PLANKS_LEVEL2@2",
					"weight": 40
				},
				{
					"id": "T6_PLANKS_LEVEL3@3",
					"weight": 4
				},
				{
					"id": "T6_METALBAR",
					"weight": 1889
				},
				{
					"id": "T6_METALBAR_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T6_METALBAR_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T6_METALBAR_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"7": {
			"amount": 4.4,
			"items": [
				{
					"id": "T7_CLOTH",
					"weight": 9445
				},
				{
					"id": "T7_CLOTH_LEVEL1@1",
					"weight": 500
				},
				{
					"id": "T7_CLOTH_LEVEL2@2",
					"weight": 50
				},
				{
					"id": "T7_CLOTH_LEVEL3@3",
					"weight": 5
				},
				{
					"id": "T7_PLANKS",
					"weight": 7556
				},
				{
					"id": "T7_PLANKS_LEVEL1@1",
					"weight": 400
				},
				{
					"id": "T7_PLANKS_LEVEL2@2",
					"weight": 40
				},
				{
					"id": "T7_PLANKS_LEVEL3@3",
					"weight": 4
				},
				{
					"id": "T7_METALBAR",
					"weight": 1889
				},
				{
					"id": "T7_METALBAR_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T7_METALBAR_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T7_METALBAR_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"8": {
			"amount": 4.2,
			"items": [
				{
					"id": "T8_CLOTH",
					"weight": 9445
				},
				{
					"id": "T8_CLOTH_LEVEL1@1",
					"weight": 500
				},
				{
					"id": "T8_CLOTH_LEVEL2@2",
					"weight": 50
				},
				{
					"id": "T8_CLOTH_LEVEL3@3",
					"weight": 5
				},
				{
					"id": "T8_PLANKS",
					"weight": 7556
				},
				{
					"id": "T8_PLANKS_LEVEL1@1",
					"weight": 400
				},
				{
					"id": "T8_PLANKS_LEVEL2@2",
					"weight": 40
				},
				{
					"id": "T8_PLANKS_LEVEL3@3",
					"weight": 4
				},
				{
					"id": "T8_METALBAR",
					"weight": 1889
				},
				{
					"id": "T8_METALBAR_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T8_METALBAR_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T8_METALBAR_LEVEL3@3",
					"weight": 1
				}
			]
		}
	},
	TOOLMAKER: {
		"2": {
			"amount": 38,
			"items": [
				{
					"id": "T2_PLANKS",
					"weight": 7556
				},
				{
					"id": "T2_PLANKS_LEVEL1@1",
					"weight": 400
				},
				{
					"id": "T2_PLANKS_LEVEL2@2",
					"weight": 40
				},
				{
					"id": "T2_PLANKS_LEVEL3@3",
					"weight": 4
				},
				{
					"id": "T2_METALBAR",
					"weight": 3778
				},
				{
					"id": "T2_METALBAR_LEVEL1@1",
					"weight": 200
				},
				{
					"id": "T2_METALBAR_LEVEL2@2",
					"weight": 20
				},
				{
					"id": "T2_METALBAR_LEVEL3@3",
					"weight": 2
				},
				{
					"id": "T2_CLOTH",
					"weight": 3778
				},
				{
					"id": "T2_CLOTH_LEVEL1@1",
					"weight": 200
				},
				{
					"id": "T2_CLOTH_LEVEL2@2",
					"weight": 20
				},
				{
					"id": "T2_CLOTH_LEVEL3@3",
					"weight": 2
				},
				{
					"id": "T2_LEATHER",
					"weight": 1889
				},
				{
					"id": "T2_LEATHER_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T2_LEATHER_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T2_LEATHER_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"3": {
			"amount": 24,
			"items": [
				{
					"id": "T3_PLANKS",
					"weight": 7556
				},
				{
					"id": "T3_PLANKS_LEVEL1@1",
					"weight": 400
				},
				{
					"id": "T3_PLANKS_LEVEL2@2",
					"weight": 40
				},
				{
					"id": "T3_PLANKS_LEVEL3@3",
					"weight": 4
				},
				{
					"id": "T3_METALBAR",
					"weight": 3778
				},
				{
					"id": "T3_METALBAR_LEVEL1@1",
					"weight": 200
				},
				{
					"id": "T3_METALBAR_LEVEL2@2",
					"weight": 20
				},
				{
					"id": "T3_METALBAR_LEVEL3@3",
					"weight": 2
				},
				{
					"id": "T3_CLOTH",
					"weight": 3778
				},
				{
					"id": "T3_CLOTH_LEVEL1@1",
					"weight": 200
				},
				{
					"id": "T3_CLOTH_LEVEL2@2",
					"weight": 20
				},
				{
					"id": "T3_CLOTH_LEVEL3@3",
					"weight": 2
				},
				{
					"id": "T3_LEATHER",
					"weight": 1889
				},
				{
					"id": "T3_LEATHER_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T3_LEATHER_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T3_LEATHER_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"4": {
			"amount": 16,
			"items": [
				{
					"id": "T4_PLANKS",
					"weight": 7556
				},
				{
					"id": "T4_PLANKS_LEVEL1@1",
					"weight": 400
				},
				{
					"id": "T4_PLANKS_LEVEL2@2",
					"weight": 40
				},
				{
					"id": "T4_PLANKS_LEVEL3@3",
					"weight": 4
				},
				{
					"id": "T4_METALBAR",
					"weight": 3778
				},
				{
					"id": "T4_METALBAR_LEVEL1@1",
					"weight": 200
				},
				{
					"id": "T4_METALBAR_LEVEL2@2",
					"weight": 20
				},
				{
					"id": "T4_METALBAR_LEVEL3@3",
					"weight": 2
				},
				{
					"id": "T4_CLOTH",
					"weight": 3778
				},
				{
					"id": "T4_CLOTH_LEVEL1@1",
					"weight": 200
				},
				{
					"id": "T4_CLOTH_LEVEL2@2",
					"weight": 20
				},
				{
					"id": "T4_CLOTH_LEVEL3@3",
					"weight": 2
				},
				{
					"id": "T4_LEATHER",
					"weight": 1889
				},
				{
					"id": "T4_LEATHER_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T4_LEATHER_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T4_LEATHER_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"5": {
			"amount": 8,
			"items": [
				{
					"id": "T5_PLANKS",
					"weight": 7556
				},
				{
					"id": "T5_PLANKS_LEVEL1@1",
					"weight": 400
				},
				{
					"id": "T5_PLANKS_LEVEL2@2",
					"weight": 40
				},
				{
					"id": "T5_PLANKS_LEVEL3@3",
					"weight": 4
				},
				{
					"id": "T5_METALBAR",
					"weight": 3778
				},
				{
					"id": "T5_METALBAR_LEVEL1@1",
					"weight": 200
				},
				{
					"id": "T5_METALBAR_LEVEL2@2",
					"weight": 20
				},
				{
					"id": "T5_METALBAR_LEVEL3@3",
					"weight": 2
				},
				{
					"id": "T5_CLOTH",
					"weight": 3778
				},
				{
					"id": "T5_CLOTH_LEVEL1@1",
					"weight": 200
				},
				{
					"id": "T5_CLOTH_LEVEL2@2",
					"weight": 20
				},
				{
					"id": "T5_CLOTH_LEVEL3@3",
					"weight": 2
				},
				{
					"id": "T5_LEATHER",
					"weight": 1889
				},
				{
					"id": "T5_LEATHER_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T5_LEATHER_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T5_LEATHER_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"6": {
			"amount": 5.3333,
			"items": [
				{
					"id": "T6_PLANKS",
					"weight": 7556
				},
				{
					"id": "T6_PLANKS_LEVEL1@1",
					"weight": 400
				},
				{
					"id": "T6_PLANKS_LEVEL2@2",
					"weight": 40
				},
				{
					"id": "T6_PLANKS_LEVEL3@3",
					"weight": 4
				},
				{
					"id": "T6_METALBAR",
					"weight": 3778
				},
				{
					"id": "T6_METALBAR_LEVEL1@1",
					"weight": 200
				},
				{
					"id": "T6_METALBAR_LEVEL2@2",
					"weight": 20
				},
				{
					"id": "T6_METALBAR_LEVEL3@3",
					"weight": 2
				},
				{
					"id": "T6_CLOTH",
					"weight": 3778
				},
				{
					"id": "T6_CLOTH_LEVEL1@1",
					"weight": 200
				},
				{
					"id": "T6_CLOTH_LEVEL2@2",
					"weight": 20
				},
				{
					"id": "T6_CLOTH_LEVEL3@3",
					"weight": 2
				},
				{
					"id": "T6_LEATHER",
					"weight": 1889
				},
				{
					"id": "T6_LEATHER_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T6_LEATHER_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T6_LEATHER_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"7": {
			"amount": 4.4,
			"items": [
				{
					"id": "T7_PLANKS",
					"weight": 7556
				},
				{
					"id": "T7_PLANKS_LEVEL1@1",
					"weight": 400
				},
				{
					"id": "T7_PLANKS_LEVEL2@2",
					"weight": 40
				},
				{
					"id": "T7_PLANKS_LEVEL3@3",
					"weight": 4
				},
				{
					"id": "T7_METALBAR",
					"weight": 3778
				},
				{
					"id": "T7_METALBAR_LEVEL1@1",
					"weight": 200
				},
				{
					"id": "T7_METALBAR_LEVEL2@2",
					"weight": 20
				},
				{
					"id": "T7_METALBAR_LEVEL3@3",
					"weight": 2
				},
				{
					"id": "T7_CLOTH",
					"weight": 3778
				},
				{
					"id": "T7_CLOTH_LEVEL1@1",
					"weight": 200
				},
				{
					"id": "T7_CLOTH_LEVEL2@2",
					"weight": 20
				},
				{
					"id": "T7_CLOTH_LEVEL3@3",
					"weight": 2
				},
				{
					"id": "T7_LEATHER",
					"weight": 1889
				},
				{
					"id": "T7_LEATHER_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T7_LEATHER_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T7_LEATHER_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"8": {
			"amount": 4.2,
			"items": [
				{
					"id": "T8_PLANKS",
					"weight": 7556
				},
				{
					"id": "T8_PLANKS_LEVEL1@1",
					"weight": 400
				},
				{
					"id": "T8_PLANKS_LEVEL2@2",
					"weight": 40
				},
				{
					"id": "T8_PLANKS_LEVEL3@3",
					"weight": 4
				},
				{
					"id": "T8_METALBAR",
					"weight": 3778
				},
				{
					"id": "T8_METALBAR_LEVEL1@1",
					"weight": 200
				},
				{
					"id": "T8_METALBAR_LEVEL2@2",
					"weight": 20
				},
				{
					"id": "T8_METALBAR_LEVEL3@3",
					"weight": 2
				},
				{
					"id": "T8_CLOTH",
					"weight": 3778
				},
				{
					"id": "T8_CLOTH_LEVEL1@1",
					"weight": 200
				},
				{
					"id": "T8_CLOTH_LEVEL2@2",
					"weight": 20
				},
				{
					"id": "T8_CLOTH_LEVEL3@3",
					"weight": 2
				},
				{
					"id": "T8_LEATHER",
					"weight": 1889
				},
				{
					"id": "T8_LEATHER_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T8_LEATHER_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T8_LEATHER_LEVEL3@3",
					"weight": 1
				}
			]
		}
	},
	WOOD: {
		"2": {
			"amount": 38,
			"items": [
				{
					"id": "T2_WOOD",
					"weight": 1889
				},
				{
					"id": "T2_WOOD_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T2_WOOD_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T2_WOOD_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"3": {
			"amount": 60,
			"items": [
				{
					"id": "T3_WOOD",
					"weight": 1889
				},
				{
					"id": "T3_WOOD_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T3_WOOD_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T3_WOOD_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"4": {
			"amount": 48,
			"items": [
				{
					"id": "T4_WOOD",
					"weight": 1889
				},
				{
					"id": "T4_WOOD_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T4_WOOD_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T4_WOOD_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"5": {
			"amount": 32,
			"items": [
				{
					"id": "T5_WOOD",
					"weight": 1889
				},
				{
					"id": "T5_WOOD_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T5_WOOD_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T5_WOOD_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"6": {
			"amount": 32,
			"items": [
				{
					"id": "T6_WOOD",
					"weight": 1889
				},
				{
					"id": "T6_WOOD_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T6_WOOD_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T6_WOOD_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"7": {
			"amount": 38.4,
			"items": [
				{
					"id": "T7_WOOD",
					"weight": 1889
				},
				{
					"id": "T7_WOOD_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T7_WOOD_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T7_WOOD_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"8": {
			"amount": 38.4,
			"items": [
				{
					"id": "T8_WOOD",
					"weight": 1889
				},
				{
					"id": "T8_WOOD_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T8_WOOD_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T8_WOOD_LEVEL3@3",
					"weight": 1
				}
			]
		}
	},
	ORE: {
		"2": {
			"amount": 38,
			"items": [
				{
					"id": "T2_ORE",
					"weight": 1889
				},
				{
					"id": "T2_ORE_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T2_ORE_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T2_ORE_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"3": {
			"amount": 60,
			"items": [
				{
					"id": "T3_ORE",
					"weight": 1889
				},
				{
					"id": "T3_ORE_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T3_ORE_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T3_ORE_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"4": {
			"amount": 48,
			"items": [
				{
					"id": "T4_ORE",
					"weight": 1889
				},
				{
					"id": "T4_ORE_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T4_ORE_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T4_ORE_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"5": {
			"amount": 32,
			"items": [
				{
					"id": "T5_ORE",
					"weight": 1889
				},
				{
					"id": "T5_ORE_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T5_ORE_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T5_ORE_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"6": {
			"amount": 32,
			"items": [
				{
					"id": "T6_ORE",
					"weight": 1889
				},
				{
					"id": "T6_ORE_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T6_ORE_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T6_ORE_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"7": {
			"amount": 38.4,
			"items": [
				{
					"id": "T7_ORE",
					"weight": 1889
				},
				{
					"id": "T7_ORE_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T7_ORE_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T7_ORE_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"8": {
			"amount": 38.4,
			"items": [
				{
					"id": "T8_ORE",
					"weight": 1889
				},
				{
					"id": "T8_ORE_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T8_ORE_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T8_ORE_LEVEL3@3",
					"weight": 1
				}
			]
		}
	},
	FIBER: {
		"2": {
			"amount": 38,
			"items": [
				{
					"id": "T2_FIBER",
					"weight": 1889
				},
				{
					"id": "T2_FIBER_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T2_FIBER_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T2_FIBER_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"3": {
			"amount": 60,
			"items": [
				{
					"id": "T3_FIBER",
					"weight": 1889
				},
				{
					"id": "T3_FIBER_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T3_FIBER_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T3_FIBER_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"4": {
			"amount": 48,
			"items": [
				{
					"id": "T4_FIBER",
					"weight": 1889
				},
				{
					"id": "T4_FIBER_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T4_FIBER_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T4_FIBER_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"5": {
			"amount": 32,
			"items": [
				{
					"id": "T5_FIBER",
					"weight": 1889
				},
				{
					"id": "T5_FIBER_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T5_FIBER_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T5_FIBER_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"6": {
			"amount": 32,
			"items": [
				{
					"id": "T6_FIBER",
					"weight": 1889
				},
				{
					"id": "T6_FIBER_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T6_FIBER_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T6_FIBER_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"7": {
			"amount": 38.4,
			"items": [
				{
					"id": "T7_FIBER",
					"weight": 1889
				},
				{
					"id": "T7_FIBER_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T7_FIBER_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T7_FIBER_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"8": {
			"amount": 38.4,
			"items": [
				{
					"id": "T8_FIBER",
					"weight": 1889
				},
				{
					"id": "T8_FIBER_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T8_FIBER_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T8_FIBER_LEVEL3@3",
					"weight": 1
				}
			]
		}
	},
	HIDE: {
		"2": {
			"amount": 38,
			"items": [
				{
					"id": "T2_HIDE",
					"weight": 1889
				},
				{
					"id": "T2_HIDE_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T2_HIDE_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T2_HIDE_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"3": {
			"amount": 60,
			"items": [
				{
					"id": "T3_HIDE",
					"weight": 1889
				},
				{
					"id": "T3_HIDE_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T3_HIDE_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T3_HIDE_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"4": {
			"amount": 48,
			"items": [
				{
					"id": "T4_HIDE",
					"weight": 1889
				},
				{
					"id": "T4_HIDE_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T4_HIDE_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T4_HIDE_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"5": {
			"amount": 32,
			"items": [
				{
					"id": "T5_HIDE",
					"weight": 1889
				},
				{
					"id": "T5_HIDE_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T5_HIDE_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T5_HIDE_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"6": {
			"amount": 32,
			"items": [
				{
					"id": "T6_HIDE",
					"weight": 1889
				},
				{
					"id": "T6_HIDE_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T6_HIDE_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T6_HIDE_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"7": {
			"amount": 38.4,
			"items": [
				{
					"id": "T7_HIDE",
					"weight": 1889
				},
				{
					"id": "T7_HIDE_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T7_HIDE_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T7_HIDE_LEVEL3@3",
					"weight": 1
				}
			]
		},
		"8": {
			"amount": 38.4,
			"items": [
				{
					"id": "T8_HIDE",
					"weight": 1889
				},
				{
					"id": "T8_HIDE_LEVEL1@1",
					"weight": 100
				},
				{
					"id": "T8_HIDE_LEVEL2@2",
					"weight": 10
				},
				{
					"id": "T8_HIDE_LEVEL3@3",
					"weight": 1
				}
			]
		}
	},
	STONE: {
		"2": {
			"amount": 38,
			"items": [{
				"id": "T2_ROCK",
				"weight": 1889
			}]
		},
		"3": {
			"amount": 60,
			"items": [{
				"id": "T3_ROCK",
				"weight": 1889
			}]
		},
		"4": {
			"amount": 48,
			"items": [{
				"id": "T4_ROCK",
				"weight": 1889
			}]
		},
		"5": {
			"amount": 32,
			"items": [{
				"id": "T5_ROCK",
				"weight": 1889
			}]
		},
		"6": {
			"amount": 32,
			"items": [{
				"id": "T6_ROCK",
				"weight": 1889
			}]
		},
		"7": {
			"amount": 38.4,
			"items": [{
				"id": "T7_ROCK",
				"weight": 1889
			}]
		},
		"8": {
			"amount": 38.4,
			"items": [{
				"id": "T8_ROCK",
				"weight": 1889
			}]
		}
	},
	FISHING: {
		"4": {
			"amount": 13.9112,
			"items": [
				{
					"id": "T1_SEAWEED",
					"weight": 29
				},
				{
					"id": "T2_FISH_FRESHWATER_ALL_COMMON",
					"weight": 50
				},
				{
					"id": "T3_FISH_FRESHWATER_ALL_COMMON",
					"weight": 50
				},
				{
					"id": "T4_FISH_FRESHWATER_ALL_COMMON",
					"weight": 50
				},
				{
					"id": "T2_FISH_SALTWATER_ALL_COMMON",
					"weight": 50
				},
				{
					"id": "T3_FISH_SALTWATER_ALL_COMMON",
					"weight": 50
				},
				{
					"id": "T4_FISH_SALTWATER_ALL_COMMON",
					"weight": 50
				},
				{
					"id": "T3_FISH_FRESHWATER_FOREST_RARE",
					"weight": 10
				},
				{
					"id": "T3_FISH_FRESHWATER_MOUNTAIN_RARE",
					"weight": 10
				},
				{
					"id": "T3_FISH_FRESHWATER_HIGHLANDS_RARE",
					"weight": 10
				},
				{
					"id": "T3_FISH_FRESHWATER_STEPPE_RARE",
					"weight": 10
				},
				{
					"id": "T3_FISH_FRESHWATER_SWAMP_RARE",
					"weight": 10
				},
				{
					"id": "T3_FISH_FRESHWATER_AVALON_RARE",
					"weight": 10
				},
				{
					"id": "T3_FISH_SALTWATER_ALL_RARE",
					"weight": 10
				}
			]
		},
		"5": {
			"amount": 17.0301,
			"items": [
				{
					"id": "T1_SEAWEED",
					"weight": 46
				},
				{
					"id": "T3_FISH_FRESHWATER_ALL_COMMON",
					"weight": 100
				},
				{
					"id": "T4_FISH_FRESHWATER_ALL_COMMON",
					"weight": 100
				},
				{
					"id": "T5_FISH_FRESHWATER_ALL_COMMON",
					"weight": 100
				},
				{
					"id": "T3_FISH_SALTWATER_ALL_COMMON",
					"weight": 100
				},
				{
					"id": "T4_FISH_SALTWATER_ALL_COMMON",
					"weight": 100
				},
				{
					"id": "T5_FISH_SALTWATER_ALL_COMMON",
					"weight": 100
				},
				{
					"id": "T3_FISH_FRESHWATER_FOREST_RARE",
					"weight": 10
				},
				{
					"id": "T5_FISH_FRESHWATER_FOREST_RARE",
					"weight": 10
				},
				{
					"id": "T3_FISH_FRESHWATER_MOUNTAIN_RARE",
					"weight": 10
				},
				{
					"id": "T5_FISH_FRESHWATER_MOUNTAIN_RARE",
					"weight": 10
				},
				{
					"id": "T3_FISH_FRESHWATER_HIGHLANDS_RARE",
					"weight": 10
				},
				{
					"id": "T5_FISH_FRESHWATER_HIGHLANDS_RARE",
					"weight": 10
				},
				{
					"id": "T3_FISH_FRESHWATER_STEPPE_RARE",
					"weight": 10
				},
				{
					"id": "T5_FISH_FRESHWATER_STEPPE_RARE",
					"weight": 10
				},
				{
					"id": "T3_FISH_FRESHWATER_SWAMP_RARE",
					"weight": 10
				},
				{
					"id": "T5_FISH_FRESHWATER_SWAMP_RARE",
					"weight": 10
				},
				{
					"id": "T3_FISH_FRESHWATER_AVALON_RARE",
					"weight": 10
				},
				{
					"id": "T5_FISH_FRESHWATER_AVALON_RARE",
					"weight": 10
				},
				{
					"id": "T3_FISH_SALTWATER_ALL_RARE",
					"weight": 10
				},
				{
					"id": "T5_FISH_SALTWATER_ALL_RARE",
					"weight": 10
				}
			]
		},
		"6": {
			"amount": 20.0528,
			"items": [
				{
					"id": "T1_SEAWEED",
					"weight": 39
				},
				{
					"id": "T4_FISH_FRESHWATER_ALL_COMMON",
					"weight": 100
				},
				{
					"id": "T5_FISH_FRESHWATER_ALL_COMMON",
					"weight": 100
				},
				{
					"id": "T6_FISH_FRESHWATER_ALL_COMMON",
					"weight": 100
				},
				{
					"id": "T4_FISH_SALTWATER_ALL_COMMON",
					"weight": 100
				},
				{
					"id": "T5_FISH_SALTWATER_ALL_COMMON",
					"weight": 100
				},
				{
					"id": "T6_FISH_SALTWATER_ALL_COMMON",
					"weight": 100
				},
				{
					"id": "T3_FISH_FRESHWATER_FOREST_RARE",
					"weight": 10
				},
				{
					"id": "T5_FISH_FRESHWATER_FOREST_RARE",
					"weight": 10
				},
				{
					"id": "T3_FISH_FRESHWATER_MOUNTAIN_RARE",
					"weight": 10
				},
				{
					"id": "T5_FISH_FRESHWATER_MOUNTAIN_RARE",
					"weight": 10
				},
				{
					"id": "T3_FISH_FRESHWATER_HIGHLANDS_RARE",
					"weight": 10
				},
				{
					"id": "T5_FISH_FRESHWATER_HIGHLANDS_RARE",
					"weight": 10
				},
				{
					"id": "T3_FISH_FRESHWATER_STEPPE_RARE",
					"weight": 10
				},
				{
					"id": "T5_FISH_FRESHWATER_STEPPE_RARE",
					"weight": 10
				},
				{
					"id": "T3_FISH_FRESHWATER_SWAMP_RARE",
					"weight": 10
				},
				{
					"id": "T5_FISH_FRESHWATER_SWAMP_RARE",
					"weight": 10
				},
				{
					"id": "T3_FISH_FRESHWATER_AVALON_RARE",
					"weight": 10
				},
				{
					"id": "T5_FISH_FRESHWATER_AVALON_RARE",
					"weight": 10
				},
				{
					"id": "T3_FISH_SALTWATER_ALL_RARE",
					"weight": 10
				},
				{
					"id": "T5_FISH_SALTWATER_ALL_RARE",
					"weight": 10
				}
			]
		},
		"7": {
			"amount": 22.3876,
			"items": [
				{
					"id": "T1_SEAWEED",
					"weight": 52
				},
				{
					"id": "T5_FISH_FRESHWATER_ALL_COMMON",
					"weight": 150
				},
				{
					"id": "T6_FISH_FRESHWATER_ALL_COMMON",
					"weight": 150
				},
				{
					"id": "T7_FISH_FRESHWATER_ALL_COMMON",
					"weight": 150
				},
				{
					"id": "T5_FISH_SALTWATER_ALL_COMMON",
					"weight": 150
				},
				{
					"id": "T6_FISH_SALTWATER_ALL_COMMON",
					"weight": 150
				},
				{
					"id": "T7_FISH_SALTWATER_ALL_COMMON",
					"weight": 150
				},
				{
					"id": "T3_FISH_FRESHWATER_FOREST_RARE",
					"weight": 10
				},
				{
					"id": "T5_FISH_FRESHWATER_FOREST_RARE",
					"weight": 10
				},
				{
					"id": "T7_FISH_FRESHWATER_FOREST_RARE",
					"weight": 10
				},
				{
					"id": "T3_FISH_FRESHWATER_MOUNTAIN_RARE",
					"weight": 10
				},
				{
					"id": "T5_FISH_FRESHWATER_MOUNTAIN_RARE",
					"weight": 10
				},
				{
					"id": "T7_FISH_FRESHWATER_MOUNTAIN_RARE",
					"weight": 10
				},
				{
					"id": "T3_FISH_FRESHWATER_HIGHLANDS_RARE",
					"weight": 10
				},
				{
					"id": "T5_FISH_FRESHWATER_HIGHLANDS_RARE",
					"weight": 10
				},
				{
					"id": "T7_FISH_FRESHWATER_HIGHLANDS_RARE",
					"weight": 10
				},
				{
					"id": "T3_FISH_FRESHWATER_STEPPE_RARE",
					"weight": 10
				},
				{
					"id": "T5_FISH_FRESHWATER_STEPPE_RARE",
					"weight": 10
				},
				{
					"id": "T7_FISH_FRESHWATER_STEPPE_RARE",
					"weight": 10
				},
				{
					"id": "T3_FISH_FRESHWATER_SWAMP_RARE",
					"weight": 10
				},
				{
					"id": "T5_FISH_FRESHWATER_SWAMP_RARE",
					"weight": 10
				},
				{
					"id": "T7_FISH_FRESHWATER_SWAMP_RARE",
					"weight": 10
				},
				{
					"id": "T3_FISH_FRESHWATER_AVALON_RARE",
					"weight": 10
				},
				{
					"id": "T5_FISH_FRESHWATER_AVALON_RARE",
					"weight": 10
				},
				{
					"id": "T7_FISH_FRESHWATER_AVALON_RARE",
					"weight": 10
				},
				{
					"id": "T3_FISH_SALTWATER_ALL_RARE",
					"weight": 10
				},
				{
					"id": "T5_FISH_SALTWATER_ALL_RARE",
					"weight": 10
				},
				{
					"id": "T7_FISH_SALTWATER_ALL_RARE",
					"weight": 10
				}
			]
		},
		"8": {
			"amount": 25.119,
			"items": [
				{
					"id": "T1_SEAWEED",
					"weight": 46
				},
				{
					"id": "T6_FISH_FRESHWATER_ALL_COMMON",
					"weight": 150
				},
				{
					"id": "T7_FISH_FRESHWATER_ALL_COMMON",
					"weight": 150
				},
				{
					"id": "T8_FISH_FRESHWATER_ALL_COMMON",
					"weight": 150
				},
				{
					"id": "T6_FISH_SALTWATER_ALL_COMMON",
					"weight": 150
				},
				{
					"id": "T7_FISH_SALTWATER_ALL_COMMON",
					"weight": 150
				},
				{
					"id": "T8_FISH_SALTWATER_ALL_COMMON",
					"weight": 150
				},
				{
					"id": "T3_FISH_FRESHWATER_FOREST_RARE",
					"weight": 10
				},
				{
					"id": "T5_FISH_FRESHWATER_FOREST_RARE",
					"weight": 10
				},
				{
					"id": "T7_FISH_FRESHWATER_FOREST_RARE",
					"weight": 10
				},
				{
					"id": "T3_FISH_FRESHWATER_MOUNTAIN_RARE",
					"weight": 10
				},
				{
					"id": "T5_FISH_FRESHWATER_MOUNTAIN_RARE",
					"weight": 10
				},
				{
					"id": "T7_FISH_FRESHWATER_MOUNTAIN_RARE",
					"weight": 10
				},
				{
					"id": "T3_FISH_FRESHWATER_HIGHLANDS_RARE",
					"weight": 10
				},
				{
					"id": "T5_FISH_FRESHWATER_HIGHLANDS_RARE",
					"weight": 10
				},
				{
					"id": "T7_FISH_FRESHWATER_HIGHLANDS_RARE",
					"weight": 10
				},
				{
					"id": "T3_FISH_FRESHWATER_STEPPE_RARE",
					"weight": 10
				},
				{
					"id": "T5_FISH_FRESHWATER_STEPPE_RARE",
					"weight": 10
				},
				{
					"id": "T7_FISH_FRESHWATER_STEPPE_RARE",
					"weight": 10
				},
				{
					"id": "T3_FISH_FRESHWATER_SWAMP_RARE",
					"weight": 10
				},
				{
					"id": "T5_FISH_FRESHWATER_SWAMP_RARE",
					"weight": 10
				},
				{
					"id": "T7_FISH_FRESHWATER_SWAMP_RARE",
					"weight": 10
				},
				{
					"id": "T3_FISH_FRESHWATER_AVALON_RARE",
					"weight": 10
				},
				{
					"id": "T5_FISH_FRESHWATER_AVALON_RARE",
					"weight": 10
				},
				{
					"id": "T7_FISH_FRESHWATER_AVALON_RARE",
					"weight": 10
				},
				{
					"id": "T3_FISH_SALTWATER_ALL_RARE",
					"weight": 10
				},
				{
					"id": "T5_FISH_SALTWATER_ALL_RARE",
					"weight": 10
				},
				{
					"id": "T7_FISH_SALTWATER_ALL_RARE",
					"weight": 10
				}
			]
		}
	}
};
var GATHER_FAME = {
	2: 450,
	3: 900,
	4: 1800,
	5: 3600,
	6: 7200,
	7: 14400,
	8: 28800
};
var GATHER_LOOT = {
	2: 38,
	3: 60,
	4: 48,
	5: 32,
	6: 32,
	7: 38.4,
	8: 38.4
};
var CRAFT_FAME = {
	2: 900,
	3: 1800,
	4: 3600,
	5: 7200,
	6: 14400,
	7: 28380,
	8: 58590
};
var CRAFT_LOOT = {
	2: 38,
	3: 24,
	4: 16,
	5: 8,
	6: 5.3333,
	7: 4.4,
	8: 4.2
};
var LABOR_JOBS = [
	{
		id: "wood",
		name: "Lumberjack",
		family: "Gathering",
		returns: "wood",
		fame: GATHER_FAME,
		loot: GATHER_LOOT,
		kind: "WOOD"
	},
	{
		id: "ore",
		name: "Prospector",
		family: "Gathering",
		returns: "ore",
		fame: GATHER_FAME,
		loot: GATHER_LOOT,
		kind: "ORE"
	},
	{
		id: "stone",
		name: "Stonecutter",
		family: "Gathering",
		returns: "stone",
		fame: GATHER_FAME,
		loot: GATHER_LOOT,
		kind: "STONE"
	},
	{
		id: "hide",
		name: "Gamekeeper",
		family: "Gathering",
		returns: "hide",
		fame: GATHER_FAME,
		loot: GATHER_LOOT,
		kind: "HIDE"
	},
	{
		id: "fiber",
		name: "Cropper",
		family: "Gathering",
		returns: "fiber",
		fame: GATHER_FAME,
		loot: GATHER_LOOT,
		kind: "FIBER"
	},
	{
		id: "fish",
		name: "Fisherman",
		family: "Gathering",
		returns: "fish",
		fame: {
			2: 720,
			3: 1360,
			4: 2223,
			5: 3680,
			6: 4880,
			7: 6640,
			8: 8320
		},
		loot: {
			2: 10.6,
			3: 9.976,
			4: 13.9112,
			5: 17.0301,
			6: 20.0528,
			7: 22.3876,
			8: 25.119
		},
		kind: "FISHING"
	},
	{
		id: "warrior",
		name: "Blacksmith",
		family: "Crafting",
		returns: "warrior materials",
		fame: CRAFT_FAME,
		loot: CRAFT_LOOT,
		kind: "WARRIOR"
	},
	{
		id: "mage",
		name: "Imbuer",
		family: "Crafting",
		returns: "mage materials",
		fame: CRAFT_FAME,
		loot: CRAFT_LOOT,
		kind: "MAGE"
	},
	{
		id: "hunter",
		name: "Fletcher",
		family: "Crafting",
		returns: "hunter materials",
		fame: CRAFT_FAME,
		loot: CRAFT_LOOT,
		kind: "HUNTER"
	},
	{
		id: "tool",
		name: "Tinker",
		family: "Crafting",
		returns: "tool materials",
		fame: CRAFT_FAME,
		loot: CRAFT_LOOT,
		kind: "TOOLMAKER"
	},
	{
		id: "mercenary",
		name: "Mercenary",
		family: "Mercenary",
		returns: "silver",
		fame: {
			2: 1412,
			3: 2171,
			4: 3264,
			5: 4368,
			6: 5856,
			7: 7968,
			8: 10800
		},
		loot: {
			2: 371,
			3: 660,
			4: 1123,
			5: 1746,
			6: 2690,
			7: 4202,
			8: 6584
		},
		kind: ""
	}
];
/** Building plots are cumulative. The guild hall uses one of them. Small plots can hold a house. */
var GUILD_ISLANDS = [
	{
		tier: 1,
		building: 4,
		small: 0
	},
	{
		tier: 2,
		building: 7,
		small: 2
	},
	{
		tier: 3,
		building: 10,
		small: 2
	},
	{
		tier: 4,
		building: 13,
		small: 2
	},
	{
		tier: 5,
		building: 16,
		small: 2
	},
	{
		tier: 6,
		building: 20,
		small: 2
	}
];
function guildHousePlots(tier) {
	const island = GUILD_ISLANDS.find((entry) => entry.tier === tier) ?? GUILD_ISLANDS[5];
	return {
		...island,
		houses: island.building - 1 + island.small
	};
}
var ISLANDS = [
	{
		tier: 1,
		plots: 1,
		large: 1,
		small: 0
	},
	{
		tier: 2,
		plots: 5,
		large: 3,
		small: 2
	},
	{
		tier: 3,
		plots: 8,
		large: 6,
		small: 2
	},
	{
		tier: 4,
		plots: 11,
		large: 9,
		small: 2
	},
	{
		tier: 5,
		plots: 14,
		large: 12,
		small: 2
	},
	{
		tier: 6,
		plots: 18,
		large: 16,
		small: 2
	}
];
function houseSlots(tier) {
	if (tier <= 2) return 1;
	if (tier <= 4) return 2;
	return 3;
}
function guildSlots(tier) {
	if (tier <= 2) return 7;
	if (tier <= 4) return 10;
	return 15;
}
var ENCHANT = [
	{
		label: ".0",
		weight: 1889
	},
	{
		label: ".1",
		weight: 100
	},
	{
		label: ".2",
		weight: 10
	},
	{
		label: ".3",
		weight: 1
	}
];
/** Yield when this journal tier is sent from this house tier. A higher house caps at 150%. */
var HOUSE_YIELD = {
	2: {
		0: 1.025,
		1: .6833,
		2: .5125
	},
	3: {
		[-1]: 1.5,
		0: 1.05,
		1: .775,
		2: .62
	},
	4: {
		[-1]: 1.5,
		0: 1.075,
		1: .83,
		2: .6917
	},
	5: {
		[-1]: 1.5,
		0: 1.1,
		1: .8667,
		2: .7429
	},
	6: {
		[-1]: 1.5,
		0: 1.125,
		1: .8929,
		2: .7813
	},
	7: {
		[-3]: 1.5,
		[-2]: 1.5,
		[-1]: 1.5,
		0: 1.15,
		1: .9125
	},
	8: {
		[-4]: 1.5,
		[-3]: 1.5,
		[-2]: 1.5,
		[-1]: 1.5,
		0: 1.2
	}
};
function houseYield(house, journal) {
	return HOUSE_YIELD[house]?.[journal - house] ?? 0;
}
function laborLoot(kind, tier) {
	return labor_loot_default[kind]?.[String(tier)] ?? null;
}
function scoreHouses(job, counts, journals, happy) {
	const rows = [];
	for (let tier = 8; tier >= 2; tier -= 1) {
		const houses = Math.max(0, Math.floor(counts[tier] ?? 0));
		if (!houses) continue;
		const labor = Math.min(tier, Math.max(2, Math.floor(journals[tier] ?? tier)));
		const rate = houseYield(tier, labor);
		const people = houses * houseSlots(tier);
		const base = job.loot[labor] ?? 0;
		rows.push({
			tier,
			houses,
			labor,
			people,
			journals: people,
			rate,
			base,
			amount: base * rate * people,
			happy: happy[tier] ?? 0
		});
	}
	return {
		rows,
		houses: rows.reduce((sum, row) => sum + row.houses, 0),
		people: rows.reduce((sum, row) => sum + row.people, 0),
		journals: rows.reduce((sum, row) => sum + row.journals, 0),
		amount: rows.reduce((sum, row) => sum + row.amount, 0)
	};
}
var BLOCKS = [
	"",
	"",
	"Limestone",
	"Sandstone",
	"Travertine",
	"Granite",
	"Slate",
	"Basalt",
	"Marble"
];
/** Cost to build or upgrade into this tier. There is no T1 house or guild hall. */
function upgradeStep(kind, tier) {
	const level = Math.max(2, Math.min(8, Math.floor(tier)));
	const scale = kind === "hall" ? 5 : 1;
	const power = 2 ** (level - 2);
	return {
		tier: level,
		wood: 30 * scale * power,
		stone: 3 * scale * power,
		blocks: 180 * scale,
		block: BLOCKS[level]
	};
}
function upgradePath(kind, from, to) {
	const start = Math.max(2, Math.floor(from) + 1);
	const end = Math.max(start, Math.min(8, Math.floor(to)));
	const steps = [];
	for (let tier = start; tier <= end; tier += 1) steps.push(upgradeStep(kind, tier));
	return {
		steps,
		wood: steps.reduce((sum, step) => sum + step.wood, 0),
		stone: steps.reduce((sum, step) => sum + step.stone, 0),
		blocks: steps.reduce((sum, step) => sum + step.blocks, 0)
	};
}
var TIERS = [
	2,
	3,
	4,
	5,
	6,
	7,
	8
];
var EMPTY = {
	2: 0,
	3: 0,
	4: 0,
	5: 0,
	6: 0,
	7: 2,
	8: 3
};
function LaborLab() {
	const [jobId, setJobId] = (0, import_react.useState)("wood");
	const [where, setWhere] = (0, import_react.useState)("island");
	const [islandTier, setIslandTier] = (0, import_react.useState)(6);
	const [counts, setCounts] = (0, import_react.useState)(EMPTY);
	const [hallTier, setHallTier] = (0, import_react.useState)(8);
	const [journalTier, setJournalTier] = (0, import_react.useState)({});
	const [happy, setHappy] = (0, import_react.useState)({});
	const [hallJournal, setHallJournal] = (0, import_react.useState)(8);
	const [hallHappy, setHallHappy] = (0, import_react.useState)(0);
	const [upgradeKind, setUpgradeKind] = (0, import_react.useState)("house");
	const [upgradeFrom, setUpgradeFrom] = (0, import_react.useState)(1);
	const [upgradeTo, setUpgradeTo] = (0, import_react.useState)(8);
	const job = LABOR_JOBS.find((entry) => entry.id === jobId) ?? LABOR_JOBS[0];
	const island = ISLANDS.find((entry) => entry.tier === islandTier) ?? ISLANDS[5];
	const guild = guildHousePlots(islandTier);
	const mix = scoreHouses(job, counts, journalTier, happy);
	const hallLabor = Math.min(hallTier, Math.max(2, hallJournal));
	const hallRate = houseYield(hallTier, hallLabor);
	const hallPeople = guildSlots(hallTier);
	const hallBase = job.loot[hallLabor];
	const hallJournals = hallPeople;
	const hallAmount = hallBase * hallRate * hallPeople;
	const path = upgradePath(upgradeKind, upgradeFrom, upgradeTo);
	const over = where === "island" ? mix.houses > island.plots : mix.houses > guild.houses;
	const tiers = TIERS.map((value) => ({
		value: String(value),
		label: `T${value}`
	}));
	const fromOptions = [
		1,
		2,
		3,
		4,
		5,
		6,
		7
	].map((value) => ({
		value: String(value),
		label: value === 1 ? "T1, not built" : `T${value}`
	}));
	const toOptions = [
		2,
		3,
		4,
		5,
		6,
		7,
		8
	].filter((value) => value > upgradeFrom).map((value) => ({
		value: String(value),
		label: `T${value}`
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-section",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JournalDesk, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-section lg:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-lg border border-line bg-panel p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "Island laborers"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "Set the houses you have. Each house is separate. A guild island has one hall."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid grid-cols-2 gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
									label: "Where",
									value: where,
									onChange: (value) => setWhere(value),
									options: [{
										value: "island",
										label: "Island"
									}, {
										value: "guild",
										label: "Guild island"
									}]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
									label: "Laborer",
									value: job.id,
									onChange: setJobId,
									options: LABOR_JOBS.map((entry) => ({
										value: entry.id,
										label: entry.name
									}))
								}),
								where === "island" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
									label: "Island level",
									value: String(island.tier),
									onChange: (value) => setIslandTier(Number(value)),
									options: ISLANDS.map((entry) => ({
										value: String(entry.tier),
										label: `T${entry.tier}`
									}))
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
									label: "Island level",
									value: String(guild.tier),
									onChange: (value) => setIslandTier(Number(value)),
									options: GUILD_ISLANDS.map((entry) => ({
										value: String(entry.tier),
										label: `T${entry.tier}`
									}))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
									label: "Guild hall",
									value: String(hallTier),
									onChange: (value) => setHallTier(Number(value)),
									options: tiers
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4",
							children: TIERS.map((tier) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
								label: `T${tier} houses`,
								min: 0,
								value: counts[tier] ?? 0,
								onChange: (value) => setCounts((current) => ({
									...current,
									[tier]: value
								}))
							}, tier))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-4 flex flex-col gap-3 text-sm",
							children: [where === "guild" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "border-b border-line pb-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Guild hall" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted",
											children: [exact(hallJournals), " journals"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 grid grid-cols-2 gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
											label: "Laborer",
											value: String(hallLabor),
											onChange: (value) => setHallJournal(Number(value)),
											options: TIERS.filter((tier) => tier <= hallTier).map((tier) => ({
												value: String(tier),
												label: `T${tier}`
											}))
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
											label: "Trophy happiness",
											min: 0,
											value: hallHappy,
											onChange: (value) => setHallHappy(Math.min(100, Math.max(0, value)))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 text-muted",
										children: [
											exact(hallAmount),
											" ",
											job.returns,
											" · ",
											pct(hallRate),
											" of the base return"
										]
									}),
									job.id === "mercenary" ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chances, { amount: hallAmount })
								]
							}) : null, mix.rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "border-b border-line pb-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											exact(row.houses),
											" × T",
											row.tier
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted",
											children: [exact(row.journals), " journals"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 grid grid-cols-2 gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
											label: "Laborer",
											value: String(row.labor),
											onChange: (value) => setJournalTier((current) => ({
												...current,
												[row.tier]: Number(value)
											})),
											options: TIERS.filter((tier) => tier <= row.tier).map((tier) => ({
												value: String(tier),
												label: `T${tier}`
											}))
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
											label: "Trophy happiness",
											min: 0,
											value: happy[row.tier] ?? 0,
											onChange: (value) => setHappy((current) => ({
												...current,
												[row.tier]: Math.min(100, Math.max(0, value))
											}))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 text-muted",
										children: [
											exact(row.amount),
											" ",
											job.returns,
											" · ",
											pct(row.rate),
											" of the base return"
										]
									}),
									job.id === "mercenary" ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chances, { amount: row.amount })
								]
							}, row.tier))]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-lg border border-line bg-panel p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: where === "guild" ? "Guild island" : `T${island.tier} island`
					}), where === "island" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-4 flex flex-col",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Result, {
								label: "Houses",
								value: exact(mix.houses),
								note: over ? `This island only has ${exact(island.plots)} plots.` : `${exact(island.plots)} plots. ${exact(island.large)} large${island.small ? `, ${exact(island.small)} small` : ""}.`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Result, {
								label: "Laborers",
								value: exact(mix.people),
								note: "A house holds 1, then 2, then 3 from T5."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Result, {
								label: "Journals",
								value: exact(mix.journals),
								note: "One filled journal per laborer, the laborer's tier."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Result, {
								label: "Return",
								value: "22 hours",
								note: "The amount follows the house tier and the journal tier."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Result, {
								label: job.family === "Mercenary" ? "Silver" : "Materials",
								value: exact(mix.amount),
								note: job.returns
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-4 flex flex-col",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Result, {
								label: "Guild hall",
								value: `T${hallTier}`,
								note: "One hall. A guild island cannot farm."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Result, {
								label: "Houses",
								value: exact(mix.houses),
								note: over ? `This guild island fits ${exact(guild.houses)} houses besides the hall.` : `${exact(guild.houses)} houses fit besides the hall.`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Result, {
								label: "Laborers",
								value: exact(hallPeople + mix.people),
								note: `${exact(hallPeople)} in the hall. 15 is the hall maximum. ${exact(mix.people)} in houses.`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Result, {
								label: "Journals",
								value: exact(hallJournals + mix.journals),
								note: `${exact(hallJournals)} for the hall. ${exact(mix.journals)} for the houses.`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Result, {
								label: "Return",
								value: "22 hours",
								note: "The amount follows the house tier and the journal tier."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Result, {
								label: job.family === "Mercenary" ? "Silver" : "Materials",
								value: exact(hallAmount + mix.amount),
								note: `${exact(hallAmount)} from the hall. ${exact(mix.amount)} from the houses.`
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-lg border border-line bg-panel p-5 lg:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "Upgrade"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "Houses and guild halls start at T2. T1 means it is not built yet."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid grid-cols-2 gap-3 md:grid-cols-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
									label: "Building",
									value: upgradeKind,
									onChange: (value) => setUpgradeKind(value),
									options: [{
										value: "house",
										label: "House"
									}, {
										value: "hall",
										label: "Guild hall"
									}]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
									label: "From",
									value: String(upgradeFrom),
									onChange: (value) => {
										const next = Number(value);
										setUpgradeFrom(next);
										if (upgradeTo <= next) setUpgradeTo(Math.min(8, next + 1));
									},
									options: fromOptions
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
									label: "To",
									value: String(upgradeTo),
									onChange: (value) => setUpgradeTo(Number(value)),
									options: toOptions
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
							className: "mt-4 flex flex-col",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Result, {
								label: "Rough logs",
								value: exact(path.wood),
								note: `${exact(path.stone)} rough stone · ${exact(path.blocks)} stone blocks`
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 flex flex-col gap-2 text-sm",
							children: path.steps.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex justify-between gap-3 border-b border-line py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["T", step.tier] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted",
									children: [
										exact(step.wood),
										" logs · ",
										exact(step.stone),
										" stone · ",
										exact(step.blocks),
										" ",
										step.block
									]
								})]
							}, step.tier))
						})
					]
				})
			]
		})]
	});
}
function JournalDesk() {
	const jobs = LABOR_JOBS.filter((job) => job.kind);
	const [jobId, setJobId] = (0, import_react.useState)("wood");
	const [house, setHouse] = (0, import_react.useState)(6);
	const [count, setCount] = (0, import_react.useState)(1);
	const [city, setCity] = (0, import_react.useState)("Martlock");
	const [premium, setPremium] = (0, import_react.useState)(true);
	const [sellOrder, setSellOrder] = (0, import_react.useState)(true);
	const [buyOrder, setBuyOrder] = (0, import_react.useState)(true);
	const [book, setBook] = (0, import_react.useState)({});
	const [typed, setTyped] = (0, import_react.useState)({});
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [note, setNote] = (0, import_react.useState)("Sell orders first. An empty city uses Albion Free Market.");
	const job = jobs.find((entry) => entry.id === jobId) ?? jobs[0];
	const rows = (0, import_react.useMemo)(() => {
		return [
			4,
			5,
			6,
			7,
			8
		].filter((tier) => laborLoot(job.kind, tier)).map((tier) => {
			const loot = laborLoot(job.kind, tier);
			const rate = houseYield(house, tier);
			const fullId = `T${tier}_JOURNAL_${job.kind}_FULL`;
			const emptyId = `T${tier}_JOURNAL_${job.kind}_EMPTY`;
			const full = typed[fullId] ?? readPrice(book, fullId, city);
			const empty = typed[emptyId] ?? readPrice(book, emptyId, city);
			const weight = loot?.items.reduce((sum, item) => sum + item.weight, 0) ?? 0;
			let gross = 0;
			let covered = 0;
			for (const item of loot?.items ?? []) {
				const unit = typed[item.id] ?? readPrice(book, item.id, city);
				if (!unit) continue;
				covered += item.weight;
				gross += weight ? (loot?.amount ?? 0) * rate * item.weight / weight * unit : 0;
			}
			const known = full > 0 && empty > 0 && rate > 0 && covered > 0;
			const revenue = net(gross, premium, sellOrder) + net(empty, premium, sellOrder);
			const cost = full * (buyOrder ? 1 + SETUP_FEE : 1);
			return {
				tier,
				rate,
				fullId,
				emptyId,
				full,
				empty,
				profit: known ? (revenue - cost) * count : null,
				amount: (loot?.amount ?? 0) * rate
			};
		});
	}, [
		book,
		buyOrder,
		city,
		count,
		house,
		job.kind,
		premium,
		sellOrder,
		typed
	]);
	async function load() {
		setLoading(true);
		const tiers = [
			4,
			5,
			6,
			7,
			8
		].filter((tier) => laborLoot(job.kind, tier));
		const ids = [...new Set(tiers.flatMap((tier) => {
			const loot = laborLoot(job.kind, tier);
			return [
				`T${tier}_JOURNAL_${job.kind}_FULL`,
				`T${tier}_JOURNAL_${job.kind}_EMPTY`,
				...loot?.items.map((item) => item.id) ?? []
			];
		}))];
		try {
			const result = await fetchMarketPrices({ data: {
				server: "asia",
				itemIds: ids.slice(0, 400),
				locations: [city],
				qualities: [1]
			} });
			setBook(result.quotes);
			setNote("Asia data project first. An empty order uses Albion Free Market.");
		} catch (error) {
			setNote(error instanceof Error ? error.message : "Could not load prices");
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		load();
	}, [jobId, city]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 rounded-lg border border-line bg-panel p-3 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						label: "Journal",
						value: job.id,
						onChange: setJobId,
						options: jobs.map((entry) => ({
							value: entry.id,
							label: entry.name
						}))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						label: "House tier",
						value: String(house),
						onChange: (value) => setHouse(Number(value)),
						options: [
							4,
							5,
							6,
							7,
							8
						].map((tier) => ({
							value: String(tier),
							label: `T${tier}`
						}))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						label: "City",
						value: city,
						onChange: (value) => setCity(value),
						options: CRAFT_CITIES.map((name) => ({
							value: name,
							label: name
						}))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
						label: "Journals",
						min: 1,
						value: count,
						onChange: setCount
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void load(),
						className: "h-11 rounded-lg bg-brass px-3 text-sm font-semibold text-ink",
						children: loading ? "Loading" : "Fetch latest prices"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setPremium((on) => !on),
						className: "h-11 rounded-lg px-3 text-sm " + (premium ? "bg-brass text-ink" : "border border-line"),
						children: premium ? "Premium" : "No premium"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setSellOrder((on) => !on),
						className: "h-11 rounded-lg px-3 text-sm " + (sellOrder ? "bg-brass text-ink" : "border border-line"),
						children: "Sell tax"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setBuyOrder((on) => !on),
						className: "h-11 rounded-lg px-3 text-sm " + (buyOrder ? "bg-brass text-ink" : "border border-line"),
						children: "Buy fee"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted",
				children: [note, " A matching journal in a higher house returns more, up to 150%."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3",
				children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-lg border border-line bg-panel p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-semibold",
								children: [
									"T",
									row.tier,
									" ",
									job.name
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold tabular-nums " + (row.profit != null && row.profit < 0 ? "text-ember" : "text-sage"),
								children: row.profit == null ? "No data" : silver(row.profit)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [
								pct(row.rate),
								" return · ",
								exact(row.amount),
								" materials"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs text-muted",
								children: [
									"Full journal",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: "mt-1 h-11 w-full rounded-md border border-line bg-ink px-2",
										type: "number",
										min: 0,
										value: row.full || "",
										placeholder: "0",
										onChange: (event) => setTyped((current) => ({
											...current,
											[row.fullId]: Number(event.target.value)
										}))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block",
										children: stamp(book, row.fullId, city)
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs text-muted",
								children: [
									"Empty journal",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: "mt-1 h-11 w-full rounded-md border border-line bg-ink px-2",
										type: "number",
										min: 0,
										value: row.empty || "",
										placeholder: "0",
										onChange: (event) => setTyped((current) => ({
											...current,
											[row.emptyId]: Number(event.target.value)
										}))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block",
										children: stamp(book, row.emptyId, city)
									})
								]
							})]
						})
					]
				}, row.tier))
			})
		]
	});
}
function readPrice(book, id, city) {
	const row = book[id]?.[city]?.["1"] ?? book[liveId(id)]?.[city]?.["1"];
	if (row?.type === "EMV" && row.value) return row.value;
	return row?.sell ?? 0;
}
function stamp(book, id, city) {
	const row = book[id]?.[city]?.["1"] ?? book[liveId(id)]?.[city]?.["1"];
	if (row?.type) return quoteNote(row);
	if (!row?.sell) return "No data";
	return row.sellDate === "afm" ? "Free Market" : "Data Project";
}
function net(price, premium, sellOrder) {
	return price * (1 - (premium ? TAX_PREMIUM : TAX_STANDARD) - (sellOrder ? SETUP_FEE : 0));
}
function Chances({ amount }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-2 text-xs text-muted",
		children: ENCHANT.map((roll) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex justify-between gap-3 py-0.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				roll.label,
				" ",
				pct(roll.weight / 2e3)
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: exact(amount * (roll.weight / 2e3)) })]
		}, roll.label))
	});
}
function Result({ label, value, note }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-b border-line py-3 last:border-b-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
				className: "text-sm text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
				className: "font-sans text-2xl font-semibold tabular-nums tracking-tight text-brass",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: note
			})
		]
	});
}
function when(value) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";
	return date.toLocaleString(void 0, {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit"
	});
}
function lineFromRecent(row) {
	const line = blankLine(row.itemId);
	line.enchant = row.enchant;
	line.route = row.route;
	line.city = row.city;
	line.place = row.place;
	return line;
}
function titleOf(row) {
	return `${getItem(row.itemId)?.name ?? row.itemId} .${row.enchant}`;
}
function RecentLab() {
	const { user } = useCurrentUserState();
	const recents = useForge((s) => s.recents ?? []);
	const openRecent = useForge((s) => s.openRecent);
	const saveRecent = useForge((s) => s.saveRecent);
	const dropRecent = useForge((s) => s.dropRecent);
	const applyDesk = useForge((s) => s.applyDesk);
	const [groups, setGroups] = (0, import_react.useState)([]);
	const [note, setNote] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const refresh = (0, import_react.useCallback)(async () => {
		if (!user) {
			setGroups([]);
			return;
		}
		try {
			setGroups(await listCraftGroups());
		} catch {
			setGroups([]);
		}
	}, [user]);
	(0, import_react.useEffect)(() => {
		refresh();
	}, [refresh]);
	const loose = recents.filter((row) => !row.saved);
	const pinned = recents.filter((row) => row.saved);
	async function pin(row) {
		if (!user) {
			setNote("Sign in with Google to save this. The last 10 stay on this browser after a reload.");
			return;
		}
		saveRecent(row.id);
		const state = useForge.getState();
		const line = state.lines.find((entry) => entry.itemId === row.itemId && entry.enchant === row.enchant && entry.route === row.route) ?? lineFromRecent(row);
		setBusy(true);
		try {
			await saveCraftGroup({ data: {
				id: null,
				name: titleOf(row),
				summary: `${row.city} · ${row.place}`,
				desk: snapshotFrom({
					...state,
					lines: [line],
					active: line.uid
				})
			} });
			setNote("Saved to your Google account.");
			await refresh();
		} catch {
			setNote("Saved on this device. The account save failed.");
		} finally {
			setBusy(false);
		}
	}
	async function openGroup(id) {
		setBusy(true);
		setNote("");
		try {
			const row = await loadCraftGroup({ data: { id } });
			if (!row) {
				setNote("That save is gone.");
				await refresh();
				return;
			}
			applyDesk(row.desk, {
				id: row.id,
				name: row.name
			});
		} catch {
			setNote("Could not open that save.");
		} finally {
			setBusy(false);
		}
	}
	async function removeGroup(id) {
		setBusy(true);
		try {
			await deleteCraftGroup({ data: { id } });
			await refresh();
		} catch {
			setNote("Could not delete that save.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-section",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-line bg-panel p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Recent crafts"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-xl text-sm text-muted",
						children: "The last 10 crafts stay on this browser after a reload. Sign in with Google and Save keeps the craft, and this list, on your account."
					}),
					note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: note
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-line bg-panel p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold tracking-wide text-brass uppercase",
						children: "Saved"
					}),
					user && groups.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 flex flex-col",
						children: groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-wrap items-center justify-between gap-3 border-b border-line py-3 last:border-b-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-parchment",
								children: group.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted",
								children: [
									group.summary,
									" · ",
									when(group.updatedAt)
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: busy,
									onClick: () => void openGroup(group.id),
									className: "h-11 rounded-lg border border-line px-3 text-sm",
									children: "Open"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: busy,
									onClick: () => void removeGroup(group.id),
									className: "h-11 rounded-lg border border-ember px-3 text-sm text-ember",
									children: "Delete"
								})]
							})]
						}, group.id))
					}) : pinned.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 flex flex-col",
						children: pinned.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-wrap items-center justify-between gap-3 border-b border-line py-3 last:border-b-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-parchment",
								children: titleOf(row)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted",
								children: [
									row.city,
									" · ",
									when(row.at)
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => openRecent(row.id),
									className: "h-11 rounded-lg border border-line px-3 text-sm",
									children: "Open"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => dropRecent(row.id),
									className: "h-11 rounded-lg border border-ember px-3 text-sm text-ember",
									children: "Delete"
								})]
							})]
						}, row.id))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "Nothing saved yet."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-muted",
						children: "Saved crafts stay on this Google account."
					}) })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-line bg-panel p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold tracking-wide text-brass uppercase",
					children: "Last 10"
				}), loose.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: "Add a craft and it shows up here."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 flex flex-col",
					children: loose.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center justify-between gap-3 border-b border-line py-3 last:border-b-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-parchment",
							children: titleOf(row)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [
								row.city,
								" · ",
								when(row.at)
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => openRecent(row.id),
									className: "h-11 rounded-lg border border-line px-3 text-sm",
									children: "Open"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: busy,
									onClick: () => void pin(row),
									className: "h-11 rounded-lg bg-brass px-3 text-sm font-semibold text-ink",
									children: "Save"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => dropRecent(row.id),
									className: "h-11 rounded-lg border border-line px-3 text-sm",
									children: "Remove"
								})
							]
						})]
					}, row.id))
				})]
			})
		]
	});
}
var REFINE_HOME = {
	ore: "Thetford",
	fiber: "Lymhurst",
	rock: "Bridgewatch",
	hide: "Martlock",
	wood: "Fort Sterling"
};
function ReturnsLab() {
	const [place, setPlace] = (0, import_react.useState)("city");
	const [city, setCity] = (0, import_react.useState)("Thetford");
	const [resource, setResource] = (0, import_react.useState)("ore");
	const [tier, setTier] = (0, import_react.useState)(6);
	const [enchant, setEnchant] = (0, import_react.useState)(4);
	const [focus, setFocus] = (0, import_react.useState)(true);
	const [daily, setDaily] = (0, import_react.useState)(0);
	const [power, setPower] = (0, import_react.useState)(4);
	const [quality, setQuality] = (0, import_react.useState)(4);
	const [region, setRegion] = (0, import_react.useState)("outlands");
	const [biome, setBiome] = (0, import_react.useState)("forest");
	const [extra, setExtra] = (0, import_react.useState)(0);
	const [runs, setRuns] = (0, import_react.useState)(10);
	const [specs, setSpecs] = (0, import_react.useState)({
		4: 0,
		5: 0,
		6: 0,
		7: 0,
		8: 0
	});
	const rrr = returnRate(productionBonus({
		place,
		city,
		category: resource,
		focus,
		daily,
		power,
		extra,
		biome,
		mapQuality: quality,
		region
	}).total);
	const item = (0, import_react.useMemo)(() => searchItems("", "refine", {
		line: resource,
		tier
	}).find((entry) => !entry.id.includes("#")), [resource, tier]);
	const enchants = item ? enchantsOf(item) : [0];
	const enchantLevel = enchants.includes(enchant) ? enchant : enchants[0] ?? 0;
	const variant = item ? variantOf(item, enchantLevel, "direct") : void 0;
	const spec = variant ? focusFromRefine(variant.focus, specs, tier) : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-col gap-section",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-section lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-line bg-panel p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Refining return"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Pick the resource, the tier, and the enchantment. Each tier spec is 0–100. This tier adds 250, and every tier adds 30. The focus number is the whole point the station shows."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid grid-cols-2 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								label: "Where",
								value: place,
								onChange: (value) => setPlace(value),
								options: [
									{
										value: "city",
										label: "Royal city"
									},
									{
										value: "island",
										label: "Island"
									},
									{
										value: "hideout",
										label: "Hideout"
									}
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								label: "Resource",
								value: resource,
								onChange: (value) => {
									setResource(value);
									setCity(REFINE_HOME[value] ?? "Thetford");
								},
								options: Object.entries(REFINE_LINE).map(([id, entry]) => ({
									value: id,
									label: entry.label
								}))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								label: "Tier",
								value: String(tier),
								onChange: (value) => setTier(Number(value)),
								options: [
									2,
									3,
									4,
									5,
									6,
									7,
									8
								].map((level) => ({
									value: String(level),
									label: `T${level}`
								}))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								label: "Enchantment",
								value: String(enchantLevel),
								onChange: (value) => setEnchant(Number(value)),
								options: enchants.map((level) => ({
									value: String(level),
									label: `.${level}`
								}))
							}),
							place === "hideout" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
									label: "City",
									value: biome,
									onChange: setBiome,
									options: HO_BIOMES.map((entry) => ({
										value: entry.id,
										label: entry.label
									}))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
									label: "Region",
									value: region,
									onChange: (value) => setRegion(value),
									options: [{
										value: "outlands",
										label: "Outlands"
									}, {
										value: "roads",
										label: "Roads"
									}]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
									label: "Map quality",
									value: String(region === "roads" ? 1 : quality),
									onChange: (value) => setQuality(Number(value)),
									options: (region === "roads" ? [1] : [
										1,
										2,
										3,
										4,
										5,
										6
									]).map((level) => ({
										value: String(level),
										label: region === "roads" ? "Q1 (Roads)" : `Q${level}`
									}))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
									label: "Hideout level",
									min: 1,
									value: power,
									onChange: setPower
								})
							] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								label: "City",
								value: city,
								onChange: setCity,
								options: CRAFT_CITIES.map((name) => ({
									value: name,
									label: name
								}))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								label: "Daily craft bonus",
								value: String(daily),
								onChange: (value) => setDaily(Number(value)),
								options: [
									{
										value: "0",
										label: "None"
									},
									{
										value: "10",
										label: "×1.10"
									},
									{
										value: "20",
										label: "×1.20"
									}
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
								label: "Extra bonus",
								min: 0,
								value: extra,
								onChange: setExtra
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
								label: "Crafts",
								min: 1,
								value: runs,
								onChange: setRuns
							}),
							[
								4,
								5,
								6,
								7,
								8
							].map((level) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
								label: `T${level} spec`,
								min: 0,
								value: specs[level] ?? 0,
								onChange: (value) => setSpecs((current) => ({
									...current,
									[level]: Math.min(100, value)
								}))
							}, level))
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							on: focus,
							onClick: () => setFocus((on) => !on),
							children: "Use focus"
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-line bg-panel p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Resource return rate"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-sans text-4xl font-semibold tabular-nums tracking-tight text-brass",
						children: pct(rrr)
					}),
					item && variant && spec ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 border-t border-line pt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-center gap-2 text-parchment",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIcon, {
											id: item.id,
											enchant: enchantLevel,
											size: 36
										}),
										item.name,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted",
											children: [
												"[",
												item.tier,
												".",
												enchantLevel,
												"]"
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "tabular-nums text-brass",
									children: focus ? `${exact(spec.cost)} focus` : "No focus"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2",
								children: variant.mats.map((mat) => {
									const back = mat.ret ? wholeReturn(mat.qty * runs * rrr) : 0;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-center justify-between gap-3 border-b border-line py-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIcon, {
													id: mat.id,
													size: 32
												}),
												matName(mat.id),
												" ",
												itemMark(mat.id) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-muted",
													children: [
														"[",
														itemMark(mat.id),
														"]"
													]
												}) : null,
												" × ",
												exact(mat.qty)
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "tabular-nums text-muted",
											children: mat.ret ? `${exact(back)} back` : "not returned"
										})]
									}, mat.id + String(mat.qty));
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-xs text-muted",
								children: [
									"Base ",
									exact(variant.focus),
									" · efficiency ",
									exact(spec.efficiency),
									focus ? ` · ${exact(spec.cost * runs)} focus for ${runs}` : ""
								]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-muted",
						children: "That tier is not in this resource."
					})
				]
			})]
		})
	});
}
function ReturnFocusLab() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReturnsLab, {});
}
function StudyLab() {
	const [itemId, setItemId] = (0, import_react.useState)("T4_MAIN_SWORD");
	const [enchant, setEnchant] = (0, import_react.useState)(0);
	const [premium, setPremium] = (0, import_react.useState)(true);
	const [focus, setFocus] = (0, import_react.useState)(false);
	const [daily, setDaily] = (0, import_react.useState)(0);
	const [goal, setGoal] = (0, import_react.useState)(1e6);
	const [value, setValue] = (0, import_react.useState)(384);
	const [damage, setDamage] = (0, import_react.useState)(5);
	const [mult, setMult] = (0, import_react.useState)(1.156);
	const [fixCount, setFixCount] = (0, import_react.useState)(1);
	const item = getItem(itemId);
	const variant = item ? variantOf(item, enchant, "direct") : void 0;
	const dailyMult = daily === 20 ? 1.2 : daily === 10 ? 1.1 : 1;
	const study = variant ? variant.fame * 2.75 * dailyMult * (focus ? 1.59 : 1) * (premium ? 1.5 : 1) : 0;
	const craft = variant ? variant.fame * (premium ? 1.5 : 1) : 0;
	const count = study > 0 ? Math.ceil(goal / study) : 0;
	const repair = repairSilver(value, damage / 100, mult, fixCount);
	function pickItem(id, nextEnchant) {
		const next = getItem(id);
		setItemId(id);
		setEnchant(nextEnchant);
		if (next) setValue(variantOf(next, nextEnchant, "direct").value);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-section lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-lg border border-line bg-panel p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Study and repair"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Studying destroys the item at its crafting station and pays 275% of crafting fame. Refining stations cannot study. Premium is ×1.5. Focus while studying is ×1.59. Repair silver is ceil(item value × missing durability × 16.5 × server multiplier). Quality and market price change neither."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemPicker, {
						onPick: (id) => pickItem(id, 0),
						compact: true
					})
				}),
				item && variant ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid grid-cols-2 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							label: "Enchant",
							value: String(enchant),
							onChange: (entry) => pickItem(itemId, Number(entry)),
							options: [...new Set(item.variants.filter((v) => v.route === "direct").map((v) => v.enchant))].map((level) => ({
								value: String(level),
								label: `.${level}`
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							label: "Daily craft bonus",
							value: String(daily),
							onChange: (entry) => setDaily(Number(entry)),
							options: [
								{
									value: "0",
									label: "None"
								},
								{
									value: "10",
									label: "×1.10"
								},
								{
									value: "20",
									label: "×1.20"
								}
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
							label: "Fame still needed",
							min: 0,
							value: goal,
							onChange: setGoal
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
							label: "Item value",
							min: 0,
							value,
							onChange: setValue
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
							label: "Missing durability %",
							min: 0,
							value: damage,
							onChange: setDamage
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
							label: "Server multiplier",
							min: 0,
							step: .001,
							value: mult,
							onChange: setMult
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
							label: "Items to repair",
							min: 1,
							value: fixCount,
							onChange: setFixCount
						})
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						on: premium,
						onClick: () => setPremium((on) => !on),
						children: "Premium"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						on: focus,
						onClick: () => setFocus((on) => !on),
						children: "Study with focus"
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "rounded-lg border border-line bg-panel p-5",
			children: item && variant ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "flex items-center gap-2 font-display text-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIcon, {
							id: item.id,
							enchant,
							size: 40
						}),
						item.name,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [
								"[",
								item.tier,
								".",
								enchant,
								"]"
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: item.study ? item.station : "This station does not allow studying."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted",
					children: "Study fame / item"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-sans text-4xl font-semibold tabular-nums tracking-tight text-brass",
					children: item.study ? exact(study) : "—"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-4 grid grid-cols-2 gap-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-muted",
						children: "Craft fame / item"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "tabular-nums",
						children: exact(craft)
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-muted",
						children: "Items to study"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "tabular-nums",
						children: item.study ? count.toLocaleString("en-US") : "—"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-sm text-muted",
					children: "Repair silver"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-sans text-4xl font-semibold tabular-nums tracking-tight text-brass",
					children: silver(repair.total)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted",
					children: [silver(repair.each), " each, rounded up before multiplying."]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-xs text-muted",
					children: "Item value follows the recipe and can be typed over. A T4 broadsword is 384. At 5% damage and a 1.156 multiplier the repair is 367.00 silver. Food and potions made only from crops show 0 craft fame."
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted",
				children: "Pick a recipe."
			})
		})]
	});
}
function RerollLab() {
	const [itemId, setItemId] = (0, import_react.useState)("T4_MAIN_SWORD");
	const [enchant, setEnchant] = (0, import_react.useState)(0);
	const [value, setValue] = (0, import_react.useState)(384);
	const [from, setFrom] = (0, import_react.useState)(1);
	const [target, setTarget] = (0, import_react.useState)(5);
	const [mult, setMult] = (0, import_react.useState)(1.156);
	const [count, setCount] = (0, import_react.useState)(1);
	const item = getItem(itemId);
	const variant = item ? variantOf(item, enchant, "direct") : void 0;
	const goal = Math.max(from + 1, target);
	const plan = rerollPlan(value, from, goal, mult);
	const qualities = [
		1,
		2,
		3,
		4,
		5
	];
	function pickVariant(id, nextEnchant) {
		const next = getItem(id);
		if (!next) return;
		setItemId(id);
		setEnchant(nextEnchant);
		setValue(variantOf(next, nextEnchant, "direct").value);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-section lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-lg border border-line bg-panel p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Quality reroll"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "At a repair station, one attempt costs item value × server multiplier × the quality modifier. Quality cannot fall. A Normal item always improves. Masterpiece cannot be rerolled. A miss does not improve the next odds."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemPicker, {
						compact: true,
						onPick: (id) => pickVariant(id, 0)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid grid-cols-2 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							label: "Enchant",
							value: String(enchant),
							onChange: (entry) => pickVariant(itemId, Number(entry)),
							options: (item ? enchantsOf(item) : [0]).map((level) => ({
								value: String(level),
								label: `.${level}`
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
							label: "Item value",
							min: 0,
							value,
							onChange: setValue
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							label: "Start quality",
							value: String(from),
							onChange: (entry) => {
								const next = Number(entry);
								setFrom(next);
								if (target <= next) setTarget(Math.min(5, next + 1));
							},
							options: qualities.filter((level) => level < 5).map((level) => ({
								value: String(level),
								label: REROLL_NAMES[level]
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							label: "Stop at",
							value: String(goal),
							onChange: (entry) => setTarget(Number(entry)),
							options: qualities.filter((level) => level > from).map((level) => ({
								value: String(level),
								label: REROLL_NAMES[level]
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
							label: "Server multiplier",
							min: 0,
							step: .001,
							value: mult,
							onChange: setMult
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
							label: "How many items",
							min: 1,
							value: count,
							onChange: setCount
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-xs text-muted",
					children: [item ? `${item.name} .${enchant} item value ${exact(variant?.value ?? 0)}. ` : "", "A T4.0 broadsword is 384. With multiplier 1.156, one Normal attempt is 1,953.18 silver, and reaching Excellent or better averages 3.81 attempts and about 9,640 silver."]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-lg border border-line bg-panel p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: ["Expected silver to ", REROLL_NAMES[goal]]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-sans text-4xl font-semibold tabular-nums tracking-tight text-brass",
					children: silver(plan.silver * count)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted",
					children: [
						plan.attempts.toLocaleString("en-US", { maximumFractionDigits: 2 }),
						" attempts each · ",
						silver(plan.silver),
						" silver each · one attempt ",
						silver(plan.attempt)
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: [
						"Chance the next roll is already ",
						REROLL_NAMES[goal],
						" or better: ",
						pct(plan.hit)
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4",
					children: qualities.map((level) => {
						const chance = plan.chances[level] ?? 0;
						if (chance <= 0) return null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between border-b border-line py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [REROLL_NAMES[level], level === from ? " · stays" : ""] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: pct(chance)
							})]
						}, level);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-xs text-muted",
					children: "Modifiers: Normal ×4.4, Good ×5.5, Outstanding ×6.6, Excellent ×27.5. Same server multiplier as repair."
				})
			]
		})]
	});
}
var MAIN_NAV = [
	{
		id: "dash",
		label: "Dashboard",
		icon: LayoutDashboard
	},
	{
		id: "bench",
		label: "Add Craft",
		icon: Hammer
	},
	{
		id: "flip",
		label: "Flipping",
		icon: Repeat
	},
	{
		id: "recent",
		label: "Recent",
		icon: Clock
	},
	{
		id: "farm",
		label: "Farming and Breeding",
		icon: Sprout
	}
];
var SECONDARY_NAV = [
	{
		id: "labor",
		label: "Laborers",
		icon: Users
	},
	{
		id: "returns",
		label: "Return & focus",
		icon: Percent
	},
	{
		id: "study",
		label: "Study & repair",
		icon: GraduationCap
	},
	{
		id: "reroll",
		label: "Reroll",
		icon: Dices
	}
];
var NAV = [...MAIN_NAV, ...SECONDARY_NAV];
function navClass(on) {
	return "inline-flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-md border px-3 text-sm " + (on ? "border-line bg-panel text-parchment" : "border-transparent text-muted");
}
function ForgeApp() {
	const storedView = useForge((s) => s.view);
	const view = NAV.some((entry) => entry.id === storedView) ? storedView : "dash";
	const setView = useForge((s) => s.setView);
	const boot = useBootScreen();
	const { user } = useCurrentUserState();
	useCloudRecents(user && !user.isDevFallback ? user.id : null);
	(0, import_react.useEffect)(() => {
		syncCatalogFromGitHub().catch(() => void 0);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!NAV.some((entry) => entry.id === storedView)) setView("dash");
	}, [storedView, setView]);
	(0, import_react.useEffect)(() => {
		let timer = 0;
		const load = () => {
			if (document.visibilityState === "hidden") return;
			useForge.getState().loadPrices();
		};
		const boot = () => {
			load();
			timer = window.setInterval(load, 6e4);
		};
		const unsubHydrate = useForge.persist.onFinishHydration(boot);
		if (useForge.persist.hasHydrated()) boot();
		else useForge.persist.rehydrate();
		let last = priceWatchKey(useForge.getState());
		const unsub = useForge.subscribe((state) => {
			const next = priceWatchKey(state);
			if (next === last) return;
			last = next;
			load();
		});
		const onVisible = () => {
			if (document.visibilityState === "visible") load();
		};
		document.addEventListener("visibilitychange", onVisible);
		return () => {
			unsubHydrate();
			unsub();
			document.removeEventListener("visibilitychange", onVisible);
			window.clearInterval(timer);
		};
	}, []);
	const page = NAV.find((entry) => entry.id === view) ?? NAV[0];
	const [menuOpen, setMenuOpen] = (0, import_react.useState)(false);
	const openView = (id) => {
		setView(id);
		setMenuOpen(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen bg-transparent text-parchment xl:pr-56",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mist mist-teal" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mist mist-violet" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-50 w-full border-b border-line bg-panel/95 backdrop-blur-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "page flex items-center justify-between gap-4 py-3 lg:py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "whitespace-nowrap font-display text-xl leading-none",
							children: "Hearthforge"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 whitespace-nowrap text-xs leading-none text-muted",
							children: "Albion crafting desk"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex shrink-0 items-center gap-4 whitespace-nowrap",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sr-only",
									children: "Server"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex h-11 items-center whitespace-nowrap rounded-lg border border-line bg-panel px-3 text-sm text-parchment",
									children: "Asia"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOut, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => signIn("grok-google", { callbackURL: "/" }),
								className: "h-11 shrink-0 whitespace-nowrap rounded-lg border border-line px-3 text-sm text-parchment",
								children: "Sign in"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line text-parchment xl:hidden",
								"aria-expanded": menuOpen,
								"aria-label": menuOpen ? "Close menu" : "Open menu",
								onClick: () => setMenuOpen((open) => !open),
								children: menuOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
							})
						]
					})]
				}), menuOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "page flex flex-col gap-1 pb-3 xl:hidden",
					children: NAV.map((entry) => {
						const Icon = entry.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => openView(entry.id),
							className: navClass(view === entry.id) + " h-11 w-full justify-start",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), entry.label]
						}, entry.id);
					})
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "fixed bottom-0 right-0 top-0 z-40 hidden w-56 flex-col gap-1 overflow-y-auto border-l border-line bg-panel/95 p-3 xl:flex",
				children: NAV.map((entry) => {
					const Icon = entry.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => openView(entry.id),
						className: navClass(view === entry.id) + " w-full justify-start",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), entry.label]
					}, entry.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "page relative z-10 flex flex-col gap-section py-8",
				children: [
					view === "dash" ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "Hearthforge"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "page-title",
						children: page.label
					})] }),
					view === "dash" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dashboard, { onOpen: openView }) : null,
					view === "bench" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bench, {}) : null,
					view === "flip" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlipLab, {}) : null,
					view === "farm" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FarmLab, {}) : null,
					view === "labor" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LaborLab, {}) : null,
					view === "returns" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReturnFocusLab, {}) : null,
					view === "study" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudyLab, {}) : null,
					view === "reroll" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RerollLab, {}) : null,
					view === "recent" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecentLab, {}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "page relative z-10 pb-10 text-xs leading-relaxed text-muted",
				children: "Return rate, focus, study fame, nutrition, and repair follow the current Albion rules. Prices refresh about once a minute. Not affiliated with Sandbox Interactive."
			}),
			boot
		]
	});
}
function useBootScreen() {
	const [phase, setPhase] = (0, import_react.useState)("on");
	const loading = useForge((s) => s.loading);
	(0, import_react.useEffect)(() => {
		const started = performance.now();
		let sawLoad = false;
		let closed = false;
		const close = () => {
			if (closed) return;
			closed = true;
			const wait = Math.max(0, 250 - (performance.now() - started));
			window.setTimeout(() => setPhase("out"), wait);
		};
		const cap = window.setTimeout(close, 2800);
		const unsub = useForge.subscribe((state) => {
			if (state.loading) sawLoad = true;
			if (!useForge.persist.hasHydrated()) return;
			if (state.priceAt != null || state.priceError || sawLoad && !state.loading) close();
		});
		const state = useForge.getState();
		if (useForge.persist.hasHydrated() && (state.priceAt != null || state.priceError)) close();
		return () => {
			unsub();
			window.clearTimeout(cap);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (phase !== "out") return;
		const timer = window.setTimeout(() => setPhase("off"), 200);
		return () => window.clearTimeout(timer);
	}, [phase]);
	if (phase === "off") return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink transition-opacity duration-200 " + (phase === "out" ? "pointer-events-none opacity-0" : "opacity-100"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex size-16 items-center justify-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-0 rounded-full border border-line" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-brass" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hammer, { className: "size-6 text-brass" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 font-display text-4xl text-parchment",
				children: "Hearthforge"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: loading ? "Reading the order book" : "Opening the desk"
			})
		]
	});
}
function mergeRecents(local, remote) {
	const map = /* @__PURE__ */ new Map();
	for (const row of [...remote, ...local]) {
		const key = `${row.itemId}|${row.enchant}|${row.route}|${row.city}`;
		const prev = map.get(key);
		if (!prev || row.at >= prev.at) map.set(key, {
			...row,
			saved: row.saved || Boolean(prev?.saved)
		});
		else if (row.saved) map.set(key, {
			...prev,
			saved: true
		});
	}
	return [...map.values()];
}
function useCloudRecents(userId) {
	(0, import_react.useEffect)(() => {
		if (!userId) return;
		let stop = false;
		let timer = 0;
		let lastSent = "";
		const send = (recents) => {
			const saved = recents.filter((row) => row.saved);
			const payload = [...recents.filter((row) => !row.saved).slice(0, 10), ...saved].slice(0, 40);
			const body = JSON.stringify(payload);
			if (body === lastSent) return;
			lastSent = body;
			saveCraftRecents({ data: { recents } }).catch(() => {
				lastSent = "";
			});
		};
		loadCraftRecents().then((remote) => {
			if (stop) return;
			const merged = mergeRecents(useForge.getState().recents ?? [], remote);
			lastSent = JSON.stringify(merged);
			useForge.getState().setRecents(merged);
			if (JSON.stringify(remote) !== lastSent) send(merged);
		}).catch(() => void 0);
		const unsub = useForge.subscribe((state, prev) => {
			if (state.recents === prev.recents) return;
			window.clearTimeout(timer);
			timer = window.setTimeout(() => send(state.recents ?? []), 600);
		});
		return () => {
			stop = true;
			unsub();
			window.clearTimeout(timer);
		};
	}, [userId]);
}
var SplitComponent = ForgeApp;
//#endregion
export { SplitComponent as component };
