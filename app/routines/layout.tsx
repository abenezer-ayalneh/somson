import { IconPlus } from '@tabler/icons-react'
import React from 'react'

import { Button } from '@/components/ui/button'
import CreateRoutineDialog from '@/components/routines/create-routine-dialog'
import { DialogTrigger } from '@/components/ui/dialog'

export default function Layout({ children }: React.PropsWithChildren<React.ReactNode>) {
	return (
		<div className="w-full h-full grow flex flex-col gap-y-2 px-4 pt-4 relative">
			<div className="w-full h-fit flex flex-col justify-start items-start">
				<h1 className="scroll-m-20 text-start text-4xl tracking-tight text-balance">Routines</h1>
				<p className="text-muted-foreground text-sm">Routines are a set of exercises grouped together to be done in one session.</p>
			</div>

			<div className="w-full grow">{children}</div>

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
