import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

export const cwd = process.cwd();
export const docsRoot = path.join(cwd, "docs");

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const REQUIRED_FRONTMATTER_KEYS = ["title", "description", "tags", "updatedAt"];

export function toPosix(filePath) {
	return filePath.split(path.sep).join("/");
}

export function isInsidePublic(relativePath) {
	return relativePath === "public" || relativePath.startsWith("public/");
}

export function collectMarkdownFiles() {
	const files = [];
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

export function routeFromFilePath(filePath) {
	const rel = toPosix(path.relative(docsRoot, filePath)).replace(/\.md$/, "");
	return `/${rel}`;
}

export function splitFrontmatter(source) {
	const match = source.match(FRONTMATTER_RE);
	if (!match) {
		return {
			hasFrontmatter: false,
			frontmatterRaw: "",
			frontmatter: {},
			body: source,
		};
	}

	return {
		hasFrontmatter: true,
		frontmatterRaw: match[1],
		frontmatter: parseSimpleFrontmatter(match[1]),
		body: source.slice(match[0].length),
	};
}

function unquoteScalar(value) {
	const trimmed = value.trim();
	if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
		const inner = trimmed.slice(1, -1);
		return inner.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
	}
	if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
		const inner = trimmed.slice(1, -1);
		return inner.replace(/\\'/g, "'").replace(/\\\\/g, "\\");
	}
	return trimmed;
}

function parseScalar(value) {
	const unquoted = unquoteScalar(value);
	if (unquoted === "true") {
		return true;
	}
	if (unquoted === "false") {
		return false;
	}
	return unquoted;
}

export function parseSimpleFrontmatter(frontmatterRaw) {
	const result = {};
	const lines = frontmatterRaw.split(/\r?\n/);
	let activeArrayKey = null;

	for (const line of lines) {
		if (!line.trim() || line.trim().startsWith("#")) {
			continue;
		}

		const keyMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
		if (keyMatch) {
			const [, key, value] = keyMatch;
			if (value.trim() === "") {
				result[key] = [];
				activeArrayKey = key;
			} else {
				result[key] = parseScalar(value);
				activeArrayKey = null;
			}
			continue;
		}

		const itemMatch = line.match(/^\s*-\s*(.+)$/);
		if (itemMatch && activeArrayKey && Array.isArray(result[activeArrayKey])) {
			result[activeArrayKey].push(parseScalar(itemMatch[1]));
			continue;
		}

		activeArrayKey = null;
	}

	return result;
}

export function normalizeWhitespace(value) {
	return value.replace(/\s+/g, " ").trim();
}

export function extractTitleFromBody(body) {
	for (const line of body.split(/\r?\n/)) {
		const headingMatch = line.match(/^#{1,6}\s+(.+)$/);
		if (headingMatch) {
			return normalizeWhitespace(headingMatch[1].replace(/[*_`]/g, ""));
		}
	}
	return "";
}

export function slugToHuman(slug) {
	const normalized = slug
		.replace(/^index$/, "obzor")
		.replace(/^\d+-/, "")
		.replace(/[_-]+/g, " ")
		.trim();

	if (!normalized) {
		return "Материал";
	}

	return normalized[0].toUpperCase() + normalized.slice(1);
}

export function inferTitle(route, body) {
	const headingTitle = extractTitleFromBody(body);
	if (headingTitle) {
		return headingTitle;
	}

	const segments = route.replace(/^\//, "").split("/");
	const fileSlug = segments[segments.length - 1] || "material";
	return slugToHuman(fileSlug);
}

function stripCodeFences(source) {
	const lines = source.split(/\r?\n/);
	const sanitized = [];
	let inFence = false;

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

export function inferDescription(body, fallbackTitle) {
	const cleaned = stripCodeFences(body);
	const lines = cleaned.split(/\r?\n/);

	for (const line of lines) {
		const value = line.trim();
		if (!value) {
			continue;
		}
		if (
			value.startsWith("#") ||
			value.startsWith(">") ||
			value.startsWith("-") ||
			value.startsWith("*") ||
			value.startsWith("|") ||
			value.startsWith("<") ||
			value.startsWith("{") ||
			value.startsWith("}") ||
			value.startsWith("[") ||
			value.startsWith("]") ||
			value.startsWith(":") ||
			value.startsWith(":::") ||
			/^import\s+/i.test(value) ||
			/^export\s+/i.test(value) ||
			/href:\s*["']/.test(value) ||
			/title:\s*["']/.test(value) ||
			value === "---"
		) {
			continue;
		}

		const normalized = normalizeWhitespace(
			value
				.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
				.replace(/`([^`]+)`/g, "$1")
				.replace(/\*\*([^*]+)\*\*/g, "$1")
		);

		if (normalized.length < 30) {
			continue;
		}

		if (normalized.length <= 170) {
			return normalized;
		}

		return `${normalized.slice(0, 167).trimEnd()}...`;
	}

	return `Краткая выжимка по теме "${fallbackTitle}".`;
}

export function inferTags(route) {
	const routePath = route.replace(/^\//, "");
	const segments = routePath.split("/");
	const tagSet = new Set();

	const rootTag = segments[0];
	if (rootTag && rootTag !== "index") {
		tagSet.add(rootTag);
	}

	for (let index = 1; index < segments.length; index += 1) {
		const segment = segments[index];
		if (!segment || segment === "index") {
			continue;
		}

		const normalized = segment.replace(/^\d+-/, "");
		if (normalized.length >= 2) {
			tagSet.add(normalized);
		}
	}

	return Array.from(tagSet).slice(0, 6);
}

export function normalizeTags(value, route) {
	if (Array.isArray(value)) {
		const normalized = value
			.map((item) => (typeof item === "string" ? item.trim() : ""))
			.filter(Boolean);
		if (normalized.length > 0) {
			return Array.from(new Set(normalized)).slice(0, 8);
		}
	}
	return inferTags(route);
}

function safeYamlString(value) {
	return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export function stringifyFrontmatter(frontmatter) {
	const lines = ["---"];

	lines.push(`title: "${safeYamlString(frontmatter.title)}"`);
	lines.push(`description: "${safeYamlString(frontmatter.description)}"`);

	lines.push("tags:");
	for (const tag of frontmatter.tags) {
		lines.push(`  - "${safeYamlString(tag)}"`);
	}

	lines.push(`updatedAt: "${frontmatter.updatedAt}"`);

	if (frontmatter.search === false) {
		lines.push("search: false");
	}

	lines.push("---", "");
	return lines.join("\n");
}

export function isValidIsoDate(value) {
	return typeof value === "string" && DATE_RE.test(value);
}

export function getGitLastUpdatedAt(filePath) {
	try {
		const output = execFileSync("git", ["log", "-1", "--format=%cs", "--", filePath], {
			encoding: "utf8",
			stdio: ["ignore", "pipe", "ignore"],
		}).trim();
		if (isValidIsoDate(output)) {
			return output;
		}
	} catch {
		// no-op
	}
	return new Date().toISOString().slice(0, 10);
}

export function escapeTsString(value) {
	return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export function normalizeInternalRoute(route) {
	if (route === "/") {
		return "/index";
	}
	return route.replace(/\/+$/, "");
}
