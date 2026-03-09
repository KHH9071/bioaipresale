// ─── Query Input ───────────────────────────────────────────────────────────────

export type BusinessObjective =
  | 'literature_intelligence'
  | 'trial_scouting'
  | 'label_regulatory'
  | 'scientific_qa'
  | 'kol_sponsor_landscape'

export type Region = 'Global' | 'US' | 'KR' | 'EU'
export type TimeYears = 3 | 5 | 10

export interface QueryInput {
  disease: string
  target: string
  drug: string
  objective: BusinessObjective
  region: Region
  timeYears: TimeYears
}

export type PrimaryUser =
  | 'research_scientist'
  | 'medical_affairs'
  | 'bd_strategy'
  | 'regulatory'

export type DataAvailability = 'low' | 'medium' | 'high'
export type DeliveryPreference = 'fast_poc' | 'reusable_platform' | 'executive_demo'

export interface PoCOptions {
  primaryUser: PrimaryUser
  dataAvailability: DataAvailability
  deliveryPreference: DeliveryPreference
}

// ─── Rule Engine Outputs ────────────────────────────────────────────────────────

export interface KPIItem {
  metric: string
  target: string
  baseline: string
}

export interface OpportunityOutput {
  opportunityStatement: string
  painPoints: string[]
  pocType: string
  pocTypeDescription: string
  kpiPreview: KPIItem[]
}

export interface WeekScope {
  week: number
  title: string
  description: string
}

export interface PoCProposal {
  problemDefinition: string
  whyAI: string
  whyNow: string
  solutionPattern: string
  solutionDescription: string
  dataNeeded: {
    public: string[]
    internal: string[]
    extension: string[]
  }
  sixWeekScope: WeekScope[]
  kpis: KPIItem[]
  risks: { risk: string; guardrail: string }[]
}

// ─── API Data Types ──────────────────────────────────────────────────────────────

export interface PubMedPaper {
  pmid: string
  title: string
  journal: string
  year: string
  abstract: string
}

export interface ClinicalTrial {
  nctId: string
  title: string
  phase: string
  status: string
  sponsor: string
  condition: string
  country: string
}

export interface PhaseCount {
  phase: string
  count: number
}

export interface SponsorEntry {
  name: string
  count: number
  condition: string
}

export interface KeywordEntry {
  term: string
  count: number
}
