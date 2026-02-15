import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import CreateRoutineDialog from '@/components/routines/create-routine-dialog'

const { mockUseCreateRoutine, toastErrorMock } = vi.hoisted(() => ({
	mockUseCreateRoutine: vi.fn(),
	toastErrorMock: vi.fn(),
}))

vi.mock('sonner', () => ({
	toast: {
		error: (message: string) => toastErrorMock(message),
	},
}))

vi.mock('@/lib/api/routines/routine.mutations', () => ({
	useCreateRoutine: () => mockUseCreateRoutine(),
}))

vi.mock('@/components/ui/dialog', () => ({
	Dialog: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
	DialogContent: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
	DialogHeader: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
	DialogTitle: ({ children }: React.PropsWithChildren) => <h2>{children}</h2>,
	DialogDescription: ({ children }: React.PropsWithChildren) => <p>{children}</p>,
	DialogFooter: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
	DialogClose: React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(function DialogClose(props, ref) {
		return (
			<button ref={ref} data-testid="dialog-close" {...props}>
				{props.children}
			</button>
		)
	}),
}))

vi.mock('@/components/ui/spinner', () => ({
	Spinner: () => <span data-testid="spinner">spinner</span>,
}))

describe('CreateRoutineDialog', () => {
	beforeEach(() => {
		mockUseCreateRoutine.mockReset()
		toastErrorMock.mockReset()
	})

	it('renders form fields and submit button', () => {
		mockUseCreateRoutine.mockReturnValue({ mutateAsync: vi.fn(), isPending: false })
		render(
			<CreateRoutineDialog>
				<button>Open dialog</button>
			</CreateRoutineDialog>,
		)

		expect(screen.getByRole('heading', { name: 'Create Routine' })).toBeInTheDocument()
		expect(screen.getByLabelText('Name')).toBeInTheDocument()
		expect(screen.getByLabelText('Description')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument()
	})

	it('submits mutation with form values and closes on success', async () => {
		const user = userEvent.setup()
		const mutateAsync = vi.fn().mockResolvedValue(undefined)
		mockUseCreateRoutine.mockReturnValue({ mutateAsync, isPending: false })
		render(
			<CreateRoutineDialog>
				<button>Open dialog</button>
			</CreateRoutineDialog>,
		)

		const closeButton = screen.getByTestId('dialog-close')
		const closeClickSpy = vi.spyOn(closeButton, 'click')

		await user.type(screen.getByLabelText('Name'), 'Push Day')
		await user.type(screen.getByLabelText('Description'), 'Chest and triceps')
		await user.click(screen.getByRole('button', { name: 'Create' }))

		await waitFor(() => {
			expect(mutateAsync).toHaveBeenCalledWith({
				name: 'Push Day',
				description: 'Chest and triceps',
			})
			expect(closeClickSpy).toHaveBeenCalled()
		})
	})

	it('shows toast message on mutation failure', async () => {
		const user = userEvent.setup()
		const mutateAsync = vi.fn().mockRejectedValue(new Error('Unable to create routine'))
		mockUseCreateRoutine.mockReturnValue({ mutateAsync, isPending: false })
		render(
			<CreateRoutineDialog>
				<button>Open dialog</button>
			</CreateRoutineDialog>,
		)

		await user.type(screen.getByLabelText('Name'), 'Push Day')
		await user.click(screen.getByRole('button', { name: 'Create' }))

		await waitFor(() => {
			expect(toastErrorMock).toHaveBeenCalledWith('Unable to create routine')
		})
	})

	it('disables submit and shows pending state', () => {
		mockUseCreateRoutine.mockReturnValue({ mutateAsync: vi.fn(), isPending: true })
		render(
			<CreateRoutineDialog>
				<button>Open dialog</button>
			</CreateRoutineDialog>,
		)

		expect(screen.getByRole('button', { name: /Processing/i })).toBeDisabled()
		expect(screen.getByTestId('spinner')).toBeInTheDocument()
	})
})
