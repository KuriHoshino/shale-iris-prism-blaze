//#region \0tanstack-start-manifest:v
var tsrStartManifest = () => ({ routes: {
	__root__: {
		filePath: "/workspace/src/routes/__root.tsx",
		children: [
			"/",
			"/login",
			"/api/auth/$"
		],
		preloads: ["/albion-craft-island-labor/assets/index-CZRPaKPl.js", "/albion-craft-island-labor/assets/react-DB-4Zxce.js"],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/albion-craft-island-labor/assets/index-CZRPaKPl.js"
		} }]
	},
	"/": {
		filePath: "/workspace/src/routes/index.tsx",
		children: void 0,
		preloads: ["/albion-craft-island-labor/assets/routes-C4BtdZ3a.js", "/albion-craft-island-labor/assets/client-BjrGIzaI.js"]
	},
	"/login": {
		filePath: "/workspace/src/routes/login.tsx",
		children: void 0,
		preloads: ["/albion-craft-island-labor/assets/login-DpD2XsIY.js", "/albion-craft-island-labor/assets/client-BjrGIzaI.js"]
	}
} });
//#endregion
export { tsrStartManifest };
