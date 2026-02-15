import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	images: {
		unoptimized: true,
	},
	// Disable trailing slash to match standard routing behavior
	trailingSlash: false,
}

export default nextConfig
