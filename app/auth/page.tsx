'use client'

import { useState } from 'react'
import { IconBrandGoogle } from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authClient } from '@/lib/auth/auth-client'
import { buildFrontendCallbackUrl } from '@/lib/auth/callback-url'
import { AUTH_DEFAULT_CALLBACK_URL, AUTH_SIGN_UP_PATH, GOOGLE_PROVIDER_ID } from '@/lib/constants/auth.constants'

export default function AuthPage() {
	const router = useRouter()
	const { data: session, isPending } = authClient.useSession()
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [signInValues, setSignInValues] = useState({ email: '', password: '' })

	const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setErrorMessage(null)
		setIsSubmitting(true)
		const { error } = await authClient.signIn.email({
			email: signInValues.email,
			password: signInValues.password,
			callbackURL: AUTH_DEFAULT_CALLBACK_URL,
		})
		setIsSubmitting(false)
		if (error) {
			setErrorMessage(error.message ?? 'Something went wrong. Please try again.')
			return
		}
		router.push(AUTH_DEFAULT_CALLBACK_URL)
	}

	const handleGoogleSignIn = async () => {
		setErrorMessage(null)
		setIsSubmitting(true)
		const callbackURL = buildFrontendCallbackUrl(AUTH_DEFAULT_CALLBACK_URL)
		const { error } = await authClient.signIn.social({
			provider: GOOGLE_PROVIDER_ID,
			callbackURL,
		})
		setIsSubmitting(false)
		if (error) {
			setErrorMessage(error.message ?? 'Something went wrong. Please try again.')
		}
	}

	const handleSignOut = async () => {
		setErrorMessage(null)
		setIsSubmitting(true)
		const { error } = await authClient.signOut()
		setIsSubmitting(false)
		if (error) {
			setErrorMessage(error.message ?? 'Something went wrong. Please try again.')
		}
	}

	return (
		<div className="flex h-full w-full items-center justify-center px-6 py-10 text-foreground">
			<div className="w-full max-w-sm space-y-5">
				<div className="flex justify-center items-center">
					<div className="flex justify-center items-center overflow-hidden rounded-lg">
						<Image src="/logo.png" alt="Somson" width={140} height={48} priority className="scale-150" />
					</div>
				</div>

				<div className="rounded-2xl border border-border bg-card p-6 shadow-2xl shadow-black/30">
					{session ? (
						<div className="space-y-4">
							<div className="space-y-1 text-center">
								<h1 className="text-xl font-semibold">You&apos;re signed in</h1>
								<p className="text-sm text-muted-foreground">{session.user.email}</p>
							</div>
							<Button className="h-9 w-full bg-foreground text-background hover:bg-foreground/90" onClick={handleSignOut} disabled={isSubmitting}>
								Sign out
							</Button>
						</div>
					) : (
						<form onSubmit={handleSignIn} className="space-y-4">
							<div className="space-y-1 text-center">
								<h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
								<p className="text-sm text-muted-foreground">Login with your Google account or email.</p>
							</div>

							<Button
								type="button"
								variant="outline"
								className="h-10 w-full border-border bg-background text-foreground hover:bg-muted"
								onClick={handleGoogleSignIn}
								disabled={isSubmitting || isPending}>
								<IconBrandGoogle className="h-4 w-4" />
								Login with Google
							</Button>

							<div className="relative py-1">
								<div className="absolute inset-0 flex items-center">
									<span className="w-full border-t border-border" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-card px-2 text-muted-foreground">Or continue with</span>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="signin-email" className="text-foreground">
									Email
								</Label>
								<Input
									id="signin-email"
									type="email"
									autoComplete="email"
									placeholder="email@example.com"
									value={signInValues.email}
									onChange={(event) => setSignInValues((prev) => ({ ...prev, email: event.target.value }))}
									className="h-10 border-input bg-background text-foreground placeholder:text-muted-foreground"
									required
								/>
							</div>

							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<Label htmlFor="signin-password" className="text-foreground">
										Password
									</Label>
									<span className="text-xs text-muted-foreground">Forgot your password?</span>
								</div>
								<Input
									id="signin-password"
									type="password"
									autoComplete="current-password"
									value={signInValues.password}
									onChange={(event) => setSignInValues((prev) => ({ ...prev, password: event.target.value }))}
									className="h-10 border-input bg-background text-foreground"
									required
								/>
							</div>

							{errorMessage ? (
								<div className="rounded-md border border-destructive/40 bg-destructive/10 p-2 text-xs text-destructive">{errorMessage}</div>
							) : null}

							<Button
								type="submit"
								className="h-10 w-full bg-foreground text-background hover:bg-foreground/90"
								disabled={isSubmitting || isPending}>
								Login
							</Button>

							<p className="text-center text-sm text-muted-foreground">
								Don&apos;t have an account?{' '}
								<Link href={AUTH_SIGN_UP_PATH} className="font-medium text-foreground underline underline-offset-4">
									Sign up
								</Link>
							</p>
						</form>
					)}
				</div>
			</div>
		</div>
	)
}
