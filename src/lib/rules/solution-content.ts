import type { SolutionArea } from '../types'

// ─── Solution Concept Content ──────────────────────────────────────────────────
// Screen 2 / Screen 3 용 비GenAI 솔루션 영역 정적 콘텐츠

export interface SolutionConceptItem {
  title: string
  description: string
}

export interface SolutionConceptContent {
  conceptTitle: string
  conceptSummary: string
  keyComponents: SolutionConceptItem[]
  whyNow: string
  commonEntryPatterns: string[]
  scopeNote: string   // "이 화면은 개념 가이드입니다" 명시용
}

export interface DataMarketContent {
  title: string
  summary: string
  maturityStages: { stage: string; signals: string[]; recommendation: string }[]
  marketContext: string
  readinessSignals: string[]
}

// ─── Screen 2: Solution Concept Content ───────────────────────────────────────

export const SOLUTION_CONCEPT_CONTENT: Partial<Record<SolutionArea, SolutionConceptContent>> = {
  edp: {
    conceptTitle: '엔터프라이즈 데이터 플랫폼 (EDP) 개념 가이드',
    conceptSummary:
      '데이터 플랫폼은 분산된 내부 데이터를 통합·정제·거버넌스 체계 아래 관리하는 인프라 레이어입니다. AI 어시스턴트 도입 전에 데이터 품질과 접근성을 확보하는 선행 과제로, 분석 및 AI 활용의 기반이 됩니다.',
    keyComponents: [
      {
        title: '데이터 수집 레이어',
        description: '다양한 원천 시스템(ERP, LIMS, 임상 DB, 파일서버)에서 데이터를 추출하고 표준화하는 ETL/ELT 파이프라인입니다.',
      },
      {
        title: '데이터 레이크 / 레이크하우스',
        description: '정형·비정형 데이터를 통합 저장하는 중앙 리포지토리입니다. Delta Lake, Apache Iceberg 등이 대표적이며 버전 관리와 트랜잭션을 지원합니다.',
      },
      {
        title: '메타데이터 카탈로그',
        description: '데이터 계보, 소유자, 품질 지표를 관리합니다. Apache Atlas, DataHub, AWS Glue Catalog 등이 활용됩니다.',
      },
      {
        title: '거버넌스 및 접근 제어',
        description: '데이터 민감도 분류, 역할 기반 접근 정책, 규정 준수(GDPR, HIPAA) 감사 로그를 포함합니다.',
      },
      {
        title: 'AI/ML 레이어 연결',
        description: '정제된 데이터를 AI 어시스턴트, 예측 모델, BI 도구에 제공하는 서빙 레이어입니다. 데이터 플랫폼이 완성된 후 AI 도입이 가속됩니다.',
      },
    ],
    whyNow:
      '클라우드 데이터 레이크 비용이 2020년 대비 60~70% 낮아졌고, 관리형 서비스(AWS Lake Formation, Azure Purview, Databricks Unity Catalog)가 성숙해 중소 규모 바이오텍에서도 6~12주 PoC가 현실화되었습니다.',
    commonEntryPatterns: [
      '파일서버/SharePoint → 중앙 레이크 통합 PoC',
      'LIMS + ERP 데이터 연결 및 통합 뷰 구축',
      '규제 제출 데이터 계보 추적 및 감사 로그 자동화',
    ],
    scopeNote:
      '이 화면은 EDP 솔루션 논의를 위한 개념 가이드입니다. 실제 데이터 파이프라인을 구축하거나 실행하지 않습니다.',
  },

  structure_prediction: {
    conceptTitle: '단백질 구조 예측 / 타깃 인사이트 워크플로우 개념 가이드',
    conceptSummary:
      'AlphaFold2/3, RoseTTAFold 등 AI 기반 구조 예측 도구는 신약 발굴의 타깃 검증과 리드 최적화 단계를 가속합니다. 본 가이드는 이 워크플로우를 도입하는 조직과의 논의를 지원하기 위한 개념 설명입니다.',
    keyComponents: [
      {
        title: 'AlphaFold2/3 구조 예측',
        description: 'DeepMind의 AlphaFold는 아미노산 서열로부터 3D 단백질 구조를 예측합니다. AlphaFold DB에 2억 개 이상의 구조가 공개되어 있습니다.',
      },
      {
        title: '구조 시각화 및 분석',
        description: 'PyMOL, ChimeraX, Mol* 등을 통해 결합 포켓, 상호작용 사이트, 구조적 유사성을 분석합니다.',
      },
      {
        title: '분자 도킹 / 결합 분석',
        description: '예측된 구조에 소분자 또는 항체를 도킹하여 결합 친화도를 평가합니다. AutoDock Vina, Schrödinger Suite 등이 활용됩니다.',
      },
      {
        title: '문헌 RAG 연결',
        description: '구조 예측 결과와 관련 논문을 연결하는 통합 뷰를 제공합니다. 타깃 검증 단계에서 근거 기반 의사결정을 지원합니다.',
      },
    ],
    whyNow:
      'AlphaFold DB의 공개로 구조 예측 비용이 사실상 0에 가까워졌고, 2024년 AlphaFold3가 단백질-소분자 상호작용 예측까지 확장되어 신약 발굴 워크플로우가 크게 가속되었습니다.',
    commonEntryPatterns: [
      '공개 AlphaFold DB 구조 검색 + 결합 포켓 분석 파일럿',
      '내부 타깃 목록에 대한 구조 기반 유사 타깃 발굴',
      '문헌 RAG + 구조 데이터 통합 타깃 인사이트 대시보드',
    ],
    scopeNote:
      '이 화면은 개념 논의 가이드입니다. 본 앱은 AlphaFold를 실행하거나 단백질 구조 예측 결과를 생성하지 않습니다. 워크플로우 설계 및 파트너십 논의에 한해 지원합니다.',
  },

  genomics_pipeline: {
    conceptTitle: '유전체 / 변이 분석 파이프라인 개념 가이드',
    conceptSummary:
      'NGS(차세대 시퀀싱) 기반 유전체 분석 파이프라인은 원시 시퀀싱 데이터를 임상적으로 의미 있는 변이 정보로 변환합니다. 본 가이드는 바이오인포매틱스 파이프라인 구축 논의를 위한 개념 설명입니다.',
    keyComponents: [
      {
        title: '품질 관리 (QC)',
        description: 'FastQC, MultiQC를 통해 시퀀싱 데이터 품질을 평가하고, Trimmomatic 등으로 어댑터 서열을 제거합니다.',
      },
      {
        title: '정렬 및 전처리',
        description: 'BWA-MEM2, STAR 등으로 레퍼런스 지놈에 정렬하고, GATK의 Best Practices로 기저 품질 재교정(BQSR)을 수행합니다.',
      },
      {
        title: '변이 콜링',
        description: 'GATK HaplotypeCaller, DeepVariant(구글), Mutect2(종양-정상 쌍)로 SNP/Indel을 검출합니다.',
      },
      {
        title: '기능 어노테이션',
        description: 'VEP, ANNOVAR, SnpEff로 변이의 임상적 의의와 경로 영향을 분류합니다. ClinVar, gnomAD와 대조합니다.',
      },
      {
        title: '임상 해석 및 리포팅',
        description: '변이 분류(ACMG 기준), 임상 관련성 해석, 구조화된 리포트 생성을 자동화합니다.',
      },
    ],
    whyNow:
      'WGS 비용이 $1,000 이하로 떨어지고, 클라우드 기반 파이프라인(AWS Batch, Google Cloud Life Sciences)이 성숙해 소규모 조직에서도 유전체 파이프라인 구축이 현실화되었습니다. FDA는 NGS 기반 CDx 경로도 정비 완료되었습니다.',
    commonEntryPatterns: [
      '단일 적응증 WES 변이 콜링 + 어노테이션 파이프라인 PoC',
      'scRNA-seq 기반 세포 유형 분류 및 바이오마커 발굴',
      'Tumor-Normal 쌍 체세포 변이 검출 자동화',
    ],
    scopeNote:
      '이 화면은 개념 논의 가이드입니다. 본 앱은 유전체 분석을 실행하거나 변이 해석 결과를 생성하지 않습니다. 파이프라인 아키텍처 설계 논의에 한해 지원합니다.',
  },

  digital_health: {
    conceptTitle: '디지털 헬스 / 워크플로우 플랫폼 개념 가이드',
    conceptSummary:
      '디지털 헬스 플랫폼은 임상·연구·환자 워크플로우를 디지털화하고, AI 모듈과 EHR 시스템을 통합하여 의료 운영 효율과 데이터 활용도를 높입니다. 규제 분류와 인터오퍼러빌리티가 핵심 과제입니다.',
    keyComponents: [
      {
        title: 'EHR/EMR 연동 (FHIR)',
        description: 'HL7 FHIR API를 통해 Epic, Cerner 등 EHR 시스템과 표준화된 데이터 교환을 구현합니다. SMART on FHIR 앱 프레임워크가 보편화되고 있습니다.',
      },
      {
        title: '임상 의사결정 지원 (CDSS)',
        description: '진단 지원, 치료 프로토콜 추천, 약물 상호작용 경고 등을 AI 기반으로 제공합니다. FDA SaMD 분류에 따른 규제 경로가 결정됩니다.',
      },
      {
        title: '원격 환자 모니터링',
        description: '웨어러블, IoT 디바이스에서 실시간 생체 데이터를 수집하고 이상 신호를 탐지합니다. FDA 510(k) 또는 De Novo 경로가 적용될 수 있습니다.',
      },
      {
        title: '워크플로우 자동화',
        description: '병리 리포트 생성, 방사선 판독 보조, 행정 업무 자동화 등 반복적 의료 업무를 자동화합니다.',
      },
    ],
    whyNow:
      'FHIR R4 표준이 정착되고 미국 21세기 치료법(21st Century Cures Act)으로 정보 차단 금지 의무화가 시행되었습니다. 한국도 마이데이터 및 전자의무기록 표준화 정책이 가속화 중입니다.',
    commonEntryPatterns: [
      '특정 임상 워크플로우(예: 투약 검토, 퇴원 요약) AI 자동화 PoC',
      'FHIR API를 통한 EHR-분석 플랫폼 통합 PoC',
      '환자 포털 / 원격 모니터링 MVP 개발',
    ],
    scopeNote:
      '이 화면은 디지털 헬스 플랫폼 논의를 위한 개념 가이드입니다. 실제 임상 시스템을 구축하거나 의료 행위를 수행하지 않습니다.',
  },
}

// ─── Screen 3: Data & Market Content ──────────────────────────────────────────

export const DATA_MARKET_CONTENT: Partial<Record<SolutionArea, DataMarketContent>> = {
  edp: {
    title: '데이터 성숙도 진단 및 EDP 도입 가이드',
    summary:
      '데이터 플랫폼 도입의 성공은 현재 데이터 성숙도에 맞는 단계별 접근에 달려 있습니다. 아래 성숙도 모델로 현재 위치를 파악하고 적합한 PoC 범위를 설정하세요.',
    maturityStages: [
      {
        stage: '초기 단계 (nascent): 분산·비구조화',
        signals: [
          '데이터가 개인 파일서버, 이메일, 로컬 Excel에 분산',
          '공식 데이터 딕셔너리 없음',
          '부서 간 데이터 공유가 수동(이메일) 의존',
        ],
        recommendation:
          '데이터 인벤토리 작성과 소규모 파이럿 통합(1~2개 데이터 소스)으로 시작. 중앙 파일 스토리지(S3/SharePoint)를 먼저 확보.',
      },
      {
        stage: '개발 중 (developing): 일부 구조화, 사일로 존재',
        signals: [
          '부서별 DB/LIMS는 있지만 통합 뷰 없음',
          'ETL 스크립트가 있지만 수동 실행·유지보수',
          '데이터 품질 점검 프로세스 불완전',
        ],
        recommendation:
          '파이프라인 자동화와 데이터 카탈로그 PoC에 집중. Airflow/dbt 기반 파이프라인 표준화. 6~8주 PoC 적합.',
      },
      {
        stage: '성숙 단계 (established): 통합 파이프라인 운영 중',
        signals: [
          '중앙 데이터 레이크 또는 웨어하우스 운영',
          '데이터 거버넌스 정책 존재',
          'BI 도구 (Tableau/Power BI) 연동 완료',
        ],
        recommendation:
          '기존 플랫폼 위에 AI/ML 레이어 추가. 벡터 스토어 연동, RAG 파이프라인 구축. AI 어시스턴트 도입 준비 완료.',
      },
    ],
    marketContext:
      '글로벌 바이오파마 데이터 플랫폼 시장은 2024년 약 $12B 규모로, CAGR 18%로 성장 중입니다. 규제 준수(FDA, EMA) 데이터 무결성 요건 강화와 AI 도입 가속이 EDP 수요를 견인하고 있습니다.',
    readinessSignals: [
      '최근 데이터 품질 문제로 인한 비즈니스 이슈 발생',
      'AI/ML 프로젝트 착수 계획 (데이터 준비 필요)',
      '규제 감사에서 데이터 계보 문제 지적',
      'M&A 또는 파트너십으로 데이터 소스 추가 예정',
    ],
  },

  structure_prediction: {
    title: '구조 기반 신약 발굴 시장 맥락',
    summary:
      'AI 기반 단백질 구조 예측은 신약 발굴 타임라인을 수년에서 수개월로 단축하는 패러다임 전환을 만들어가고 있습니다. AlphaFold DB 공개 이후 구조 기반 접근이 표준화되는 추세입니다.',
    maturityStages: [
      {
        stage: '구조 예측 입문: 공개 DB 활용',
        signals: [
          'AlphaFold DB / PDB에서 타깃 구조 검색',
          '전용 계산 인프라 없음',
          '구조 분석 전문 인력 미보유',
        ],
        recommendation:
          '공개 AlphaFold DB 구조 검색 + PyMOL/Mol* 시각화 워크숍으로 시작. 기존 GenAI 파이프라인에 구조 데이터 연결 PoC.',
      },
      {
        stage: '구조 기반 분석 파이프라인 구축',
        signals: [
          'GPU 클러스터 또는 클라우드 컴퓨팅 활용 가능',
          '컴퓨터 화학 팀 내부 존재',
          '도킹 시뮬레이션 경험 보유',
        ],
        recommendation:
          '타깃 특이적 AlphaFold 재훈련 또는 도킹 파이프라인 자동화. 구조-활성 관계(SAR) 분석 플랫폼 구축.',
      },
      {
        stage: '통합 신약 발굴 플랫폼',
        signals: [
          '구조 예측, 도킹, MD 시뮬레이션 통합 워크플로우',
          '문헌 RAG + 구조 데이터 통합 대시보드',
          'AI 기반 후보물질 생성(생성형 화학) 도입',
        ],
        recommendation:
          'Generative chemistry 플랫폼 도입 검토. 내부 합성 가능성 데이터베이스와 통합. 파트너십(CRO, 플랫폼 사) 구조 논의.',
      },
    ],
    marketContext:
      'AI 기반 신약 발굴 시장은 2024년 약 $4B, 2030년 $50B 이상 예상(CAGR 35%). Insilico Medicine, Recursion Pharmaceuticals, Exscientia 등이 이 분야를 선도하며, 빅파마의 AI 파트너십 계약이 급증하고 있습니다.',
    readinessSignals: [
      '타깃 검증 단계에서 구조 정보 활용 필요',
      '리드 최적화 기간 단축 목표',
      '컴퓨터 화학 역량 내재화 또는 외부 협력 검토 중',
      'AlphaFold DB를 이미 비정형적으로 활용 중',
    ],
  },

  genomics_pipeline: {
    title: '유전체 분석 파이프라인 도입 성숙도 가이드',
    summary:
      'NGS 기반 유전체 분석은 정밀의료의 핵심 인프라입니다. 분석 목적(연구/CDx/임상)과 데이터 유형에 따라 파이프라인 요건과 규제 경로가 달라집니다.',
    maturityStages: [
      {
        stage: '연구 목적 파이프라인',
        signals: [
          '학술/연구 목적의 WGS/WES 분석',
          '표준화된 파이프라인 없이 개별 연구자 스크립트 의존',
          '소규모 코호트 (n<100)',
        ],
        recommendation:
          'Snakemake/Nextflow 기반 재현 가능 파이프라인 표준화. GATK Best Practices 도입. 클라우드 비용 최적화(spot instance 활용).',
      },
      {
        stage: '대규모 코호트 / 바이오뱅크',
        signals: [
          '수천~수만 샘플 처리 필요',
          '파이프라인 자동화 및 모니터링 필요',
          'GWAS, 다중 오믹스 통합 분석',
        ],
        recommendation:
          '클라우드 워크플로우(Terra/Cromwell/AWS Batch) 도입. 변이 DB(gnomAD, ClinVar) 통합. 분석 결과 공유 포털 구축.',
      },
      {
        stage: '임상/CDx 파이프라인',
        signals: [
          'FDA/CE 인증 목표',
          '임상 보고서 자동 생성 필요',
          '변이 분류 ACMG 기준 준수 필요',
        ],
        recommendation:
          'CAP/CLIA 인증 요건 충족 파이프라인 설계. 변이 해석 자동화(소프트웨어 보조 분류). 규제 제출 패키지 자동 생성.',
      },
    ],
    marketContext:
      'NGS 시장은 2024년 $24B, 2030년 $50B+ 예상. 정밀의료 확산, 암 유전체 검사 보험 급여화, FDA CDx 승인 가속이 성장을 견인합니다. Illumina, Oxford Nanopore, Pacific Biosciences가 시퀀싱 플랫폼을 제공하며, Tempus, Foundation Medicine이 임상 유전체 서비스를 제공합니다.',
    readinessSignals: [
      'Targeted panel, WES, WGS 데이터 이미 보유',
      '분석 자동화로 처리량 향상 목표',
      'Variant of Uncertain Significance(VUS) 분류 자동화 필요',
      'CDx 또는 임상 유전체 서비스 출시 계획',
    ],
  },

  digital_health: {
    title: '디지털 헬스 플랫폼 도입 성숙도 가이드',
    summary:
      '디지털 헬스 플랫폼 도입은 규제 환경, 기존 IT 인프라, 사용자 유형에 따라 경로가 달라집니다. 규제 분류와 인터오퍼러빌리티 준비도가 핵심 성공 요인입니다.',
    maturityStages: [
      {
        stage: '내부 워크플로우 디지털화',
        signals: [
          '수작업 의료 프로세스(페이퍼, 팩스) 잔존',
          'EHR은 있지만 활용도 낮음',
          '부서 간 정보 단절',
        ],
        recommendation:
          '단일 고통 포인트(예: 투약 오류 감소, 방사선 보고서 자동 완성) PoC 시작. 비규제 영역(행정 자동화)에서 먼저 검증.',
      },
      {
        stage: 'FHIR 기반 통합 및 AI 도입',
        signals: [
          'EHR FHIR API 접근 가능',
          '파일럿 AI 프로젝트 1~2개 완료',
          'IT 팀과 임상팀 협력 경험 보유',
        ],
        recommendation:
          'FHIR 기반 데이터 파이프라인 구축. SMART on FHIR 앱 프레임워크 도입. 임상의사결정 지원(CDSS) PoC.',
      },
      {
        stage: '규제 인증 디지털 헬스',
        signals: [
          'FDA SaMD (Software as a Medical Device) 출시 목표',
          '임상 근거 데이터 수집 계획',
          '규제 전략팀 내부 보유',
        ],
        recommendation:
          'FDA 21 CFR Part 820, ISO 13485 요건 충족 SDLC 구축. 임상 유효성 평가 계획 수립. AI/ML 기반 SaMD Pre-Submission 전략.',
      },
    ],
    marketContext:
      '글로벌 디지털 헬스 시장은 2024년 $330B+로, CAGR 18%. AI 기반 의사결정 지원, 원격 환자 모니터링, 정밀의료 플랫폼이 핵심 성장 동력. 한국은 디지털 헬스케어 특별법(2024), 마이데이터 정책이 시장을 가속하고 있습니다.',
    readinessSignals: [
      'EHR 현대화 또는 교체 프로젝트 진행 중',
      '임상 데이터 분석팀 신설 또는 강화 계획',
      '원격의료 또는 홈케어 서비스 확장 목표',
      '환자 경험 향상을 위한 디지털 채널 구축 필요',
    ],
  },
}
