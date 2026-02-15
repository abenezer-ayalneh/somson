import { IconLanguage } from '@tabler/icons-react'

import { ThemeSelectorButton } from '@/components/theme-selector-button'
import { Button } from '@/components/ui/button'

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className="relative h-full w-full">
			<div className="absolute right-0 top-0 z-10 flex h-12 items-center gap-2 px-4 py-2">
				<Button variant="outline" size="icon-lg">
					<IconLanguage />
				</Button>
				<ThemeSelectorButton />
			</div>
			{children}
		</div>
	)
}
