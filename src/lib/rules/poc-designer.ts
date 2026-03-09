import type {
  BusinessObjective,
  QueryInput,
  PoCOptions,
  PoCProposal,
  KPIItem,
  WeekScope,
} from '../types'
import { OBJECTIVE_MAP } from './opportunity'

// ─── Why AI / Why Now ──────────────────────────────────────────────────────────

const WHY_AI: Record<BusinessObjective, string> = {
  literature_intelligence:
    '바이오메디컬 문헌의 양은 수년마다 두 배로 증가하며 수작업 합성은 더 이상 확장 가능하지 않습니다. AI 기반 검색은 수초 내에 관련 근거를 찾고, 분석가가 수시간에 걸쳐 작성할 요약을 인용 추적 가능한 형태로 즉시 생성합니다.',
  trial_scouting:
    '임상시험 데이터는 공개되어 있지만 수만 건의 항목에 걸쳐 구조가 불일치합니다. AI는 이를 정규화·클러스터링하여 수작업 모니터링이 체계적으로 놓치는 경쟁 신호를 표면화합니다.',
  label_regulatory:
    '규제 문서는 수천 페이지에 달하며 도메인 특화 용어가 키워드 검색의 한계를 초과합니다. AI 기반 시맨틱 검색은 정확한 선례 식별과 구조화된 교차 라벨 비교를 가능하게 합니다.',
  scientific_qa:
    '큐레이션된 과학 코퍼스에 기반한 대형 언어 모델은 인용 수준의 추적 가능성으로 도메인 특화 질문에 답할 수 있으며, 일상적인 쿼리에 대한 전문가 자문 수시간을 대체합니다.',
  kol_sponsor_landscape:
    '논문 및 임상시험 저자 데이터는 기계 판독 가능하지만 대규모로 체계 분석된 적이 없습니다. AI는 영향력 네트워크를 매핑하고 관계 기반 수작업 방식보다 훨씬 빠르게 신규 플레이어를 식별합니다.',
}

const WHY_NOW: Record<BusinessObjective, string> = {
  literature_intelligence:
    'RAG(검색 증강 생성) 인프라는 2024~2025년 프로덕션 수준으로 성숙했으며, 벡터 데이터베이스와 오픈 임베딩이 6주 PoC 기간 내 제약 등급 근거 검색을 현실화하고 있습니다.',
  trial_scouting:
    'ClinicalTrials.gov v2 API가 구조화된 임상시험 데이터를 체계적 분석에 적합한 형태로 노출하기 시작했습니다. 임상 인텔리전스 PoC의 기술적 진입 장벽은 지금보다 낮은 적이 없습니다.',
  label_regulatory:
    'FDA와 EMA는 규제 제출에서의 AI 활용 가이던스를 적극적으로 발행하고 있습니다. AI 기반 라벨 인텔리전스를 조기 도입하면 규제 기대를 앞서는 포지셔닝이 가능합니다.',
  scientific_qa:
    '내부 문서 저장소가 팀의 합성 역량보다 빠르게 성장하고 있습니다. 검색 레이어 없이 보내는 분기는 곧 누적 지식 부채로 이어집니다.',
  kol_sponsor_landscape:
    '목표 적응증의 경쟁 구도가 변화하고 있으며 새로운 스폰서와 학술 그룹이 진입하고 있습니다. 6주 PoC로 경쟁 기회가 좁아지기 전에 체계적 모니터링 기반을 구축할 수 있습니다.',
}

// ─── Problem Definition ────────────────────────────────────────────────────────

function buildProblemDefinition(input: QueryInput, rule: typeof OBJECTIVE_MAP[BusinessObjective]): string {
  const subject = [input.disease, input.target, input.drug].filter(Boolean).join(' / ') || '목표 적응증'
  const firstPain = rule.painPoints[0].replace('과학 문헌이', `${subject} 관련 과학 문헌이`)
  return `${firstPain} ${rule.painPoints[1]} 이는 리서치, 메디컬 어페어스, BD팀에 복합적인 부담을 주며, AI 기반 검색으로 직접 해소할 수 있는 문제입니다.`
}

// ─── Data Needed ──────────────────────────────────────────────────────────────

const DATA_NEEDED: Record<BusinessObjective, PoCProposal['dataNeeded']> = {
  literature_intelligence: {
    public: ['PubMed / MEDLINE 초록', 'PubMed Central 전문 (오픈 액세스)', 'bioRxiv 프리프린트 (선택)'],
    internal: ['내부 연구 보고서 (PDF)', '과학 Q&A 로그', '문헌 리뷰 문서'],
    extension: ['상업 문헌 DB (Embase, SciFinder)', '임상 연구 보고서', '메디컬 어페어스 브리핑 자료'],
  },
  trial_scouting: {
    public: ['ClinicalTrials.gov 레지스트리 데이터', 'WHO ICTRP 레지스트리', 'FDA 의약품 승인 데이터베이스'],
    internal: ['내부 파이프라인 트래커', 'BD 타깃 목록', '경쟁 인텔리전스 보고서'],
    extension: ['상업 임상시험 DB (Citeline, GlobalData)', '특허 출원 데이터', '보도자료 모니터링 피드'],
  },
  label_regulatory: {
    public: ['FDA 의약품 라벨 (DailyMed)', 'EMA 제품 정보', 'FDA 가이던스 문서'],
    internal: ['라벨 제출 초안', '규제 서신', '시장 접근 브리핑 자료'],
    extension: ['과거 제출 서류 (dossier)', '자문위원회 회의록', '해외 라벨 번역본'],
  },
  scientific_qa: {
    public: ['PubMed 문헌 코퍼스', '임상 진료 가이드라인', '질환별 데이터베이스'],
    internal: ['내부 SOP 및 프로토콜', '연구 Q&A 아카이브', '교육 자료 및 슬라이드'],
    extension: ['전문가 인터뷰 기록', '학회 발표 자료', '의학 교육 콘텐츠'],
  },
  kol_sponsor_landscape: {
    public: ['PubMed 저자 데이터', 'ClinicalTrials.gov 연구자/스폰서 데이터', '학회 발표 데이터베이스'],
    internal: ['메디컬 어페어스 KOL 레지스트리', '자문위원회 기록', '연구자 미팅 노트'],
    extension: ['상업 KOL DB (Citeline KOL)', '연구비 데이터베이스 (NIH Reporter)', '소셜 미디어 / 전문가 네트워크 데이터'],
  },
}

// ─── 6-Week PoC Scope ─────────────────────────────────────────────────────────

const SIX_WEEK_SCOPE: Record<BusinessObjective, WeekScope[]> = {
  literature_intelligence: [
    { week: 1, title: '요구사항 정의 및 코퍼스 범위 설정', description: '검색 범위 정의, 내부 문서 저장소 식별, 연구팀과 쿼리 유형 및 답변 형식 정렬' },
    { week: 2, title: '데이터 수집 및 인덱싱', description: 'PubMed 코퍼스 및 고객 PDF 수집, 청킹 및 임베딩, 메타데이터 필터를 갖춘 벡터 인덱스 구축' },
    { week: 3, title: '검색 기준선 구축', description: '하이브리드 검색(밀집+키워드) 구현, SME 관련성 평가 기반 20개 테스트 질문에 대한 평가 수행' },
    { week: 4, title: '요약 생성 및 UI 구축', description: '인용 강제 적용 LLM 요약 추가, 근거 카드 및 소스 링크를 갖춘 쿼리 인터페이스 구축' },
    { week: 5, title: 'SME 검토 및 개선', description: '연구원 피드백 세션, 검색 전략 정제, 프롬프트 튜닝, 도메인 특화 격차 해소' },
    { week: 6, title: 'KPI 검증 및 데모', description: '업무 소요 시간 측정, 보류 테스트셋 정밀도 평가, 이해관계자 데모, PoC 요약 보고서 작성' },
  ],
  trial_scouting: [
    { week: 1, title: '범위 설정 및 데이터 접근', description: '목표 적응증 범위 정의, ClinicalTrials.gov API 접근 검증, BD팀과 스폰서/경쟁사 목록 정렬' },
    { week: 2, title: '데이터 파이프라인 구축', description: '임상시험 데이터 수집 파이프라인 구축, 상태/단계/스폰서 필드 정규화, 업데이트 주기 수립' },
    { week: 3, title: '랜드스케이프 분석', description: '임상 단계 분포, 스폰서 빈도, 지역 클러스터링 구현 및 경쟁 신호 표면화' },
    { week: 4, title: '대시보드 및 알림 구축', description: '랜드스케이프 대시보드 UI 구축, 상태 변경 알림 로직 구현, 단계/상태/스폰서 유형별 필터 추가' },
    { week: 5, title: 'BD팀 검토', description: 'BD팀 워크스루, 경쟁 인텔리전스 커버리지 검증, 알림 임계값 및 표시 형식 개선' },
    { week: 6, title: 'KPI 측정 및 데모', description: '스카우팅 시간 벤치마크, 전문가 기준 대비 커버리지 재현율, 이해관계자 데모, PoC 보고서' },
  ],
  label_regulatory: [
    { week: 1, title: '규제 코퍼스 정의', description: '목표 라벨 및 가이던스 문서 식별, 문서 접근 확보, 규제 담당 팀과 쿼리 분류 체계 정의' },
    { week: 2, title: '문서 처리', description: 'FDA/EMA 라벨 수집 및 파싱, 섹션 단위 청킹, 섹션 수준 메타데이터를 갖춘 검색 인덱스 구축' },
    { week: 3, title: '시맨틱 검색 기준선', description: '섹션 수준 인용을 갖춘 시맨틱 검색 구현, 15개 규제 선례 쿼리에 대한 평가 수행' },
    { week: 4, title: '교차 라벨 비교', description: '다중 라벨 쿼리를 위한 구조화된 비교 뷰 구축, 문서/섹션/버전 출처를 갖춘 추적 가능성 레이어 추가' },
    { week: 5, title: '규제팀 검토', description: '규제 담당자 검증 세션, 섹션 청킹 및 인용 형식 정제, 감사 추적 요건 반영' },
    { week: 6, title: '검증 및 데모', description: '추적 가능성 감사, 업무 소요 시간 벤치마크, 컴플라이언스 검토, 이해관계자 데모, PoC 보고서' },
  ],
  scientific_qa: [
    { week: 1, title: '지식 범위 정의', description: '내부 문서 저장소 및 외부 코퍼스 식별, 질문 분류 체계 정의, 과학팀과 인용 요건 정렬' },
    { week: 2, title: '지식베이스 구축', description: '내부 SOP, 보고서 및 관련 PubMed 문헌 수집·인덱싱, 청킹 및 임베딩 전략 수립' },
    { week: 3, title: 'Q&A 파이프라인 구축', description: '필수 출처 인용을 갖춘 검색 증강 Q&A 구현, 25개 대표 과학 질문에 대한 평가 수행' },
    { week: 4, title: '인터페이스 및 통합', description: '소스 패널을 갖춘 대화형 인터페이스 구축, 가용한 경우 내부 문서 관리 시스템과 연동' },
    { week: 5, title: '연구원 평가', description: '5~10명의 연구원을 대상으로 파일럿 진행, 답변 품질 및 인용 준수에 대한 구조화된 피드백 수집' },
    { week: 6, title: '채택률 측정 및 데모', description: '사용률 추적, 인용 준수 감사, 평가 세트 품질 점수, 이해관계자 데모' },
  ],
  kol_sponsor_landscape: [
    { week: 1, title: '엔티티 범위 및 데이터 소스 설정', description: '목표 적응증 및 KOL 기준 정의, PubMed 및 ClinicalTrials.gov 데이터 품질 검증' },
    { week: 2, title: '엔티티 추출 파이프라인 구축', description: '저자, 기관, 스폰서 추출, 엔티티 정규화·중복 제거·PubMed-임상시험 레코드 연결' },
    { week: 3, title: '네트워크 및 빈도 분석', description: '논문 발표 빈도 순위, 임상시험 연구자 네트워크, 스폰서 활동 타임라인 구축' },
    { week: 4, title: '랜드스케이프 대시보드', description: 'KOL 프로필 카드, 스폰서 랜드스케이프 뷰, 활동 타임라인 시각화 구축' },
    { week: 5, title: '메디컬 어페어스 검증', description: '내부 KOL 레지스트리 대비 순위 검증, 스코어링 로직 정제, 학회/연구비 신호 추가 (가용한 경우)' },
    { week: 6, title: '커버리지 벤치마크 및 데모', description: '전문가 KOL 목록 대비 재현율 측정, 보고서 생성 시간 벤치마크, 이해관계자 데모' },
  ],
}

// ─── Risks & Guardrails ───────────────────────────────────────────────────────

const STANDARD_RISKS = [
  { risk: '환각 / 허위 근거 생성', guardrail: '모든 출력에 PMID, NCT ID 또는 문서 섹션 출처 인용 필수 — 근거 없는 주장 불허' },
  { risk: '인덱싱 코퍼스 최신성 격차', guardrail: '마지막 인덱싱 날짜를 화면에 표시하고, 30일 이상 경과 시 재인덱싱 알림 발송' },
  { risk: '의료적·진단적 오용', guardrail: '고정 주의 문구 표시: "본 결과는 연구 및 제안 기획 전용이며 임상 의사결정 용도로 사용할 수 없습니다"' },
  { risk: '내부 문서 데이터 보안', guardrail: '공개/내부 문서 인덱스 네임스페이스 분리, 쿼리 레이어에서 접근 제어 적용' },
]

const OBJECTIVE_SPECIFIC_RISK: Record<BusinessObjective, { risk: string; guardrail: string }> = {
  literature_intelligence: { risk: '용어 불일치로 인한 검색 재현율 저하', guardrail: 'MeSH 어휘 및 질환별 온톨로지 기반 동의어 확장 구현' },
  trial_scouting: { risk: 'ClinicalTrials.gov 데이터 지연 또는 API 불안정', guardrail: '타임스탬프 검증을 포함한 일일 동기화, API 장애 시 최종 정상 스냅샷으로 폴백' },
  label_regulatory: { risk: '라벨 버전 불일치로 구 버전 선례 사용', guardrail: '수집 시점에 모든 문서에 버전 스탬프 적용, 모든 인용 출력에 문서 날짜 표시' },
  scientific_qa: { risk: '미해결 과학 분야에서 과도한 자신감 표현', guardrail: '검색 신뢰도 낮은 답변에 불확실성 마커 표시 및 SME 검토 권고' },
  kol_sponsor_landscape: { risk: '엔티티 해석 오류로 서로 다른 인물 병합', guardrail: '보수적 중복 제거 적용, 낮은 신뢰도 병합 건에 대한 수동 검토 큐 운영' },
}

// ─── Main Generator ───────────────────────────────────────────────────────────

export function generatePoCProposal(input: QueryInput, options: PoCOptions): PoCProposal {
  const rule = OBJECTIVE_MAP[input.objective]

  return {
    problemDefinition: buildProblemDefinition(input, rule),
    whyAI: WHY_AI[input.objective],
    whyNow: WHY_NOW[input.objective],
    solutionPattern: rule.pocType,
    solutionDescription: rule.pocTypeDescription,
    dataNeeded: DATA_NEEDED[input.objective],
    sixWeekScope: SIX_WEEK_SCOPE[input.objective],
    kpis: rule.kpis,
    risks: [...STANDARD_RISKS, OBJECTIVE_SPECIFIC_RISK[input.objective]],
  }
}
