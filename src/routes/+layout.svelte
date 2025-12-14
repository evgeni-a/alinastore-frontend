<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { init, logout, user, isAuthenticated } from '$lib/stores/auth';
	import { Button } from 'flowbite-svelte';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';
	import { _, isLoading } from 'svelte-i18n';
	import '$lib/i18n';
	import '../app.css';

	let { children } = $props();

	let currentUser = $derived($user);
	let isAuth = $derived(isAuthenticated());
	let currentPath = $derived($page.url.pathname);

	onMount(() => {
		init();

		if (!isAuthenticated() && currentPath !== '/login' && !currentPath.startsWith('/oauth2')) {
			goto('/login');
		}
	});

	async function handleLogout() {
		logout();
		await goto('/login');
	}
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" />
</svelte:head>

{#if isAuth && currentPath !== '/login' && !currentPath.startsWith('/oauth2') && !$isLoading}
	<header class="bg-white shadow-sm border-b border-gray-200">
		<nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<div class="flex items-center">
					<h1 class="text-xl font-semibold text-gray-900">Alina Store</h1>
				</div>
				<div class="flex items-center gap-4">
					{#if currentUser}
						<span class="text-gray-700">{$_('common.welcome')}, {currentUser.name}</span>
					{/if}
					<LanguageSwitcher />
					<Button color="light" size="sm" onclick={handleLogout}>
						{$_('common.logout')}
					</Button>
				</div>
			</div>
		</nav>
	</header>
{/if}

<main class="min-h-screen bg-gray-50">
	{@render children()}
</main>
