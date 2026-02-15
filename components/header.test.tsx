import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import Header from '@/components/header'

const { mockUseSession, mockSignOut, mockPush, authClientMock } = vi.hoisted(() => {
	const useSession = vi.fn()
	const signOut = vi.fn()
	const push = vi.fn()
	return {
		mockUseSession: useSession,
		mockSignOut: signOut,
		mockPush: push,
		authClientMock: {
			useSession,
			signOut,
		},
	}
})

vi.mock('next/navigation', async () => {
	const actual = await vi.importActual<object>('next/navigation')
	return {
		...actual,
		useRouter: () => ({ push: mockPush }),
	}
})

vi.mock('@/lib/auth/auth-client', () => ({
	authClient: authClientMock,
}))

vi.mock('@/components/theme-selector-button', () => ({
	ThemeSelectorButton: () => <div data-testid="theme-selector-button">Theme</div>,
}))

describe('Header', () => {
	beforeEach(() => {
		mockUseSession.mockReset()
		mockSignOut.mockReset()
		mockPush.mockReset()
	})

	it('shows sign-in link when there is no session', () => {
		mockUseSession.mockReturnValue({ data: null, isPending: false })
		render(<Header />)

		expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/auth')
	})

	it('shows sign-out button when session exists', () => {
		mockUseSession.mockReturnValue({ data: { user: { email: 'user@example.com' } }, isPending: false })
		render(<Header />)

		expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument()
	})

	it('calls signOut and redirects to auth page when clicking sign-out button', async () => {
		const user = userEvent.setup()
		mockUseSession.mockReturnValue({ data: { user: { email: 'user@example.com' } }, isPending: false })
		mockSignOut.mockResolvedValue({ error: null })
		render(<Header />)

		await user.click(screen.getByRole('button', { name: 'Sign out' }))
		expect(mockSignOut).toHaveBeenCalled()
		expect(mockPush).toHaveBeenCalledWith('/auth')
	})

	it('disables sign-out button while session hook is pending', () => {
		mockUseSession.mockReturnValue({ data: { user: { email: 'user@example.com' } }, isPending: true })
		render(<Header />)

		expect(screen.getByRole('button', { name: 'Sign out' })).toBeDisabled()
	})
})
