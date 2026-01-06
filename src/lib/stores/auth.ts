import { writable } from 'svelte/store';
import { decodeJWT, type User } from '$lib/utils/jwt';
import { browser } from '$app/environment';

const TOKEN_KEY = 'auth_token';

export const user = writable<User | null>(null);
export const token = writable<string | null>(null);

export function login(jwtToken: string): void {
	if (!browser) return;

	try {
		const userData = decodeJWT(jwtToken);
		localStorage.setItem(TOKEN_KEY, jwtToken);
		token.set(jwtToken);
		user.set(userData);
	} catch (error) {
		console.error('Failed to login:', error);
		throw error;
	}
}

export function logout(): void {
	if (!browser) return;

	localStorage.removeItem(TOKEN_KEY);
	token.set(null);
	user.set(null);
}

export function init(): void {
	if (!browser) return;

	const storedToken = localStorage.getItem(TOKEN_KEY);
	if (storedToken) {
		try {
			const userData = decodeJWT(storedToken);
			token.set(storedToken);
			user.set(userData);
		} catch (error) {
			console.error('Failed to restore session:', error);
			logout();
		}
	}
}

export function isAuthenticated(): boolean {
	if (!browser) return false;
	return localStorage.getItem(TOKEN_KEY) !== null;
}



