import fs from "node:fs";
import { collectMarkdownFiles, splitFrontmatter } from "./lib/content-utils.mjs";

const STOP_WORDS = new Set([
	"и",
	"или",
	"во",
	"в",
	"на",
	"по",
	"для",
	"к",
	"что",
	"такое",
	"это",
	"как",
	"подробно",
	"подробный",
	"подробная",
	"подробное",
	"полный",
	"разбор",
	"с",
	"о",
]);

const REPLACEMENTS = [
	[/Critical\s+Rendering?\s+Path/gi, "CRP"],
	[/Content\s+Security\s+Policy/gi, "CSP"],
	[/Cross[-\s]Site\s+Request\s+Forgery/gi, "CSRF"],
	[/Cross[-\s]Site\s+Scripting/gi, "XSS"],
	[/Server[-\s]Sent\s+Events?/gi, "SSE"],
	[/Server[-\s]Side\s+Rendering/gi, "SSR"],
	[/Static\s+Site\s+Generation/gi, "SSG"],
	[/Incremental\s+Static\s+Regeneration/gi, "ISR"],
	[/Object\.freeze\(\)/g, "Object.freeze"],
	[/Type\s+Guards?/gi, "TypeGuards"],
	[/JavaScript/gi, "JS"],
	[/TypeScript/gi, "TS"],
];

const ACRONYM_FIXES = [
	[/\bJs\b/g, "JS"],
	[/\bTs\b/g, "TS"],
	[/\bJwt\b/g, "JWT"],
	[/\bHttp\b/g, "HTTP"],
	[/\bCss\b/g, "CSS"],
	[/\bHtml\b/g, "HTML"],
	[/\bApi\b/g, "API"],
	[/\bSse\b/g, "SSE"],
	[/\bCrp\b/g, "CRP"],
	[/\bCsp\b/g, "CSP"],
	[/\bCsrf\b/g, "CSRF"],
	[/\bXss\b/g, "XSS"],
	[/\bSsr\b/g, "SSR"],
	[/\bSsg\b/g, "SSG"],
	[/\bIsr\b/g, "ISR"],
];

function normalizeWord(word) {
	return word.toLowerCase().replace(/[^\p{L}\p{N}/.+-]/gu, "");
}

function normalizeTitle(input) {
	let value = String(input ?? "")
		.replace(/[*_`]/g, "")
		.replace(/^#{1,6}\s+/, "")
		.replace(/\[[^\]]*]\([^)]+\)/g, "")
		.replace(/^[^\p{L}\p{N}]+/u, "")
		.trim();

	for (const [pattern, replacement] of REPLACEMENTS) {
		value = value.replace(pattern, replacement);
	}

	value = value
		.replace(/[«»"“”]/g, " ")
		.replace(/[()]/g, " ")
		.replace(/[—–:;,!?+]/g, " ")
		.replace(/\s+/g, " ")
		.trim();

	if (!value) {
		return "Материал";
	}

	let words = value.split(" ").filter(Boolean);

	if (words.length > 3) {
		const withoutStops = words.filter((word) => !STOP_WORDS.has(normalizeWord(word)));
		if (withoutStops.length >= 2) {
			words = withoutStops;
		}
	}

	let result = words.slice(0, 3).join(" ").trim();
	if (!result) {
		result = "Материал";
	}

	for (const [pattern, replacement] of ACRONYM_FIXES) {
		result = result.replace(pattern, replacement);
	}

	return result.replace(/\s+/g, " ").trim();
}

function replaceTitleLine(source, nextTitle) {
	return source.replace(/^title:\s*.*$/m, `title: "${nextTitle.replace(/"/g, '\\"')}"`);
}

function replaceFirstH1(source, nextTitle) {
	return source.replace(/^#\s+(.+)$/m, `# ${nextTitle}`);
}

const files = collectMarkdownFiles();
const changed = [];

for (const filePath of files) {
	const source = fs.readFileSync(filePath, "utf8");
	const { hasFrontmatter, frontmatter, body } = splitFrontmatter(source);

	let next = source;

	if (hasFrontmatter && typeof frontmatter.title === "string" && frontmatter.title.trim()) {
		const shortTitle = normalizeTitle(frontmatter.title);
		if (shortTitle !== frontmatter.title.trim()) {
			next = replaceTitleLine(next, shortTitle);
		}
	}

	const h1Match = body.match(/^#\s+(.+)$/m);
	if (h1Match) {
		const shortH1 = normalizeTitle(h1Match[1].trim());
		const currentBody = splitFrontmatter(next).body;
		const updatedBody = replaceFirstH1(currentBody, shortH1);

		if (updatedBody !== currentBody) {
			const fmMatch = next.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
			next = fmMatch ? `${fmMatch[0]}${updatedBody}` : updatedBody;
		}
	}

	if (next !== source) {
		fs.writeFileSync(filePath, next, "utf8");
		changed.push(filePath);
	}
}

console.log(`Headings shortened. Updated files: ${changed.length}`);
