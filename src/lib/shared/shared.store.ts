import { derived, writable } from 'svelte/store';
import { GPT_MODEL } from './shared.type';

/**
 * localStorage
 */
export const openAiApiKey$ = writable('');
export const gptModel$ = writable(GPT_MODEL.GPT_3_5_TURBO as GPT_MODEL);

export const gptModelVerified$ = derived(gptModel$, (gptModel) => {
	const isValid = gptModel && Object.values(GPT_MODEL).includes(gptModel);
	return isValid ? gptModel : GPT_MODEL.GPT_3_5_TURBO;
});

/**
 * Banners
 */
export const banners$ = writable([] as any);
