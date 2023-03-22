// https://platform.openai.com/docs/models/gpt-4
export enum GPT_MODEL {
	GPT_3_5_TURBO = 'gpt-3.5-turbo',
	GPT_3_5_TURBO_0301 = 'gpt-3.5-turbo-0301',

	// Vanilla
	GPT_4 = 'gpt-4',
	// gpt-4 from March 14th 2023
	GPT_4_0314 = 'gpt-4-0314',
	// gpt-4 but with 4x context length
	GPT_4_32k = 'gpt-4-32k',
	// gpt-4-32k from March 14th 2023
	GPT_4_32k_0314 = 'gpt-4-32k-0314'
}

export enum MESSAGE_ROLE {
	SYSTEM = 'system',
	ASSISTANT = 'assistant',
	USER = 'user'
}

export enum LOCAL_STORAGE_KEY {
	OPEN_AI_API_KEY = 'openAiApiKey',
	CHAT_LIST = 'bChatList',
	SAVED_PROMPTS = 'bSavedPrompts',
	GPT_MODEL = 'bGptModel'

	// e.g. bChat-123456789
	// CHAT_PREFIX = 'bChat'
}

export enum BANNER_TYPE {
	ERROR = 'error',
	INFO = 'info',
	WARNING = 'warning',
	SUCCESS = 'success'
}

export enum ERROR {
	LOCAL_STORAGE_SET_ITEM = 'LOCAL_STORAGE_SET_ITEM',
	OPENAI_CHAT_COMPLETION = 'OPENAI_CHAT_COMPLETION',
	REGISTRATION = 'REGISTRATION',
	LOGIN = 'LOGIN',
	PASSWORD_RESET = 'PASSWORD_RESET',
	USER_DATA_FETCH = 'USER_DATA_FETCH',
	PASSWORD_CHANGE = 'PASSWORD_CHANGE',
	CHECKOUT_SESSION_CREATE = 'CHECKOUT_SESSION_CREATE',
	DATA_SYNC_SAVE = 'CHAT_SYNC_SAVE',
	DATA_SYNC_SAVE_LIMIT = 'CHAT_SYNC_SAVE_LIMIT',
	DATA_SYNC_IMPORT = 'CHAT_SYNC_IMPORT'
}
