<script setup lang="ts">
import type { DefaultTheme } from "vitepress";
import { computed } from "vue";
import { useData, useRoute, withBase } from "vitepress";
import { sidebar } from "../../sidebar";

type SidebarItem = DefaultTheme.SidebarItem & {
	items?: SidebarItem[];
};

type BreadcrumbItem = {
	label: string;
	link?: string;
	current?: boolean;
};

const route = useRoute();
const { frontmatter, page, site } = useData();

const landingPagePattern = /(^обзор$|обзор этапа|документация|главная|core обзор)/i;

function normalizePath(value: string): string {
	const withoutBase = value.startsWith(site.value.base)
		? value.slice(site.value.base.length - 1)
		: value;
	const withoutHash = withoutBase.split("#")[0].split("?")[0];
	const withoutIndex = withoutHash.replace(/\/index(?:\.html)?$/, "");
	const withoutExtension = withoutIndex.replace(/\.html$/, "");

	return withoutExtension === "/" ? "/" : withoutExtension.replace(/\/$/, "");
}

function findSidebarPath(
	items: SidebarItem[],
	targetPath: string,
	parents: SidebarItem[] = []
): SidebarItem[] | null {
	for (const item of items) {
		const path = [...parents, item];

		if (item.link && normalizePath(item.link) === targetPath) {
			return path;
		}

		if (item.items) {
			const nestedPath = findSidebarPath(item.items, targetPath, path);

			if (nestedPath) {
				return nestedPath;
			}
		}
	}

	return null;
}

function findLandingLink(item: SidebarItem): string | undefined {
	if (item.link) {
		return item.link;
	}

	return item.items?.find(
		(child) => child.link && child.text && landingPagePattern.test(child.text)
	)?.link;
}

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
	const currentPath = normalizePath(route.path);

	if (currentPath === "/" || frontmatter.value.layout === "home" || page.value.isNotFound) {
		return [];
	}

	const sidebarPath = findSidebarPath(sidebar as SidebarItem[], currentPath);

	if (!sidebarPath) {
		return [];
	}

	const result: BreadcrumbItem[] = [{ label: "Главная", link: "/" }];

	for (const item of sidebarPath) {
		if (!item.text) {
			continue;
		}

		const link = findLandingLink(item);
		const normalizedLink = link ? normalizePath(link) : undefined;
		const previousLink = result.at(-1)?.link;

		if (normalizedLink && previousLink && normalizePath(previousLink) === normalizedLink) {
			continue;
		}

		result.push({ label: item.text, link });
	}

	const currentItem = result.at(-1);

	if (currentItem) {
		currentItem.current = true;
		currentItem.link = undefined;
	}

	return result;
});
</script>

<template>
	<nav v-if="breadcrumbs.length > 1" class="doc-breadcrumbs" aria-label="Хлебные крошки">
		<ol class="doc-breadcrumbs__list">
			<li
				v-for="(item, index) in breadcrumbs"
				:key="`${item.label}-${index}`"
				class="doc-breadcrumbs__item"
			>
				<span v-if="index > 0" class="doc-breadcrumbs__separator" aria-hidden="true"> / </span>
				<a
					v-if="item.link && !item.current"
					class="doc-breadcrumbs__link"
					:href="withBase(item.link)"
				>
					{{ item.label }}
				</a>
				<span
					v-else
					class="doc-breadcrumbs__label"
					:aria-current="item.current ? 'page' : undefined"
				>
					{{ item.label }}
				</span>
			</li>
		</ol>
	</nav>
</template>
