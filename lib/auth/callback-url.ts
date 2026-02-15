const ABSOLUTE_URL_PATTERN = /^https?:\/\//i

export const buildFrontendCallbackUrl = (path: string): string => {
	if (ABSOLUTE_URL_PATTERN.test(path) || typeof window === 'undefined') {
		return path
	}

	return new URL(path, window.location.origin).toString()
}
