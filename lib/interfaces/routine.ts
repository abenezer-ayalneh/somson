export interface Routine {
	id: string
	name: string
	description?: string
	lastDone: string
	createdAt: string
	updatedAt: string
}

export interface CreateRoutineRequest {
	name: string
	description?: string
}
