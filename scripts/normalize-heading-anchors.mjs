import fs from "node:fs";
import path from "node:path";
import { createMarkdownRenderer } from "vitepress";
import {
	collectMarkdownFiles,
	cwd,
	routeFromFilePath,
	toPosix,
} from "./lib/content-utils.mjs";

const mode = process.argv[2] ?? "--check";
if (!new Set(["--check", "--write"]).has(mode)) {
	console.error("Usage: node scripts/normalize-heading-anchors.mjs [--check|--write]");
	process.exit(2);
}

const CYRILLIC_TO_LATIN = {
	а: "a",
	б: "b",
	в: "v",
	г: "g",
	д: "d",
	е: "e",
	ё: "yo",
	ж: "zh",
	з: "z",
	и: "i",
	й: "y",
	к: "k",
	л: "l",
	м: "m",
	н: "n",
	о: "o",
	п: "p",
	р: "r",
	с: "s",
	т: "t",
	у: "u",
	ф: "f",
	х: "kh",
	ц: "ts",
	ч: "ch",
	ш: "sh",
	щ: "shch",
	ъ: "",
	ы: "y",
	ь: "",
	э: "e",
	ю: "yu",
	я: "ya",
};

const EXTERNAL_PROTOCOL_RE = /^(?:https?:|mailto:|tel:|data:)/i;
const MARKDOWN_LINK_RE = /(!?\[[^\]]*\]\()([^)]+)(\))/g;
const CUSTOM_ANCHOR_RE = /[ \t]+\{#[^}\s]+\}[ \t]*$/;
const HEADING_LINE_RE = /^(\s{0,3}#{1,6}[ \t]+)(.*?)([ \t]+#+[ \t]*)?$/;

function transliterate(value) {
	return Array.from(value.toLowerCase(), (character) => {
		return CYRILLIC_TO_LATIN[character] ?? character;
	}).join("");
}

function createBaseSlug(value) {
	const slug = transliterate(value)
		.normalize("NFKD")
		.replace(/\p{M}+/gu, "")
		.replace(/\+/g, " plus ")
		.replace(/&/g, " and ")
		.replace(/@/g, " at ")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.replace(/-{2,}/g, "-");

	return slug || "section";
}

function getVisibleHeadingText(inlineToken) {
	if (!Array.isArray(inlineToken?.children)) {
		return inlineToken?.content ?? "";
	}

	return inlineToken.children
		.filter((token) => ["text", "code_inline", "image"].includes(token.type))
		.map((token) => token.content)
		.join("");
}

function allocateSlug(baseSlug, usedSlugs) {
	if (!usedSlugs.has(baseSlug)) {
		usedSlugs.add(baseSlug);
		return baseSlug;
	}

	let suffix = 2;
	let candidate = `${baseSlug}-${suffix}`;
	while (usedSlugs.has(candidate)) {
		suffix += 1;
		candidate = `${baseSlug}-${suffix}`;
	}

	usedSlugs.add(candidate);
	return candidate;
}

function replaceHeadingAnchor(line, slug) {
	const match = line.match(HEADING_LINE_RE);
	if (!match) {
		return null;
	}

	const [, prefix, rawHeading, closingHashes = ""] = match;
	const heading = rawHeading.replace(CUSTOM_ANCHOR_RE, "").trimEnd();
	return `${prefix}${heading} {#${slug}}${closingHashes}`;
}

function createRouteMap(files) {
	const routes = new Map();
	for (const filePath of files) {
		const route = routeFromFilePath(filePath);
		routes.set(route, filePath);
		if (route.endsWith("/index")) {
			routes.set(route.slice(0, -"/index".length) || "/", filePath);
		}
	}
	return routes;
}

function resolveTargetFile(currentFile, targetPath, routeMap) {
	if (!targetPath) {
		return currentFile;
	}

	if (targetPath.startsWith("/")) {
		const route = targetPath.replace(/\.(?:md|html)$/, "").replace(/\/+$/, "") || "/";
		return routeMap.get(route) ?? routeMap.get(`${route}/index`) ?? null;
	}

	const absoluteTarget = path.resolve(path.dirname(currentFile), targetPath);
	const candidates = path.extname(absoluteTarget)
		? [absoluteTarget]
		: [absoluteTarget, `${absoluteTarget}.md`, path.join(absoluteTarget, "index.md")];

	return candidates.find((candidate) => fs.existsSync(candidate)) ?? null;
}

function updateLinkTarget(rawTarget, currentFile, anchorMaps, routeMap) {
	const leadingWhitespace = rawTarget.match(/^\s*/)?.[0] ?? "";
	const trailingWhitespace = rawTarget.match(/\s*$/)?.[0] ?? "";
	const trimmed = rawTarget.trim();
	const targetMatch = trimmed.match(/^(\S+)([\s\S]*)$/);
	if (!targetMatch) {
		return rawTarget;
	}

	let [, url, titleSuffix] = targetMatch;
	const wrappedInAngles = url.startsWith("<") && url.endsWith(">");
	if (wrappedInAngles) {
		url = url.slice(1, -1);
	}

	if (EXTERNAL_PROTOCOL_RE.test(url)) {
		return rawTarget;
	}

	const hashIndex = url.indexOf("#");
	if (hashIndex === -1) {
		return rawTarget;
	}

	const targetPath = url.slice(0, hashIndex);
	const encodedAnchor = url.slice(hashIndex + 1);
	let currentAnchor;
	try {
		currentAnchor = decodeURIComponent(encodedAnchor);
	} catch {
		currentAnchor = encodedAnchor;
	}

	const targetFile = resolveTargetFile(currentFile, targetPath, routeMap);
	const nextAnchor = targetFile ? anchorMaps.get(targetFile)?.get(currentAnchor) : null;
	if (!nextAnchor || nextAnchor === currentAnchor) {
		return rawTarget;
	}

	const nextUrl = `${targetPath}#${nextAnchor}`;
	const formattedUrl = wrappedInAngles ? `<${nextUrl}>` : nextUrl;
	return `${leadingWhitespace}${formattedUrl}${titleSuffix}${trailingWhitespace}`;
}

function replaceInternalAnchorLinks(source, filePath, anchorMaps, routeMap) {
	const eol = source.includes("\r\n") ? "\r\n" : "\n";
	const lines = source.split(/\r?\n/);
	let activeFence = null;
	let changes = 0;

	for (let index = 0; index < lines.length; index += 1) {
		const line = lines[index];
		const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);
		if (fenceMatch) {
			const marker = fenceMatch[1][0];
			if (activeFence === null) {
				activeFence = marker;
			} else if (activeFence === marker) {
				activeFence = null;
			}
			continue;
		}

		if (activeFence !== null) {
			continue;
		}

		lines[index] = line.replace(MARKDOWN_LINK_RE, (fullMatch, prefix, rawTarget, suffix) => {
			const nextTarget = updateLinkTarget(rawTarget, filePath, anchorMaps, routeMap);
			if (nextTarget !== rawTarget) {
				changes += 1;
			}
			return `${prefix}${nextTarget}${suffix}`;
		});
	}

	return { source: lines.join(eol), changes };
}

const markdown = await createMarkdownRenderer(cwd);
const files = collectMarkdownFiles();
const routeMap = createRouteMap(files);
const plans = new Map();
const anchorMaps = new Map();
const issues = [];
let headingCount = 0;

for (const filePath of files) {
	const source = fs.readFileSync(filePath, "utf8");
	const eol = source.includes("\r\n") ? "\r\n" : "\n";
	const lines = source.split(/\r?\n/);
	const tokens = markdown.parse(source, {});
	const usedSlugs = new Set();
	const fileAnchorMap = new Map();

	for (let index = 0; index < tokens.length; index += 1) {
		const token = tokens[index];
		if (token.type !== "heading_open" || !token.map) {
			continue;
		}

		const inlineToken = tokens[index + 1];
		const visibleText = getVisibleHeadingText(inlineToken);
		const slug = allocateSlug(createBaseSlug(visibleText), usedSlugs);
		const lineIndex = token.map[0];
		const nextLine = replaceHeadingAnchor(lines[lineIndex], slug);
		if (nextLine === null) {
			issues.push(`${toPosix(path.relative(cwd, filePath))}:${lineIndex + 1} unsupported heading`);
			continue;
		}

		const oldAnchor = token.attrGet("id");
		if (oldAnchor) {
			fileAnchorMap.set(oldAnchor, slug);
		}

		headingCount += 1;
		if (lines[lineIndex] !== nextLine) {
			issues.push(
				`${toPosix(path.relative(cwd, filePath))}:${lineIndex + 1} ${oldAnchor ?? "<none>"} -> ${slug}`
			);
			lines[lineIndex] = nextLine;
		}
	}

	anchorMaps.set(filePath, fileAnchorMap);
	plans.set(filePath, { original: source, source: lines.join(eol) });
}

let linkChanges = 0;
for (const [filePath, plan] of plans) {
	const result = replaceInternalAnchorLinks(plan.source, filePath, anchorMaps, routeMap);
	plan.source = result.source;
	linkChanges += result.changes;
}

const changedPlans = [...plans.entries()].filter(([, plan]) => plan.source !== plan.original);

if (mode === "--write") {
	for (const [filePath, plan] of changedPlans) {
		fs.writeFileSync(filePath, plan.source, "utf8");
	}
	console.log(
		`Heading anchors normalized: ${headingCount} headings, ${changedPlans.length} files, ${linkChanges} links updated.`
	);
	process.exit(0);
}

if (issues.length > 0 || changedPlans.length > 0) {
	console.error(
		`Heading anchor validation failed: ${issues.length} headings and ${linkChanges} links need normalization.`
	);
	for (const issue of issues.slice(0, 20)) {
		console.error(`- ${issue}`);
	}
	if (issues.length > 20) {
		console.error(`...and ${issues.length - 20} more`);
	}
	console.error("Run `yarn sync:anchors` to fix them.");
	process.exit(1);
}

console.log(`Heading anchor validation passed (${headingCount} headings).`);
