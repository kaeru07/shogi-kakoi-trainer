export interface LearningRecord {
  id: string
  name: string
  learnedAt: string
}

const STORAGE_KEY = 'shogi-learned-castles'

export function getLearningRecords(): LearningRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as LearningRecord[]) : []
  } catch {
    return []
  }
}

export function recordLearned(id: string, name: string): void {
  const records = getLearningRecords()
  const exists = records.some((r) => r.id === id)
  if (!exists) {
    records.push({ id, name, learnedAt: new Date().toISOString() })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  } else {
    const updated = records.map((r) =>
      r.id === id ? { ...r, learnedAt: new Date().toISOString() } : r,
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }
}

export function isLearned(id: string): boolean {
  return getLearningRecords().some((r) => r.id === id)
}
