import { notFound } from 'next/navigation'
import TestClient from './TestClient'
import { getCastle, CASTLES } from '../../lib/castles'

export function generateStaticParams() {
  return CASTLES.map(c => ({ id: c.id }))
}

export default async function TestPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const castle = getCastle(id)
  if (!castle) notFound()
  return <TestClient castle={castle} />
}
