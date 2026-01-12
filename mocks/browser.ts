import { setupWorker } from 'msw/browser'

import { routineHandlers } from '@/mocks/handlers/routine.handlers'

export const worker = setupWorker(...[...routineHandlers])
