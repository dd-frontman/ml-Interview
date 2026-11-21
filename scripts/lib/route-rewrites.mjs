const EXACT_REWRITES = new Map([
	[
		"python/yazyk-python/asyncio-korutiny-i-taskgroup/index.md",
		"python/yazyk-python/asyncio-korutiny-i-taskgroup.md",
	],
]);

const PREFIX_REWRITES = [
	{
		from: "python/yazyk-python/1-core/osnovy-yazyka/",
		to: "python/yazyk-python/1-core/",
	},
	{
		from: "python/yazyk-python/1-core/operatory-i-usloviya/",
		to: "python/yazyk-python/1-core/",
	},
	{
		from: "python/yazyk-python/1-core/iteratsiya/tsikly-for-i-range/",
		to: "python/yazyk-python/1-core/tsikly-for-i-range/",
		rewriteIndex: true,
	},
	{
		from: "python/yazyk-python/1-core/iteratsiya/",
		to: "python/yazyk-python/1-core/",
	},
	{
		from: "python/yazyk-python/1-core/funktsii-v-python/instrumenty/",
		to: "python/yazyk-python/1-core/",
	},
];

const IMPORTS_REWRITES = new Set(["modul-sys.md", "moduli-venv-i-pip.md"]);

export function rewriteDocPath(sourcePath) {
	const normalized = sourcePath.replace(/^\/+/, "");
	const exact = EXACT_REWRITES.get(normalized);
	if (exact) {
		return exact;
	}

	const importsPrefix = "python/yazyk-python/1-core/importy-i-moduli/";
	if (normalized.startsWith(importsPrefix)) {
		const rest = normalized.slice(importsPrefix.length);
		if (IMPORTS_REWRITES.has(rest)) {
			return `python/yazyk-python/1-core/${rest}`;
		}
	}

	for (const rule of PREFIX_REWRITES) {
		if (!normalized.startsWith(rule.from)) {
			continue;
		}

		const rest = normalized.slice(rule.from.length);
		if (rest === "index.md" && !rule.rewriteIndex) {
			return normalized;
		}
		return `${rule.to}${rest}`;
	}

	return normalized;
}
