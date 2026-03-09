import type { PubMedPaper, QueryInput } from '../types'

export interface PubMedResponse {
  papers: PubMedPaper[]
  fallback: boolean
}

export async function fetchPubMed(
  input: Pick<QueryInput, 'disease' | 'target' | 'drug' | 'timeYears'>,
  options?: { reviewOnly?: boolean },
): Promise<PubMedResponse> {
  const params = new URLSearchParams()
  if (input.disease) params.set('disease', input.disease)
  if (input.target) params.set('target', input.target)
  if (input.drug) params.set('drug', input.drug)
  params.set('timeYears', String(input.timeYears))
  if (options?.reviewOnly) params.set('reviewOnly', 'true')

  const res = await fetch(`/api/pubmed?${params.toString()}`)
  if (!res.ok) throw new Error(`PubMed fetch failed: ${res.status}`)
  return res.json()
}
