import { init } from '$lib/stores/auth';
import { browser } from '$app/environment';

export async function load() {
	if (browser) {
		init();
	}
	return {};
}

