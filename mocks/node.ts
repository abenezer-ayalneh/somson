import { setupServer } from 'msw/node'

import { routineHandlers } from './handlers/routine.handlers'

export const server = setupServer(...routineHandlers)
