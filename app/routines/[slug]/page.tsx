export default async function Routine({ params }: PageProps<'/routines/[slug]'>) {
	const { slug } = await params
	return <div>{slug}</div>
}
