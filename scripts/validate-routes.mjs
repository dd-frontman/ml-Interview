import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const docsRoot = path.join(cwd, "docs");
const sidebarPath = path.join(cwd, ".vitepress", "sidebar.ts");
const sidebarGeneratedPath = path.join(cwd, ".vitepress", "sidebar.generated.ts");
const homePath = path.join(docsRoot, "index.md");

const ROUTE_RE = /^\/[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/;

function toPosix(filePath) {
	return filePath.split(path.sep).join("/");
}

function isInsidePublic(relativePath) {
	return relativePath === "public" || relativePath.startsWith("public/");
}

function collectMarkdownRoutes() {
	const routes = [];
	const stack = [docsRoot];

	while (stack.length > 0) {
		const current = stack.pop();
		for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
			const abs = path.join(current, entry.name);
			const rel = toPosix(path.relative(docsRoot, abs));
			if (isInsidePublic(rel)) {
				continue;
			}

			if (entry.isDirectory()) {
				stack.push(abs);
				continue;
			}

			if (entry.isFile() && entry.name.endsWith(".md")) {
				routes.push(`/${rel.replace(/\.md$/, "")}`);
			}
		}
	}

	return routes.sort();
}

function extractMatches(filePath, regex) {
	if (!fs.existsSync(filePath)) {
		return [];
	}
	const source = fs.readFileSync(filePath, "utf8");
	return [...source.matchAll(regex)].map((match) => match[1]);
}

function resolveRouteAlias(route, routeSet) {
	const normalized = route.replace(/\/+$/, "") || "/";
	if (routeSet.has(normalized)) {
		return normalized;
	}

	if (normalized === "/" && routeSet.has("/index")) {
		return "/index";
	}

	const indexAlias = `${normalized}/index`;
	if (routeSet.has(indexAlias)) {
		return indexAlias;
	}

	return null;
}

const routes = collectMarkdownRoutes();
const routeSet = new Set(routes);
const errors = [];

for (const route of routes) {
	if (!ROUTE_RE.test(route)) {
		errors.push(`Invalid route format in docs: ${route}`);
	}
}

const sidebarSourcePath = fs.existsSync(sidebarGeneratedPath) ? sidebarGeneratedPath : sidebarPath;
const sidebarLinks = extractMatches(sidebarSourcePath, /link:\s*"([^"]+)"/g);
for (const link of sidebarLinks) {
	if (!ROUTE_RE.test(link)) {
		errors.push(`Invalid sidebar link format: ${link}`);
		continue;
	}
	if (!resolveRouteAlias(link, routeSet)) {
		errors.push(`Sidebar link points to missing page: ${link}`);
	}
}

const homeLinks = extractMatches(homePath, /withBase\(['"]([^'"]+)['"]\)/g);
for (const link of homeLinks) {
	if (!ROUTE_RE.test(link)) {
		errors.push(`Invalid home route format: ${link}`);
		continue;
	}
	if (!resolveRouteAlias(link, routeSet)) {
		errors.push(`Home page link points to missing page: ${link}`);
	}
}

if (errors.length > 0) {
	console.error("Route validation failed:");
	for (const error of errors) {
		console.error(`- ${error}`);
	}
	process.exit(1);
}

console.log(
	`Route validation passed (${routes.length} pages, ${sidebarLinks.length} sidebar links).`
);
