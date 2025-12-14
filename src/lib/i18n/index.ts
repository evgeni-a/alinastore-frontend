import { register, init, getLocaleFromNavigator } from 'svelte-i18n';
import { browser } from '$app/environment';

register('en', () => import('./locales/en.json'));
register('ru', () => import('./locales/ru.json'));

let initialLocale = 'en';
if (browser) {
	const storedLocale = localStorage.getItem('locale');
	initialLocale = storedLocale || getLocaleFromNavigator() || 'en';
}

init({
	fallbackLocale: 'en',
	initialLocale: initialLocale
});

