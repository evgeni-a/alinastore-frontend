<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { _, isLoading } from 'svelte-i18n';

	const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
	const oauth2Url = `${apiBaseUrl}/oauth2/authorization/google`;
</script>

{#if !$isLoading}
	<div class="flex items-center justify-center min-h-screen bg-gray-50">
		<div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
			<div class="text-center">
				<h1 class="text-3xl font-bold text-gray-900 mb-2">{$_('common.welcome')}</h1>
				<p class="text-gray-600 mb-8">{$_('auth.loginRequired')}</p>
			</div>

			<a href={oauth2Url} class="block">
				<Button color="blue" size="xl" class="w-full">
					<svg
						class="w-5 h-5 mr-2"
						aria-hidden="true"
						focusable="false"
						data-prefix="fab"
						data-icon="google"
						role="img"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 488 512"
					>
						<path
							fill="currentColor"
							d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 52.6 94.3 256s164.2 203.4 252.5 191.4c45.2-8.1 75.9-31.5 94.3-64.9H248v-85.3h240z"
						></path>
					</svg>
					{$_('common.loginWithGoogle')}
				</Button>
			</a>
		</div>
	</div>
{:else}
	<div class="flex items-center justify-center min-h-screen">
		<div class="text-center">
			<div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
		</div>
	</div>
{/if}

