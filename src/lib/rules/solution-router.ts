import type {
  QueryInput,
  SolutionArea,
  SolutionRouteResult,
  ProblemDomain,
} from '../types'

// ─── Solution Area Content Map ─────────────────────────────────────────────────

interface SolutionAreaRule {
  areaLabel: string
  rationale: string
  discoveryQuestions: string[]
  requiredDataAssets: string[]
  architectureHint: string
  conceptDiscussionOnly: boolean
  disclaimerText?: string
}

const SOLUTION_AREA_MAP: Record<SolutionArea, SolutionAreaRule> = {
  genai: {
    areaLabel: 'GenAI / 의료 AI 어시스턴트',
    rationale:
      '고객의 문제는 지식 검색과 합성에 집중되어 있으며, RAG 기반 AI 어시스턴트가 6~8주 PoC로 직접 해소 가능한 영역입니다. 현재 탭의 문헌·임상 데이터를 통해 근거 기반 PoC 제안을 구체화할 수 있습니다.',
    discoveryQuestions: [
      '어떤 팀이 가장 자주 문헌 검색 또는 문서 탐색을 수행합니까?',
      '질문당 현재 소요 시간은 얼마이며, 주요 병목은 어디입니까?',
      '내부 문서(SOP, 연구 보고서, 규제 자료)를 인덱스에 포함할 수 있습니까?',
      '인용 추적 가능성이 규제 또는 컴플라이언스 관점에서 요구됩니까?',
    ],
    requiredDataAssets: [
      'PubMed 검색 쿼리 예시 목록',
      '내부 문서 샘플 (SOP, 연구 보고서 등)',
      'SME 평가자 섭외 가능 여부 확인',
    ],
    architectureHint:
      '공개 데이터 소스 → 수집/ETL → 하이브리드 검색 인덱스 → LLM 오케스트레이션 → 인용 가드레일 → 웹 앱 (현재 참조 아키텍처 탭에서 확인)',
    conceptDiscussionOnly: false,
  },
  kol: {
    areaLabel: 'KOL & 스폰서 랜드스케이프 인텔리전스',
    rationale:
      '고객의 문제는 외부 경쟁 및 KOL 현황 파악이며, PubMed 저자 분석과 ClinicalTrials.gov 연구자 추출 기반 PoC가 적합합니다. 기존 임상 동향 탭의 스폰서 데이터를 Presales 논의에 직접 활용할 수 있습니다.',
    discoveryQuestions: [
      'KOL 식별의 주 목적은 무엇입니까? (BD, MSL 배치, 자문위원 모집)',
      '모니터링 범위는 글로벌입니까, 특정 지역/적응증에 집중됩니까?',
      '내부 KOL 레지스트리와의 대조 검증이 필요합니까?',
      '실시간 알림(신규 스폰서, 시험 상태 변경) 요건이 있습니까?',
    ],
    requiredDataAssets: [
      '목표 적응증 및 타깃 목록',
      '기존 KOL 레지스트리 또는 CRM 데이터',
      'BD/MSL 팀 구성원 인터뷰 일정',
    ],
    architectureHint:
      'PubMed 저자 추출 → ClinicalTrials.gov 연구자 추출 → 엔티티 정규화 → 네트워크 그래프 → KOL 프로필 대시보드 (현재 참조 아키텍처 확장 가능)',
    conceptDiscussionOnly: false,
  },
  edp: {
    areaLabel: '엔터프라이즈 데이터 플랫폼 / 데이터 레이크',
    rationale:
      '고객은 내부 데이터 통합 문제를 가지고 있으며, AI 어시스턴트보다 데이터 파이프라인과 거버넌스 레이어가 선행 과제입니다. 데이터 성숙도 수준에 따라 PoC 범위와 기간이 달라집니다.',
    discoveryQuestions: [
      '현재 데이터 사일로의 개수와 형식(RDBMS, 파일서버, SaaS 등)은 어떻게 됩니까?',
      'IT 팀이 ETL 파이프라인 구축에 참여할 수 있습니까?',
      '데이터 거버넌스 또는 GDPR/HIPAA 제약이 있습니까?',
      '통합 후 최우선 AI 사용 사례는 무엇입니까?',
      '클라우드 환경 선호도(AWS/Azure/GCP)는 어떻게 됩니까?',
    ],
    requiredDataAssets: [
      '데이터 소스 목록 및 형식 명세',
      '현재 데이터 접근 권한 구조',
      '데이터 볼륨 추정치 (GB/TB 단위)',
    ],
    architectureHint:
      '원천 시스템 → 수집 파이프라인(Spark/dbt) → 데이터 레이크(S3/ADLS) → 메타데이터 카탈로그 → 거버넌스/품질 레이어 → 분석/BI → AI 어시스턴트(2단계 확장)',
    conceptDiscussionOnly: false,
  },
  structure_prediction: {
    areaLabel: '단백질 구조 예측 / 타깃 인사이트 워크플로우',
    rationale:
      '고객의 문제는 단백질 구조 또는 분자 결합 분석으로, AlphaFold 계열 구조 예측 워크플로우가 적합한 논의 방향입니다. 본 화면은 워크플로우 설계 및 파트너십 논의를 위한 개념 가이드입니다.',
    discoveryQuestions: [
      'AlphaFold2/3 또는 유사 구조 예측 도구를 현재 활용하고 있습니까?',
      '구조 예측이 타깃 검증 단계입니까, 아니면 리드 최적화 단계입니까?',
      '컴퓨터 화학(docking, MD 시뮬레이션) 팀이 내부에 있습니까?',
      '구조 데이터를 문헌 근거와 연결하는 통합 워크플로우가 필요합니까?',
    ],
    requiredDataAssets: [
      '타깃 단백질 서열 또는 PDB ID',
      '기존 구조 예측 결과물 (있는 경우)',
      '컴퓨터 화학 도구 환경 및 인프라 정보',
    ],
    architectureHint:
      'AlphaFold/RoseTTAFold 추론 엔진 → 구조 시각화(PyMOL/Mol*) → 결합 포켓 분석 → 문헌 RAG 연결(구조-논문 통합 뷰) → 타깃 인사이트 대시보드',
    conceptDiscussionOnly: true,
    disclaimerText:
      '이 경로는 개념 논의 가이드입니다. 본 앱은 AlphaFold를 실행하거나 단백질 구조 예측 결과를 생성하지 않습니다. 워크플로우 설계 및 파트너십 논의에 한해 지원합니다.',
  },
  genomics_pipeline: {
    areaLabel: '유전체 / 변이 분석 파이프라인',
    rationale:
      '고객의 문제는 시퀀싱 또는 변이 분석이며, 바이오인포매틱스 파이프라인 구축이 핵심 논의 방향입니다. 본 화면은 파이프라인 아키텍처 설계 논의를 위한 개념 가이드입니다.',
    discoveryQuestions: [
      '시퀀싱 데이터 유형은 무엇입니까? (WGS, WES, RNA-seq, scRNA-seq 등)',
      '현재 사용 중인 변이 콜링 파이프라인이 있습니까?',
      '데이터 볼륨 및 처리 주기(배치/실시간)는 어떻게 됩니까?',
      '규제 제출용 데이터입니까, 연구 목적입니까?',
      '클라우드 컴퓨팅 환경(AWS Batch/Azure/GCP Life Sciences) 사용 가능합니까?',
    ],
    requiredDataAssets: [
      '시퀀싱 데이터 샘플(FASTQ/BAM/VCF 형식)',
      '레퍼런스 지놈 버전 정보',
      '변이 필터링 기준 또는 임상적 의의 데이터베이스 선호도',
    ],
    architectureHint:
      '원시 시퀀싱 데이터 → QC(FastQC/MultiQC) → 정렬(BWA/STAR) → 변이 콜링(GATK/DeepVariant) → 어노테이션(VEP/ANNOVAR) → 임상 해석 레이어 → 리포팅',
    conceptDiscussionOnly: true,
    disclaimerText:
      '이 경로는 개념 논의 가이드입니다. 본 앱은 유전체 분석을 실행하거나 변이 해석 결과를 생성하지 않습니다. 파이프라인 아키텍처 설계 논의에 한해 지원합니다.',
  },
  digital_health: {
    areaLabel: '디지털 헬스 / 워크플로우 플랫폼',
    rationale:
      '고객의 문제는 임상 또는 운영 워크플로우의 디지털화이며, 단순 AI 어시스턴트보다 플랫폼 설계가 필요한 논의입니다. EHR 연동, 규제 분류, 사용자 중심 설계가 핵심 과제입니다.',
    discoveryQuestions: [
      '워크플로우의 최종 사용자는 의료진입니까, 연구팀입니까, 환자입니까?',
      'EHR/EMR 시스템과의 연동이 필요합니까? (Epic, Cerner, 등)',
      'HL7 FHIR 또는 DICOM 데이터를 다룹니까?',
      '규제 인증(FDA SaMD, CE-MDR)이 필요합니까?',
      '기존 IT 인프라와의 통합 범위는 어떻게 됩니까?',
    ],
    requiredDataAssets: [
      '현재 워크플로우 문서화 자료',
      'EHR/시스템 API 명세 (있는 경우)',
      '파일럿 대상 사용자 그룹 규모 및 접근 권한',
    ],
    architectureHint:
      'EHR/데이터 소스 → FHIR API 레이어 → 워크플로우 엔진 → 임상 AI 모듈(선택) → 사용자 포털(임상의/연구자) → 감사 로깅 및 규정 준수 레이어',
    conceptDiscussionOnly: false,
  },
}

// ─── Routing Logic ─────────────────────────────────────────────────────────────

function resolveArea(input: QueryInput): SolutionArea {
  const { problemDomain, objective } = input

  // Primary routing: problemDomain
  if (problemDomain) {
    switch (problemDomain) {
      case 'literature_regulatory':
        return 'genai'
      case 'trial_competitive':
        return 'genai'
      case 'kol_landscape':
        return 'kol'
      case 'data_infrastructure':
        return 'edp'
      case 'drug_discovery_computational':
        return 'structure_prediction'
      case 'patient_digital_health':
        return 'digital_health'
    }
  }

  // Fallback: objective (하위 호환 — 기존 5개 objective → genai or kol)
  if (objective === 'kol_sponsor_landscape') return 'kol'
  return 'genai'
}

// ─── Public API ────────────────────────────────────────────────────────────────

export function routeSolution(input: QueryInput): SolutionRouteResult {
  const area = resolveArea(input)
  const rule = SOLUTION_AREA_MAP[area]
  return {
    area,
    areaLabel: rule.areaLabel,
    rationale: rule.rationale,
    discoveryQuestions: rule.discoveryQuestions,
    requiredDataAssets: rule.requiredDataAssets,
    architectureHint: rule.architectureHint,
    conceptDiscussionOnly: rule.conceptDiscussionOnly,
    disclaimerText: rule.disclaimerText,
  }
}

export function isGenAIPath(area: SolutionArea): boolean {
  return area === 'genai' || area === 'kol'
}

export const PROBLEM_DOMAIN_LABELS: Record<ProblemDomain, string> = {
  literature_regulatory: '문헌 / 규제 인텔리전스',
  trial_competitive: '임상 / 경쟁 인텔리전스',
  data_infrastructure: '데이터 인프라 / 플랫폼 구축',
  drug_discovery_computational: '신약 발굴 / 컴퓨테이셔널 분석',
  patient_digital_health: '환자 데이터 / 디지털 헬스',
  kol_landscape: 'KOL / 랜드스케이프 인텔리전스',
}

export const DATA_MATURITY_LABELS: Record<string, string> = {
  nascent: '초기 단계 (분산·비구조화)',
  developing: '개발 중 (일부 구조화, 사일로 존재)',
  established: '성숙 단계 (통합 파이프라인 운영 중)',
}

export const SOLUTION_AREA_LABELS: Record<SolutionArea, string> = {
  genai: 'GenAI / 의료 AI 어시스턴트',
  kol: 'KOL & 랜드스케이프 인텔리전스',
  edp: '엔터프라이즈 데이터 플랫폼',
  structure_prediction: '단백질 구조 예측',
  genomics_pipeline: '유전체 분석 파이프라인',
  digital_health: '디지털 헬스 플랫폼',
}
