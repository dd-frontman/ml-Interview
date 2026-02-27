import fs from "node:fs";
import path from "node:path";
import {
	collectMarkdownFiles,
	inferTitle,
	isValidIsoDate,
	routeFromFilePath,
	splitFrontmatter,
	toPosix,
} from "./lib/content-utils.mjs";

const cwd = process.cwd();
const docsIndexPath = path.join(cwd, "docs", "index.md");
const staleDays = Number.parseInt(process.env.STALE_DAYS ?? "365", 10);
const shouldFailOnStale = process.argv.includes("--fail-on-stale");

const now = new Date();
const files = collectMarkdownFiles();
const stale = [];
const missingUpdatedAt = [];

for (const filePath of files) {
	if (filePath === docsIndexPath) {
		continue;
	}

	const source = fs.readFileSync(filePath, "utf8");
	const { frontmatter, body } = splitFrontmatter(source);
	const route = routeFromFilePath(filePath);
	const title =
		typeof frontmatter.title === "string" && frontmatter.title.trim()
			? frontmatter.title.trim()
			: inferTitle(route, body);

	if (!isValidIsoDate(frontmatter.updatedAt)) {
		missingUpdatedAt.push({
			route,
			title,
			file: toPosix(path.relative(cwd, filePath)),
		});
		continue;
	}

	const lastUpdated = new Date(`${frontmatter.updatedAt}T00:00:00Z`);
	const ageDays = Math.floor((now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));
	if (ageDays > staleDays) {
		stale.push({
			route,
			title,
			updatedAt: frontmatter.updatedAt,
			ageDays,
		});
	}
}

stale.sort((a, b) => b.ageDays - a.ageDays);

console.log(`Stale content report (threshold: ${staleDays} days)`);
console.log(`- Total pages checked: ${files.length - 1}`);
console.log(`- Missing updatedAt: ${missingUpdatedAt.length}`);
console.log(`- Stale pages: ${stale.length}`);

if (missingUpdatedAt.length > 0) {
	console.log("\nPages missing updatedAt:");
	for (const item of missingUpdatedAt.slice(0, 20)) {
		console.log(`- ${item.file} (${item.route})`);
	}
	if (missingUpdatedAt.length > 20) {
		console.log(`...and ${missingUpdatedAt.length - 20} more`);
	}
}

if (stale.length > 0) {
	console.log("\nStale pages:");
	for (const item of stale.slice(0, 30)) {
		console.log(`- ${item.route} · ${item.updatedAt} · ${item.ageDays} days`);
	}
	if (stale.length > 30) {
		console.log(`...and ${stale.length - 30} more`);
	}
}

if (shouldFailOnStale && (stale.length > 0 || missingUpdatedAt.length > 0)) {
	process.exit(1);
}
