import { n as createMiddleware } from "../server.js";
import { z } from "zod";
//#region src/lib/auth/middleware.ts
/**
* Auth middleware for server functions — the standard way to get the caller's
* verified user id. When deployed the session cookie is same-origin and rides
* along automatically. In the live preview the client also forwards the bearer
* token (partitioned cookies) via the `.client` hook below — call sites do not
* thread it themselves.
*
*   import { createServerFn } from "@tanstack/react-start";
*   import { getSql } from "@/lib/db";
*   import { authMiddleware } from "@/lib/auth/middleware";
*
*   export const listTodos = createServerFn({ method: "GET" })
*     .middleware([authMiddleware])
*     .handler(async ({ context }) => {
*       const sql = await getSql();
*       return sql`select * from todos where user_id = ${context.userId}`;
*     });
*
* Signed out with auth on (live preview included) -> throws `UnauthorizedError`
* (see `verify.server.ts`). With auth disabled (`VITE_AUTH_ENABLED=false`, the
* shipped default) it resolves the shared dev user — but throws instead when a
* `DATABASE_URL` is also set, so an app without sign-in must not use this at
* all. On the auth-on path, use it on every server function that touches
* per-user data and scope every query by `context.userId`.
*/
var authMiddleware = createMiddleware({ type: "function" }).client(async ({ next }) => {
	const { getBearerToken } = await import("./client-CUsKFAtC.js").then((n) => n.n);
	return next({ sendContext: { bearerToken: getBearerToken() ?? void 0 } });
}).server(async ({ next, context }) => {
	const { assertSameSiteRequest } = await import("./isolation.server-BirgqTzC.js");
	const { requireUserId } = await import("./verify.server-C0t1PxLV.js");
	assertSameSiteRequest();
	return next({ context: { userId: await requireUserId(context.bearerToken) } });
});
//#endregion
//#region src/lib/forge/desk.ts
var DeskSchema = z.object({
	server: z.enum([
		"asia",
		"europe",
		"americas"
	]),
	premium: z.boolean(),
	buyCity: z.string().min(1).max(40),
	sellCity: z.string().min(1).max(40),
	buyMode: z.enum(["instant", "order"]),
	sellMode: z.enum([
		"order",
		"instant",
		"notax"
	]),
	leftover: z.enum(["reuse", "sell"]),
	stationRate: z.number().min(0).max(1e4),
	quality: z.number().int().min(1).max(5),
	active: z.string().min(1).max(40),
	lines: z.array(z.object({
		uid: z.string().min(1).max(40),
		itemId: z.string().min(1).max(80),
		enchant: z.number().int().min(0).max(4),
		route: z.enum(["direct", "upgrade"]),
		runs: z.number().int().min(1).max(1e5),
		place: z.enum([
			"city",
			"island",
			"hideout"
		]),
		city: z.string().min(1).max(40),
		power: z.number().int().min(1).max(20),
		hoBiome: z.enum([
			"forest",
			"swamp",
			"highland",
			"steppe",
			"mountain",
			"caerleon",
			"brecilien"
		]),
		hoQuality: z.number().int().min(1).max(6),
		hoRegion: z.enum(["outlands", "roads"]),
		extra: z.number().min(0).max(100),
		focus: z.boolean(),
		daily: z.union([
			z.literal(0),
			z.literal(10),
			z.literal(20)
		]),
		mastery: z.number().min(0).max(100),
		specialist: z.number().min(0).max(100),
		siblings: z.number().min(0).max(100),
		journal: z.boolean(),
		journalTier: z.number().int().min(2).max(8).optional(),
		journalTiers: z.array(z.number().int().min(2).max(8)).max(7).optional(),
		productOverride: z.number().nullable(),
		matOverrides: z.record(z.string().max(80), z.number()),
		focusOverride: z.number().nullable()
	})).min(1).max(40)
});
function snapshotFrom(state) {
	return DeskSchema.parse({
		server: state.server,
		premium: state.premium,
		buyCity: state.buyCity,
		sellCity: state.sellCity,
		buyMode: state.buyMode,
		sellMode: state.sellMode,
		leftover: state.leftover,
		stationRate: state.stationRate,
		quality: state.quality,
		active: state.active,
		lines: state.lines
	});
}
//#endregion
export { snapshotFrom as n, authMiddleware as r, DeskSchema as t };
