// ─── Bottleneck Scenario Types ────────────────────────────────────────────────

export type BottleneckScenarioId =
  | 'undruggable_target'    // 공략 불가 표적 / 단백질 분해 전략
  | 'rwd_autoimmune'        // RWD 이질성 / 자가면역 치료 최적화
  | 'mutation_agnostic'     // 돌연변이 의존 확장성 한계 / 편집 전략
  | 'off_target_toxicity'   // 전신 독성 한계 / 국소 스마트 전달

export type SignalMode = 'strong' | 'moderate' | 'limited'

export interface ScenarioTabContent {
  overview: {
    customerRequest: string       // 고객 표면 요구
    rootProblem: string           // 실제 본질적 병목
    whyNow: string                // 왜 지금 중요한지
    opportunityNote: string       // Presales 기회 포인트
    aiOpportunities: string[]     // 적용 가능한 AI/데이터 접근
  }
  evidence: {
    signalNote: string            // 데이터 신호 수준 설명
    aiOpportunities: string[]     // 근거 탭에서 강조할 AI 포인트
    searchHint: string            // 탐색 가이드 힌트
  }
  trials: {
    signalMode: SignalMode        // 임상시험 신호 강도
    signalNote: string            // 신호 해석 메시지
    guidance: string              // Presales 활용 가이던스
  }
  poc: {
    objective: string             // PoC 목표 정의
    inScope: string[]             // 범위 내 (명확하게)
    outOfScope: string[]          // 범위 외 (명확하게)
    successKpis: string[]         // 성공 KPI 힌트
    riskNote: string              // 주요 리스크/가정
  }
  architecture: {
    highlightedComponents: string[] // 이 시나리오에서 강조되는 구성요소
    deliveryNote: string            // 납품 맥락 노트
    governanceNote: string          // 거버넌스/가드레일 강조점
  }
}

export interface PresalesScenario {
  id: BottleneckScenarioId
  title: string              // UI 표시 제목
  shortLabel: string         // 프리셋 칩 라벨
  category: string           // 병목 카테고리 (예: "신약 발굴 병목")
  bottleneckSummary: string  // 한 줄 병목 요약
  tags: string[]             // 키워드 태그
  presetInput: {
    disease: string
    target: string
    drug: string
    objective: string
    region: string
    timeYears: number
    problemDomain: string
    dataMaturity: string
  }
  tabContent: ScenarioTabContent
}
