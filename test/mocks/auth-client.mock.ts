import { vi } from 'vitest'

export const mockUseSession = vi.fn()
export const mockSignInEmail = vi.fn()
export const mockSignInSocial = vi.fn()
export const mockSignUpEmail = vi.fn()
export const mockSignOut = vi.fn()

export const authClientMock = {
	useSession: mockUseSession,
	signIn: {
		email: mockSignInEmail,
		social: mockSignInSocial,
	},
	signUp: {
		email: mockSignUpEmail,
	},
	signOut: mockSignOut,
}

export function resetAuthClientMocks() {
	mockUseSession.mockReset()
	mockSignInEmail.mockReset()
	mockSignInSocial.mockReset()
	mockSignUpEmail.mockReset()
	mockSignOut.mockReset()
}
