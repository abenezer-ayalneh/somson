import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import SignUpPage from '@/app/auth/sign-up/page'
import { buildFrontendCallbackUrl } from '@/lib/auth/callback-url'
import { AUTH_DEFAULT_CALLBACK_URL, GOOGLE_PROVIDER_ID } from '@/lib/constants/auth.constants'

const { mockUseSession, mockSignInSocial, mockSignUpEmail, mockPush, authClientMock } = vi.hoisted(() => {
	const useSession = vi.fn()
	const signInSocial = vi.fn()
	const signUpEmail = vi.fn()
	const push = vi.fn()

	return {
		mockUseSession: useSession,
		mockSignInSocial: signInSocial,
		mockSignUpEmail: signUpEmail,
		mockPush: push,
		authClientMock: {
			useSession,
			signIn: {
				social: signInSocial,
			},
			signUp: {
				email: signUpEmail,
			},
		},
	}
})

vi.mock('next/navigation', async () => {
	const actual = await vi.importActual<object>('next/navigation')
	return {
		...actual,
		useRouter: () => ({
			push: mockPush,
		}),
	}
})

vi.mock('@/lib/auth/auth-client', () => ({
	authClient: authClientMock,
}))

describe('SignUpPage', () => {
	beforeEach(() => {
		mockUseSession.mockReset()
		mockSignInSocial.mockReset()
		mockSignUpEmail.mockReset()
		mockPush.mockReset()
	})

	it('renders the sign-up form', () => {
		mockUseSession.mockReturnValue({ isPending: false })
		render(<SignUpPage />)

		expect(screen.getByRole('heading', { name: 'Create account' })).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Sign up with Google' })).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Sign up' })).toBeInTheDocument()
		expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/auth')
	})

	it('submits email sign-up and redirects on success', async () => {
		const user = userEvent.setup()
		mockUseSession.mockReturnValue({ isPending: false })
		mockSignUpEmail.mockResolvedValue({ error: null })
		render(<SignUpPage />)

		await user.type(screen.getByLabelText('Name'), 'Alex Johnson')
		await user.type(screen.getByLabelText('Email'), 'alex@example.com')
		await user.type(screen.getByLabelText('Password'), 'strong-pass')
		await user.click(screen.getByRole('button', { name: 'Sign up' }))

		await waitFor(() => {
			expect(mockSignUpEmail).toHaveBeenCalledWith({
				name: 'Alex Johnson',
				email: 'alex@example.com',
				password: 'strong-pass',
				callbackURL: AUTH_DEFAULT_CALLBACK_URL,
			})
			expect(mockPush).toHaveBeenCalledWith(AUTH_DEFAULT_CALLBACK_URL)
		})
	})

	it('shows email sign-up error message', async () => {
		const user = userEvent.setup()
		mockUseSession.mockReturnValue({ isPending: false })
		mockSignUpEmail.mockResolvedValue({ error: { message: 'Email already used' } })
		render(<SignUpPage />)

		await user.type(screen.getByLabelText('Name'), 'Alex Johnson')
		await user.type(screen.getByLabelText('Email'), 'alex@example.com')
		await user.type(screen.getByLabelText('Password'), 'strong-pass')
		await user.click(screen.getByRole('button', { name: 'Sign up' }))

		expect(await screen.findByText('Email already used')).toBeInTheDocument()
		expect(mockPush).not.toHaveBeenCalled()
	})

	it('shows google sign-up error message', async () => {
		const user = userEvent.setup()
		mockUseSession.mockReturnValue({ isPending: false })
		mockSignInSocial.mockResolvedValue({ error: { message: 'Google provider unavailable' } })
		render(<SignUpPage />)

		await user.click(screen.getByRole('button', { name: 'Sign up with Google' }))

		expect(mockSignInSocial).toHaveBeenCalledWith({
			provider: GOOGLE_PROVIDER_ID,
			callbackURL: buildFrontendCallbackUrl(AUTH_DEFAULT_CALLBACK_URL),
		})
		expect(await screen.findByText('Google provider unavailable')).toBeInTheDocument()
	})

	it('disables actions while session status is pending', () => {
		mockUseSession.mockReturnValue({ isPending: true })
		render(<SignUpPage />)

		expect(screen.getByRole('button', { name: 'Sign up with Google' })).toBeDisabled()
		expect(screen.getByRole('button', { name: 'Sign up' })).toBeDisabled()
	})
})
