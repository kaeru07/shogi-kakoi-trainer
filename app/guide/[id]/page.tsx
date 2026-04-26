import { notFound } from 'next/navigation'
import GuideClient from './GuideClient'
import { getCastle } from '../../lib/castles'

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
