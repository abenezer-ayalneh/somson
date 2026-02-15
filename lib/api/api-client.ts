import { AUTH_CREDENTIALS, JSON_CONTENT_TYPE } from '@/lib/constants/request.constants'
import { API_BASE_URL } from '@/lib/constants/env'
import { handleResponse } from '@/lib/error-handling'

interface ApiRequestOptions {
	method?: string
	body?: unknown
	headers?: Record<string, string>
	credentials?: RequestCredentials
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}, fallbackErrorMessage: string): Promise<T> {
	const { method = 'GET', body, headers = {}, credentials = AUTH_CREDENTIALS } = options

	const fetchOptions: RequestInit = {
		method,
		credentials,
		headers: {
			...headers,
			...(body !== undefined && {
				'Content-Type': JSON_CONTENT_TYPE,
			}),
		},
		...(body !== undefined && { body: JSON.stringify(body) }),
	}

	const response = await fetch(`${API_BASE_URL}${path}`, fetchOptions)
	return handleResponse<T>(response, fallbackErrorMessage)
}
