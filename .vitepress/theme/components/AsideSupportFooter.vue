<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<template>
	<div class="aside-support-footer">
		<div class="aside-support-footer__year">© {{ currentYear }} by DK</div>
		<a
			class="aside-support-footer__link"
			href="https://github.com/dd-frontman/web-interview"
			target="_blank"
			rel="noopener noreferrer"
		>
			Понравилась дока?<br />
			Поставь ⭐ на GitHub.
		</a>
	</div>
</template>
