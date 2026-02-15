import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import RoutinesPage from '@/app/routines/page'

const { mockUseRoutines, mockUseDeleteRoutine, mockFormatDistanceToNow, toastErrorMock } = vi.hoisted(() => ({
	mockUseRoutines: vi.fn(),
	mockUseDeleteRoutine: vi.fn(),
	mockFormatDistanceToNow: vi.fn(),
	toastErrorMock: vi.fn(),
}))

vi.mock('date-fns', () => ({
	formatDistanceToNow: (value: Date | string | number) => mockFormatDistanceToNow(value),
}))

vi.mock('sonner', () => ({
	toast: {
		error: (message: string) => toastErrorMock(message),
	},
}))

vi.mock('@/lib/api/routines/routine.queries', () => ({
	useRoutines: () => mockUseRoutines(),
}))

vi.mock('@/lib/api/routines/routine.mutations', () => ({
	useDeleteRoutine: () => mockUseDeleteRoutine(),
}))

vi.mock('@/components/routines/create-routine-dialog', () => ({
	default: ({ children }: React.PropsWithChildren) => <div data-testid="create-routine-dialog">{children}</div>,
}))

vi.mock('@/components/ui/dialog', () => ({
	DialogTrigger: ({ children }: React.PropsWithChildren) => <>{children}</>,
}))

vi.mock('@/components/ui/skeleton', () => ({
	Skeleton: ({ className }: { className?: string }) => <div data-testid="skeleton" className={className} />,
}))

vi.mock('@/components/ui/alert-dialog', () => ({
	AlertDialog: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
	AlertDialogTrigger: ({ children }: React.PropsWithChildren) => <>{children}</>,
	AlertDialogContent: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
	AlertDialogHeader: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
	AlertDialogTitle: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
	AlertDialogDescription: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
	AlertDialogFooter: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
	AlertDialogAction: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props}>{children}</button>,
	AlertDialogCancel: React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(function AlertDialogCancel(props, ref) {
		return (
			<button ref={ref} data-testid="alert-dialog-cancel" {...props}>
				{props.children}
			</button>
		)
	}),
}))

describe('Routines page', () => {
	beforeEach(() => {
		mockUseRoutines.mockReset()
		mockUseDeleteRoutine.mockReset()
		mockFormatDistanceToNow.mockReset()
		toastErrorMock.mockReset()
	})

	it('shows loading skeletons while routines are loading', () => {
		mockUseRoutines.mockReturnValue({ data: undefined, isLoading: true })
		mockUseDeleteRoutine.mockReturnValue({ mutateAsync: vi.fn(), isPending: false })
		render(<RoutinesPage />)

		expect(screen.getAllByTestId('skeleton')).toHaveLength(5)
	})

	it('shows empty state when there are no routines', () => {
		mockUseRoutines.mockReturnValue({ data: [], isLoading: false })
		mockUseDeleteRoutine.mockReturnValue({ mutateAsync: vi.fn(), isPending: false })
		render(<RoutinesPage />)

		expect(screen.getByText('No Routines Yet')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Create Routine' })).toBeInTheDocument()
		expect(screen.getAllByTestId('create-routine-dialog').length).toBeGreaterThan(0)
	})

	it('renders populated routines list with links', () => {
		mockFormatDistanceToNow.mockReturnValue('2 days')
		mockUseRoutines.mockReturnValue({
			data: [
				{
					id: 'routine-1',
					name: 'Leg Day',
					description: 'Heavy squats and lunges',
					lastDone: '2026-02-09T00:00:00.000Z',
				},
			],
			isLoading: false,
		})
		mockUseDeleteRoutine.mockReturnValue({ mutateAsync: vi.fn(), isPending: false })
		render(<RoutinesPage />)

		expect(screen.getByText('Leg Day')).toBeInTheDocument()
		expect(screen.getByText('Heavy squats and lunges')).toBeInTheDocument()
		expect(screen.getByText('Last Done: 2 days ago')).toBeInTheDocument()
		expect(screen.getByRole('link')).toHaveAttribute('href', '/routines/routine-1')
	})

	it('deletes routine and closes dialog on success', async () => {
		const user = userEvent.setup()
		const mutateAsync = vi.fn().mockResolvedValue(undefined)

		mockUseRoutines.mockReturnValue({
			data: [{ id: 'routine-1', name: 'Push Day', description: 'Chest and triceps', lastDone: null }],
			isLoading: false,
		})
		mockUseDeleteRoutine.mockReturnValue({ mutateAsync, isPending: false })
		render(<RoutinesPage />)

		const cancelButton = screen.getByTestId('alert-dialog-cancel')
		const cancelClickSpy = vi.spyOn(cancelButton, 'click')
		await user.click(screen.getByRole('button', { name: 'Delete' }))

		await waitFor(() => {
			expect(mutateAsync).toHaveBeenCalledWith('routine-1')
			expect(cancelClickSpy).toHaveBeenCalled()
		})
	})

	it('shows toast when delete mutation fails', async () => {
		const user = userEvent.setup()
		const mutateAsync = vi.fn().mockRejectedValue(new Error('Delete failed'))

		mockUseRoutines.mockReturnValue({
			data: [{ id: 'routine-1', name: 'Push Day', description: 'Chest and triceps', lastDone: null }],
			isLoading: false,
		})
		mockUseDeleteRoutine.mockReturnValue({ mutateAsync, isPending: false })
		render(<RoutinesPage />)

		await user.click(screen.getByRole('button', { name: 'Delete' }))

		await waitFor(() => {
			expect(toastErrorMock).toHaveBeenCalledWith('Delete failed')
		})
	})
})
