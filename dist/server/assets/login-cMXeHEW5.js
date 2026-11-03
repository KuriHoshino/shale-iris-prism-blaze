import { r as signIn } from "./client-CUsKFAtC.js";
import { a as GROK_PROVIDERS } from "./server-CHAsLMwu.js";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/login.tsx?tsr-split=component
function Login() {
	return /* @__PURE__ */ jsx("main", {
		className: "grid min-h-screen place-items-center bg-ink p-6 text-parchment",
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-sm space-y-3",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "font-display text-3xl",
					children: "Sign in"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-sm text-muted",
					children: "Sign in with Google to keep saved crafts on your account."
				}),
				GROK_PROVIDERS.map((provider) => /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => signIn(provider.providerId, { callbackURL: "/" }),
					className: "h-11 w-full rounded-lg border border-line bg-panel text-sm text-parchment",
					children: ["Continue with ", provider.label]
				}, provider.providerId))
			]
		})
	});
}
//#endregion
export { Login as component };
