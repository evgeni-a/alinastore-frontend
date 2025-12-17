<script lang="ts">
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import { Card, Button, Input, Alert, Table, TableHead, TableHeadCell, TableBody, TableBodyRow, TableBodyCell } from 'flowbite-svelte';
	import { authenticatedFetch, type ApiError } from '$lib/utils/api';

	interface CartItem {
		skuId: number;
		skuName: string;
		price: number;
		quantity: number;
	}

	interface Cart {
		items: CartItem[];
		totalAmount: number;
	}

	let cart = $state<Cart | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);
	let successMessage = $state<string | null>(null);
	let submitting = $state(false);

	onMount(async () => {
		await loadCart();
	});

	async function loadCart() {
		loading = true;
		error = null;

		try {
			cart = await authenticatedFetch<Cart>('/client/cart');
		} catch (err) {
			const apiError = err as ApiError;
			error = apiError.message || $_('cart.loadError');
		} finally {
			loading = false;
		}
	}

	async function updateQuantity(skuId: number, newQuantity: number) {
		if (newQuantity < 1) return;

		error = null;
		successMessage = null;

		try {
			await authenticatedFetch('/client/cart', {
				method: 'PATCH',
				body: JSON.stringify({ skuId, quantity: newQuantity })
			});
			await loadCart();
		} catch (err) {
			const apiError = err as ApiError;
			error = apiError.message || $_('cart.updateError');
		}
	}

	async function removeItem(skuId: number) {
		error = null;
		successMessage = null;

		try {
			await authenticatedFetch(`/client/cart/${skuId}`, {
				method: 'DELETE'
			});
			await loadCart();
		} catch (err) {
			const apiError = err as ApiError;
			error = apiError.message || $_('cart.deleteError');
		}
	}

	async function submitOrder() {
		if (!cart || cart.items.length === 0) return;

		submitting = true;
		error = null;
		successMessage = null;

		try {
			await authenticatedFetch('/client/order/submit', {
				method: 'POST'
			});
			successMessage = $_('cart.orderSubmitted');
			await loadCart();
		} catch (err) {
			const apiError = err as ApiError;
			error = apiError.message || $_('cart.orderError');
		} finally {
			submitting = false;
		}
	}

	function calculateSubtotal(item: CartItem): number {
		return item.price * item.quantity;
	}
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<h1 class="text-3xl font-bold text-gray-900 mb-8">{$_('cart.title')}</h1>

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
	{:else if !cart || cart.items.length === 0}
		<Card>
			<div class="text-center py-12">
				<p class="text-gray-600 text-lg">{$_('cart.emptyCart')}</p>
			</div>
		</Card>
	{:else}
		<Card>
			<h5 class="text-xl font-bold mb-4">{$_('cart.yourCart')}</h5>

			<Table hoverable={true}>
				<TableHead>
					<TableHeadCell>{$_('cart.item')}</TableHeadCell>
					<TableHeadCell>{$_('cart.unitPrice')}</TableHeadCell>
					<TableHeadCell>{$_('cart.quantity')}</TableHeadCell>
					<TableHeadCell>{$_('cart.subtotal')}</TableHeadCell>
					<TableHeadCell>
						<span class="sr-only">Actions</span>
					</TableHeadCell>
				</TableHead>
				<TableBody>
					{#each cart.items as item (item.skuId)}
						<TableBodyRow>
							<TableBodyCell class="font-medium">
								{item.skuName}
							</TableBodyCell>
							<TableBodyCell>
								${item.price.toFixed(2)}
							</TableBodyCell>
							<TableBodyCell>
								<Input
									type="number"
									min="1"
									value={item.quantity}
									oninput={(e) =>
										updateQuantity(item.skuId, parseInt(e.currentTarget.value) || 1)}
									class="w-24"
									size="sm"
								/>
							</TableBodyCell>
							<TableBodyCell>
								${calculateSubtotal(item).toFixed(2)}
							</TableBodyCell>
							<TableBodyCell>
								<Button
									color="red"
									size="xs"
									onclick={() => removeItem(item.skuId)}
								>
									{$_('common.delete')}
								</Button>
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>

			<div class="mt-6 border-t pt-6">
				<div class="flex justify-between items-center mb-6">
					<span class="text-xl font-bold text-gray-900">{$_('cart.total')}:</span>
					<span class="text-2xl font-bold text-gray-900">
						${cart.totalAmount.toFixed(2)}
					</span>
				</div>

				<div class="flex justify-end">
					<Button
						color="blue"
						size="lg"
						onclick={submitOrder}
						disabled={submitting}
					>
						{submitting ? $_('common.loading') : $_('cart.submitOrder')}
					</Button>
				</div>
			</div>
		</Card>
	{/if}
</div>
