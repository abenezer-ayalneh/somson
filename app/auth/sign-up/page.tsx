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
import { AUTH_DEFAULT_CALLBACK_URL, AUTH_SIGN_IN_PATH, GOOGLE_PROVIDER_ID } from '@/lib/constants/auth.constants'

export default function SignUpPage() {
	const router = useRouter()
	const { isPending } = authClient.useSession()
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [signUpValues, setSignUpValues] = useState({ name: '', email: '', password: '' })

	const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setErrorMessage(null)
		setIsSubmitting(true)
		const { error } = await authClient.signUp.email({
			email: signUpValues.email,
			password: signUpValues.password,
			name: signUpValues.name,
			callbackURL: AUTH_DEFAULT_CALLBACK_URL,
		})
		setIsSubmitting(false)
		if (error) {
			setErrorMessage(error.message ?? 'Something went wrong. Please try again.')
			return
		}
		router.push(AUTH_DEFAULT_CALLBACK_URL)
	}

	const handleGoogleSignUp = async () => {
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

	return (
		<div className="flex h-full w-full items-center justify-center px-6 py-10 text-foreground">
			<div className="w-full max-w-sm space-y-5">
				<div className="flex justify-center items-center">
					<div className="flex justify-center items-center overflow-hidden rounded-lg">
						<Image src="/logo.png" alt="Somson" width={140} height={48} priority className="scale-150" />
					</div>
				</div>

				<div className="rounded-2xl border border-border bg-card p-6 shadow-2xl shadow-black/30">
					<form onSubmit={handleSignUp} className="space-y-4">
						<div className="space-y-1 text-center">
							<h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
							<p className="text-sm text-muted-foreground">Create your account to start using the app.</p>
						</div>

						<Button
							type="button"
							variant="outline"
							className="h-10 w-full border-border bg-background text-foreground hover:bg-muted"
							onClick={handleGoogleSignUp}
							disabled={isSubmitting || isPending}>
							<IconBrandGoogle className="h-4 w-4" />
							Sign up with Google
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
							<Label htmlFor="signup-name" className="text-foreground">
								Name
							</Label>
							<Input
								id="signup-name"
								type="text"
								autoComplete="name"
								placeholder="Alex Johnson"
								value={signUpValues.name}
								onChange={(event) => setSignUpValues((prev) => ({ ...prev, name: event.target.value }))}
								className="h-10 border-input bg-background text-foreground placeholder:text-muted-foreground"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="signup-email" className="text-foreground">
								Email
							</Label>
							<Input
								id="signup-email"
								type="email"
								autoComplete="email"
								placeholder="email@example.com"
								value={signUpValues.email}
								onChange={(event) => setSignUpValues((prev) => ({ ...prev, email: event.target.value }))}
								className="h-10 border-input bg-background text-foreground placeholder:text-muted-foreground"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="signup-password" className="text-foreground">
								Password
							</Label>
							<Input
								id="signup-password"
								type="password"
								autoComplete="new-password"
								value={signUpValues.password}
								onChange={(event) => setSignUpValues((prev) => ({ ...prev, password: event.target.value }))}
								className="h-10 border-input bg-background text-foreground"
								required
							/>
						</div>

						{errorMessage ? (
							<div className="rounded-md border border-destructive/40 bg-destructive/10 p-2 text-xs text-destructive">{errorMessage}</div>
						) : null}

						<Button type="submit" className="h-10 w-full bg-foreground text-background hover:bg-foreground/90" disabled={isSubmitting || isPending}>
							Sign up
						</Button>

						<p className="text-center text-sm text-muted-foreground">
							Already have an account?{' '}
							<Link href={AUTH_SIGN_IN_PATH} className="font-medium text-foreground underline underline-offset-4">
								Sign in
							</Link>
						</p>
					</form>
				</div>
			</div>
		</div>
	)
}
