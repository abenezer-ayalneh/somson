import { getSessionCookie } from 'better-auth/cookies'
import { NextRequest, NextResponse } from 'next/server'

import { AUTH_API_ROUTE_PREFIX, AUTH_SIGN_IN_PATH } from '@/lib/constants/auth.constants'

const isPublicPath = (pathname: string): boolean => pathname === AUTH_SIGN_IN_PATH || pathname.startsWith(`${AUTH_SIGN_IN_PATH}/`)

const isAuthApiRoute = (pathname: string): boolean => pathname.startsWith(AUTH_API_ROUTE_PREFIX)

const isNextAsset = (pathname: string): boolean => pathname.startsWith('/_next')

const isStaticFile = (pathname: string): boolean => /\.[a-zA-Z0-9]+$/.test(pathname)

export const proxy = (request: NextRequest) => {
	const { pathname } = request.nextUrl

	if (isNextAsset(pathname) || isStaticFile(pathname) || isAuthApiRoute(pathname) || isPublicPath(pathname)) {
		return NextResponse.next()
	}

	const sessionCookie = getSessionCookie(request)

	if (!sessionCookie) {
		return NextResponse.redirect(new URL(AUTH_SIGN_IN_PATH, request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/:path*'],
}
