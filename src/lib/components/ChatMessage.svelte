<script lang="ts">
	import type { ChatCompletionRequestMessageRoleEnum } from 'openai';
	import { marked } from 'marked';

	export let type: ChatCompletionRequestMessageRoleEnum;
	export let message: string;
</script>

<div class="chat {type === 'user' ? 'chat-end' : 'chat-start'} justify-end">
	<div class="chat-image avatar">
		<div class="w-10 rounded-full">
			<img
				src="https://ui-avatars.com/api/?name={type === 'user' ? 'Me' : 'AI'}"
				alt="{type} avatar"
			/>
		</div>
	</div>
	<div class="chat-header">
		{type === 'user' ? 'Me' : 'Bot'}
	</div>
	<div
		class="chat-bubble prose {type === 'user'
			? 'chat-bubble-primary'
			: 'chat-bubble-secondary'} text-gray-100"
	>
		{@html marked.parse(message)}
	</div>
</div>
