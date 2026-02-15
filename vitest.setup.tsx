import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import React from 'react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
	cleanup()
	vi.clearAllMocks()
})

vi.mock('next/link', () => ({
	default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}))

vi.mock('next/font/google', () => ({
	Geist: () => ({ variable: 'mock-geist-sans' }),
	Geist_Mono: () => ({ variable: 'mock-geist-mono' }),
}))

vi.mock('@/app/globals.css', () => ({}))
vi.mock('/Users/abeni/Documents/MyFiles/projects/misc/somson/somson-frontend/app/globals.css', () => ({}))

vi.mock('msw/browser', () => ({
	setupWorker: () => ({
		start: vi.fn().mockResolvedValue(undefined),
	}),
}))
