<script lang="ts">
	import { onMount } from 'svelte';
	import { requireAuth } from '$lib/utils/auth';
	import { user } from '$lib/stores/auth';
	import { _, isLoading } from 'svelte-i18n';

	let currentUser = $derived($user);

	onMount(async () => {
		await requireAuth();
	});
</script>

{#if !$isLoading}
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<div class="bg-white rounded-lg shadow p-6">
			<h1 class="text-3xl font-bold text-gray-900 mb-4">
				{$_('common.welcome')}, {currentUser?.name || 'User'}!
			</h1>
			<p class="text-gray-600">You are successfully logged in.</p>
			{#if currentUser}
				<div class="mt-4 space-y-2">
					<p class="text-sm text-gray-500"><strong>Email:</strong> {currentUser.email}</p>
					<p class="text-sm text-gray-500"><strong>Roles:</strong> {currentUser.roles.join(', ')}</p>
				</div>
			{/if}
		</div>
	</div>
{:else}
	<div class="flex items-center justify-center min-h-screen">
		<div class="text-center">
			<div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
		</div>
	</div>
{/if}
