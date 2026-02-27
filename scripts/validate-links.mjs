import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const docsRoot = path.join(cwd, "docs");
const readmePath = path.join(cwd, "README.md");
const sidebarGeneratedPath = path.join(cwd, ".vitepress", "sidebar.generated.ts");
const sidebarFallbackPath = path.join(cwd, ".vitepress", "sidebar.ts");

const EXTERNAL_PROTOCOL_RE = /^(https?:|mailto:|tel:|data:)/i;
const MARKDOWN_LINK_RE = /!?\[[^\]]*\]\(([^)]+)\)/g;
const URL_WITH_TITLE_RE = /^(\S+)(?:\s+["'][^"']*["'])?$/;
const RELATED_TOPICS_BLOCK_RE = /<RelatedTopics[\s\S]*?\/>/g;
const RELATED_TOPICS_HREF_RE = /href:\s*"([^"]+)"/g;
const ROOT_LINK_RE = /link:\s*"([^"]+)"/g;

function toPosix(filePath) {
	return filePath.split(path.sep).join("/");
}

function isInsidePublic(relativePath) {
	return relativePath === "public" || relativePath.startsWith("public/");
}

function routeFromFilePath(filePath) {
	const rel = toPosix(path.relative(docsRoot, filePath)).replace(/\.md$/, "");
	return `/${rel}`;
}

function normalizeRoute(route) {
	if (route === "/") {
		return "/index";
	}
	return route.replace(/\/+$/, "");
}

function resolveRouteAlias(route, routeMap) {
	const normalized = route.replace(/\/+$/, "") || "/";
	const canonical = normalizeRoute(normalized);

	if (routeMap.has(canonical)) {
		return canonical;
	}

	if (canonical === "/index") {
		return routeMap.has("/index") ? "/index" : null;
	}

	const indexAlias = `${canonical}/index`;
	if (routeMap.has(indexAlias)) {
		return indexAlias;
	}

	return null;
}

function stripCodeFences(source) {
	const lines = source.split(/\r?\n/);
	let inFence = false;
	const sanitized = [];

	for (const line of lines) {
		if (/^\s*```/.test(line)) {
			inFence = !inFence;
			sanitized.push("");
			continue;
		}
		sanitized.push(inFence ? "" : line);
	}

	return sanitized.join("\n");
}

function normalizeTarget(rawTarget) {
	let target = rawTarget.trim();
	if (target.startsWith("<") && target.endsWith(">")) {
		target = target.slice(1, -1).trim();
	}

	const match = target.match(URL_WITH_TITLE_RE);
	if (match) {
		target = match[1];
	}

	return target;
}

function splitPathAndHash(target) {
	const hashIndex = target.indexOf("#");
	if (hashIndex === -1) {
		return { pathPart: target, hashPart: "" };
	}
	return {
		pathPart: target.slice(0, hashIndex),
		hashPart: target.slice(hashIndex + 1),
	};
}

function collectDocRoutes() {
	const routes = new Map();
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
				routes.set(routeFromFilePath(abs), abs);
			}
		}
	}

	return routes;
}

function collectMarkdownFiles() {
	const files = [];
	if (fs.existsSync(readmePath)) {
		files.push(readmePath);
	}

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
				files.push(abs);
			}
		}
	}

	return files.sort();
}

function extractSidebarLinks() {
	const sidebarPath = fs.existsSync(sidebarGeneratedPath)
		? sidebarGeneratedPath
		: sidebarFallbackPath;
	if (!fs.existsSync(sidebarPath)) {
		return new Set();
	}

	const source = fs.readFileSync(sidebarPath, "utf8");
	const links = new Set();
	let match;
	while ((match = ROOT_LINK_RE.exec(source)) !== null) {
		links.add(match[1].trim());
	}
	return links;
}

function resolveRelativeTarget(baseFile, targetPath, routeMap) {
	const baseDir = path.dirname(baseFile);
	const resolved = path.resolve(baseDir, targetPath);
	const candidates = [];

	if (path.extname(targetPath)) {
		candidates.push(resolved);
	} else {
		candidates.push(resolved);
		candidates.push(`${resolved}.md`);
		candidates.push(path.join(resolved, "index.md"));
	}

	for (const candidate of candidates) {
		if (!fs.existsSync(candidate)) {
			continue;
		}

		if (candidate.endsWith(".md") && candidate.startsWith(docsRoot)) {
			return {
				exists: true,
				route: normalizeRoute(routeFromFilePath(candidate)),
			};
		}

		return { exists: true, route: null };
	}

	const maybeRoute = normalizeRoute(`/${toPosix(path.relative(docsRoot, resolved))}`);
	if (routeMap.has(maybeRoute)) {
		return { exists: true, route: maybeRoute };
	}

	return { exists: false, route: null };
}

function validateRelatedTopicsBlock(source, currentRoute, routeMap, rel) {
	const errors = [];
	const blocks = [...source.matchAll(RELATED_TOPICS_BLOCK_RE)];

	for (const block of blocks) {
		const raw = block[0];
		const seen = new Set();
		let hrefMatch;
		while ((hrefMatch = RELATED_TOPICS_HREF_RE.exec(raw)) !== null) {
			const hrefRaw = hrefMatch[1].trim();
			const resolvedHref = resolveRouteAlias(hrefRaw, routeMap);
			const dedupeKey = resolvedHref ?? normalizeRoute(hrefRaw);
			if (seen.has(dedupeKey)) {
				errors.push(`${rel}: duplicate href in RelatedTopics: ${hrefRaw}`);
				continue;
			}
			seen.add(dedupeKey);

			if (resolvedHref && resolvedHref === currentRoute) {
				errors.push(`${rel}: self-link in RelatedTopics: ${hrefRaw}`);
			}

			if (!resolvedHref) {
				errors.push(`${rel}: missing route in RelatedTopics: ${hrefRaw}`);
			}
		}
	}

	return errors;
}

function validateMarkdownLinks(filePath, routeMap, inboundCount) {
	const errors = [];
	const source = fs.readFileSync(filePath, "utf8");
	const searchable = stripCodeFences(source);
	const rel = toPosix(path.relative(cwd, filePath));
	const currentRoute = filePath.startsWith(docsRoot)
		? normalizeRoute(routeFromFilePath(filePath))
		: null;

	if (currentRoute) {
		errors.push(...validateRelatedTopicsBlock(source, currentRoute, routeMap, rel));
	}

	let match;
	while ((match = MARKDOWN_LINK_RE.exec(searchable)) !== null) {
		const rawTarget = match[1];
		const target = normalizeTarget(rawTarget);
		if (!target) {
			continue;
		}

		if (target.startsWith("#")) {
			continue;
		}

		if (EXTERNAL_PROTOCOL_RE.test(target)) {
			if (/^https?:/i.test(target)) {
				try {
					// eslint-disable-next-line no-new
					new URL(target);
				} catch {
					errors.push(`${rel}: invalid external URL: ${target}`);
				}
			}
			continue;
		}

		const { pathPart, hashPart } = splitPathAndHash(target);
		if (!pathPart) {
			continue;
		}

		if (pathPart.startsWith("/")) {
			const normalized = pathPart.replace(/\/+$/, "") || "/";
			const resolvedRoute = resolveRouteAlias(normalized, routeMap);
			const publicCandidate = path.join(docsRoot, "public", normalized.replace(/^\//, ""));
			if (!resolvedRoute && !fs.existsSync(publicCandidate)) {
				errors.push(`${rel}: missing root link target: ${target}`);
				continue;
			}

			if (currentRoute && resolvedRoute && resolvedRoute === currentRoute && !hashPart) {
				errors.push(`${rel}: self-link detected: ${target}`);
			}

			if (resolvedRoute && (!currentRoute || resolvedRoute !== currentRoute)) {
				inboundCount.set(resolvedRoute, (inboundCount.get(resolvedRoute) ?? 0) + 1);
			}
			continue;
		}

		const resolved = resolveRelativeTarget(filePath, pathPart, routeMap);
		if (!resolved.exists) {
			errors.push(`${rel}: missing relative link target: ${target}`);
			continue;
		}

		if (resolved.route && currentRoute && resolved.route === currentRoute && !hashPart) {
			errors.push(`${rel}: self-link detected: ${target}`);
			continue;
		}

		if (resolved.route && (!currentRoute || resolved.route !== currentRoute)) {
			inboundCount.set(resolved.route, (inboundCount.get(resolved.route) ?? 0) + 1);
		}
	}

	return errors;
}

if (!fs.existsSync(docsRoot)) {
	console.error("Link validation failed: docs directory not found.");
	process.exit(1);
}

const routeMap = collectDocRoutes();
const routeSet = new Set(routeMap.keys());
const sidebarRawLinks = extractSidebarLinks();
const sidebarLinks = new Set(
	Array.from(sidebarRawLinks)
		.map((link) => resolveRouteAlias(link, routeMap))
		.filter(Boolean)
);
const inboundCount = new Map();
const files = collectMarkdownFiles();
const errors = files.flatMap((filePath) => validateMarkdownLinks(filePath, routeMap, inboundCount));

for (const route of routeSet) {
	if (route === "/index") {
		continue;
	}
	if (sidebarLinks.has(route)) {
		continue;
	}
	if ((inboundCount.get(route) ?? 0) > 0) {
		continue;
	}
	errors.push(`orphan page (no sidebar and no inbound links): ${route}`);
}

if (errors.length > 0) {
	console.error("Link validation failed:");
	for (const error of errors) {
		console.error(`- ${error}`);
	}
	process.exit(1);
}

console.log(
	`Link validation passed (${files.length} markdown files, ${routeSet.size} routes, ${sidebarLinks.size} sidebar links).`
);
