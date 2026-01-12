import { IconLanguage, IconMenu3 } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import { ThemeSelectorButton } from '@/components/theme-selector-button'

export default function Header() {
	return (
		<div className="w-full h-12 flex justify-between items-center px-4 py-2">
			<Button variant="ghost" size="icon-lg" className="">
				<IconMenu3 />
			</Button>
			<div className="flex gap-2">
				<Button variant="outline" size="icon-lg" className="">
					<IconLanguage />
				</Button>
				<ThemeSelectorButton />
			</div>
		</div>
	)
}
