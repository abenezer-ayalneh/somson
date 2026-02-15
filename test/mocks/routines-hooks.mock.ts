import { vi } from 'vitest'

export const mockUseRoutines = vi.fn()
export const mockUseRoutine = vi.fn()
export const mockUseCreateRoutine = vi.fn()
export const mockUseDeleteRoutine = vi.fn()

export function resetRoutineHookMocks() {
	mockUseRoutines.mockReset()
	mockUseRoutine.mockReset()
	mockUseCreateRoutine.mockReset()
	mockUseDeleteRoutine.mockReset()
}
