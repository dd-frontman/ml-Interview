import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests/mobile",
	timeout: 45_000,
	expect: {
		timeout: 10_000,
	},
	retries: process.env.CI ? 1 : 0,
	reporter: [["list"], ["html", { open: "never" }]],
	use: {
		...devices["iPhone 13"],
		baseURL: "http://127.0.0.1:4173/ml-interview",
		trace: "on-first-retry",
	},
	webServer: {
		command: "yarn build && yarn preview --host 127.0.0.1 --port 4173",
		port: 4173,
		reuseExistingServer: !process.env.CI,
		timeout: 180_000,
	},
});
