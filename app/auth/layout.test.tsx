import { render, screen } from '@testing-library/react'
import React from 'react'
import { vi } from 'vitest'

import AuthLayout from '@/app/auth/layout'

vi.mock('@/components/theme-selector-button', () => ({
	ThemeSelectorButton: () => <div data-testid="theme-selector-button">ThemeSelectorButton</div>,
}))

describe('AuthLayout', () => {
	it('renders language and theme controls with children', () => {
		render(
			<AuthLayout>
				<div>Auth content</div>
			</AuthLayout>,
		)

		expect(screen.getByRole('button')).toBeInTheDocument()
		expect(screen.getByTestId('theme-selector-button')).toBeInTheDocument()
		expect(screen.getByText('Auth content')).toBeInTheDocument()
	})
})
