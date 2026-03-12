import type { SolutionArea } from '../types'

// ─── Architecture Pattern Types ───────────────────────────────────────────────

export interface ArchBlock {
  id: string
  label: string
  description: string
  layer: string
  color: string
}

export interface ArchDeployOption {
  title: string
  description: string
  color: string
}

export interface ArchGovernanceItem {
  label: string
  text: string
}

export interface ArchDeliveryNote {
  title: string
  text: string
}

export interface ArchPattern {
  solutionArea: SolutionArea
  title: string
  subtitle: string
  blocks: ArchBlock[]
  deploymentOptions: ArchDeployOption[]
  governance: ArchGovernanceItem[]
  deliveryNotes: ArchDeliveryNote[]
}

// ─── GenAI Architecture (기존 유지) ──────────────────────────────────────────

const GENAI_PATTERN: ArchPattern = {
  solutionArea: 'genai',
  title: 'GenAI / 의료 AI 어시스턴트 참조 아키텍처',
  subtitle: 'Bio AI 근거 탐색 및 제안 워크플로우를 위한 클라우드 준비 패턴',
  blocks: [
    { id: 'public-data', label: '외부 공개 데이터', description: 'PubMed/NCBI, ClinicalTrials.gov, FDA DailyMed, EMA 제품 정보, bioRxiv. 사실적 근거의 기반을 제공하는 데이터 소스로, PoC 라이선스 위험 없이 모두 공개 접근 가능합니다.', layer: 'source', color: '#58A6FF' },
    { id: 'internal-data', label: '고객 내부 콘텐츠', description: '내부 연구 보고서, SOP, 규제 제출 서류, 메디컬 어페어스 문서. 프로덕션 환경에서만 접근하며 — 고객이 통제된 접근을 제공하지 않는 한 PoC에서는 사용하지 않습니다.', layer: 'source', color: '#3FB950' },
    { id: 'ingestion', label: '수집 / ETL', description: '문서 수집, PDF 파싱, 포맷 정규화. 이 레이어는 다양한 소스 포맷이 인덱스에 들어가기 전 처리합니다. 여기서의 안정성이 하위 데이터 품질 장애를 방지합니다.', layer: 'processing', color: '#D29922' },
    { id: 'metadata', label: '메타데이터 정규화', description: 'PubMed MeSH 용어, ClinicalTrials 질환명, 고객 내부 명명법에 걸쳐 용어를 통일합니다. 이 없이는 서로 다른 어휘의 동일 개념이 검색 실패를 일으킵니다.', layer: 'processing', color: '#D29922' },
    { id: 'search-index', label: '검색 인덱스 / 벡터 스토어', description: '밀집 벡터 임베딩(시맨틱 유사도)과 BM25 키워드 인덱스(정확 매칭 재현율)를 결합한 하이브리드 인덱스. 제약 도메인 검색에는 둘 다 필요하며 하나만으로는 충분하지 않습니다.', layer: 'processing', color: '#D29922' },
    { id: 'llm-orchestration', label: 'LLM 오케스트레이션', description: '검색 → 프롬프트 구성 → 생성 파이프라인을 관리합니다. 컨텍스트 윈도우 사용 제어, 인용 요건 강제 적용, 복잡 쿼리에 대한 다단계 추론을 조율합니다.', layer: 'intelligence', color: '#BC8CFF' },
    { id: 'guardrail', label: '가드레일 / 인용 엔진', description: 'AI 생성 모든 답변에 추적 가능한 출처 참조를 포함하도록 보장합니다. 환각이 사실로 제시되는 것을 방지합니다. 규제 책임이 있는 모든 제약/바이오텍 배포에 필수입니다.', layer: 'intelligence', color: '#BC8CFF' },
    { id: 'web-app', label: '웹 앱 / 사용자 레이어', description: '최종 사용자가 상호작용하는 쿼리 인터페이스, 근거 카드, 해석 패널. 연구원 및 BD팀을 위해 설계되었으며 범용 채팅 인터페이스가 아닙니다.', layer: 'delivery', color: '#F85149' },
    { id: 'logging', label: '로깅 / 평가', description: '쿼리 로그, 검색 결과, 사용자 피드백, 지연 시간 지표를 수집합니다. PoC 기간 KPI 측정 및 배포 후 지속적 개선에 필수적입니다.', layer: 'observability', color: '#8B949E' },
  ],
  deploymentOptions: [
    { title: '클라우드 빠른 PoC', description: '관리형 벡터 DB (Pinecone / Weaviate Cloud), 서버리스 LLM API, Vercel 등에 배포하는 Next.js 프론트엔드. 1주일 이내 배포 가능. 인프라팀 불필요.', color: '#3FB950' },
    { title: '엔터프라이즈 배포', description: '자체 호스팅 벡터 DB, VPC 격리 LLM 추론, SSO 통합, 감사 로깅. 데이터 민감도 요건이 있는 고객 내부 문서 PoC에 적합합니다.', color: '#58A6FF' },
    { title: '하이브리드 데이터 접근', description: '공개 데이터는 클라우드 인덱스, 내부 데이터는 온프레미스 인덱스에 저장. 쿼리 라우터가 쿼리별로 어느 인덱스를 참조할지 결정합니다. 속도와 데이터 거버넌스를 균형 있게 유지합니다.', color: '#D29922' },
  ],
  governance: [
    { label: '출처 추적 가능성', text: '모든 답변에 문서, 섹션, 버전 출처 포함. 출처 없는 주장은 사용자에게 전달되지 않습니다.' },
    { label: '전문가 검토 게이트', text: '고위험 출력(규제, 메디컬 어페어스)은 배포 전 SME 검토를 거칩니다.' },
    { label: '접근 제어', text: '공개 문서와 내부 문서 간 네임스페이스 분리. 사용자 역할 기반 쿼리 범위 제한.' },
    { label: '비진단용 주의 문구', text: '고정 UI 주의 문구 및 시스템 수준 지시사항: 연구 및 Presales 기획 전용.' },
  ],
  deliveryNotes: [
    { title: 'PoC 범위', text: '공개 데이터 한정, 단일 유스케이스, 클라우드 호스팅. 6주 내 시연 가능. 프로덕션 SLA 및 보안 인증 불필요.' },
    { title: '프로덕션 전환', text: '내부 데이터 수집, VPC 격리, SSO, 감사 로깅, SLA 모니터링 추가. 규제 대응 배포 기준 PoC 이후 통상 3~4개월 소요.' },
    { title: '예상 확장', text: '추가 적응증 커버리지, 다국어 지원, 내부 연구 플랫폼 API 연동, 하위 보고서 생성 모듈 확장.' },
  ],
}

// ─── KOL Architecture (GenAI 확장) ────────────────────────────────────────────

const KOL_PATTERN: ArchPattern = {
  solutionArea: 'kol',
  title: 'KOL & 랜드스케이프 인텔리전스 참조 아키텍처',
  subtitle: 'PubMed 저자 분석 + ClinicalTrials 연구자 네트워크 기반 KOL 맵 구축 패턴',
  blocks: [
    { id: 'pubmed-source', label: 'PubMed 저자 데이터', description: 'PubMed API를 통해 타깃 질환 관련 논문의 저자 목록, 소속 기관, 발표 빈도를 추출합니다. 학문적 영향력의 주요 신호입니다.', layer: 'source', color: '#58A6FF' },
    { id: 'trials-source', label: 'ClinicalTrials.gov 연구자', description: '임상시험 PI(Principal Investigator), 스폰서, 모집 사이트를 추출합니다. 임상 활동 기반 KOL 식별의 핵심 소스입니다.', layer: 'source', color: '#3FB950' },
    { id: 'entity-extraction', label: '엔티티 추출 및 정규화', description: '저자명, 소속기관, ORCID를 표준화하고 동명이인 구분 및 기관 변경 추적을 수행합니다. 데이터 품질의 핵심 레이어입니다.', layer: 'processing', color: '#D29922' },
    { id: 'deduplication', label: '중복 제거 및 엔티티 병합', description: 'PubMed와 ClinicalTrials 저자 동일인 판별, 보수적 매칭 전략 적용. 오탐(false merge) 방지를 위해 수동 검토 큐 포함합니다.', layer: 'processing', color: '#D29922' },
    { id: 'network-graph', label: '네트워크 그래프', description: 'KOL 간 공저자 관계, 임상 협력 네트워크를 그래프 DB(Neo4j 또는 DynamoDB)에 구성합니다. 영향력 중심성 지표(degree, betweenness) 계산합니다.', layer: 'intelligence', color: '#BC8CFF' },
    { id: 'ranking', label: 'KOL 순위 모델', description: '발표 빈도, 인용 수, 임상 참여도, 지역 활동성을 가중합산하여 KOL 순위를 산출합니다. 비즈니스 목적(BD/MSL/KOL 자문)에 따라 가중치 조정 가능합니다.', layer: 'intelligence', color: '#BC8CFF' },
    { id: 'kol-portal', label: 'KOL 프로필 포털', description: 'KOL별 논문 목록, 임상 참여 이력, 소속 기관, 연락처(공개 정보만) 카드를 표시합니다. 필터(지역/전문분야/활동 기간)를 지원합니다.', layer: 'delivery', color: '#F85149' },
    { id: 'alert-engine', label: '알림 엔진', description: '신규 KOL 등장, 기존 KOL 활동 상태 변화, 새 임상 참여 시 알림을 생성합니다. 주 단위 인덱스 갱신과 변화 감지 로직을 포함합니다.', layer: 'observability', color: '#8B949E' },
  ],
  deploymentOptions: [
    { title: '공개 데이터 PoC', description: 'PubMed + ClinicalTrials.gov 공개 API만 사용. 라이선스 비용 없음. 4~6주 내 KOL 맵 초안 도출 가능.', color: '#3FB950' },
    { title: '상용 DB 연동', description: 'Citeline (Pharmaprojects), Clarivate (Web of Science), IQVIA 등 상용 데이터와 통합하여 KOL 커버리지 확장. PoC 이후 단계에서 권장.', color: '#58A6FF' },
    { title: '내부 CRM 통합', description: '기존 MSL/BD CRM과 KOL 레지스트리를 연동하여 내부 관계 이력 + 외부 활동 데이터를 통합 뷰로 제공.', color: '#D29922' },
  ],
  governance: [
    { label: '개인정보 준수', text: '공개 게재 정보만 수집. 연락처는 공개된 학술 이메일/소속 기관만 표시. GDPR 적용 지역은 별도 레이어 적용.' },
    { label: '보수적 엔티티 병합', text: '동명이인 오병합 방지를 위해 수동 검토 큐 포함. 확실한 매칭만 자동 병합.' },
    { label: '데이터 신선도', text: '주 1회 PubMed/ClinicalTrials 인덱스 갱신. 마지막 업데이트 타임스탬프 UI에 표시.' },
    { label: '비즈니스 목적 제한', text: 'BD/MSL 전략 및 Presales 기획 전용. 개인 마케팅 또는 스팸 목적 사용 금지 명시.' },
  ],
  deliveryNotes: [
    { title: 'PoC 범위', text: '단일 적응증 기준 KOL 탑 50 도출. PubMed + ClinicalTrials 데이터만 사용. 4~6주 내 초안 대시보드 시연 가능.' },
    { title: '프로덕션 전환', text: '다적응증 확장, 상용 DB 통합, 자동 알림, CRM 연동. PoC 이후 3~6개월 추가 개발.' },
    { title: '예상 확장', text: '경쟁사 스폰서 맵, 신규 KOL 조기 발굴(emerging KOL), KOL-논문-임상 통합 타임라인 뷰.' },
  ],
}

// ─── EDP Architecture ──────────────────────────────────────────────────────────

const EDP_PATTERN: ArchPattern = {
  solutionArea: 'edp',
  title: '엔터프라이즈 데이터 플랫폼 참조 아키텍처',
  subtitle: '분산 데이터 통합 → 거버넌스 → AI 어시스턴트 확장을 위한 단계별 데이터 플랫폼 패턴',
  blocks: [
    { id: 'source-systems', label: '원천 시스템', description: 'LIMS, ERP, 임상 DB, 파일서버(SharePoint, S3), SaaS(Salesforce, Veeva). 각 시스템에서 데이터를 추출하는 커넥터가 이 레이어의 핵심입니다.', layer: 'source', color: '#58A6FF' },
    { id: 'ingestion-pipeline', label: '수집 파이프라인 (ETL/ELT)', description: 'Apache Airflow, dbt, AWS Glue, Azure Data Factory로 배치/스트리밍 수집을 자동화합니다. 데이터 변환과 품질 체크가 이 단계에서 수행됩니다.', layer: 'processing', color: '#D29922' },
    { id: 'data-lake', label: '데이터 레이크 / 레이크하우스', description: 'AWS S3 + Delta Lake, Azure ADLS + Apache Iceberg, 또는 Databricks Lakehouse. 정형·비정형 데이터를 중앙 저장소에 통합합니다.', layer: 'processing', color: '#D29922' },
    { id: 'catalog', label: '메타데이터 카탈로그', description: 'Apache Atlas, DataHub, AWS Glue Data Catalog. 데이터 계보, 소유자, 품질 SLA를 관리합니다. 데이터 검색 가능성(discoverability)의 핵심입니다.', layer: 'processing', color: '#D29922' },
    { id: 'governance', label: '거버넌스 & 접근 제어', description: '역할 기반 접근 제어(RBAC), 데이터 마스킹, 감사 로그, 규정 준수(GDPR/HIPAA) 레이어. 데이터 민감도 분류와 정책 자동화를 포함합니다.', layer: 'intelligence', color: '#BC8CFF' },
    { id: 'quality-monitor', label: '데이터 품질 모니터링', description: 'Great Expectations, dbt Tests, Monte Carlo. 파이프라인 실행 시마다 데이터 품질을 검사하고 이상치를 알립니다.', layer: 'intelligence', color: '#BC8CFF' },
    { id: 'analytics-bi', label: '분석 / BI 레이어', description: 'Tableau, Power BI, Superset. 정제된 데이터를 비즈니스 사용자가 직접 분석할 수 있는 셀프 서비스 분석 환경을 제공합니다.', layer: 'delivery', color: '#F85149' },
    { id: 'ai-extension', label: 'AI/ML 확장 레이어', description: '데이터 플랫폼 위에 구축되는 GenAI 어시스턴트, 예측 모델, Feature Store. 플랫폼이 성숙한 후 AI 도입이 가속됩니다. (2단계 확장)' , layer: 'delivery', color: '#F85149' },
    { id: 'observability-edp', label: '파이프라인 관측성', description: '파이프라인 실행 로그, SLA 모니터링, 비용 추적, 데이터 지연 알림. 운영 팀이 플랫폼 건강 상태를 실시간으로 파악합니다.', layer: 'observability', color: '#8B949E' },
  ],
  deploymentOptions: [
    { title: '클라우드 네이티브 EDP', description: 'AWS Lake Formation + Glue + Athena, 또는 Azure Purview + ADLS + Synapse. 관리형 서비스로 운영 부담 최소화. 3~4개월 PoC 가능.', color: '#3FB950' },
    { title: 'Databricks Lakehouse', description: 'Delta Lake + Databricks Unity Catalog + MLflow. 데이터 엔지니어링, ML, BI를 통합 플랫폼에서 처리. 바이오파마 대형 고객 표준 패턴.', color: '#58A6FF' },
    { title: '온프레미스 하이브리드', description: '민감 데이터는 온프레미스 레이크, 공개 데이터는 클라우드 처리. 보안 규제가 강한 임상 데이터에 적합. 데이터 레지던시 요건 충족.', color: '#D29922' },
  ],
  governance: [
    { label: '데이터 계보 추적', text: '원천 시스템에서 최종 보고서까지 모든 변환 단계를 추적. 규제 감사 시 데이터 출처 입증 가능.' },
    { label: '민감도 분류', text: '임상 데이터, 개인 정보, 공개 데이터를 자동 분류하고 등급에 따른 접근 정책을 적용.' },
    { label: '데이터 품질 SLA', text: '주요 데이터셋별 품질 임계값 설정, 위반 시 알림 및 파이프라인 중단 게이트.' },
    { label: 'GDPR/HIPAA 감사 로그', text: '모든 데이터 접근 이벤트를 불변 로그에 기록. 규정 준수 리포트 자동 생성.' },
  ],
  deliveryNotes: [
    { title: 'PoC 범위', text: '핵심 데이터 소스 2~3개 통합, 파이프라인 자동화, 기본 카탈로그 구축. 6~8주 내 시연 가능.' },
    { title: '프로덕션 전환', text: '전체 데이터 소스 통합, 엔터프라이즈 거버넌스 정책 수립, BI/AI 연동. 통상 6~12개월 소요.' },
    { title: '예상 확장', text: '데이터 마켓플레이스 구축, AI Feature Store 연동, 실시간 스트리밍 파이프라인, 규제 제출 자동화.' },
  ],
}

// ─── Structure Prediction Architecture ────────────────────────────────────────

const STRUCTURE_PATTERN: ArchPattern = {
  solutionArea: 'structure_prediction',
  title: '단백질 구조 예측 / 타깃 인사이트 참조 아키텍처 (개념 가이드)',
  subtitle: 'AlphaFold 계열 구조 예측 워크플로우 설계 논의용 패턴 — 개념 논의 전용',
  blocks: [
    { id: 'sequence-input', label: '단백질 서열 / PDB 입력', description: 'UniProt 서열(FASTA) 또는 PDB 구조 ID를 입력으로 받습니다. AlphaFold DB에서 2억 개 이상의 구조를 무료로 검색할 수 있습니다.', layer: 'source', color: '#58A6FF' },
    { id: 'public-structure-db', label: '공개 구조 데이터베이스', description: 'Protein Data Bank(PDB), AlphaFold DB, UniProt. 공개 구조 데이터의 1차 소스로 PoC 라이선스 비용 없이 활용 가능합니다.', layer: 'source', color: '#3FB950' },
    { id: 'alphafold-engine', label: 'AlphaFold / 구조 예측 엔진', description: 'AlphaFold2/3 추론, RoseTTAFold, ESMFold 등 구조 예측 모델. GPU 클러스터 또는 클라우드(AWS/GCP)에서 실행. 개념 논의에서는 공개 API 활용을 권장합니다.', layer: 'processing', color: '#D29922' },
    { id: 'structure-analysis', label: '구조 분석 레이어', description: '결합 포켓 예측(FPocket, DoGSiteScorer), 구조 정렬(TM-align), 알로스테릭 사이트 분석. 구조에서 약물 결합 가능성을 평가합니다.', layer: 'processing', color: '#D29922' },
    { id: 'docking-module', label: '분자 도킹 모듈', description: 'AutoDock Vina, Glide(Schrödinger), GNINA(AI 기반 도킹). 소분자 결합 친화도 예측. 도킹 결과는 실험 검증 전까지 스크리닝 도구로만 활용합니다.', layer: 'intelligence', color: '#BC8CFF' },
    { id: 'literature-rag', label: '문헌 RAG 연결', description: '구조 예측 타깃 관련 PubMed 논문을 자동 연결합니다. 구조 기반 인사이트와 문헌 근거를 통합 뷰로 제공합니다.', layer: 'intelligence', color: '#BC8CFF' },
    { id: 'target-dashboard', label: '타깃 인사이트 대시보드', description: '구조 시각화(Mol*/PyMOL WebGL), 결합 포켓 목록, 관련 논문 카드, 도킹 결과 요약을 통합 표시합니다.', layer: 'delivery', color: '#F85149' },
    { id: 'structure-observability', label: '분석 로그 / 파이프라인 추적', description: '예측 요청 로그, 사용 API 버전, 결과 해석 이력을 관리합니다. 재현성 확보와 파이프라인 버전 관리에 필수입니다.', layer: 'observability', color: '#8B949E' },
  ],
  deploymentOptions: [
    { title: '공개 API 활용 PoC', description: 'AlphaFold DB API + PDB API + PubMed API만 사용. 컴퓨팅 비용 최소화. 4~6주 내 타깃 인사이트 프로토타입 구축 가능.', color: '#3FB950' },
    { title: '클라우드 GPU 파이프라인', description: 'AWS p3/p4, GCP A100 인스턴스에서 AlphaFold2 추론 실행. 내부 타깃 맞춤 예측 가능. 월 $500~$2,000 컴퓨팅 비용 예상.', color: '#58A6FF' },
    { title: '전문 플랫폼 파트너십', description: 'Schrödinger, Atomwise, Insilico Medicine 등 전문 플랫폼과 파트너십. 자체 구축 대신 API 연동으로 빠른 시작 가능.', color: '#D29922' },
  ],
  governance: [
    { label: '개념 논의 전용 명시', text: '본 아키텍처는 워크플로우 설계 논의용입니다. AlphaFold 결과는 스크리닝 도구이며 실험 검증이 필수입니다.' },
    { label: '구조 예측 불확실성 표시', text: 'AlphaFold pLDDT 신뢰 점수를 모든 예측 결과에 표시. 신뢰도 낮은 영역(pLDDT < 70)은 별도 표시.' },
    { label: '지적재산권 주의', text: '상업적 구조 예측 서비스 사용 시 라이선스 조건 확인 필수. AlphaFold DB는 CC BY 4.0 라이선스.', },
    { label: '임상 의사결정 분리', text: '구조 예측 기반 인사이트는 연구·발굴 단계 전용. 임상 의사결정에 직접 사용 금지.' },
  ],
  deliveryNotes: [
    { title: 'PoC 범위 (개념 논의)', text: '공개 AlphaFold DB 구조 검색, PyMOL 시각화, PubMed 연결. 4~6주. AlphaFold 직접 실행 없음.' },
    { title: '프로덕션 전환', text: '자체 AlphaFold 추론 인프라 또는 플랫폼 파트너십, 도킹 파이프라인 자동화, 내부 화합물 라이브러리 통합. 6~18개월.' },
    { title: '예상 확장', text: '생성형 화학(generative chemistry) 연동, MD 시뮬레이션 파이프라인, 다중 타깃 비교 분석 플랫폼.' },
  ],
}

// ─── Genomics Architecture ────────────────────────────────────────────────────

const GENOMICS_PATTERN: ArchPattern = {
  solutionArea: 'genomics_pipeline',
  title: '유전체 / 변이 분석 파이프라인 참조 아키텍처 (개념 가이드)',
  subtitle: 'NGS 데이터에서 임상적 변이 해석까지의 바이오인포매틱스 파이프라인 패턴 — 개념 논의 전용',
  blocks: [
    { id: 'raw-sequencing', label: '원시 시퀀싱 데이터', description: 'NGS 장비(Illumina, Oxford Nanopore)에서 출력된 FASTQ 파일. WGS/WES/Targeted Panel/RNA-seq 등 다양한 유형을 처리합니다.', layer: 'source', color: '#58A6FF' },
    { id: 'reference-db', label: '레퍼런스 데이터베이스', description: 'hg38/GRCh38 레퍼런스 지놈, gnomAD(집단 주파수), ClinVar(임상 의의), dbSNP. 변이 어노테이션의 기반 데이터입니다.', layer: 'source', color: '#3FB950' },
    { id: 'qc-trimming', label: 'QC 및 전처리', description: 'FastQC(품질 평가), MultiQC(배치 리포트), Trimmomatic/Fastp(어댑터 제거). 파이프라인 출력 품질을 결정하는 첫 번째 체크포인트입니다.', layer: 'processing', color: '#D29922' },
    { id: 'alignment', label: '정렬 및 전처리', description: 'BWA-MEM2(DNA), STAR(RNA), GATK BQSR(기저 품질 재교정), Picard(중복 제거). GATK Best Practices 기준 구현을 권장합니다.', layer: 'processing', color: '#D29922' },
    { id: 'variant-calling', label: '변이 콜링', description: 'GATK HaplotypeCaller(생식계열), Mutect2(체세포), DeepVariant(AI 기반). 분석 목적과 데이터 유형에 따라 콜러를 선택합니다.', layer: 'intelligence', color: '#BC8CFF' },
    { id: 'annotation', label: '기능 어노테이션', description: 'VEP, ANNOVAR, SnpEff. 변이의 유전자 영향, 집단 주파수, 임상 의의를 주석합니다. ACMG 변이 분류 기준 적용.', layer: 'intelligence', color: '#BC8CFF' },
    { id: 'interpretation', label: '임상 해석 레이어', description: '병원성 분류(Pathogenic/VUS/Benign), 치료 관련성(OncoKB, CIViC), 임상 보고서 자동 생성. AI 보조 변이 분류 모델 적용 가능.', layer: 'delivery', color: '#F85149' },
    { id: 'reporting-portal', label: '리포팅 포털', description: '변이 목록, 임상 의의 요약, ACMG 분류, 치료 옵션 연결을 표시하는 의사/연구자용 포털. 보고서 PDF 자동 생성 포함.', layer: 'delivery', color: '#F85149' },
    { id: 'pipeline-monitor', label: '파이프라인 모니터링', description: '샘플 처리 상태 추적, QC 지표 대시보드, 처리 실패 알림, 비용 모니터링. Nextflow Tower, AWS Step Functions으로 구현.', layer: 'observability', color: '#8B949E' },
  ],
  deploymentOptions: [
    { title: '클라우드 확장 파이프라인', description: 'AWS Batch + Nextflow, 또는 Google Cloud Life Sciences + Cromwell. 샘플 수에 따라 자동 확장. WGS 샘플당 $5~$30 처리 비용.', color: '#3FB950' },
    { title: '온프레미스 컨테이너', description: 'Nextflow + Singularity + HPC 클러스터. 데이터 보안 요건이 강한 임상 환경에 적합. 재현 가능한 컨테이너 기반 파이프라인.', color: '#58A6FF' },
    { title: 'Terra / AnVIL 플랫폼', description: 'Broad Institute Terra(Google Cloud 기반) 또는 NHGRI AnVIL. 공개 데이터셋(UK Biobank, TOPMed)과 통합 가능한 연구 협력 플랫폼.', color: '#D29922' },
  ],
  governance: [
    { label: '개념 논의 전용 명시', text: '본 아키텍처는 파이프라인 설계 논의용입니다. 본 앱은 유전체 분석을 실행하거나 변이 해석 결과를 생성하지 않습니다.' },
    { label: '게놈 데이터 보호', text: '유전체 데이터는 개인 식별 정보. GDPR/HIPAA/한국 생명윤리법 요건 충족 필수. 데이터 최소화 원칙 적용.' },
    { label: '분석 재현성', text: '모든 파이프라인은 컨테이너(Docker/Singularity)로 버전 고정. 레퍼런스 DB 버전, 소프트웨어 버전을 메타데이터에 기록.' },
    { label: 'IRB/윤리 승인', text: '인체 유래 시료 분석은 IRB 승인 필수. 임상 목적 분석은 추가 규제(CLIA/CAP 인증) 요건 확인 필요.' },
  ],
  deliveryNotes: [
    { title: 'PoC 범위 (개념 논의)', text: '특정 시퀀싱 유형(WES 또는 Targeted Panel), 소규모 샘플(10~20개), 변이 콜링 + 어노테이션 자동화. 6주 파이프라인 구축 PoC.' },
    { title: '프로덕션 전환', text: '대규모 코호트 처리, CDx 규제 인증, 임상 보고서 자동 생성, 전자의무기록(EMR) 연동. 통상 6~18개월.' },
    { title: '예상 확장', text: '다중 오믹스 통합(RNA-seq, 단백체, 후성유전체), scRNA-seq 세포 유형 분류, 신생 항원(neoantigen) 예측 파이프라인.' },
  ],
}

// ─── Digital Health Architecture ──────────────────────────────────────────────

const DIGITAL_HEALTH_PATTERN: ArchPattern = {
  solutionArea: 'digital_health',
  title: '디지털 헬스 / 워크플로우 플랫폼 참조 아키텍처',
  subtitle: 'EHR 연동 → 임상 AI → 사용자 포털까지의 디지털 헬스 플랫폼 패턴',
  blocks: [
    { id: 'ehr-emr', label: 'EHR / EMR 시스템', description: 'Epic, Cerner, 삼성서울/서울아산 자체 EMR 등. FHIR R4 API를 통해 Patient, Observation, Encounter 리소스를 표준화된 방식으로 제공합니다.', layer: 'source', color: '#58A6FF' },
    { id: 'iot-wearable', label: 'IoT / 웨어러블 디바이스', description: '혈당계, 혈압계, 심전도 패치, 스마트워치 등에서 실시간 생체 데이터를 수집합니다. HL7 FHIR Observation 리소스로 표준화합니다.', layer: 'source', color: '#3FB950' },
    { id: 'fhir-layer', label: 'FHIR API 레이어', description: 'HL7 FHIR R4 서버(HAPI FHIR, Azure Health Data Services). EHR과 앱 사이의 표준화된 데이터 교환 허브. SMART on FHIR 인증을 통한 보안 접근 제어.', layer: 'processing', color: '#D29922' },
    { id: 'clinical-data-pipeline', label: '임상 데이터 파이프라인', description: '비정형 임상 노트 NLP 처리(cTAKES, MedSpaCy), 코드 표준화(ICD-10, SNOMED CT, LOINC), 품질 검증. 다운스트림 AI 모델의 입력 품질을 보장합니다.', layer: 'processing', color: '#D29922' },
    { id: 'clinical-ai', label: '임상 AI 모듈', description: '임상 의사결정 지원(CDSS), 예측 모델(재입원 위험, 패혈증 조기 감지), NLP 기반 문서 자동화. FDA SaMD 분류에 따른 규제 적용.', layer: 'intelligence', color: '#BC8CFF' },
    { id: 'workflow-engine', label: '워크플로우 엔진', description: '임상 프로세스 자동화(알림, 승인, 에스컬레이션), 케어 플랜 관리, 업무 배정. 기존 EMR 워크플로우와 통합 설계.', layer: 'intelligence', color: '#BC8CFF' },
    { id: 'clinician-portal', label: '임상의 / 연구자 포털', description: '의사·간호사·연구자를 위한 대시보드 및 앱. AI 출력을 승인/거부할 수 있는 Human-in-the-loop 인터페이스. 모바일 지원 권장.', layer: 'delivery', color: '#F85149' },
    { id: 'patient-app', label: '환자 앱 / 포털', description: '환자가 직접 데이터를 확인하고 의료진과 소통하는 채널. PHR(개인건강기록), 원격 진료 연동, 알림/리마인더 기능.', layer: 'delivery', color: '#F85149' },
    { id: 'audit-compliance', label: '감사 로그 / 규정 준수', description: '모든 임상 AI 의사결정 이력 기록, 환자 데이터 접근 감사 로그, HIPAA/개인정보보호법 준수 레이어. 규제 제출 패키지 자동 생성.', layer: 'observability', color: '#8B949E' },
  ],
  deploymentOptions: [
    { title: '단일 워크플로우 MVP', description: '단일 임상 사용 사례(예: 방사선 보고서 초안 생성)에 집중. FHIR 샌드박스 + LLM API. 6~8주 내 파일럿 가능. 규제 인증 불필요.', color: '#3FB950' },
    { title: '엔터프라이즈 EHR 통합', description: 'Epic App Orchard 또는 Cerner App Market 등록. SMART on FHIR 인증. VPC 격리, SSO, HIPAA BAA 체결. 3~6개월 개발.', color: '#58A6FF' },
    { title: 'FDA SaMD 인증 경로', description: 'FDA 21 CFR Part 820, ISO 13485, IEC 62304 준수. Pre-Submission 미팅 → 510(k) 또는 De Novo 제출. 일반적으로 12~24개월 인증 기간.', color: '#D29922' },
  ],
  governance: [
    { label: 'Human-in-the-Loop 의무화', text: '임상 AI 출력은 반드시 의료진 검토 후 적용. AI가 최종 임상 결정을 자동 집행하지 않는 워크플로우 설계.' },
    { label: '규제 분류 사전 확인', text: '개발 전 FDA SaMD 분류(Class I/II/III) 또는 한국 의료기기 분류 확인. 분류에 따라 개발 요건이 크게 달라짐.' },
    { label: '환자 동의 관리', text: '데이터 수집·활용에 대한 환자 동의 기록, 동의 철회 처리, 목적 외 사용 금지. IRB 승인 프로세스 포함.' },
    { label: '비의료 행위 경계 명시', text: 'AI 도구는 의료 행위 보조 도구임을 명시. 진단·치료 결정은 면허 의료인이 수행. 면책 문구 UI에 고정 표시.' },
  ],
  deliveryNotes: [
    { title: 'PoC 범위', text: '단일 워크플로우 자동화, FHIR 샌드박스 연동, 소규모 파일럿(5~10명 의료진). 6~8주 내 사용성 검증 가능.' },
    { title: '프로덕션 전환', text: '전체 EHR 통합, 다부서 확장, 보안 인증(HIPAA/개인정보법), 의료기기 분류 검토. 6~18개월 추가 개발.' },
    { title: '예상 확장', text: '다기관 연동, 예측 모델 고도화(재입원·악화 예측), 환자 참여 앱, 원격 모니터링(RPM) 플랫폼 통합.' },
  ],
}

// ─── Pattern Map ──────────────────────────────────────────────────────────────

const ARCHITECTURE_PATTERNS: Record<SolutionArea, ArchPattern> = {
  genai: GENAI_PATTERN,
  kol: KOL_PATTERN,
  edp: EDP_PATTERN,
  structure_prediction: STRUCTURE_PATTERN,
  genomics_pipeline: GENOMICS_PATTERN,
  digital_health: DIGITAL_HEALTH_PATTERN,
}

// ─── Public API ────────────────────────────────────────────────────────────────

export function getArchPattern(area: SolutionArea): ArchPattern {
  return ARCHITECTURE_PATTERNS[area]
}
