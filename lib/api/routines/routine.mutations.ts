'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { CreateRoutineRequest } from '@/lib/interfaces/routine'

import { createRoutine, deleteRoutine, updateRoutine } from './routine.requests'
import { routineKeys } from './routine.queries'

export function useCreateRoutine() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: createRoutine,
		onSuccess: async () => {
			// Invalidate and refetch routines list after creating
			await queryClient.invalidateQueries({ queryKey: routineKeys.lists() })
		},
	})
}

export function useUpdateRoutine() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ slug, input }: { slug: string; input: Partial<CreateRoutineRequest> }) => updateRoutine(slug, input),
		onSuccess: async (_, variables) => {
			// Invalidate both the list and the specific routine detail
			await queryClient.invalidateQueries({ queryKey: routineKeys.lists() })
			await queryClient.invalidateQueries({ queryKey: routineKeys.detail(variables.slug) })
		},
	})
}

export function useDeleteRoutine() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: deleteRoutine,
		onSuccess: async () => {
			// Invalidate routines list after deletion
			await queryClient.invalidateQueries({ queryKey: routineKeys.lists() })
		},
	})
}
