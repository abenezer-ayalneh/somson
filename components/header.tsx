'use client'

import { IconLanguage, IconMenu3 } from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { ThemeSelectorButton } from '@/components/theme-selector-button'
import { authClient } from '@/lib/auth/auth-client'
import { AUTH_SIGN_IN_PATH } from '@/lib/constants/auth.constants'

export default function Header() {
	const router = useRouter()
	const { data: session, isPending } = authClient.useSession()

	return (
		<div className="w-full h-12 flex justify-between items-center px-4 py-2">
			<Button variant="ghost" size="icon-lg" className="">
				<IconMenu3 />
			</Button>
			<div className="flex gap-2">
				{session ? (
					<Button
						variant="outline"
						size="lg"
						onClick={async () => {
							const { error } = await authClient.signOut()
							if (!error) router.push(AUTH_SIGN_IN_PATH)
						}}
						disabled={isPending}>
						Sign out
					</Button>
				) : (
					<Button variant="outline" size="lg" asChild>
						<Link href="/auth">Sign in</Link>
					</Button>
				)}
				<Button variant="outline" size="icon-lg" className="">
					<IconLanguage />
				</Button>
				<ThemeSelectorButton />
			</div>
		</div>
	)
}
