/**
 * scenario-templates.ts
 *
 * 각 병목 시나리오별로 실제 generator 출력을 대체·보강하는 콘텐츠 정의.
 * opportunityOutput, pocProposal, solutionRoute에 직접 적용됩니다.
 *
 * 원칙:
 * - 기존 generator의 objective-based 출력을 "덮어쓰는" 방식 (fallback 유지)
 * - 문구는 "학술 설명"이 아닌 "고객 제안" 톤
 * - trial signal이 약한 시나리오는 그 사실을 로직에 반영
 */

import type { KPIItem, PoCProposal, WeekScope, QueryInput, SolutionArea } from '../types'
import type { BottleneckScenarioId } from './types'

// ─── Helper ──────────────────────────────────────────────────────────────────

function buildSubject(input: QueryInput): string {
  return [input.disease, input.target, input.drug].filter(Boolean).join(' / ') || '목표 적응증'
}

// ─── Template Interface ───────────────────────────────────────────────────────

export interface ScenarioGeneratorTemplate {
  // ── OpportunityOutput ──────────────────────────────────────────────────────
  opportunityStatement: (input: QueryInput) => string
  painPoints: string[]
  pocType: string
  pocTypeDescription: string
  kpis: KPIItem[]

  // ── PoCProposal ────────────────────────────────────────────────────────────
  problemDefinition: (input: QueryInput) => string
  whyAI: string
  whyNow: string
  solutionPattern: string
  solutionDescription: string
  dataNeeded: PoCProposal['dataNeeded']
  sixWeekScope: WeekScope[]
  scenarioRisks: Array<{ risk: string; guardrail: string }>

  // ── SolutionRouteResult override ───────────────────────────────────────────
  rationale: string
  discoveryQuestions: string[]
  requiredDataAssets: string[]
  architectureHint: string
  // area/areaLabel은 선택적 override — 지정 시 base routing 결과를 덮어씀.
  // 시나리오가 presales 서사를 주도하는 경우 라벨 불일치(예: rwd_autoimmune의
  // base area='edp' → "엔터프라이즈 데이터 플랫폼")를 방지하기 위함.
  area?: SolutionArea
  areaLabel?: string
}

// ─── 시나리오 1: 공략 불가 표적 / 단백질 분해 전략 ──────────────────────────

const UNDRUGGABLE_TARGET: ScenarioGeneratorTemplate = {
  // OpportunityOutput
  opportunityStatement: (input) => {
    const subject = buildSubject(input)
    return `${subject}에서 기존 저분자 억제제의 한계를 넘어 Degrader·PROTAC·분자 접착제 전략 기회를 AI 기반 문헌·기전 탐색으로 빠르게 식별할 수 있습니다. 분산된 표적 관련 evidence를 통합하여 재공략 전략 평가 사이클을 단축하고 내부 가설 수립을 가속화합니다.`
  },
  painPoints: [
    'Degrader·PROTAC·분자 접착제 관련 문헌이 PubMed·preprint·특허에 분산되어 있어 전략 탐색에 며칠에서 몇 주가 소요됩니다.',
    '기전·표적·약물 연결 정보가 구조화되지 않아 degrader 접근 가능성을 체계적으로 평가하기 어렵습니다.',
    '내성 기전과 새로운 표적 접근법 관련 논문이 빠르게 증가하고 있어 수작업 탐색만으로는 최신 동향을 따라가기 어렵습니다.',
  ],
  pocType: '표적 인텔리전스 RAG (Target Intelligence RAG)',
  pocTypeDescription:
    '분산된 degrader·PROTAC 관련 문헌·기전 데이터를 통합 검색·합성하여 표적 재공략 전략을 빠르게 평가하고 내부 가설 수립을 지원합니다. Literature Intelligence RAG 패턴의 표적 발굴 특화 변형입니다.',

  kpis: [
    {
      metric: '관련 근거 재현율',
      target: '전문가 선정 Top-20 논문 중 80% 이상 탐색',
      baseline: 'SME 수작업 검색 결과와 비교',
    },
    {
      metric: '표적 탐색 시간 단축',
      target: '수작업 대비 60% 이상 감소',
      baseline: '연구원 평균 탐색 시간 4~6시간 기준',
    },
    {
      metric: 'Degrader 전략 비교 커버리지',
      target: '주요 접근법 3가지 이상 근거 수준 비교 완료',
      baseline: '6주 PoC 결과 전문가 검토 기준',
    },
  ],

  // PoCProposal
  problemDefinition: (input) => {
    const subject = buildSubject(input)
    return `${subject} 연구에서 기존 저분자 억제제 접근법이 내성·결합 포켓 한계로 막히면서, Degrader·PROTAC·분자 접착제 전략으로의 전환을 검토해야 하는 상황입니다. 그러나 관련 문헌·기전·특허 데이터가 여러 소스에 분산되어 있어 전략 탐색 및 가설 수립에 상당한 시간이 소요되고 있습니다.`
  },
  whyAI:
    'Degrader·PROTAC 분야 문헌은 최근 5년간 기하급수적으로 증가했으며, 기전·표적·적응증 연결 관계는 수작업으로 합성하기에 너무 복잡합니다. AI 기반 근거 탐색은 분산된 정보를 구조화하여 전문가가 전략적 판단에 집중하도록 돕습니다.',
  whyNow:
    '저분자 억제제(1세대) 내성 기전이 임상에서 확인되면서 차세대 전략으로의 전환 압력이 커졌습니다. 동시에 PROTAC·분자 접착제 임상 데이터가 축적되기 시작했고, 경쟁사들이 빠르게 포지셔닝을 변화시키고 있어 지금이 탐색 최적 시점입니다.',
  solutionPattern: '표적 인텔리전스 RAG',
  solutionDescription:
    '분산된 degrader/PROTAC 관련 문헌·기전 데이터를 통합 검색·합성하여 표적 재공략 전략을 빠르게 평가하고 내부 가설 수립을 지원합니다.',

  dataNeeded: {
    public: [
      'PubMed / bioRxiv (degrader·PROTAC·E3 ligase·molecular glue 중심)',
      'ChEMBL 표적 공개 데이터',
      '특허 공개 DB (Espacenet / Google Patents 무료 API)',
    ],
    internal: [
      '내부 표적 분석 보고서 (제공 가능한 경우)',
      '기존 전임상 데이터 요약',
      '기전 문헌 리뷰 문서',
    ],
    extension: [
      '상업 특허 DB (Derwent Innovation 등) — PoC 이후',
      '상업 문헌 DB (Embase) — 높은 커버리지 필요 시',
      '경쟁사 파이프라인 공개 리포트 통합',
    ],
  },

  sixWeekScope: [
    {
      week: 1,
      title: '표적 탐색 범위 정의',
      description:
        '표적·기전·적응증 키워드 체계 정의, SME와 degrader 전략 우선순위 정렬, 쿼리 유형 및 출력 형식 합의',
    },
    {
      week: 2,
      title: 'Literature corpus 구축',
      description:
        'PubMed + bioRxiv 수집·인덱싱 (degrader·PROTAC·E3 ligase 집중), 청킹 및 임베딩, 기전·표적 메타데이터 필터 구성',
    },
    {
      week: 3,
      title: '검색 기준선 구축',
      description:
        '하이브리드 검색(시맨틱+키워드) 구현, 20개 표적 탐색 테스트 쿼리에 대한 SME 관련성 평가',
    },
    {
      week: 4,
      title: '표적-기전-전략 매핑',
      description:
        '표적-기전-degrader 접근법 연결 관계 클러스터링, 전략 유형(PROTAC·분자 접착제·autophagy degrader)별 근거 수준 비교 초안',
    },
    {
      week: 5,
      title: 'SME 검토 및 개선',
      description:
        '전문가 피드백 세션, 핵심 누락 논문 확인, 쿼리 최적화, degrader 전략 비교 요약 생성',
    },
    {
      week: 6,
      title: 'KPI 검증 및 데모',
      description:
        '재현율·시간 절감 측정, 결과 보고서 작성, 이해관계자 데모, 특허 DB 연동 2단계 계획 수립',
    },
  ],

  scenarioRisks: [
    {
      risk: '특허·법적 해석 혼선',
      guardrail:
        '특허 분석은 공개 문헌 기반 근거 합성에 한정 — 법적 권고로 오인되지 않도록 면책 문구 명시',
    },
    {
      risk: '과학적 불확실성 과소 표현',
      guardrail:
        '모든 근거 출력에 evidence level(전임상/임상/리뷰) 태그 명시, 불확실성 높은 항목은 별도 표시',
    },
  ],

  // SolutionRouteResult override
  rationale:
    '고객 문제는 공략 불가 표적에 대한 degrader·PROTAC 전략 탐색이며, 분산된 문헌·기전 데이터를 통합하는 Literature Intelligence RAG가 6~8주 PoC로 직접 해소 가능한 영역입니다. 표적 재공략 전략 비교 초안을 근거 기반으로 구체화할 수 있습니다.',
  discoveryQuestions: [
    '현재 어떤 표적에서 저분자 접근이 막혀 있으며, 내부적으로 어떤 대안 전략을 검토 중입니까?',
    'Degrader 전략 탐색에서 가장 큰 시간 소모 단계는 어디입니까? (문헌 검색·기전 분석·전략 비교 중)',
    '내부 기전 분석 보고서 또는 전임상 데이터를 인덱스에 포함할 수 있습니까?',
    'SME 검토 프로세스는 어떻게 구성되어 있으며, AI 출력이 어떤 형태일 때 가장 유용합니까?',
  ],
  requiredDataAssets: [
    '탐색 우선순위 표적 목록 및 관련 기전 키워드',
    '내부 문헌 리뷰 샘플 (PDF/Word, 있는 경우)',
    'SME 평가자 섭외 가능 여부 확인',
  ],
  architectureHint:
    'PubMed + preprint + 특허 공개 DB → 수집/ETL → 기전·표적·적응증 메타데이터 정규화 → 하이브리드 검색 인덱스 → LLM 근거 합성 → 전문가 검토 게이트 → 표적 전략 보고서 출력',
}

// ─── 시나리오 2: RWD 이질성 / 자가면역 치료 최적화 ──────────────────────────

const RWD_AUTOIMMUNE: ScenarioGeneratorTemplate = {
  opportunityStatement: (input) => {
    const subject = buildSubject(input)
    return `${subject} 영역에서 RWD·EMR 파편화와 환자 이질성으로 인한 치료 최적화 병목을 데이터 통합 + AI 세분화로 해소하는 기회가 있습니다. 공개 RWE 근거를 통합 탐색하여 환자 세분화 프레임과 switching 인사이트를 구조화하고, 내부 데이터 연동 기반을 확보합니다.`
  },
  painPoints: [
    'EMR·청구·레지스트리 데이터가 파편화되어 있어 환자 이질성을 체계적으로 분석하기 어렵습니다.',
    'RCT 기반 치료 지침과 실제 진료 결과 간의 간극이 크고, 치료 선택 실패 비용이 증가하고 있습니다.',
    '바이오시밀러 경쟁 증가로 치료 결정에서의 차별화된 데이터 지원이 필요하지만, 통합 분석 레이어가 없습니다.',
  ],
  pocType: '환자 세분화 & 치료 지원 PoC (Patient Stratification & Treatment Support)',
  pocTypeDescription:
    '공개 RWE 문헌·가이드라인을 통합 탐색하여 환자 세분화 프레임을 구조화하고, 치료 반응 예측 및 switching 시나리오 분석을 지원하는 데이터 플랫폼 기반을 확보합니다.',

  kpis: [
    {
      metric: '코호트 세분화 유용성',
      target: '세분화 제안 70% 이상이 임상적으로 의미 있다고 전문가 판단',
      baseline: 'PoC 운영 후 MSL·메디컬팀 평가',
    },
    {
      metric: '치료 switching 인사이트',
      target: '근거 기반 switching 시나리오 3가지 이상 식별',
      baseline: '공개 RWE 문헌 기반 전문가 검토',
    },
    {
      metric: '문헌 탐색 시간 단축',
      target: '환자 세분화 관련 문헌 탐색 50% 단축',
      baseline: '수동 검색 대비',
    },
  ],

  problemDefinition: (input) => {
    const subject = buildSubject(input)
    return `${subject} 치료에서 RCT 대상 인구와 실제 환자 군 간의 이질성이 크고, EMR·청구·레지스트리 데이터가 파편화되어 있어 치료 반응 예측 및 switching 전략 수립이 체계적으로 이루어지지 않고 있습니다. 바이오시밀러 경쟁 심화로 데이터 기반 의사결정 지원의 필요성이 높아지고 있습니다.`
  },
  whyAI:
    '환자 이질성 분석과 longitudinal 치료 패턴 탐색은 수작업으로 처리하기에 데이터 규모가 너무 크고 복잡합니다. AI 기반 세분화와 RWE 문헌 합성은 임상 의사결정을 지원하는 구조화된 인사이트를 신속하게 생성합니다.',
  whyNow:
    '바이오시밀러 진입으로 차별화 압력이 증가했고, 각국 보건 당국이 RWE 기반 의사결정을 점점 더 요구하고 있습니다. EMR 데이터 접근 환경이 개선되면서 RWD 기반 PoC의 실현 가능성이 높아졌습니다.',
  solutionPattern: '환자 세분화 & 반응 예측 워크플로우',
  solutionDescription:
    '공개 RWE 근거를 통합 탐색·합성하여 환자 세분화 프레임을 구조화하고, 내부 EMR 데이터 연동 후 반응 예측 워크플로우로 확장 가능한 기반을 구축합니다.',

  dataNeeded: {
    public: [
      '공개 RWE 문헌 (PubMed — 환자 세분화·switching 패턴 집중)',
      '임상 진료 가이드라인 (ACR·EULAR 등)',
      'ClinicalTrials.gov (대조군 설계·환자 기준 확인)',
    ],
    internal: [
      'EMR·청구 데이터 샘플 — 존재 여부 및 접근 가능성 확인 필수',
      '기존 환자 레지스트리 데이터 (있는 경우)',
      '메디컬팀 내부 치료 패턴 보고서',
    ],
    extension: [
      '상업 RWD DB (IQVIA, Optum — PoC 이후 확장)',
      'EHR 직접 연동 파이프라인 (FHIR API)',
      '국가 건강보험 청구 데이터',
    ],
  },

  sixWeekScope: [
    {
      week: 1,
      title: 'RWD 탐색 범위 정의',
      description:
        '자가면역 질환·치료 유형·환자 특성 체계 정의, 메디컬팀과 세분화 기준 정렬, 공개 데이터 가용성 확인',
    },
    {
      week: 2,
      title: '공개 RWE 코퍼스 구축',
      description:
        'RWE 문헌·가이드라인 수집·인덱싱 (환자 세분화·JAK/바이오로직 반응 집중), 청킹 및 임베딩',
    },
    {
      week: 3,
      title: '세분화 패턴 탐색',
      description:
        '환자 특성-반응군 연결 문헌 클러스터링, 반응 예측 관련 바이오마커 신호 합성',
    },
    {
      week: 4,
      title: 'Switching 시나리오 합성',
      description:
        '치료 전환 관련 논문 군집 식별, 위험 인자 및 switching 타이밍 요약 생성',
    },
    {
      week: 5,
      title: '메디컬팀 검토 및 데이터 파이프라인 설계',
      description:
        '전문가 피드백, 세분화 기준 정제, 내부 EMR 연동 feasibility 평가 및 데이터 파이프라인 설계 초안',
    },
    {
      week: 6,
      title: 'KPI 검증 및 데모',
      description:
        '세분화 유용성 평가, 내부 데이터 연동 feasibility 보고서 작성, 이해관계자 데모',
    },
  ],

  scenarioRisks: [
    {
      risk: '공개 데이터 기반 세분화의 내부 환자군 대표성 한계',
      guardrail:
        'PoC 결과는 공개 RWE 기반 가설 수준으로 프레이밍 — 내부 EMR 검증 없이는 치료 결정에 적용 불가 명시',
    },
    {
      risk: 'RWD 이질성 자체가 분석 노이즈로 작용',
      guardrail:
        '데이터 품질 수준을 출력과 함께 명시, 불확실성 높은 세분화 결과는 별도 플래그',
    },
  ],

  rationale:
    '고객 문제는 RWD 파편화와 환자 이질성이며, 데이터 통합 플랫폼 + 문헌 기반 세분화 PoC가 직접 해소 가능한 영역입니다. 공개 RWE 근거 탐색으로 세분화 프레임을 먼저 구축하고, 이후 내부 EMR 연동으로 확장하는 2단계 접근이 적합합니다.',
  discoveryQuestions: [
    '현재 EMR·청구 데이터의 접근 가능성과 구조화 수준은 어떻게 됩니까?',
    '치료 반응 예측에서 가장 큰 병목은 어디입니까? (데이터 수집·분석·의사결정 중)',
    '내부 환자 레지스트리나 치료 반응 추적 시스템이 존재합니까?',
    '데이터 거버넌스 및 GDPR/HIPAA 준수 요건은 어떻게 됩니까?',
  ],
  requiredDataAssets: [
    '공개 RWE 탐색을 위한 질환·치료 키워드 목록',
    '내부 EMR 데이터 샘플 가용 여부 및 접근 경로 확인',
    '메디컬팀·데이터팀 인터뷰 일정',
  ],
  architectureHint:
    '공개 RWE 문헌 + 가이드라인 → 수집/ETL → 환자 특성·치료 메타데이터 정규화 → 세분화 인덱스 → LLM 합성 → Governed Analytics 레이어 → 치료 지원 대시보드 (2단계: EMR 직접 연동)',
  area: 'edp',
  areaLabel: 'RWD 인텔리전스 플랫폼 (EDP 기반)',
}

// ─── 시나리오 3: 돌연변이 의존 확장성 한계 / 편집 전략 ───────────────────────

const MUTATION_AGNOSTIC: ScenarioGeneratorTemplate = {
  opportunityStatement: (input) => {
    const subject = buildSubject(input)
    return `${subject}에서 mutation-specific 개발의 확장성 한계를 AI 기반 공통 병인 경로 탐색과 편집 전략 근거 합성으로 우회할 수 있습니다. 임상 신호보다 문헌·플랫폼 신호가 앞서 있는 초기 단계에서 빠른 근거 탐색이 경쟁 우위를 만듭니다.`
  },
  painPoints: [
    '돌연변이별 개발 전략은 환자 수가 적은 적응증에서 경제성이 낮고, 승인 이후에도 커버 범위가 제한적입니다.',
    '공통 병인 경로 탐색에 필요한 문헌·플랫폼 데이터가 여러 소스에 분산되어 있어 체계적 평가가 어렵습니다.',
    '유전자 편집 기술(base editing·prime editing)의 발전 속도가 빠르나, 관련 근거를 팀 전체가 공유하기 어렵습니다.',
  ],
  pocType: '공통 경로 탐색 & 편집 전략 근거 합성 (Pathway Triage & Evidence Synthesis)',
  pocTypeDescription:
    '분산된 편집 전략 관련 전임상·임상 근거를 통합 탐색·합성하여 공통 병인 경로 기반 후보 우선순위화 프레임을 구축합니다. 과학적 불확실성을 정직하게 표현하는 것이 이 PoC의 핵심 가치입니다.',

  kpis: [
    {
      metric: '후보 단축 목록 품질',
      target: '공통 경로 후보 3가지 이상 전문가 확인',
      baseline: 'SME 평가 패널 검토 결과',
    },
    {
      metric: '근거 탐색 효율',
      target: '수작업 문헌 합성 대비 시간 60% 단축',
      baseline: '연구원 수동 탐색 시간 측정',
    },
    {
      metric: '근거 신뢰도',
      target: '출력 근거의 80% 이상이 전임상 또는 임상 수준',
      baseline: '전문가 패널 평가',
    },
  ],

  problemDefinition: (input) => {
    const subject = buildSubject(input)
    return `${subject} 개발에서 돌연변이별 치료 전략은 확장성과 경제성 측면에서 한계가 명확합니다. 공통 병인 경로 또는 mutation-agnostic 편집 전략으로의 전환을 검토해야 하지만, 관련 전임상·임상 근거와 전달 전략 데이터가 여러 플랫폼과 저널에 분산되어 체계적 평가가 어렵습니다.`
  },
  whyAI:
    '유전자 편집 분야 문헌은 최근 5년간 폭발적으로 증가했으며, 기전·경로·전달 전략 연결 관계는 수작업으로 합성하기에 너무 복잡합니다. AI 기반 근거 탐색은 공통 경로 후보를 빠르게 식별하고, 과학적 불확실성을 구조화하여 전문가 판단을 지원합니다.',
  whyNow:
    '유전자 편집(base editing·prime editing) 기술이 임상 적용 가능 수준으로 성숙했고, FDA/EMA가 플랫폼 기반 희귀질환 치료에 우호적인 신호를 보이고 있습니다. 경쟁사들이 mutation-agnostic 포지셔닝을 빠르게 선점하고 있어 지금이 탐색 최적 시점입니다.',
  solutionPattern: '공통 경로 탐색 & 편집 전략 근거 합성',
  solutionDescription:
    '분산된 편집 전략 관련 전임상·임상 근거를 통합 탐색하여 공통 병인 경로 후보를 구조화하고, 전문가 검토 기반의 hypothesis 지원 워크플로우를 구축합니다.',

  dataNeeded: {
    public: [
      'PubMed + bioRxiv (mutation-agnostic·exon skipping·base editing·common pathway 집중)',
      'ClinicalTrials.gov (편집 기반 임상시험 — 현재 제한적이나 추적 필요)',
      'Gene therapy 관련 플랫폼 공개 데이터',
    ],
    internal: [
      '내부 유전체 분석 보고서 (있는 경우)',
      '전임상 돌연변이 유형별 데이터 요약',
      '편집 전략 검토 내부 문서',
    ],
    extension: [
      '상업 게놈·편집 플랫폼 데이터 (PoC 이후)',
      '특허 공개 DB (편집 기술 특허 탐색)',
      '연구비·파트너십 DB (NIH Reporter 등)',
    ],
  },

  sixWeekScope: [
    {
      week: 1,
      title: '탐색 범위 및 불확실성 프레임 정의',
      description:
        '돌연변이 유형·공통 경로 키워드 체계 정의, 편집 기술 분류, "알고 있는 것 vs 불확실한 것" 프레임 합의',
    },
    {
      week: 2,
      title: '다중 소스 코퍼스 구축',
      description:
        'PubMed + bioRxiv 수집·인덱싱 (exon skipping·base editing·pathway 집중), 논문별 evidence level 태깅',
    },
    {
      week: 3,
      title: '공통 경로 클러스터링',
      description:
        '공통 병인 경로 후보 탐색, 편집 기술 유형별 근거 수준 비교, 불확실성 높은 항목 별도 표시',
    },
    {
      week: 4,
      title: '전달 전략 매핑',
      description:
        'Delivery modality 관련 문헌 분류(AAV·LNP·나노입자), 전임상 근거 수준 정리, 번역 리스크 식별',
    },
    {
      week: 5,
      title: '전문가 검토 및 가설 초안',
      description:
        '경로 후보 전문가 검증, 불확실성 항목 확인, 가설 지지 근거 초안 생성 (결론이 아닌 근거)',
    },
    {
      week: 6,
      title: 'KPI 검증 및 데모',
      description:
        '품질 평가, 불확실성 명시 결과 보고서 작성, "무엇을 알고 있는가 / 무엇이 아직 불확실한가" 요약, 이해관계자 데모',
    },
  ],

  scenarioRisks: [
    {
      risk: '과학적 불확실성 과소 표현 — 편집 기술의 성숙도 차이 무시',
      guardrail:
        '모든 근거 출력에 evidence level(전임상/Phase I/리뷰)을 명시하고, 불확실성 높은 항목은 별도 경고 표시',
    },
    {
      risk: 'AI 출력이 전략 권고로 오인',
      guardrail:
        '출력 UI에 "이 결과는 근거 탐색 지원이며 전략 결론이 아닙니다"를 고정 표시, 모든 주장에 출처 첨부',
    },
  ],

  rationale:
    '고객 문제는 mutation-specific 개발의 확장성 한계이며, AI 기반 공통 경로 탐색과 편집 전략 근거 합성이 직접 해소 가능한 영역입니다. 임상 신호보다 문헌·플랫폼 신호가 앞서 있는 초기 단계의 특성에 맞게 PoC를 구조화합니다.',
  discoveryQuestions: [
    '현재 어떤 돌연변이 유형에서 개발 확장성 한계를 가장 크게 느끼고 있습니까?',
    '내부적으로 공통 경로 탐색을 시도한 적이 있다면, 주요 장벽은 무엇이었습니까?',
    '편집 기술(base editing·exon skipping 등) 중 현재 가장 유망하게 보는 접근법은 무엇입니까?',
    'AI 출력이 "전략 결론"이 아닌 "근거 지원" 수준으로 제공될 때 내부 프로세스에 어떻게 활용될 수 있습니까?',
  ],
  requiredDataAssets: [
    '탐색 대상 돌연변이 유형 목록 및 관련 경로 키워드',
    '내부 전임상 데이터 요약 (공유 가능한 범위)',
    'SME 평가자 섭외 가능 여부 확인',
  ],
  architectureHint:
    'PubMed + bioRxiv + 플랫폼 공개 DB → 수집/ETL → Evidence level 태깅 및 경로·기술 분류 → 다중 소스 통합 검색 → LLM 근거 합성 → 전문가 검토 게이트 (높은 불확실성 반영) → 가설 지지 보고서 출력',
  area: 'structure_prediction',
  areaLabel: '플랫폼 전략 · 편집 기술 인사이트',
}

// ─── 시나리오 4: 전신 독성 한계 / 국소 스마트 전달 ─────────────────────────

const OFF_TARGET_TOXICITY: ScenarioGeneratorTemplate = {
  opportunityStatement: (input) => {
    const subject = buildSubject(input)
    return `${subject}에서 전신 독성으로 막힌 후보를 국소·스마트 전달 전략으로 재구성할 기회가 있습니다. AI 기반 전달 전략 문헌 탐색과 독성-효능 프로파일 합성으로 재구성 가능성을 빠르게 평가하고 delivery hypothesis를 구조화합니다.`
  },
  painPoints: [
    '전신 투여 시 독성-효능 tradeoff가 치명적으로 작용하며, 효능이 검증된 후보가 독성 때문에 개발이 중단됩니다.',
    '전달 전략 전환(LNP·ADC·국소 방출) 검토에 필요한 formulation별 근거와 독성 데이터가 분산되어 있습니다.',
    'ADC·LNP 기술 발전 속도가 빠르나, 적응증별 최적 전달 전략을 체계적으로 평가하는 체계가 없습니다.',
  ],
  pocType: '전달 전략 가설 프레이밍 & 후보 스크리닝 (Delivery Hypothesis Framing)',
  pocTypeDescription:
    '전달 전략 관련 공개 문헌을 통합 탐색하여 후보별 국소·스마트 전달 가능성을 구조적으로 평가하는 delivery hypothesis 프레임을 구축합니다.',

  kpis: [
    {
      metric: '전달 전략 제안 품질',
      target: '제안된 전달 전략 중 70% 이상이 타당하다고 전문가 판단',
      baseline: 'PoC 후 전문가 검토',
    },
    {
      metric: '독성 완화 가설 커버리지',
      target: '주요 전신 독성 문제의 80% 이상에 대한 전달 대안 식별',
      baseline: '공개 문헌 기반 탐색 결과',
    },
    {
      metric: '탐색 소요 시간',
      target: '전달 전략 비교 보고서 작성 시간 50% 단축',
      baseline: '수동 검색·작성 대비',
    },
  ],

  problemDefinition: (input) => {
    const subject = buildSubject(input)
    return `${subject} 후보에서 효능은 확인됐으나 전신 투여 시 독성이 개발의 걸림돌로 작용하고 있습니다. 국소·스마트 전달 전략(ADC·LNP·국소 방출 시스템)으로의 전환을 검토해야 하지만, 관련 formulation 근거와 독성 프로파일 데이터가 여러 소스에 분산되어 체계적 평가가 어렵습니다.`
  },
  whyAI:
    'ADC·LNP·국소 전달 관련 문헌이 최근 급증하고 있으며, 적응증별 전달 전략 비교는 수작업으로 처리하기에 너무 많은 변수가 있습니다. AI 기반 문헌 탐색은 후보 특이적 delivery hypothesis를 빠르게 구조화하여 전문가 검토 효율을 높입니다.',
  whyNow:
    'ADC, 지질 나노입자(LNP), 국소 방출 시스템 기술이 임상 적용 가능 수준으로 성숙했으며, 전달 최적화로 개발 실패 후보를 구제한 사례가 늘고 있습니다. 경쟁사들이 전달 전략 차별화를 빠르게 추진 중이므로 지금이 탐색 최적 시점입니다.',
  solutionPattern: '전달 전략 가설 프레이밍 & 후보 스크리닝',
  solutionDescription:
    '전달 전략 관련 공개 문헌을 통합 탐색하여 후보별 국소·스마트 전달 가능성을 구조적으로 평가하고, delivery hypothesis 초안을 전문가 검토 입력 형태로 생성합니다.',

  dataNeeded: {
    public: [
      'PubMed (ADC·LNP·나노입자·국소 전달·독성 프로파일 집중)',
      'bioRxiv (formulation 최신 연구)',
      'FDA 의약품 라벨 (독성 섹션 — DailyMed)',
    ],
    internal: [
      '후보 물질 전임상 독성 데이터 요약 (제공 가능한 경우)',
      '기존 formulation 탐색 내부 보고서',
      '약리학·CMC 팀 내부 문서',
    ],
    extension: [
      '상업 formulation DB (PoC 이후)',
      '특허 공개 DB (전달 기술 특허 탐색)',
      'ADMET 예측 플랫폼 연동 (2단계)',
    ],
  },

  sixWeekScope: [
    {
      week: 1,
      title: '후보 및 전달 전략 범위 정의',
      description:
        '적응증·타깃·전달 전략 체계 정의, 독성-효능 기준 정렬, 탐색 우선순위 전달 모달리티 합의',
    },
    {
      week: 2,
      title: '전달 전략 코퍼스 구축',
      description:
        'ADC·LNP·나노입자·국소 전달 관련 문헌 수집·인덱싱, 독성 유형별 메타데이터 필터 구성',
    },
    {
      week: 3,
      title: '독성-효능 매핑',
      description:
        '전달 방식별 독성 프로파일 비교 문헌 클러스터링, 전신 독성 vs 국소 전달 효능 연결 관계 탐색',
    },
    {
      week: 4,
      title: 'Delivery hypothesis 생성',
      description:
        '적응증별 국소 전달 적용 가능성 매핑 초안 작성, 후보 물질과 전달 전략 연결 가설 구조화',
    },
    {
      week: 5,
      title: '전문가 검토 및 번역 리스크 확인',
      description:
        '전달 전략 후보 검증, 가정 및 번역 리스크 항목 식별, 출력이 처방 권고가 아님을 명확히',
    },
    {
      week: 6,
      title: 'KPI 검증 및 데모',
      description:
        '품질 평가, 전달 전략 비교 보고서 작성, 가설 지지 근거 요약 (결론이 아닌 근거), 이해관계자 데모',
    },
  ],

  scenarioRisks: [
    {
      risk: '공개 데이터 기반 delivery hypothesis가 특정 후보에 직접 적용 가능하다는 오인',
      guardrail:
        '모든 출력에 "공개 문헌 기반 가설 지지, 후보 특이적 검증 별도 필요" 명시, 처방·임상 권고 표현 금지',
    },
    {
      risk: '전달 전략의 후보 물성 의존성 과소 평가',
      guardrail:
        '출력에 "물성 데이터 없이는 전달 전략 선택 불가" 가정 명시, 내부 전임상 데이터 검증을 조건으로 프레이밍',
    },
  ],

  rationale:
    '고객 문제는 효능 확인 후보의 전신 독성 한계이며, AI 기반 전달 전략 문헌 탐색과 delivery hypothesis 구조화가 6~8주 PoC로 직접 해소 가능한 영역입니다. 임상시험 데이터보다 문헌·플랫폼 근거가 앞서 있는 단계에 적합한 접근입니다.',
  discoveryQuestions: [
    '독성 문제로 막혀 있는 후보가 있다면, 가장 큰 독성 패턴은 무엇입니까? (on-target vs off-target)',
    '국소 전달 또는 ADC·LNP 전략을 내부적으로 검토한 적이 있다면 주요 장벽은 무엇이었습니까?',
    '후보 물질의 물리화학적 특성 데이터가 전달 전략 평가에 사용 가능합니까?',
    'AI 출력이 delivery hypothesis 초안 형태로 제공될 때 내부 CMC·약리학 팀과 어떻게 협업합니까?',
  ],
  requiredDataAssets: [
    '탐색 우선순위 후보 물질 및 적응증 목록',
    '주요 독성 패턴 및 현재 전달 방식 정보',
    'CMC·약리학 팀 인터뷰 일정',
  ],
  architectureHint:
    'PubMed + 전달 전략 공개 DB → 수집/ETL → 독성 유형·전달 모달리티 메타데이터 정규화 → 하이브리드 검색 인덱스 → LLM 근거 합성 → 전문가 검토 게이트 → Delivery hypothesis 출력 (결론이 아닌 근거 지원)',
}

// ─── Registry ─────────────────────────────────────────────────────────────────

export const SCENARIO_TEMPLATES: Record<BottleneckScenarioId, ScenarioGeneratorTemplate> = {
  undruggable_target: UNDRUGGABLE_TARGET,
  rwd_autoimmune: RWD_AUTOIMMUNE,
  mutation_agnostic: MUTATION_AGNOSTIC,
  off_target_toxicity: OFF_TARGET_TOXICITY,
}
