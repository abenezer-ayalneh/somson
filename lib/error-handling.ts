interface BackendErrorResponse {
	statusCode: number
	errorType: string
	message: string
	details?: string | object
}

export class RoutineApiError extends Error {
	statusCode: number
	errorType: string
	details?: string | object

	constructor(message: string, statusCode: number, errorType: string, details?: string | object) {
		super(message)
		this.name = 'RoutineApiError'
		this.statusCode = statusCode
		this.errorType = errorType
		this.details = details
	}
}

export async function handleResponse<T>(response: Response, fallbackErrorMessage: string): Promise<T> {
	if (!response.ok) {
		try {
			// Read the response body as text first (can only read once)
			const errorText = await response.text()
			const contentType = response.headers.get('content-type')

			// Try to parse as JSON if content-type indicates JSON
			if (contentType?.includes('application/json') && errorText.trim()) {
				try {
					const errorData = JSON.parse(errorText)

					// Check if the response matches the backend error format
					if (
						typeof errorData === 'object' &&
						errorData !== null &&
						'statusCode' in errorData &&
						'errorType' in errorData &&
						'message' in errorData
					) {
						const backendError = errorData as BackendErrorResponse
						throw new RoutineApiError(backendError.message, backendError.statusCode, backendError.errorType, backendError.details)
					}

					// If it's JSON but not in the expected format, use it as details
					throw new RoutineApiError(fallbackErrorMessage, response.status, response.statusText, errorData)
				} catch (parseError) {
					// If error is already a RoutineApiError, re-throw it
					if (parseError instanceof RoutineApiError) {
						throw parseError
					}

					// If JSON parsing failed, use the text as details
					throw new RoutineApiError(fallbackErrorMessage, response.status, response.statusText, errorText)
				}
			}

			// If not JSON or empty, use text as details
			throw new RoutineApiError(fallbackErrorMessage, response.status, response.statusText, errorText || response.statusText)
		} catch (error) {
			// If error is already a RoutineApiError, re-throw it
			if (error instanceof RoutineApiError) {
				throw error
			}

			// If reading fails, use status text
			throw new RoutineApiError(fallbackErrorMessage, response.status, response.statusText, response.statusText)
		}
	}

	// Handle successful responses
	const contentLength = response.headers.get('content-length')

	// If there's no content (204 No Content or 0 content-length), return undefined for void responses
	if (response.status === 204 || contentLength === '0') {
		return undefined as T
	}

	// Read the response body once
	try {
		const text = await response.text()

		// If text is empty, return undefined for void responses
		if (!text.trim()) {
			return undefined as T
		}

		// Try to parse as JSON
		return JSON.parse(text) as T
	} catch {
		// If parsing fails or no body, return undefined (void response)
		return undefined as T
	}
}
