const TRUE_STRING = 'true'
const AUTH_ROUTE_SUFFIX = '/auth'

const normalizeBoolean = (value: string | undefined): boolean => value?.toLowerCase() === TRUE_STRING

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api'
export const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? `${API_BASE_URL}${AUTH_ROUTE_SUFFIX}`
export const ENABLE_MSW = normalizeBoolean(process.env.NEXT_PUBLIC_ENABLE_MSW)
export const IS_DEVELOPMENT = process.env.NEXT_PUBLIC_NODE_ENV === 'development'
