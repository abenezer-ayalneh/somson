import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import AuthPage from '@/app/auth/page'
import { buildFrontendCallbackUrl } from '@/lib/auth/callback-url'
import { AUTH_DEFAULT_CALLBACK_URL, GOOGLE_PROVIDER_ID } from '@/lib/constants/auth.constants'

const { mockUseSession, mockSignInEmail, mockSignInSocial, mockSignOut, mockPush, authClientMock } = vi.hoisted(() => {
	const useSession = vi.fn()
	const signInEmail = vi.fn()
	const signInSocial = vi.fn()
	const signOut = vi.fn()
	const push = vi.fn()

	return {
		mockUseSession: useSession,
		mockSignInEmail: signInEmail,
		mockSignInSocial: signInSocial,
		mockSignOut: signOut,
		mockPush: push,
		authClientMock: {
			useSession,
			signIn: {
				email: signInEmail,
				social: signInSocial,
			},
			signOut,
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

describe('AuthPage', () => {
	beforeEach(() => {
		mockUseSession.mockReset()
		mockSignInEmail.mockReset()
		mockSignInSocial.mockReset()
		mockSignOut.mockReset()
		mockPush.mockReset()
	})

	it('renders sign-in form for unauthenticated users', () => {
		mockUseSession.mockReturnValue({ data: null, isPending: false })
		render(<AuthPage />)

		expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Login with Google' })).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
		expect(screen.getByRole('link', { name: 'Sign up' })).toHaveAttribute('href', '/auth/sign-up')
	})

	it('submits email sign-in and redirects on success', async () => {
		const user = userEvent.setup()
		mockUseSession.mockReturnValue({ data: null, isPending: false })
		mockSignInEmail.mockResolvedValue({ error: null })
		render(<AuthPage />)

		await user.type(screen.getByLabelText('Email'), 'user@example.com')
		await user.type(screen.getByLabelText('Password'), 'secret123')
		await user.click(screen.getByRole('button', { name: 'Login' }))

		await waitFor(() => {
			expect(mockSignInEmail).toHaveBeenCalledWith({
				email: 'user@example.com',
				password: 'secret123',
				callbackURL: AUTH_DEFAULT_CALLBACK_URL,
			})
			expect(mockPush).toHaveBeenCalledWith(AUTH_DEFAULT_CALLBACK_URL)
		})
	})

	it('shows error message when email sign-in fails', async () => {
		const user = userEvent.setup()
		mockUseSession.mockReturnValue({ data: null, isPending: false })
		mockSignInEmail.mockResolvedValue({ error: { message: 'Invalid credentials' } })
		render(<AuthPage />)

		await user.type(screen.getByLabelText('Email'), 'user@example.com')
		await user.type(screen.getByLabelText('Password'), 'wrong-password')
		await user.click(screen.getByRole('button', { name: 'Login' }))

		expect(await screen.findByText('Invalid credentials')).toBeInTheDocument()
		expect(mockPush).not.toHaveBeenCalled()
	})

	it('shows google sign-in error message', async () => {
		const user = userEvent.setup()
		mockUseSession.mockReturnValue({ data: null, isPending: false })
		mockSignInSocial.mockResolvedValue({ error: { message: 'Google auth failed' } })
		render(<AuthPage />)

		await user.click(screen.getByRole('button', { name: 'Login with Google' }))

		expect(mockSignInSocial).toHaveBeenCalledWith({
			provider: GOOGLE_PROVIDER_ID,
			callbackURL: buildFrontendCallbackUrl(AUTH_DEFAULT_CALLBACK_URL),
		})
		expect(await screen.findByText('Google auth failed')).toBeInTheDocument()
	})

	it('renders signed-in view and calls sign out', async () => {
		const user = userEvent.setup()
		mockUseSession.mockReturnValue({ data: { user: { email: 'session@example.com' } }, isPending: false })
		mockSignOut.mockResolvedValue({ error: null })
		render(<AuthPage />)

		expect(screen.getByText("You're signed in")).toBeInTheDocument()
		expect(screen.getByText('session@example.com')).toBeInTheDocument()

		await user.click(screen.getByRole('button', { name: 'Sign out' }))
		expect(mockSignOut).toHaveBeenCalled()
	})

	it('disables sign-in actions while auth session is pending', () => {
		mockUseSession.mockReturnValue({ data: null, isPending: true })
		render(<AuthPage />)

		expect(screen.getByRole('button', { name: 'Login with Google' })).toBeDisabled()
		expect(screen.getByRole('button', { name: 'Login' })).toBeDisabled()
	})
})
