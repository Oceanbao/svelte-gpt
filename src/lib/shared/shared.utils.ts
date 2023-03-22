import { GPT_MODEL, MESSAGE_ROLE } from './shared.type';
import { CHAT_COMPLETION_ENDPOINT } from './shared.constants';
//
// Svelte action
export function autofocus(el: any) {
	el.focus();
}

export const truncateString = (str: string, cutLength = 18) => {
	const truncated = str.substring(0, cutLength);

	return truncated.length < str.length ? `${truncated}...` : truncated;
};

export const truncateStringInMiddle = (str: string, cutLength = 4) => {
	const cutStart = str.substring(0, cutLength);
	const cutEnd = str.substring(str.length - cutLength, str.length);
	return `${cutStart}...${cutEnd}`;
};

/**
 * https://platform.openai.com/docs/guides/chat/introduction
 */
export const chatCompletion = async (
	input: string,
	messageHistory: Record<string, string>[],
	openAiKey: string,
	model = GPT_MODEL.GPT_3_5_TURBO
) => {
	const completionHeaders = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${openAiKey}`
	};

	const messages = [
		...messageHistory,
		{
			role: MESSAGE_ROLE.USER,
			content: input
		}
	];

	const completionBody = {
		model,
		messages
	};

	const completion = await fetch(CHAT_COMPLETION_ENDPOINT, {
		method: 'POST',
		headers: completionHeaders,
		body: JSON.stringify(completionBody)
	}).then((response) => response.json());

	const { error } = completion;

	const completionMessage = completion?.choices?.map?.((choice) => ({
		role: choice.message?.role,
		content: choice.message?.content
	}));

	/**
	 * success: { choices: [...], usage: {...}, created: number, model, object }
	 * error: { code}
	 */
	return error
		? { error, data: null }
		: completionMessage
		? { data: completionMessage, error: null }
		: {
				data: null,
				error: {
					code: 'unknown',
					message: 'Request to OpenAI failed'
				}
		  };
};
