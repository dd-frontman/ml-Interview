import fs from "node:fs";
import path from "node:path";
import {
	REQUIRED_FRONTMATTER_KEYS,
	collectMarkdownFiles,
	escapeTsString,
	getGitLastUpdatedAt,
	inferDescription,
	inferTitle,
	normalizeTags,
	routeFromFilePath,
	splitFrontmatter,
	stringifyFrontmatter,
} from "./lib/content-utils.mjs";

const cwd = process.cwd();
const docsIndexPath = path.join(cwd, "docs", "index.md");

function hasSchema(frontmatter) {
	return REQUIRED_FRONTMATTER_KEYS.every((key) => key in frontmatter);
}

const files = collectMarkdownFiles();
const changedFiles = [];

for (const filePath of files) {
	if (filePath === docsIndexPath) {
		continue;
	}

	const source = fs.readFileSync(filePath, "utf8");
	const { hasFrontmatter, frontmatter, body } = splitFrontmatter(source);
	const route = routeFromFilePath(filePath);

	const title =
		typeof frontmatter.title === "string" && frontmatter.title.trim()
			? frontmatter.title.trim()
			: inferTitle(route, body);

	const existingDescription =
		typeof frontmatter.description === "string" ? frontmatter.description.trim() : "";
	const descriptionLooksInvalid =
		!existingDescription ||
		existingDescription.length < 20 ||
		existingDescription.startsWith("{") ||
		/href:\s*["']/.test(existingDescription) ||
		/title:\s*["']/.test(existingDescription);

	const description = descriptionLooksInvalid ? inferDescription(body, title) : existingDescription;

	const tags = normalizeTags(frontmatter.tags, route);

	const updatedAt =
		typeof frontmatter.updatedAt === "string" && /^\d{4}-\d{2}-\d{2}$/.test(frontmatter.updatedAt)
			? frontmatter.updatedAt
			: getGitLastUpdatedAt(filePath);

	// Исключаем слишком объемные "шпаргалки" из локального поискового индекса,
	// чтобы снизить размер generated search chunk.
	const estimatedWords = body.split(/\s+/).filter(Boolean).length;
	const searchFlag = frontmatter.search === false || estimatedWords > 1500 ? false : undefined;

	const canonicalFrontmatter = {
		title,
		description,
		tags,
		updatedAt,
		search: searchFlag,
	};

	const nextSource = `${stringifyFrontmatter(canonicalFrontmatter)}${body.replace(/^\r?\n*/, "")}`;

	if (!hasFrontmatter || !hasSchema(frontmatter) || source !== nextSource) {
		fs.writeFileSync(filePath, nextSource, "utf8");
		changedFiles.push(path.relative(cwd, filePath));
	}
}

console.log(`Frontmatter sync complete. Updated files: ${changedFiles.length}`);
if (changedFiles.length > 0) {
	const preview = changedFiles.slice(0, 10).map((filePath) => `- ${escapeTsString(filePath)}`);
	console.log(preview.join("\n"));
	if (changedFiles.length > preview.length) {
		console.log(`...and ${changedFiles.length - preview.length} more`);
	}
}
