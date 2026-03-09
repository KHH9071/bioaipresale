import type {
  BusinessObjective,
  QueryInput,
  OpportunityOutput,
  KPIItem,
} from '../types'

// ─── Objective Mapping Table ───────────────────────────────────────────────────

interface ObjectiveRule {
  pocType: string
  pocTypeDescription: string
  painPoints: string[]
  kpis: KPIItem[]
}

const OBJECTIVE_MAP: Record<BusinessObjective, ObjectiveRule> = {
  literature_intelligence: {
    pocType: '과학 근거 RAG (Scientific Evidence RAG)',
    pocTypeDescription:
      'PubMed 코퍼스 및 내부 문서를 인덱싱한 검색 증강 생성(RAG) 시스템으로, 질문에 대한 인용 기반 근거를 즉시 제공합니다.',
    painPoints: [
      '과학 문헌이 여러 데이터베이스에 분산되어 있어 하나의 질문에 답하기 위해 수십 편의 논문을 수작업으로 검토해야 합니다.',
      '문헌 검색 지연이 내부 리뷰 사이클 및 경쟁 정보 수집 업무를 며칠에서 몇 주씩 지연시킵니다.',
      '용어 불일치와 명명법 변화로 인해 키워드 검색에서 핵심 논문이 누락되는 사례가 반복됩니다.',
    ],
    kpis: [
      {
        metric: '검색 시간 단축',
        target: '근거 질의당 수작업 검색 시간 60% 이상 감소',
        baseline: '내부 연구원 대상 업무 소요 시간 측정',
      },
      {
        metric: '검색 정밀도',
        target: '상위 10개 결과 중 관련 문서 비율 80% 이상',
        baseline: '50개 테스트 쿼리에 대한 전문가 관련성 평가',
      },
      {
        metric: '근거 요약 초안 생성',
        target: '2분 이내 근거 요약 초안 자동 생성',
        baseline: '현재 수작업 작성 소요 시간 대비',
      },
    ],
  },

  trial_scouting: {
    pocType: '임상시험 인텔리전스 대시보드 (Trial Intelligence Dashboard)',
    pocTypeDescription:
      'ClinicalTrials.gov 및 내부 파이프라인 데이터를 기반으로 구조화된 임상 동향 탐색 및 경쟁사 현황을 제공합니다.',
    painPoints: [
      '임상시험 현황 모니터링을 키워드 검색으로 수작업 수행하여 경쟁 신호와 신규 스폰서를 놓치는 경우가 빈번합니다.',
      '스폰서 및 경쟁 인텔리전스 확보를 위해 여러 데이터 소스를 교차 검증해야 하며 통합된 뷰가 없습니다.',
      '임상 단계 전환 신호와 모집 상태 변경이 BD팀에 사전 알림 없이 누락됩니다.',
    ],
    kpis: [
      {
        metric: '스카우팅 시간 단축',
        target: '임상 동향 브리핑 생성 시간 50% 이상 감소',
        baseline: '도입 전후 분석가 업무 시간 로그 비교',
      },
      {
        metric: '스폰서 발굴 커버리지',
        target: '수작업 벤치마크 대비 활성 경쟁사 90% 이상 식별',
        baseline: '전문가 검토 기반 기준 데이터셋',
      },
      {
        metric: '신호-알림 지연 시간',
        target: 'ClinicalTrials.gov 업데이트 후 24시간 이내 상태 변경 감지',
        baseline: '현재 모니터링 주기: 주 1회 또는 월 1회',
      },
    ],
  },

  label_regulatory: {
    pocType: '라벨 인텔리전스 검색 (Label Intelligence Search)',
    pocTypeDescription:
      '의약품 라벨, 규제 제출 서류, 당국 가이던스 문서에 대한 시맨틱 검색으로 선례 근거를 즉시 식별합니다.',
    painPoints: [
      '라벨 및 규제 문서 검토에 전문가 수시간이 소요되며 수천 페이지에서 관련 선례를 찾아야 합니다.',
      '경쟁 인텔리전스를 위한 교차 라벨 비교를 수작업으로 수행하여 핵심 차이를 놓칠 위험이 높습니다.',
      '시장 접근 의사결정에 필요한 규제 인텔리전스에 구조화된 검색 및 감사 추적 레이어가 부재합니다.',
    ],
    kpis: [
      {
        metric: '라벨 검토 시간',
        target: '라벨 코퍼스 내 선례 탐색 시간 70% 이상 감소',
        baseline: '규제 담당 팀 업무 시간 감사',
      },
      {
        metric: '답변 추적 가능성',
        target: '모든 출력에 소스 섹션 및 문서 버전 인용 100% 준수',
        baseline: '출력 샘플 100건에 대한 감사자 검증',
      },
      {
        metric: '교차 라벨 비교',
        target: '비교 브리핑 5분 이내 생성',
        baseline: '현재 기준: 분석가 2~4시간 소요',
      },
    ],
  },

  scientific_qa: {
    pocType: '과학 Q&A 어시스턴트 (Scientific Q&A Assistant)',
    pocTypeDescription:
      '인용 강제 적용 기반의 과학 코퍼스 검색 증강 대화형 인터페이스로, 도메인 질문에 즉각적인 근거 기반 답변을 제공합니다.',
    painPoints: [
      '연구원이 내부 지식베이스에서 해결 가능한 반복 질문에 상당한 시간을 소모합니다.',
      '기관 지식이 문서와 전문가 개인에게 분산되어 있어 핵심 인력 부재 시 병목이 발생합니다.',
      '범용 LLM은 환각 위험과 출처 미표기로 인해 도메인 특화 과학 질문에 신뢰하기 어렵습니다.',
    ],
    kpis: [
      {
        metric: '질문 해결 시간',
        target: '일상적 과학 질문의 50% 이상을 3분 이내 해결',
        baseline: '내부 설문 기반 현재 중앙값 해결 시간',
      },
      {
        metric: '인용 준수율',
        target: '모든 답변에 추적 가능한 출처 인용 100% 포함',
        baseline: '전문가 패널의 PoC 출력 전수 검토',
      },
      {
        metric: '연구원 채택률',
        target: '대상 사용자의 70% 이상이 4주 후 주 1회 이상 사용',
        baseline: 'PoC 운영 이후 사용 로그',
      },
    ],
  },

  kol_sponsor_landscape: {
    pocType: 'KOL & 스폰서 랜드스케이프 도구 (KOL & Sponsor Landscape Tool)',
    pocTypeDescription:
      '논문 및 임상시험 저자 데이터 기반 엔티티 추출 및 네트워크 매핑으로 KOL과 스폰서 현황을 체계적으로 시각화합니다.',
    painPoints: [
      'KOL 식별이 관계 기반 정보에 의존하며, 논문 및 임상시험 활동의 체계적 분석이 이루어지지 않습니다.',
      '스폰서 동향 추적이 사후 대응 방식으로 이루어져 신규 플레이어를 조기에 발견하지 못합니다.',
      'BD와 메디컬 어페어스가 논문 발표, 임상 운영, 신흥 오피니언 리더 현황을 통합 조회할 수 없습니다.',
    ],
    kpis: [
      {
        metric: 'KOL 식별 커버리지',
        target: '목표 적응증 전문가 큐레이션 KOL 목록 대비 재현율 85% 이상',
        baseline: '메디컬 어페어스 KOL 레지스트리와의 벤치마크',
      },
      {
        metric: '랜드스케이프 보고서 생성',
        target: '전체 스폰서 랜드스케이프 브리핑 10분 이내 생성',
        baseline: '현재 기준: 분석가 1~2일 소요',
      },
      {
        metric: '신규 스폰서 탐지',
        target: '최초 임상시험 등록 후 30일 이내 신규 활성 스폰서 플래그',
        baseline: 'ClinicalTrials.gov 모니터링 주기',
      },
    ],
  },
}

// ─── Generators ───────────────────────────────────────────────────────────────

const OBJECTIVE_LABELS: Record<BusinessObjective, string> = {
  literature_intelligence: '과학 근거 검색 및 합성',
  trial_scouting: '임상시험 랜드스케이프 모니터링',
  label_regulatory: '라벨 및 규제 인텔리전스',
  scientific_qa: '과학 지식 검색 및 질의응답',
  kol_sponsor_landscape: 'KOL 및 스폰서 인텔리전스 매핑',
}

export function generateOpportunityStatement(input: QueryInput): string {
  const subject = [input.disease, input.target, input.drug]
    .filter(Boolean)
    .join(' / ')
  const regionNote = input.region === 'Global' ? '글로벌' : input.region
  const timeNote = `최근 ${input.timeYears}년`

  return `${subject || '목표 적응증'}에 대한 ${OBJECTIVE_LABELS[input.objective]} 고도화를 위한 Bio AI PoC 기회가 존재합니다. ${timeNote} ${regionNote} 근거 데이터를 활용하여 수작업 리서치 부담을 줄이고 팀에 실행 가능한 인사이트를 신속하게 제공할 수 있습니다.`
}

export function generateOpportunityOutput(input: QueryInput): OpportunityOutput {
  const rule = OBJECTIVE_MAP[input.objective]
  return {
    opportunityStatement: generateOpportunityStatement(input),
    painPoints: rule.painPoints,
    pocType: rule.pocType,
    pocTypeDescription: rule.pocTypeDescription,
    kpiPreview: rule.kpis,
  }
}

export { OBJECTIVE_MAP }
