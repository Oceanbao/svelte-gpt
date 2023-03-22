import { browser } from '$app/environment';

import { openAiApiKey$, gptModel$ } from '$lib/shared/shared.store';
import { GPT_MODEL, LOCAL_STORAGE_KEY } from '$lib/shared/shared.type';

export const load = async () => {
	/**
	 * Sync localStorage to stores
	 */
	if (browser) {
		const openAiApiKey = localStorage.getItem(LOCAL_STORAGE_KEY.OPEN_AI_API_KEY);
		const gptModel = localStorage.getItem(LOCAL_STORAGE_KEY.GPT_MODEL);

		// GPT model
		if (gptModel) {
			gptModel$.set(gptModel as GPT_MODEL);
		}

		// API key
		if (openAiApiKey) {
			openAiApiKey$.set(openAiApiKey);
		}
	}

	return {};
};
