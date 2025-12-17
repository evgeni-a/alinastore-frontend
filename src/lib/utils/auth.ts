import { goto } from '$app/navigation';
import { isAuthenticated } from '$lib/stores/auth';

export async function requireAuth(): Promise<void> {
	if (!isAuthenticated()) {
		await goto('/login');
	}
}


