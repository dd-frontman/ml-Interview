import { expect, test } from "@playwright/test";

const ROUTES = [
	"/",
	"/ml/obuchenie-s-uchitelem",
	"/math/lineynaya-algebra-dlya-ml",
	"/deep-learning/transformery-baza",
	"/mlops/deploy-i-monitoring",
];

function toFileName(route: string) {
	return route === "/" ? "home" : route.replace(/[^\w-]+/g, "-").replace(/^-+|-+$/g, "");
}

for (const route of ROUTES) {
	test(`mobile layout: ${route}`, async ({ page }, testInfo) => {
		await page.goto(route, { waitUntil: "networkidle" });
		await expect(page.locator("#VPContent")).toBeVisible();

		const hasHorizontalOverflow = await page.evaluate(
			() => document.documentElement.scrollWidth - window.innerWidth > 1
		);
		expect(hasHorizontalOverflow).toBeFalsy();

		await page.screenshot({
			path: testInfo.outputPath(`${toFileName(route)}.png`),
			fullPage: true,
		});
	});
}
