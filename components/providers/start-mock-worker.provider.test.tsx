import { render, screen } from '@testing-library/react'
import React from 'react'
import { vi } from 'vitest'

import StartMockWorkerProvider from '@/components/providers/start-mock-worker.provider'

const CHILD_CONTENT = 'Provider child'

const { mockWorkerStart, envOverrides } = vi.hoisted(() => ({
	mockWorkerStart: vi.fn().mockResolvedValue(undefined),
	envOverrides: { ENABLE_MSW: true, IS_DEVELOPMENT: true },
}))

vi.mock('@/lib/constants/env', () => ({
	get ENABLE_MSW() {
		return envOverrides.ENABLE_MSW
	},
	get IS_DEVELOPMENT() {
		return envOverrides.IS_DEVELOPMENT
	},
}))

vi.mock('@/mocks/browser', () => ({
	worker: {
		start: () => mockWorkerStart(),
	},
}))

describe('StartMockWorkerProvider', () => {
	beforeEach(() => {
		envOverrides.ENABLE_MSW = true
		envOverrides.IS_DEVELOPMENT = true
		mockWorkerStart.mockResolvedValue(undefined)
		mockWorkerStart.mockClear()
	})

	it('shows Spinner while mock worker is starting', async () => {
		let resolveWorkerStart: () => void
		mockWorkerStart.mockImplementation(
			() =>
				new Promise<void>((resolve) => {
					resolveWorkerStart = resolve
				}),
		)

		render(
			<StartMockWorkerProvider>
				<div>{CHILD_CONTENT}</div>
			</StartMockWorkerProvider>,
		)

		expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
		expect(screen.queryByText(CHILD_CONTENT)).not.toBeInTheDocument()

		await vi.waitFor(() => {
			expect(mockWorkerStart).toHaveBeenCalled()
		})
		resolveWorkerStart!()

		expect(await screen.findByText(CHILD_CONTENT)).toBeInTheDocument()
		expect(screen.queryByRole('status', { name: 'Loading' })).not.toBeInTheDocument()
	})

	it('renders children after mock worker has started', async () => {
		render(
			<StartMockWorkerProvider>
				<div>{CHILD_CONTENT}</div>
			</StartMockWorkerProvider>,
		)

		expect(await screen.findByText(CHILD_CONTENT)).toBeInTheDocument()
		expect(mockWorkerStart).toHaveBeenCalledTimes(1)
	})

	it('renders children immediately when MSW is disabled', async () => {
		envOverrides.ENABLE_MSW = false

		render(
			<StartMockWorkerProvider>
				<div>{CHILD_CONTENT}</div>
			</StartMockWorkerProvider>,
		)

		expect(await screen.findByText(CHILD_CONTENT)).toBeInTheDocument()
		expect(mockWorkerStart).not.toHaveBeenCalled()
	})

	it('renders children immediately when not in development', async () => {
		envOverrides.IS_DEVELOPMENT = false

		render(
			<StartMockWorkerProvider>
				<div>{CHILD_CONTENT}</div>
			</StartMockWorkerProvider>,
		)

		expect(await screen.findByText(CHILD_CONTENT)).toBeInTheDocument()
		expect(mockWorkerStart).not.toHaveBeenCalled()
	})
})
