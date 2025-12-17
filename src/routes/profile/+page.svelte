<script lang="ts">
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import { Card, Button, Input, Label, Alert } from 'flowbite-svelte';
	import { authenticatedFetch, type ApiError } from '$lib/utils/api';
	import { user } from '$lib/stores/auth';

	interface ProfileData {
		name: string;
		email: string;
		phone?: string;
	}

	let profile = $state<ProfileData>({
		name: '',
		email: '',
		phone: ''
	});
	let loading = $state(true);
	let saving = $state(false);
	let error = $state<string | null>(null);
	let successMessage = $state<string | null>(null);

	onMount(async () => {
		await loadProfile();
	});

	async function loadProfile() {
		loading = true;
		error = null;

		try {
			const data = await authenticatedFetch<ProfileData>('/client/profile');
			profile = { ...data };
		} catch (err) {
			const apiError = err as ApiError;
			// If profile endpoint doesn't exist, use data from user store
			if ($user) {
				profile = {
					name: $user.name,
					email: $user.email,
					phone: ''
				};
			} else {
				error = apiError.message || $_('profile.updateError');
			}
		} finally {
			loading = false;
		}
	}

	async function updateProfile() {
		// Validation
		if (!profile.name.trim()) {
			error = $_('profile.nameRequired');
			return;
		}

		if (!profile.phone?.trim()) {
			error = $_('profile.phoneRequired');
			return;
		}

		saving = true;
		error = null;
		successMessage = null;

		try {
			await authenticatedFetch('/client/profile', {
				method: 'PUT',
				body: JSON.stringify({
					name: profile.name,
					phone: profile.phone
				})
			});
			successMessage = $_('profile.updateSuccess');
		} catch (err) {
			const apiError = err as ApiError;
			error = apiError.message || $_('profile.updateError');
		} finally {
			saving = false;
		}
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		updateProfile();
	}
</script>

<div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<h1 class="text-3xl font-bold text-gray-900 mb-8">{$_('profile.title')}</h1>

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

	{#if loading}
		<div class="text-center py-12">
			<p class="text-gray-600">{$_('common.loading')}</p>
		</div>
	{:else}
		<Card>
			<form onsubmit={handleSubmit} class="space-y-6">
				<div>
					<Label for="email" class="mb-2">{$_('profile.email')}</Label>
					<Input
						id="email"
						type="email"
						bind:value={profile.email}
						disabled
						class="bg-gray-50"
					/>
					<p class="mt-1 text-sm text-gray-500">Email cannot be changed</p>
				</div>

				<div>
					<Label for="name" class="mb-2">{$_('profile.name')}</Label>
					<Input
						id="name"
						type="text"
						bind:value={profile.name}
						required
						placeholder={$_('profile.name')}
					/>
				</div>

				<div>
					<Label for="phone" class="mb-2">{$_('profile.phone')}</Label>
					<Input
						id="phone"
						type="tel"
						bind:value={profile.phone}
						required
						placeholder="+1 (555) 000-0000"
					/>
				</div>

				<div class="flex justify-end gap-4">
					<Button
						type="submit"
						color="blue"
						disabled={saving}
					>
						{saving ? $_('common.loading') : $_('profile.updateProfile')}
					</Button>
				</div>
			</form>
		</Card>
	{/if}
</div>
