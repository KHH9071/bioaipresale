// ─── Query Input ───────────────────────────────────────────────────────────────

export type BusinessObjective =
  | 'literature_intelligence'
  | 'trial_scouting'
  | 'label_regulatory'
  | 'scientific_qa'
  | 'kol_sponsor_landscape'

export type Region = 'Global' | 'US' | 'KR' | 'EU'
export type TimeYears = 3 | 5 | 10

// ─── Solution Routing ──────────────────────────────────────────────────────────

export type ProblemDomain =
  | 'literature_regulatory'          // 문헌 / 규제 인텔리전스
  | 'trial_competitive'              // 임상 / 경쟁 인텔리전스
  | 'data_infrastructure'            // 데이터 인프라 / 플랫폼 구축
  | 'drug_discovery_computational'   // 신약 발굴 / 컴퓨테이셔널 분석
  | 'patient_digital_health'         // 환자 데이터 / 디지털 헬스
  | 'kol_landscape'                  // KOL / 랜드스케이프 인텔리전스

export type DataMaturity =
  | 'nascent'      // 초기 단계 (분산·비구조화)
  | 'developing'   // 개발 중 (일부 구조화, 사일로 존재)
  | 'established'  // 성숙 단계 (통합 파이프라인 운영 중)

export type SolutionArea =
  | 'genai'                // GenAI / 의료 AI 어시스턴트
  | 'edp'                  // 엔터프라이즈 데이터 플랫폼
  | 'structure_prediction' // 단백질 구조 예측 (개념 논의)
  | 'genomics_pipeline'    // 유전체 분석 파이프라인 (개념 논의)
  | 'digital_health'       // 디지털 헬스 / 워크플로우 플랫폼
  | 'kol'                  // KOL & 랜드스케이프 인텔리전스

export interface SolutionRouteResult {
  area: SolutionArea
  areaLabel: string
  rationale: string
  discoveryQuestions: string[]
  requiredDataAssets: string[]
  architectureHint: string
  conceptDiscussionOnly: boolean
  disclaimerText?: string
}

export interface QueryInput {
  disease: string
  target: string
  drug: string
  objective: BusinessObjective
  region: Region
  timeYears: TimeYears
  problemDomain: ProblemDomain
  dataMaturity: DataMaturity
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
