import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { vi } from 'vitest'

import RootLayout from '@/app/layout'

const { mockUsePathname } = vi.hoisted(() => ({
	mockUsePathname: vi.fn(),
}))

vi.mock('next/navigation', async () => {
	const actual = await vi.importActual<object>('next/navigation')
	return {
		...actual,
		usePathname: () => mockUsePathname(),
	}
})

vi.mock('@/components/providers/theme.provider', () => ({
	ThemeProvider: ({ children }: React.PropsWithChildren) => <div data-testid="theme-provider">{children}</div>,
}))

vi.mock('@/components/providers/start-mock-worker.provider', () => ({
	default: ({ children }: React.PropsWithChildren) => <div data-testid="mock-worker-provider">{children}</div>,
}))

vi.mock('@/components/providers/tanstack-query.provider', () => ({
	default: ({ children }: React.PropsWithChildren) => <div data-testid="query-provider">{children}</div>,
}))

vi.mock('@/components/header', () => ({
	default: () => <header>Header</header>,
}))

vi.mock('@/components/ui/sonner', () => ({
	Toaster: () => <div data-testid="toaster" />,
}))

describe('RootLayout', () => {
	beforeEach(() => {
		mockUsePathname.mockReset()
		document.head.innerHTML = ''
		document.title = ''
	})

	it('renders header for non-auth paths and sets metadata', async () => {
		mockUsePathname.mockReturnValue('/routines')
		render(
			<RootLayout>
				<div>Page content</div>
			</RootLayout>,
		)

		expect(screen.getByText('Header')).toBeInTheDocument()
		expect(screen.getByText('Page content')).toBeInTheDocument()
		expect(screen.getByTestId('theme-provider')).toBeInTheDocument()
		expect(screen.getByTestId('mock-worker-provider')).toBeInTheDocument()
		expect(screen.getByTestId('query-provider')).toBeInTheDocument()
		expect(screen.getByTestId('toaster')).toBeInTheDocument()

		const main = document.querySelector('main')
		expect(main).toHaveClass('h-[calc(100vh-48px)]')

		await waitFor(() => {
			expect(document.title).toBe('Somson')
			const descriptionMeta = document.querySelector('meta[name="description"]')
			expect(descriptionMeta).toHaveAttribute('content', 'All in one gym and fitness management application.')
		})
	})

	it('hides header on auth path and uses full-height main class', () => {
		mockUsePathname.mockReturnValue('/auth/sign-up')
		render(
			<RootLayout>
				<div>Auth page content</div>
			</RootLayout>,
		)

		expect(screen.queryByText('Header')).not.toBeInTheDocument()
		expect(screen.getByText('Auth page content')).toBeInTheDocument()

		const main = document.querySelector('main')
		expect(main).toHaveClass('h-full')
	})
})
