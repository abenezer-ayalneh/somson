import { render, screen } from '@testing-library/react'

import Home from '@/app/page'

describe('Home page', () => {
	it('renders the routines navigation link', () => {
		render(<Home />)

		const routinesLink = screen.getByRole('link', { name: 'Routines' })
		expect(routinesLink).toBeInTheDocument()
		expect(routinesLink).toHaveAttribute('href', '/routines')
	})
})
