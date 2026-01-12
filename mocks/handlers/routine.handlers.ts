import { delay, http, HttpHandler, HttpResponse } from 'msw'
import { faker } from '@faker-js/faker'

import { CreateRoutineRequest, Routine } from '@/lib/interfaces/routine'

const API_BASE_URL = process.env.BACKEND_URL || '/api'

let ROUTINES_LIST: Routine[] = [
	{
		id: '1',
		name: 'Leg Day',
		description: 'Leg day routine description',
		lastDone: faker.date.past().toDateString(),
		createdAt: faker.date.past().toDateString(),
		updatedAt: faker.date.past().toDateString(),
	},
	{
		id: faker.string.uuid(),
		name: 'Upper Body',
		description: 'Upper body routine description',
		lastDone: faker.date.past().toDateString(),
		createdAt: faker.date.past().toDateString(),
		updatedAt: faker.date.past().toDateString(),
	},
]

const MOCKED_ERROR_MESSAGE = {
	statusCode: 555,
	errorType: 'MOCKED_ERROR',
	message: 'Mocked error message',
	details: faker.helpers.arrayElements([null, {}]),
}

export const routineHandlers: HttpHandler[] = [
	http.all('*', async () => {
		await delay(500)
	}),
	http.get(`${API_BASE_URL}/routines`, () => {
		return HttpResponse.json<Routine[]>(ROUTINES_LIST)
	}),
	http.post<object, CreateRoutineRequest>(`${API_BASE_URL}/routines`, async ({ request }) => {
		const { name, description } = await request.json()

		if (name === 'error') {
			return HttpResponse.json(MOCKED_ERROR_MESSAGE, { status: 555 })
		}

		const routine = {
			id: faker.string.uuid(),
			name,
			description,
			lastDone: faker.date.recent().toDateString(),
			createdAt: faker.date.recent().toDateString(),
			updatedAt: faker.date.recent().toDateString(),
		}
		ROUTINES_LIST.push(routine)
		return HttpResponse.json<Routine>(routine)
	}),
	http.delete(`${API_BASE_URL}/routines/:slug`, ({ params }) => {
		if (params.slug === '1') {
			return HttpResponse.json(MOCKED_ERROR_MESSAGE, { status: 555 })
		}

		const slug = params.slug
		ROUTINES_LIST = ROUTINES_LIST.filter((routine) => routine.id !== slug)
		return HttpResponse.json({})
	}),
]
