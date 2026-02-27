<script setup lang="ts">
interface OfficialDocLink {
	title: string;
	href: string;
}

defineProps<{
	links: OfficialDocLink[];
}>();
</script>

<template>
	<section class="official-docs">
		<h2>Официальная документация</h2>
		<ul class="official-docs__list">
			<li v-for="link in links" :key="link.href">
				<a :href="link.href" target="_blank" rel="noreferrer">
					{{ link.title }}
				</a>
			</li>
		</ul>
	</section>
</template>
