import { createAuthClient } from 'better-auth/react'

import { AUTH_BASE_URL } from '@/lib/constants/env'
import { AUTH_CREDENTIALS } from '@/lib/constants/request.constants'

export const authClient = createAuthClient({
	baseURL: AUTH_BASE_URL,
	fetchOptions: {
		credentials: AUTH_CREDENTIALS,
	},
})
