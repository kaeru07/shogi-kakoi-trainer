import { notFound } from 'next/navigation'
import GuideClient from './GuideClient'
import { getCastle, CASTLES } from '../../lib/castles'

export function generateStaticParams() {
  return CASTLES.map(c => ({ id: c.id }))
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const castle = getCastle(id)
  if (!castle) notFound()
  return <GuideClient castle={castle} />
}
