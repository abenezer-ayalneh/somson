'use client'

import { useEffect, useState } from 'react'

import { Spinner } from '@/components/ui/spinner'
import { ENABLE_MSW, IS_DEVELOPMENT } from '@/lib/constants/env'

export default function StartMockWorkerProvider({ children }: { children: React.ReactNode }) {
	const [isMockReady, setMockReady] = useState(false)

	useEffect(() => {
		async function enableMocks() {
			if (!ENABLE_MSW || !IS_DEVELOPMENT) {
				setMockReady(true)
				return
			}

			const { worker } = await import('@/mocks/browser')
			await worker.start()
			setMockReady(true)
		}

		enableMocks()
	}, [])

	if (!isMockReady) {
		return (
			<div className="w-full h-full flex justify-center items-center">
				<Spinner />
			</div>
		)
	}

	return <>{children}</>
}
