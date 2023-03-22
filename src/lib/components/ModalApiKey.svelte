<script lang="ts">
	import { getContext } from 'svelte';
	import { getNotificationsContext } from 'svelte-notifications';

	import { HOW_TO_GET_API_KEY_LINK, NOTIFICATION_SETTINGS } from '$lib/shared/shared.constants';
	import { banners$, gptModelVerified$, openAiApiKey$ } from '$lib/shared/shared.store';
	import { autofocus, chatCompletion } from '$lib/shared/shared.utils';

	import { BANNER_TYPE, ERROR, LOCAL_STORAGE_KEY } from '$lib/shared/shared.type';

	const { close } = getContext('simple-modal') as any;
	const { addNotification } = getNotificationsContext();

	let openAiApiKey = $openAiApiKey$;
	let errorMessage = '';
	let validatingApi = false;

	const closeModal = () => {
		close();
	};

	const setApiKey = async () => {
		if (openAiApiKey) {
			validatingApi = true;
			const { error } = await chatCompletion('Hi', [], openAiApiKey, $gptModelVerified$);
			validatingApi = false;

			if (error) {
				errorMessage =
					error?.message || error?.name || error?.code || 'Connection to OpenAI failed';
				return;
			}
		}

		openAiApiKey$.set(openAiApiKey);

		try {
			localStorage.setItem(LOCAL_STORAGE_KEY.OPEN_AI_API_KEY, openAiApiKey);
		} catch (e: any) {
			banners$.update((banners) => {
				banners.push({
					id: ERROR.LOCAL_STORAGE_SET_ITEM,
					bannerType: BANNER_TYPE.ERROR,
					title: 'Access to browser storage failed',
					description: e?.message || e?.name || ''
				});
				return banners;
			});
			closeModal();
			return;
		}

		addNotification({
			...NOTIFICATION_SETTINGS,
			text: 'API key set'
		});
		closeModal();
	};
</script>

<div class="bg-white rounded-lg border-gray-200 divide-y">
	<div class="bg-white px-3 py-2">
		<h3 class="text-lg leading-6 font-medium text-gray-900">OpenAI API key</h3>
	</div>

	<div class="px-4 py-5 sm:p-6">
		<!-- API key -->
		<label for="name" class="block text-sm font-medium text-gray-700"> API key </label>
		<input
			bind:value={openAiApiKey}
			use:autofocus
			id="open-ai-key"
			name="open-ai-key"
			type="text"
			placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
			class={`text-gray-100 block w-full text-sm mt-1 pl-3 pr-10 py-2 rounded border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 flex-1`}
		/>
		{#if errorMessage}
			<p class="mt-2 text-sm text-red-600">{errorMessage}</p>
		{/if}

		<p class="mt-1 text-sm text-gray-400">
			Your API Key will be stored locally on your browser.
			<a
				href={HOW_TO_GET_API_KEY_LINK}
				class="text-blue-400 hover:underline hover:text-blue-400"
				target="_blank"
				rel="noopener noreferrer"
			>
				Get your API key for free from OpenAI.
			</a>
		</p>
	</div>

	<div class="pt-5">
		<div class="flex gap-2 justify-end">
			<button
				on:click={closeModal}
				type="button"
				class="bg-white py-1.5 px-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				Cancel
			</button>
			<button
				disabled={validatingApi}
				type="button"
				on:click={setApiKey}
				class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
			>
				{#if validatingApi}
					<svg
						aria-hidden="true"
						role="status"
						class="inline w-4 h-4 mr-3 text-white animate-spin"
						viewBox="0 0 100 101"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
							fill="#E5E7EB"
						/>
						<path
							d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
							fill="currentColor"
						/>
					</svg>
					Validating...
				{:else}
					Save
				{/if}
			</button>
		</div>
	</div>
</div>
