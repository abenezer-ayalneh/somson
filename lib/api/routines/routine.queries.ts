import { useQuery } from '@tanstack/react-query'

import { getRoutine, getRoutines } from '@/lib/api/routines/routine.requests'

export const routineKeys = {
	all: ['routines'] as const,
	lists: () => [...routineKeys.all, 'list'] as const,
	list: (filters?: string) => [...routineKeys.lists(), { filters }] as const,
	details: () => [...routineKeys.all, 'detail'] as const,
	detail: (id: string) => [...routineKeys.details(), id] as const,
}

export function useRoutines() {
	return useQuery({
		queryKey: routineKeys.lists(),
		queryFn: getRoutines,
	})
}

export function useRoutine(slug: string) {
	return useQuery({
		queryKey: routineKeys.detail(slug),
		queryFn: () => getRoutine(slug),
		enabled: !!slug,
	})
}
