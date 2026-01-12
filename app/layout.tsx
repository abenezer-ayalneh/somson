import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'
import { ThemeProvider } from '@/components/providers/theme.provider'
import StartMockWorkerProvider from '@/components/providers/start-mock-worker.provider'
import Header from '@/components/header'
import TanstackQueryProvider from '@/components/providers/tanstack-query.provider'
import { Toaster } from '@/components/ui/sonner'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Somson',
	description: 'All in one gym and fitness management application.',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html className="w-screen h-screen" lang="en">
			<body className={`w-full h-full ${geistSans.variable} ${geistMono.variable} antialiased`}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<StartMockWorkerProvider>
						<TanstackQueryProvider>
							<Header />
							<main className="w-full h-[calc(100vh-48px)]">{children}</main>
							<Toaster />
						</TanstackQueryProvider>
					</StartMockWorkerProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
