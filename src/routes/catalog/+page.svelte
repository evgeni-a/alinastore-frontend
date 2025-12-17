<script lang="ts">
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import { Card, Button, Input, Alert } from 'flowbite-svelte';
	import { authenticatedFetch, type ApiError } from '$lib/utils/api';

	interface SKU {
		id: number;
		name: string;
		price: number;
		quantity?: number;
	}

	interface Product {
		id: number;
		name: string;
		description?: string;
		skus: SKU[];
	}

	let products = $state<Product[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let successMessage = $state<string | null>(null);
	let quantities = $state<Record<number, number>>({});

	onMount(async () => {
		await loadProducts();
	});

	async function loadProducts() {
		loading = true;
		error = null;

		try {
			products = await authenticatedFetch<Product[]>('/client/products');
			// Initialize quantities for all SKUs
			products.forEach((product) => {
				product.skus.forEach((sku) => {
					quantities[sku.id] = 1;
				});
			});
		} catch (err) {
			const apiError = err as ApiError;
			error = apiError.message || $_('catalog.loadError');
		} finally {
			loading = false;
		}
	}

	async function addToCart(skuId: number) {
		error = null;
		successMessage = null;

		const quantity = quantities[skuId] || 1;

		try {
			await authenticatedFetch('/client/cart', {
				method: 'POST',
				body: JSON.stringify({ skuId, quantity })
			});
			successMessage = $_('catalog.addToCart') + ' ✓';
			setTimeout(() => {
				successMessage = null;
			}, 3000);
		} catch (err) {
			const apiError = err as ApiError;
			error = apiError.message || $_('common.error');
		}
	}

	function updateQuantity(skuId: number, value: number) {
		quantities[skuId] = Math.max(1, value);
	}
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<h1 class="text-3xl font-bold text-gray-900 mb-8">{$_('catalog.title')}</h1>

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
	{:else if products.length === 0}
		<div class="text-center py-12">
			<p class="text-gray-600">{$_('catalog.noProducts')}</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each products as product (product.id)}
				<Card>
					<h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900">
						{product.name}
					</h5>
					{#if product.description}
						<p class="mb-3 font-normal text-gray-700 leading-tight">
							{product.description}
						</p>
					{/if}
					<div class="space-y-3">
						{#each product.skus as sku (sku.id)}
							<div class="border-t pt-3">
								<div class="flex justify-between items-start mb-2">
									<div>
										<p class="font-medium text-gray-900">{sku.name}</p>
										<p class="text-sm text-gray-600">
											{$_('catalog.price')}: ${sku.price.toFixed(2)}
										</p>
									</div>
								</div>
								<div class="flex gap-2 items-center">
									<div class="flex-1">
										<Input
											type="number"
											min="1"
											value={quantities[sku.id]}
											oninput={(e) =>
												updateQuantity(sku.id, parseInt(e.currentTarget.value) || 1)}
											class="w-full"
											size="sm"
										>
											<span slot="left">{$_('catalog.quantity')}:</span>
										</Input>
									</div>
									<Button size="sm" onclick={() => addToCart(sku.id)}>
										{$_('catalog.addToCart')}
									</Button>
								</div>
							</div>
						{/each}
					</div>
				</Card>
			{/each}
		</div>
	{/if}
</div>
