'use client'

import { Geist, Geist_Mono } from 'next/font/google'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

import './globals.css'
import { ThemeProvider } from '@/components/providers/theme.provider'
import StartMockWorkerProvider from '@/components/providers/start-mock-worker.provider'
import Header from '@/components/header'
import TanstackQueryProvider from '@/components/providers/tanstack-query.provider'
import { Toaster } from '@/components/ui/sonner'
import { AUTH_SIGN_IN_PATH } from '@/lib/constants/auth.constants'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const pathname = usePathname()
	const isAuthPath = pathname.startsWith(AUTH_SIGN_IN_PATH)

	useEffect(() => {
		document.title = 'Somson'
		const metaDescription = document.querySelector('meta[name="description"]')
		if (metaDescription) {
			metaDescription.setAttribute('content', 'All in one gym and fitness management application.')
		} else {
			const meta = document.createElement('meta')
			meta.name = 'description'
			meta.content = 'All in one gym and fitness management application.'
			document.head.appendChild(meta)
		}
	}, [])

	return (
		<html className="w-screen h-screen" lang="en">
			<body className={`w-full h-full ${geistSans.variable} ${geistMono.variable} antialiased`}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<StartMockWorkerProvider>
						<TanstackQueryProvider>
							{isAuthPath ? null : <Header />}
							<main className={isAuthPath ? 'h-full w-full' : 'h-[calc(100vh-48px)] w-full'}>{children}</main>
							<Toaster />
						</TanstackQueryProvider>
					</StartMockWorkerProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
