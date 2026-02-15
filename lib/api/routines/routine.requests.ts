import { apiRequest } from '@/lib/api/api-client'
import { CreateRoutineRequest, Routine } from '@/lib/interfaces/routine'
import { RoutineApiError } from '@/lib/error-handling'

export async function getRoutines(): Promise<Routine[]> {
	try {
		return await apiRequest<Routine[]>('/routines', {}, 'Failed to fetch routines')
	} catch (error) {
		if (error instanceof RoutineApiError) {
			throw error
		}
		throw new Error(`Network error while fetching routines: ${error instanceof Error ? error.message : 'Unknown error'}`)
	}
}

export async function getRoutine(slug: string): Promise<Routine> {
	try {
		return await apiRequest<Routine>(`/routines/${slug}`, {}, 'Failed to fetch routine')
	} catch (error) {
		if (error instanceof RoutineApiError) {
			throw error
		}
		throw new Error(`Network error while fetching routine: ${error instanceof Error ? error.message : 'Unknown error'}`)
	}
}

export async function createRoutine(input: CreateRoutineRequest): Promise<Routine> {
	try {
		return await apiRequest<Routine>('/routines', { method: 'POST', body: input }, 'Failed to create routine')
	} catch (error) {
		if (error instanceof RoutineApiError) {
			throw error
		}
		throw new Error(`Network error while creating routine: ${error instanceof Error ? error.message : 'Unknown error'}`)
	}
}

export async function updateRoutine(slug: string, input: Partial<CreateRoutineRequest>): Promise<Routine> {
	try {
		return await apiRequest<Routine>(`/routines/${slug}`, { method: 'PATCH', body: input }, 'Failed to update routine')
	} catch (error) {
		if (error instanceof RoutineApiError) {
			throw error
		}
		throw new Error(`Network error while updating routine: ${error instanceof Error ? error.message : 'Unknown error'}`)
	}
}

export async function deleteRoutine(slug: string): Promise<void> {
	try {
		await apiRequest<void>(`/routines/${slug}`, { method: 'DELETE' }, 'Failed to delete routine')
	} catch (error) {
		if (error instanceof RoutineApiError) {
			throw error
		}
		throw new Error(`Network error while deleting routine: ${error instanceof Error ? error.message : 'Unknown error'}`)
	}
}
