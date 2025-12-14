<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { login } from '$lib/stores/auth';
	import { _, isLoading } from 'svelte-i18n';

	let error = $state<string | null>(null);
	let loading = $state(true);

	onMount(async () => {
		try {
			const tokenParam = $page.url.searchParams.get('token');

			if (tokenParam) {
				login(tokenParam);
				await goto('/');
			} else {
				error = 'Token not found in URL parameters';
				loading = false;
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to process OAuth2 callback';
			loading = false;
		}
	});
</script>

{#if loading || $isLoading}
	<div class="flex items-center justify-center min-h-screen">
		<div class="text-center">
			<div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			{#if !$isLoading}
				<p class="mt-4 text-gray-600">{$_('auth.loggingIn')}</p>
			{/if}
		</div>
	</div>
{:else if error}
	<div class="flex items-center justify-center min-h-screen">
		<div class="text-center">
			<div class="text-red-600 mb-4">{error}</div>
			{#if !$isLoading}
				<a href="/login" class="text-blue-600 hover:underline">{$_('common.login')}</a>
			{/if}
		</div>
	</div>
{/if}

