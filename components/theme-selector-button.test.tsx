import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { ThemeSelectorButton } from '@/components/theme-selector-button'

const { setThemeMock } = vi.hoisted(() => ({
	setThemeMock: vi.fn(),
}))

vi.mock('next-themes', () => ({
	useTheme: () => ({
		setTheme: setThemeMock,
	}),
}))

vi.mock('@/components/ui/dropdown-menu', () => ({
	DropdownMenu: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
	DropdownMenuTrigger: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
	DropdownMenuContent: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
	DropdownMenuItem: ({ children, onClick }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button onClick={onClick}>{children}</button>,
}))

describe('ThemeSelectorButton', () => {
	beforeEach(() => {
		setThemeMock.mockReset()
	})

	it('renders accessible trigger label', () => {
		render(<ThemeSelectorButton />)
		expect(screen.getByText('Toggle theme')).toBeInTheDocument()
	})

	it('sets light, dark, and system themes', async () => {
		const user = userEvent.setup()
		render(<ThemeSelectorButton />)

		await user.click(screen.getByRole('button', { name: 'Light' }))
		await user.click(screen.getByRole('button', { name: 'Dark' }))
		await user.click(screen.getByRole('button', { name: 'System' }))

		expect(setThemeMock).toHaveBeenNthCalledWith(1, 'light')
		expect(setThemeMock).toHaveBeenNthCalledWith(2, 'dark')
		expect(setThemeMock).toHaveBeenNthCalledWith(3, 'system')
	})
})
