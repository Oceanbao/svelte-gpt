<script lang="ts">
	import { getContext } from 'svelte';
	import ChatMessage from '$lib/components/ChatMessage.svelte';
	import ModalApiKey from '@/lib/components/ModalApiKey.svelte';
	import KeyIcon from '@/lib/components/KeyIcon.svelte';
	import { truncateStringInMiddle } from '@/lib/shared/shared.utils';
	import { openAiApiKey$ } from '@/lib/shared/shared.store';
	import type { ChatCompletionRequestMessage } from 'openai';
	import { SSE } from 'sse.js';

	let query: string = '';
	let answer: string = '';
	let loading: boolean = false;
	let chatMessages: ChatCompletionRequestMessage[] = [];
	let scrollToDiv: HTMLDivElement;

	function scrollToBottom() {
		setTimeout(function () {
			scrollToDiv.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
		}, 100);
	}

	const handleSubmit = async () => {
		loading = true;
		chatMessages = [...chatMessages, { role: 'user', content: query }];
		const eventSource = new SSE('/api/chat', {
			headers: {
				'Content-Type': 'application/json',
				'x-openai-key': $openAiApiKey$
			},
			payload: JSON.stringify({ messages: chatMessages })
		});
		query = '';
		eventSource.addEventListener('error', handleError);
		eventSource.addEventListener('message', (e) => {
			scrollToBottom();
			try {
				loading = false;
				if (e.data === '[DONE]') {
					chatMessages = [...chatMessages, { role: 'assistant', content: answer }];
					answer = '';
					return;
				}
				const completionResponse = JSON.parse(e.data);
				const [{ delta }] = completionResponse.choices;
				if (delta.content) {
					answer = (answer ?? '') + delta.content;
				}
			} catch (err) {
				handleError(err);
			}
		});
		eventSource.stream();
		scrollToBottom();
	};

	function handleError<T>(err: T) {
		loading = false;
		query = '';
		answer = '';
		console.error(err);
	}

	const { open } = getContext('simple-modal') as any;

	const openApiKeyModal = () => {
		open(ModalApiKey, {});
	};
</script>

<div
	class="flex flex-col pt-4 md:pt-8 w-full h-screen md:h-full md:w-2/3 px-2 md:px-8 py-2 md:py-0 items-center gap-2 md:gap-4"
>
	<div>
		<h1 class="text-2xl font-bold w-full text-center">Parrot</h1>
		<p class="text-sm italic">Powered by gpt-3.5-turbo</p>
	</div>
	<button
		on:click={openApiKeyModal}
		type="button"
		class="flex justify-center items-centr gap-2 lg:mx-0 hover:underline bg-gradient-to-r from-emerald-400 to-cyan-400 text-white font-bold rounded py-3 px-6 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
	>
		<KeyIcon />
		{$openAiApiKey$ ? truncateStringInMiddle($openAiApiKey$) : 'Enter API key'}
	</button>
	<div class="h-[500px] w-full bg-gray-900 rounded-md p-4 overflow-y-auto flex flex-col gap-4">
		<div class="flex flex-col gap-2">
			<ChatMessage type="assistant" message="Hello, ask me anything you want!" />
			{#each chatMessages as message}
				<ChatMessage type={message.role} message={message.content} />
			{/each}
			{#if answer}
				<ChatMessage type="assistant" message={answer} />
			{/if}
			{#if loading}
				<ChatMessage type="assistant" message="Loading.." />
			{/if}
		</div>
		<div class="" bind:this={scrollToDiv} />
	</div>
	<form
		class="flex w-full rounded-md gap-4 bg-gray-900 p-4"
		on:submit|preventDefault={() => handleSubmit()}
	>
		<input type="text" class="input input-bordered w-full" bind:value={query} />
		<button disabled={!$openAiApiKey$} type="submit" class="btn btn-accent"> Send </button>
	</form>
</div>
