import fs from "node:fs";
import path from "node:path";
import {
	REQUIRED_FRONTMATTER_KEYS,
	collectMarkdownFiles,
	docsRoot,
	splitFrontmatter,
	toPosix,
} from "./lib/content-utils.mjs";

const cwd = process.cwd();
const docsIndexPath = path.join(docsRoot, "index.md");

const LINE_RULES = [
	{
		pattern: /(?:\?|&)utm_source=chatgpt\.com/g,
		message: "remove tracking parameter utm_source=chatgpt.com",
	},
	{
		pattern: /:contentReference\[oaicite:[^\]]+\]\{[^}]+\}/g,
		message: "remove oaicite artifact",
	},
	{
		pattern: /^\s*::contentReference\[oaicite:[^\]]+\]\{[^}]+\}\s*$/g,
		message: "remove oaicite line artifact",
	},
	{
		pattern: /!\[\[[^\]]+\]\]/g,
		message: "replace Obsidian image embed with standard markdown image",
	},
	{
		pattern: /\[\[[^[\]]+\]\]/g,
		message: "replace Obsidian wikilink with plain markdown link or text",
	},
	{
		pattern: /ChatGPT может допускать ошибки/gi,
		message: "remove assistant boilerplate text",
	},
	{
		pattern: /Скажи, что нужно дальше/gi,
		message: "remove assistant prompt text",
	},
];

const UPDATED_AT_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidTitle(title) {
	if (typeof title !== "string") {
		return false;
	}
	const trimmed = title.trim();
	if (trimmed.length < 2) {
		return false;
	}
	return /[\p{L}\p{N}]/u.test(trimmed);
}

function validateFile(filePath) {
	const issues = [];
	const source = fs.readFileSync(filePath, "utf8");
	const lines = source.split(/\r?\n/);
	const rel = toPosix(path.relative(cwd, filePath));
	const isRootIndex = filePath === docsIndexPath;

	if (!isRootIndex) {
		const { hasFrontmatter, frontmatter } = splitFrontmatter(source);
		if (!hasFrontmatter) {
			issues.push(`${rel}:1 missing frontmatter block`);
		} else {
			for (const key of REQUIRED_FRONTMATTER_KEYS) {
				if (!(key in frontmatter)) {
					issues.push(`${rel}:1 missing frontmatter key "${key}"`);
				}
			}

			if (!isValidTitle(frontmatter.title)) {
				issues.push(`${rel}:1 invalid frontmatter title`);
			}

			if (
				typeof frontmatter.description !== "string" ||
				frontmatter.description.trim().length < 10
			) {
				issues.push(`${rel}:1 invalid frontmatter description`);
			}

			if (!Array.isArray(frontmatter.tags) || frontmatter.tags.length === 0) {
				issues.push(`${rel}:1 invalid frontmatter tags`);
			}

			if (!UPDATED_AT_RE.test(String(frontmatter.updatedAt ?? ""))) {
				issues.push(`${rel}:1 invalid frontmatter updatedAt (expected YYYY-MM-DD)`);
			}
		}
	}

	for (let index = 0; index < lines.length; index += 1) {
		const line = lines[index];
		for (const rule of LINE_RULES) {
			rule.pattern.lastIndex = 0;
			if (rule.pattern.test(line)) {
				issues.push(`${rel}:${index + 1} ${rule.message}`);
			}
		}
	}

	let inFence = false;
	let fenceOpenedAt = 0;
	for (let index = 0; index < lines.length; index += 1) {
		const line = lines[index];
		if (/^\s*```/.test(line)) {
			if (inFence) {
				inFence = false;
				fenceOpenedAt = 0;
			} else {
				inFence = true;
				fenceOpenedAt = index + 1;
			}
		}
	}

	if (inFence) {
		issues.push(`${rel}:${fenceOpenedAt} unclosed code fence`);
	}

	return issues;
}

if (!fs.existsSync(docsRoot)) {
	console.error("Content validation failed: docs directory not found.");
	process.exit(1);
}

const files = collectMarkdownFiles();
const errors = files.flatMap(validateFile);

if (errors.length > 0) {
	console.error("Content validation failed:");
	for (const error of errors) {
		console.error(`- ${error}`);
	}
	process.exit(1);
}

console.log(`Content validation passed (${files.length} markdown files).`);
