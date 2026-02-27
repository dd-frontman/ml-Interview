<script setup lang="ts">
import { computed } from "vue";
import { useData, withBase } from "vitepress";
import { contentIndex } from "../generated/content-index";

const { page } = useData();
const MAX_RELATED_ITEMS = 4;

const contentIndexByRoute = new Map(contentIndex.map((item) => [item.route, item]));
const autoRelatedPool = contentIndex.filter((item) => !item.hasManualRelated && item.search);

function toPublicRoute(route: string) {
	if (route === "/index") {
		return "/";
	}
	if (route.endsWith("/index")) {
		return route.slice(0, -"/index".length);
	}
	return route;
}

const currentRoute = computed(() => {
	const relativePath = page.value.relativePath ?? "";
	if (!relativePath.endsWith(".md")) {
		return "";
	}
	return `/${relativePath.replace(/\.md$/, "")}`;
});

const currentEntry = computed(() => {
	const route = currentRoute.value;
	if (!route || route === "/index") {
		return null;
	}

	const current = contentIndexByRoute.get(route) ?? null;
	return current;
});

const relatedItems = computed(() => {
	const current = currentEntry.value;
	if (!current || current.hasManualRelated || current.tags.length === 0) {
		return [];
	}

	const currentTags = new Set(current.tags);
	const rankedItems = autoRelatedPool
		.filter((item) => item.route !== current.route)
		.map((item) => {
			const sharedTags = item.tags.reduce(
				(count, tag) => (currentTags.has(tag) ? count + 1 : count),
				0
			);
			return { ...item, sharedTags };
		})
		.filter((item) => item.sharedTags > 0)
		.sort((a, b) => {
			if (b.sharedTags !== a.sharedTags) {
				return b.sharedTags - a.sharedTags;
			}
			return b.updatedAt.localeCompare(a.updatedAt);
		});

	return rankedItems.slice(0, MAX_RELATED_ITEMS);
});
</script>

<template>
	<div
		v-if="currentEntry && currentEntry.tags.length > 0"
		class="tip custom-block related-topics auto-related-topics"
	>
		<p class="custom-block-title">
			{{ relatedItems.length > 0 ? "Связанные темы" : "Теги страницы" }}
		</p>
		<p class="auto-related-topics__tags">
			<span v-for="tag in currentEntry.tags" :key="tag">#{{ tag }}</span>
		</p>
		<ul v-if="relatedItems.length > 0">
			<li v-for="item in relatedItems" :key="item.route">
				<a :href="withBase(toPublicRoute(item.route))">{{ item.title }}</a>
			</li>
		</ul>
	</div>
</template>
