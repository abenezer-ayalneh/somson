import { CreateRoutineRequest, Routine } from '@/lib/interfaces/routine'
import { handleResponse, RoutineApiError } from '@/lib/error-handling'

const API_BASE_URL = process.env.BACKEND_URL || '/api'

export async function getRoutines(): Promise<Routine[]> {
	try {
		const response = await fetch(`${API_BASE_URL}/routines`, {
			headers: {
				'Content-Type': 'application/json',
			},
		})

		return handleResponse<Routine[]>(response, 'Failed to fetch routines')
	} catch (error) {
		if (error instanceof RoutineApiError) {
			throw error
		}
		throw new Error(`Network error while fetching routines: ${error instanceof Error ? error.message : 'Unknown error'}`)
	}
}

export async function getRoutine(slug: string): Promise<Routine> {
	try {
		const response = await fetch(`${API_BASE_URL}/routines/${slug}`, {
			headers: {
				'Content-Type': 'application/json',
			},
		})

		return handleResponse<Routine>(response, 'Failed to fetch routine')
	} catch (error) {
		if (error instanceof RoutineApiError) {
			throw error
		}
		throw new Error(`Network error while fetching routine: ${error instanceof Error ? error.message : 'Unknown error'}`)
	}
}

export async function createRoutine(input: CreateRoutineRequest): Promise<Routine> {
	try {
		const response = await fetch(`${API_BASE_URL}/routines`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(input),
		})

		return handleResponse<Routine>(response, 'Failed to create routine')
	} catch (error) {
		if (error instanceof RoutineApiError) {
			throw error
		}
		throw new Error(`Network error while creating routine: ${error instanceof Error ? error.message : 'Unknown error'}`)
	}
}

export async function updateRoutine(slug: string, input: Partial<CreateRoutineRequest>): Promise<Routine> {
	try {
		const response = await fetch(`${API_BASE_URL}/routines/${slug}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(input),
		})

		return handleResponse<Routine>(response, 'Failed to update routine')
	} catch (error) {
		if (error instanceof RoutineApiError) {
			throw error
		}
		throw new Error(`Network error while updating routine: ${error instanceof Error ? error.message : 'Unknown error'}`)
	}
}

export async function deleteRoutine(slug: string): Promise<void> {
	try {
		const response = await fetch(`${API_BASE_URL}/routines/${slug}`, {
			method: 'DELETE',
		})

		await handleResponse<void>(response, 'Failed to delete routine')
	} catch (error) {
		if (error instanceof RoutineApiError) {
			throw error
		}
		throw new Error(`Network error while deleting routine: ${error instanceof Error ? error.message : 'Unknown error'}`)
	}
}
