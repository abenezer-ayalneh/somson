'use client'

import { formatDistanceToNow } from 'date-fns'
import { useParams } from 'next/navigation'

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { useRoutine } from '@/lib/api/routines/routine.queries'

const INFO_LABELS = {
	lastDone: 'Last Done',
	createdAt: 'Created',
	updatedAt: 'Updated',
} as const

export default function Routine() {
	const params = useParams()
	const slug = params?.slug as string

	const { data: routine, isLoading, isError, error } = useRoutine(slug)

	if (isLoading) {
		return (
			<div className="w-full h-full grow flex flex-col gap-y-2 px-4 pt-4">
				<div className="w-full h-fit flex flex-col gap-2">
					<Skeleton className="w-48 h-8" />
					<Skeleton className="w-full h-4" />
				</div>
				<div className="w-full flex flex-col gap-2">
					<Skeleton className="w-full h-16" />
					<Skeleton className="w-full h-16" />
				</div>
			</div>
		)
	}

	if (isError) {
		return (
			<div className="w-full h-full grow flex flex-col gap-y-2 px-4 pt-4">
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon" />
						<EmptyTitle>Unable to load routine</EmptyTitle>
						<EmptyDescription>{error instanceof Error ? error.message : 'An error occurred while loading routine.'}</EmptyDescription>
					</EmptyHeader>
				</Empty>
			</div>
		)
	}

	if (!routine) {
		return (
			<div className="w-full h-full grow flex flex-col gap-y-2 px-4 pt-4">
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon" />
						<EmptyTitle>Routine not found</EmptyTitle>
						<EmptyDescription>The routine you are looking for does not exist.</EmptyDescription>
					</EmptyHeader>
				</Empty>
			</div>
		)
	}

	return (
		<div className="w-full h-full grow flex flex-col gap-y-4 px-4 pt-4">
			<div className="w-full h-fit flex flex-col justify-start items-start gap-1">
				<h1 className="scroll-m-20 text-start text-4xl tracking-tight text-balance">{routine.name}</h1>
				<p className="text-muted-foreground text-sm">{routine.description ?? 'No description provided yet.'}</p>
			</div>

			<div className="w-full flex flex-col gap-3">
				<div className="flex flex-col">
					<span className="text-xs text-muted-foreground">{INFO_LABELS.lastDone}</span>
					<span className="text-sm">{routine.lastDone ? `${formatDistanceToNow(new Date(routine.lastDone))} ago` : '-'}</span>
				</div>
				<div className="flex flex-col">
					<span className="text-xs text-muted-foreground">{INFO_LABELS.createdAt}</span>
					<span className="text-sm">{formatDistanceToNow(new Date(routine.createdAt))} ago</span>
				</div>
				<div className="flex flex-col">
					<span className="text-xs text-muted-foreground">{INFO_LABELS.updatedAt}</span>
					<span className="text-sm">{formatDistanceToNow(new Date(routine.updatedAt))} ago</span>
				</div>
			</div>
		</div>
	)
}
