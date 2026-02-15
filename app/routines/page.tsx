'use client'

import React, { useRef } from 'react'
import { IconBarbell, IconPlayerPlay, IconPlus, IconTrash } from '@tabler/icons-react'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import Link from 'next/link'

import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import CreateRoutineDialog from '@/components/routines/create-routine-dialog'
import { DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemTitle } from '@/components/ui/item'
import { useRoutines } from '@/lib/api/routines/routine.queries'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useDeleteRoutine } from '@/lib/api/routines/routine.mutations'
import { Routine } from '@/lib/interfaces/routine'
import { Skeleton } from '@/components/ui/skeleton'

export default function Routines() {
	const { data: routines, isLoading } = useRoutines()

	const deleteRoutineMutation = useDeleteRoutine()

	const cancelButtonRef = useRef<HTMLButtonElement>(null)

	const handleDeleteRoutine = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, routine: Pick<Routine, 'id'>) => {
		event.preventDefault()
		await deleteRoutineMutation
			.mutateAsync(routine.id)
			.then(() => {
				cancelButtonRef.current?.click()
			})
			.catch((error) => {
				toast.error(error.message ?? 'An error occurred while deleting routine.')
			})
	}

	return (
		<div className="w-full h-full grow flex flex-col gap-y-2 px-4 pt-4 relative">
			<div className="w-full h-fit flex flex-col justify-start items-start">
				<h1 className="scroll-m-20 text-start text-4xl tracking-tight text-balance">Routines</h1>
				<p className="text-muted-foreground text-sm">Routines are a set of exercises grouped together to be done in one session.</p>
			</div>

			<div className="w-full grow">
				{isLoading && (
					<div className="w-full h-full flex flex-col gap-2">
						{Array.from({ length: 5 }).map((_, index) => (
							<Skeleton key={index} className="w-full h-24 rounded-sm" />
						))}
					</div>
				)}
				{!routines || routines.length === 0 ? (
					<div className="w-full h-full flex flex-col items-center justify-start gap-4">
						<Empty>
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<IconBarbell />
								</EmptyMedia>
								<EmptyTitle>No Routines Yet</EmptyTitle>
								<EmptyDescription>You haven&apos;t created any routine yet. Get started by creating your first routine.</EmptyDescription>
							</EmptyHeader>
							<EmptyContent>
								<CreateRoutineDialog>
									<DialogTrigger asChild>
										<Button type="button">Create Routine</Button>
									</DialogTrigger>
								</CreateRoutineDialog>
							</EmptyContent>
						</Empty>
					</div>
				) : (
					<div className="w-full h-full flex flex-col gap-2">
						{routines.map((routine) => (
							<Item key={routine.id} variant="outline">
								<ItemContent>
									<ItemTitle className="text-base">{routine.name}</ItemTitle>
									<ItemDescription>{routine.description}</ItemDescription>
									<ItemFooter>Last Done: {routine.lastDone ? formatDistanceToNow(routine.lastDone) : '-'} ago</ItemFooter>
								</ItemContent>
								<ItemActions>
									<Button variant="outline" size="icon-lg" asChild>
										<Link href={`/routines/${routine.id}`}>
											<IconPlayerPlay />
										</Link>
									</Button>
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button variant="destructive" size="icon-lg">
												<IconTrash />
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>Are you sure?</AlertDialogTitle>
												<AlertDialogDescription>
													This will permanently delete the routine and it cannot be undone. You will lose all the workout exercises
													and your tracked records under it.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogAction
													variant="destructive"
													disabled={deleteRoutineMutation.isPending}
													onClick={(event) => handleDeleteRoutine(event, routine)}>
													Delete
												</AlertDialogAction>
												<AlertDialogCancel variant="outline" ref={cancelButtonRef}>
													Cancel
												</AlertDialogCancel>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</ItemActions>
							</Item>
						))}
					</div>
				)}
			</div>

			<CreateRoutineDialog>
				<DialogTrigger asChild>
					<Button type="button" variant="outline" size="icon-lg" className="w-12 h-12 bg-background rounded-full absolute bottom-6 right-4">
						<IconPlus />
					</Button>
				</DialogTrigger>
			</CreateRoutineDialog>
		</div>
	)
}
