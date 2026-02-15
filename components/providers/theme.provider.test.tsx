import { render, screen } from '@testing-library/react'
import React from 'react'
import { vi } from 'vitest'

import { ThemeProvider } from '@/components/providers/theme.provider'

const { mockNextThemesProvider } = vi.hoisted(() => ({
	mockNextThemesProvider: vi.fn(({ children }: React.PropsWithChildren) => <div data-testid="next-theme-provider">{children}</div>),
}))

vi.mock('next-themes', () => ({
	ThemeProvider: (props: React.PropsWithChildren) => mockNextThemesProvider(props),
}))

describe('ThemeProvider', () => {
	beforeEach(() => {
		mockNextThemesProvider.mockClear()
	})

	it('passes props to next-themes provider and renders children', () => {
		render(
			<ThemeProvider attribute="class" defaultTheme="dark">
				<div>Theme child</div>
			</ThemeProvider>,
		)

		expect(mockNextThemesProvider).toHaveBeenCalled()
		expect(mockNextThemesProvider.mock.calls[0]?.[0]).toMatchObject({
			attribute: 'class',
			defaultTheme: 'dark',
		})
		expect(screen.getByTestId('next-theme-provider')).toBeInTheDocument()
		expect(screen.getByText('Theme child')).toBeInTheDocument()
	})
})
