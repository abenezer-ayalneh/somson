import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import RoutinePage from '@/app/routines/[slug]/page'

const { mockUseRoutine, mockUseParams, mockFormatDistanceToNow } = vi.hoisted(() => ({
	mockUseRoutine: vi.fn(),
	mockUseParams: vi.fn(),
	mockFormatDistanceToNow: vi.fn(),
}))

vi.mock('next/navigation', async () => {
	const actual = await vi.importActual<object>('next/navigation')
	return {
		...actual,
		useParams: () => mockUseParams(),
	}
})

vi.mock('date-fns', () => ({
	formatDistanceToNow: (value: Date | string | number) => mockFormatDistanceToNow(value),
}))

vi.mock('@/lib/api/routines/routine.queries', () => ({
	useRoutine: (slug: string) => mockUseRoutine(slug),
}))

describe('Routine detail page', () => {
	beforeEach(() => {
		mockUseRoutine.mockReset()
		mockUseParams.mockReset()
		mockFormatDistanceToNow.mockReset()
		mockUseParams.mockReturnValue({ slug: 'routine-1' })
	})

	it('shows loading skeletons while routine is loading', () => {
		mockUseRoutine.mockReturnValue({ data: null, isLoading: true, isError: false, error: null })
		render(<RoutinePage />)

		expect(screen.queryByText('Routine not found')).not.toBeInTheDocument()
		expect(screen.queryByText('Unable to load routine')).not.toBeInTheDocument()
	})

	it('shows API error branch with message', () => {
		mockUseRoutine.mockReturnValue({
			data: null,
			isLoading: false,
			isError: true,
			error: new Error('Network failed'),
		})
		render(<RoutinePage />)

		expect(screen.getByText('Unable to load routine')).toBeInTheDocument()
		expect(screen.getByText('Network failed')).toBeInTheDocument()
	})

	it('shows not found branch when routine is null', () => {
		mockUseRoutine.mockReturnValue({ data: null, isLoading: false, isError: false, error: null })
		render(<RoutinePage />)

		expect(screen.getByText('Routine not found')).toBeInTheDocument()
		expect(screen.getByText('The routine you are looking for does not exist.')).toBeInTheDocument()
	})

	it('shows routine details and fallback values', () => {
		mockFormatDistanceToNow.mockReturnValueOnce('10 days').mockReturnValueOnce('1 day')
		mockUseRoutine.mockReturnValue({
			data: {
				id: 'routine-1',
				name: 'Push Day',
				description: null,
				lastDone: null,
				createdAt: '2026-02-01T00:00:00.000Z',
				updatedAt: '2026-02-10T00:00:00.000Z',
			},
			isLoading: false,
			isError: false,
			error: null,
		})
		render(<RoutinePage />)

		expect(screen.getByRole('heading', { name: 'Push Day' })).toBeInTheDocument()
		expect(screen.getByText('No description provided yet.')).toBeInTheDocument()
		expect(screen.getByText('Last Done')).toBeInTheDocument()
		expect(screen.getByText('-')).toBeInTheDocument()
		expect(screen.getByText('Created')).toBeInTheDocument()
		expect(screen.getByText('10 days ago')).toBeInTheDocument()
		expect(screen.getByText('Updated')).toBeInTheDocument()
		expect(screen.getByText('1 day ago')).toBeInTheDocument()
	})
})
