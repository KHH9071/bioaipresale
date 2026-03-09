import type { ClinicalTrial, QueryInput } from '../types'

export interface TrialsResponse {
  studies: ClinicalTrial[]
  total: number
  fallback: boolean
}

export async function fetchTrials(
  input: Pick<QueryInput, 'disease' | 'target' | 'drug'>,
): Promise<TrialsResponse> {
  const params = new URLSearchParams()
  if (input.disease) params.set('disease', input.disease)
  if (input.target) params.set('target', input.target)
  if (input.drug) params.set('drug', input.drug)

  const res = await fetch(`/api/trials?${params.toString()}`)
  if (!res.ok) throw new Error(`Trials fetch failed: ${res.status}`)
  return res.json()
}
