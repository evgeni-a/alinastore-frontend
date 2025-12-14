<script lang="ts">
	import { locale } from 'svelte-i18n';
	import { Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let currentLocale = $state('en');
	let availableLocales = ['en', 'ru'];

	onMount(() => {
		currentLocale = $locale || 'en';
		$effect(() => {
			currentLocale = $locale || 'en';
		});
	});

	function switchLocale(newLocale: string) {
		$locale = newLocale;
		currentLocale = newLocale;
		if (typeof window !== 'undefined') {
			localStorage.setItem('locale', newLocale);
		}
	}
</script>

<div class="flex gap-2">
	{#each availableLocales as localeOption}
		<Button
			color={currentLocale === localeOption ? 'blue' : 'light'}
			size="xs"
			onclick={() => switchLocale(localeOption)}
		>
			{localeOption.toUpperCase()}
		</Button>
	{/each}
</div>

