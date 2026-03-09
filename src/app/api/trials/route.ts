import { NextRequest, NextResponse } from 'next/server'
import type { ClinicalTrial } from '@/lib/types'
import fallbackLungCancer from '@/lib/fixtures/trials-lungcancer.json'
import fallbackAlzheimer from '@/lib/fixtures/trials-alzheimer.json'
import fallbackHer2 from '@/lib/fixtures/trials-her2.json'

function selectFallback(disease: string, target: string, drug: string) {
  const q = `${disease} ${target} ${drug}`.toLowerCase()
  if (q.includes('alzheimer') || q.includes('amyloid') || q.includes('lecanemab') || q.includes('donanemab')) {
    return fallbackAlzheimer
  }
  if (q.includes('her2') || q.includes('breast cancer') || q.includes('t-dxd') || q.includes('trastuzumab deruxtecan')) {
    return fallbackHer2
  }
  return fallbackLungCancer
}

const CT_BASE = 'https://clinicaltrials.gov/api/v2'

const PHASE_MAP: Record<string, string> = {
  'PHASE1': 'Phase I',
  'PHASE2': 'Phase II',
  'PHASE3': 'Phase III',
  'PHASE4': 'Phase IV',
  'EARLY_PHASE1': 'Early Phase I',
  'NA': 'N/A',
}

function normalizePhase(phases: string[] | undefined): string {
  if (!phases || phases.length === 0) return 'N/A'
  return PHASE_MAP[phases[0]] ?? phases[0]
}

function normalizeStatus(status: string | undefined): string {
  const map: Record<string, string> = {
    'RECRUITING': 'Recruiting',
    'ACTIVE_NOT_RECRUITING': 'Active',
    'COMPLETED': 'Completed',
    'TERMINATED': 'Terminated',
    'WITHDRAWN': 'Withdrawn',
    'ENROLLING_BY_INVITATION': 'Enrolling by Invitation',
    'NOT_YET_RECRUITING': 'Not Yet Recruiting',
  }
  return map[status ?? ''] ?? status ?? 'Unknown'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeStudy(s: any): ClinicalTrial {
  const proto = s.protocolSection ?? {}
  const id = proto.identificationModule ?? {}
  const status = proto.statusModule ?? {}
  const design = proto.designModule ?? {}
  const sponsor = proto.sponsorCollaboratorsModule ?? {}
  const conditions = proto.conditionsModule ?? {}
  const locations = proto.contactsLocationsModule ?? {}

  return {
    nctId: id.nctId ?? '',
    title: id.briefTitle ?? '',
    phase: normalizePhase(design.phases),
    status: normalizeStatus(status.overallStatus),
    sponsor: sponsor.leadSponsor?.name ?? '',
    condition: conditions.conditions?.[0] ?? '',
    country: locations.locations?.[0]?.country ?? '',
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const disease = searchParams.get('disease') ?? ''
  const drug = searchParams.get('drug') ?? ''
  const target = searchParams.get('target') ?? ''

  if (!disease && !drug && !target) {
    return NextResponse.json({ studies: [], total: 0 })
  }

  try {
    const params = new URLSearchParams()
    if (disease) params.set('query.cond', disease)
    if (drug) params.set('query.intr', drug)
    if (!disease && target) params.set('query.cond', target)
    params.set('fields', 'NCTId,BriefTitle,Phase,OverallStatus,LeadSponsorName,Condition,LocationCountry,StartDate')
    params.set('pageSize', '50')
    params.set('format', 'json')

    const url = `${CT_BASE}/studies?${params.toString()}`
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error(`ClinicalTrials API failed: ${res.status}`)

    const json = await res.json()
    const studies: ClinicalTrial[] = (json.studies ?? []).map(normalizeStudy)

    return NextResponse.json({ studies, total: json.totalCount ?? studies.length, fallback: false })
  } catch (err) {
    console.error('[Trials API] Error, serving fallback:', err)
    return NextResponse.json({ ...selectFallback(disease, target, drug), fallback: true })
  }
}
