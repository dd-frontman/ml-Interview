import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { h } from "vue";
import AsideSupportFooter from "./components/AsideSupportFooter.vue";
import AutoRelatedTopics from "./components/AutoRelatedTopics.vue";
import OfficialDocsLinks from "./components/OfficialDocsLinks.vue";
import RelatedTopics from "./components/RelatedTopics.vue";
import "./custom.css";

export default {
	extends: DefaultTheme,
	Layout: () =>
		h(DefaultTheme.Layout, null, {
			"doc-footer-before": () => h(AutoRelatedTopics),
			"aside-bottom": () => h(AsideSupportFooter),
		}),
	enhanceApp({ app }) {
		app.component("OfficialDocsLinks", OfficialDocsLinks);
		app.component("RelatedTopics", RelatedTopics);
	},
} satisfies Theme;
