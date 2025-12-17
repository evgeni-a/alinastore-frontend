<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { Card, Button, Alert } from 'flowbite-svelte';
	import { authenticatedFetch, type ApiError } from '$lib/utils/api';

	let loading = $state(false);
	let error = $state<string | null>(null);
	let successMessage = $state<string | null>(null);
	let requestSent = $state(false);

	async function requestAccess() {
		loading = true;
		error = null;
		successMessage = null;

		try {
			await authenticatedFetch('/client/access/request', {
				method: 'POST'
			});
			successMessage = $_('noAccess.requestSent');
			requestSent = true;
		} catch (err) {
			const apiError = err as ApiError;
			error = apiError.message || $_('noAccess.requestError');
		} finally {
			loading = false;
		}
	}
</script>

<div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
	<Card class="text-center">
		<div class="mb-6">
			<svg
				class="mx-auto h-24 w-24 text-gray-400"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
				/>
			</svg>
		</div>

		<h1 class="text-3xl font-bold text-gray-900 mb-4">
			{$_('noAccess.title')}
		</h1>

		<p class="text-lg text-gray-600 mb-8">
			{$_('noAccess.message')}
		</p>

		{#if error}
			<Alert color="red" class="mb-4">
				{error}
			</Alert>
		{/if}

		{#if successMessage}
			<Alert color="green" class="mb-4">
				{successMessage}
			</Alert>
		{/if}

		{#if !requestSent}
			<Button
				color="blue"
				size="lg"
				onclick={requestAccess}
				disabled={loading}
			>
				{loading ? $_('common.loading') : $_('noAccess.requestAccess')}
			</Button>
		{:else}
			<div class="bg-green-50 border border-green-200 rounded-lg p-4">
				<p class="text-green-800 font-medium">
					{$_('noAccess.requestSent')}
				</p>
			</div>
		{/if}
	</Card>
</div>
