import { QueryClient } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import TanstackQueryProvider from '@/components/providers/tanstack-query.provider'

const { getQueryClientMock } = vi.hoisted(() => ({
	getQueryClientMock: vi.fn(() => new QueryClient()),
}))

vi.mock('@/lib/get-query-client', () => ({
	getQueryClient: () => getQueryClientMock(),
}))

describe('TanstackQueryProvider', () => {
	beforeEach(() => {
		getQueryClientMock.mockClear()
	})

	it('creates query client and wraps children', () => {
		render(
			<TanstackQueryProvider>
				<div>Provider child</div>
			</TanstackQueryProvider>,
		)

		expect(getQueryClientMock).toHaveBeenCalledTimes(1)
		expect(screen.getByText('Provider child')).toBeInTheDocument()
	})
})
