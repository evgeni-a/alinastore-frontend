import { get } from 'svelte/store';
import { token } from '$lib/stores/auth';

const API_BASE = '/api';

export interface ApiError {
	message: string;
	status: number;
}

export async function authenticatedFetch<T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<T> {
	const currentToken = get(token);

	if (!currentToken) {
		throw new Error('No authentication token available');
	}

	const headers = new Headers(options.headers);
	headers.set('Authorization', `Bearer ${currentToken}`);
	headers.set('Content-Type', 'application/json');

	const response = await fetch(`${API_BASE}${endpoint}`, {
		...options,
		headers
	});

	if (!response.ok) {
		const error: ApiError = {
			message: await response.text().catch(() => 'Unknown error'),
			status: response.status
		};
		throw error;
	}

	// Handle empty responses (e.g., 204 No Content)
	const contentType = response.headers.get('content-type');
	if (!contentType || !contentType.includes('application/json')) {
		return {} as T;
	}

	return response.json();
}
