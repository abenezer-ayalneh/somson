'use client'

import React, { useRef } from 'react'
import { toast } from 'sonner'

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useCreateRoutine } from '@/lib/api/routines/routine.mutations'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'

export default function CreateRoutineDialog({ children }: React.PropsWithChildren) {
	const createRoutineMutation = useCreateRoutine()
	const closeRef = useRef<HTMLButtonElement>(null)

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const formData = new FormData(event.currentTarget)
		const name = formData.get('name') as string
		const description = formData.get('description') as string

		createRoutineMutation
			.mutateAsync({ name, description })
			.then(() => {
				closeRef.current?.click()
			})
			.catch((error) => {
				toast.error(error.message ?? 'An error occurred while creating routine.')
			})
	}

	return (
		<Dialog>
			{children}
			<DialogContent>
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Create Routine</DialogTitle>
						<DialogDescription>
							Create a workout routine. This can be a single muscle, a muscle group or a couple of muscle groups you want to include in one
							workout session.
						</DialogDescription>
					</DialogHeader>

					<div className="flex flex-col gap-4 py-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="name">Name</Label>
							<Input id="name" name="name" placeholder="E.g: Shoulder and Triceps, Leg Day, Upper body, etc..." required />
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="description">Description</Label>
							<Textarea id="description" name="description" placeholder="Type routine description here..." />
						</div>
					</div>

					<DialogFooter>
						<Button type="submit" disabled={createRoutineMutation.isPending}>
							{createRoutineMutation.isPending ? 'Processing' : 'Create'} {createRoutineMutation.isPending && <Spinner />}
						</Button>
					</DialogFooter>
					<DialogClose className="sr-only" ref={closeRef} />
				</form>
			</DialogContent>
		</Dialog>
	)
}
