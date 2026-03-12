import type { SolutionArea, KPIItem, WeekScope } from '../types'

// ─── Non-GenAI PoC Framework ──────────────────────────────────────────────────
// Screen 4 (PoC 설계)용 비GenAI 솔루션 영역 PoC 프레임워크

export interface NonGenAIPoCProposal {
  solutionArea: SolutionArea
  areaLabel: string
  problemDefinition: string
  whyAI: string
  whyNow: string
  solutionPattern: string
  solutionDescription: string
  sixWeekScope: WeekScope[]
  kpis: KPIItem[]
  dataNeeded: {
    public: string[]
    internal: string[]
    extension: string[]
  }
  risks: { risk: string; guardrail: string }[]
  conceptNote?: string  // "개념 논의" 경로에 대한 면책 문구
}

const NON_GENAI_POC_MAP: Partial<Record<SolutionArea, NonGenAIPoCProposal>> = {
  edp: {
    solutionArea: 'edp',
    areaLabel: '엔터프라이즈 데이터 플랫폼 PoC',
    problemDefinition:
      '내부 연구·임상·규제 데이터가 다수 사일로에 분산되어 있으며, 통합 분석 및 AI 도입을 위한 데이터 접근 레이어가 부재한 상태입니다. 데이터 파이프라인 자동화와 거버넌스 체계 구축이 선행 과제입니다.',
    whyAI:
      '단순 데이터 이동이 아닌, AI/ML 모델 서빙을 위한 Feature Store, 실시간 데이터 품질 모니터링, 메타데이터 기반 자동 분류 등이 현대 EDP의 핵심 가치이기 때문입니다. 데이터 플랫폼 없이 AI 프로젝트는 반복적으로 데이터 전처리에서 병목을 겪습니다.',
    whyNow:
      '클라우드 관리형 데이터 레이크(AWS Lake Formation, Azure Purview, Databricks Unity Catalog)가 성숙 단계에 진입했고, 초기 구축 비용이 2020년 대비 60~70% 낮아졌습니다. 동시에 규제 기관(FDA, EMA)의 데이터 무결성 요건 강화로 EDP 투자가 리스크 관리 측면에서도 필수화되고 있습니다.',
    solutionPattern: '데이터 파이프라인 & 거버넌스 PoC',
    solutionDescription:
      '핵심 데이터 소스 2~3개를 대상으로 수집-정제-카탈로그-거버넌스 파이프라인을 구축하고, 이후 AI 어시스턴트 또는 BI 도구 연동 가능성을 검증합니다.',
    sixWeekScope: [
      { week: 1, title: '데이터 소스 인벤토리', description: '핵심 데이터 소스 목록 작성, 형식/볼륨/접근 권한 정리, PoC 범위 2~3개 소스 확정' },
      { week: 2, title: '파이프라인 설계 및 구축', description: '수집 커넥터 개발, ETL/ELT 파이프라인 초안 구현, 클라우드 스토리지 환경 설정' },
      { week: 3, title: '데이터 품질 기준 수립', description: '데이터 프로파일링, 품질 규칙 정의, 메타데이터 카탈로그 초안 작성' },
      { week: 4, title: '거버넌스 레이어 구성', description: '역할 기반 접근 제어(RBAC) 구현, 데이터 계보 추적 설정, 감사 로그 활성화' },
      { week: 5, title: '통합 검증 및 SME 리뷰', description: '비즈니스 사용자 대상 데이터 접근 테스트, 품질 지표 검토, 사용성 피드백 수집' },
      { week: 6, title: 'KPI 측정 및 확장 로드맵', description: '파이프라인 지연 시간·신뢰도 KPI 측정, 추가 데이터 소스 및 AI 연동 로드맵 제시' },
    ],
    kpis: [
      { metric: '데이터 접근 시간', target: '80% 감소 (수일 → 수분)', baseline: '현재 데이터 요청-응답 평균 3~5 영업일' },
      { metric: '파이프라인 신뢰도', target: '99% 이상 성공률', baseline: '현재 수동 이관 오류율 15~20%' },
      { metric: '데이터 카탈로그 커버리지', target: 'PoC 범위 내 100%', baseline: '현재 공식 메타데이터 없음' },
    ],
    dataNeeded: {
      public: ['규제 표준 문서 (ICH 가이드라인, FDA 데이터 표준)', 'FAIR 데이터 원칙 프레임워크', '클라우드 벤더 레퍼런스 아키텍처'],
      internal: ['데이터 소스 목록 및 형식 명세', '현재 ETL 스크립트 (있는 경우)', '데이터 볼륨 및 접근 권한 구조'],
      extension: ['추가 데이터 소스(3개 이상) 통합', 'AI/ML 모델 서빙 레이어 연동', 'BI 대시보드(Tableau/Power BI) 통합'],
    },
    risks: [
      { risk: '기존 시스템 API 문서 부재 → 수집 커넥터 개발 지연', guardrail: '소스 시스템 담당자 인터뷰를 Week 1에 완료, 문서화 선행' },
      { risk: '데이터 보안 요건으로 클라우드 이관 차단', guardrail: '온프레미스 레이크 또는 프라이빗 클라우드 옵션 병행 설계' },
      { risk: '데이터 품질이 예상보다 낮아 정제 범위 급증', guardrail: 'Week 2에 데이터 프로파일링 먼저 수행, PoC 범위 재조정 게이트 포함' },
      { risk: '거버넌스 정책 합의 지연 (부서 간 소유권 분쟁)', guardrail: 'Steering Committee 또는 데이터 거버넌스 위원회 Week 1에 구성' },
    ],
  },

  structure_prediction: {
    solutionArea: 'structure_prediction',
    areaLabel: '단백질 구조 예측 파트너십 PoC',
    problemDefinition:
      '타깃 단백질의 3D 구조 정보 확보 및 결합 포켓 분석이 신약 발굴 초기 단계의 병목입니다. 기존 X선 결정학 방법의 비용/시간 대비 AlphaFold 계열 AI 구조 예측의 적용 가능성을 평가하고 워크플로우를 설계합니다.',
    whyAI:
      'AlphaFold2/3는 기존 X선 결정학 대비 100배 이상 빠르게 3D 구조를 예측하며, AlphaFold DB에 2억 개 이상의 구조가 공개되어 있습니다. 이제 구조 기반 신약 발굴은 대규모 컴퓨팅 자원 없이도 시작 가능합니다.',
    whyNow:
      'AlphaFold3(2024)가 단백질-소분자 상호작용 예측까지 확장되었고, RoseTTAFold All-Atom이 다분자 복합체 예측을 지원합니다. 구조 예측의 정확도와 활용 범위가 급격히 확대된 시점입니다.',
    solutionPattern: '구조 기반 타깃 인사이트 파이럿',
    solutionDescription:
      '타깃 단백질에 대해 AlphaFold DB 구조 검색 → 시각화 → 결합 포켓 분석 → 문헌 근거 연결까지의 워크플로우를 파이럿으로 검증합니다. 직접 AlphaFold를 실행하지 않고 공개 API/DB를 활용합니다.',
    sixWeekScope: [
      { week: 1, title: '타깃 정의 및 공개 구조 검색', description: '타깃 단백질 목록 확정, AlphaFold DB / PDB에서 구조 검색, 결과물 검토' },
      { week: 2, title: '구조 시각화 및 결합 포켓 분석', description: 'PyMOL/Mol* 시각화, 결합 포켓 예측(FPocket), 기존 리간드와 비교 분석' },
      { week: 3, title: '문헌 근거 연결', description: '구조 데이터 + PubMed 논문 연결 파이프라인 구축, 타깃 인사이트 카드 프로토타입' },
      { week: 4, title: '결합 분석 및 선택적 도킹', description: '관심 소분자 도킹 파이럿(AutoDock Vina), 결합 친화도 예측 결과 정리' },
      { week: 5, title: 'SME 검토 및 워크플로우 정제', description: '약화학자·구조생물학자 피드백 반영, 워크플로우 개선, 발견 사항 정리' },
      { week: 6, title: '로드맵 및 파트너십 논의', description: 'PoC 결과 발표, 확장 로드맵(자체 구축 vs 파트너십), 다음 단계 제안' },
    ],
    kpis: [
      { metric: '타깃당 구조 분석 소요 시간', target: '5일 이하', baseline: '기존 X선 결정학 3~12개월' },
      { metric: 'AlphaFold DB 커버리지', target: '타깃 목록 80% 이상 구조 확보', baseline: '현재 공개 구조 보유율 미파악' },
      { metric: '구조-문헌 연결 자동화율', target: '타깃당 관련 논문 10편 이상 자동 연결', baseline: '현재 수동 검색' },
    ],
    dataNeeded: {
      public: ['AlphaFold DB (alphafold.ebi.ac.uk)', 'Protein Data Bank (PDB)', 'UniProt 단백질 서열 데이터베이스'],
      internal: ['타깃 단백질 서열 목록 또는 PDB ID', '기존 구조 데이터 (있는 경우)', '관심 소분자 / 리간드 목록'],
      extension: ['자체 AlphaFold 추론 인프라 구축', 'MD 시뮬레이션 파이프라인 연동', '생성형 화학(generative chemistry) 플랫폼 연결'],
    },
    risks: [
      { risk: 'AlphaFold 예측 정확도가 특정 타깃에서 낮음', guardrail: '다중 구조 예측 도구 비교(AlphaFold + RoseTTAFold), 실험 데이터와 교차 검증' },
      { risk: '도킹 결과의 실제 결합 친화도와의 상관관계 불확실', guardrail: '도킹 결과를 스크리닝 우선순위 도구로만 활용, 실험 검증 필수 명시' },
      { risk: '내부 구조생물학 전문 인력 부재', guardrail: 'CRO 파트너십 또는 외부 전문가 협력 모델 Week 1에 확정' },
    ],
    conceptNote:
      '본 PoC 제안은 개념 설계 가이드입니다. 본 앱은 AlphaFold를 실행하거나 단백질 구조를 생성하지 않습니다. 실제 구현은 외부 플랫폼 또는 전문 파트너사와의 협력을 통해 진행됩니다.',
  },

  genomics_pipeline: {
    solutionArea: 'genomics_pipeline',
    areaLabel: '유전체 분석 파이프라인 PoC',
    problemDefinition:
      'NGS 데이터 분석이 수작업 또는 표준화되지 않은 스크립트에 의존하여 재현성과 처리 속도에 한계가 있습니다. 표준화된 변이 콜링 파이프라인 구축과 분석 자동화가 핵심 과제입니다.',
    whyAI:
      'AI 기반 변이 콜러(DeepVariant)는 전통적 GATK 대비 특히 복잡 게놈 영역에서 정확도가 높고, Transformer 기반 모델이 변이 해석(병원성 예측)의 정확도를 지속 향상시키고 있습니다.',
    whyNow:
      'WGS 비용이 $1,000 이하로 진입하고, AWS Genomics CLI, Google Cloud Life Sciences 등 클라우드 기반 파이프라인이 성숙해 소규모 조직에서도 대규모 유전체 분석이 가능해졌습니다.',
    solutionPattern: 'NGS 변이 분석 자동화 파이프라인',
    solutionDescription:
      '특정 시퀀싱 유형(WES 또는 Targeted Panel)에 대해 QC → 정렬 → 변이 콜링 → 어노테이션까지 자동화 파이프라인을 구축하고, 분석 보고서 자동 생성을 검증합니다.',
    sixWeekScope: [
      { week: 1, title: '데이터 가용성 평가 및 파이프라인 설계', description: '시퀀싱 데이터 샘플 확보, 분석 범위(패널/WES/WGS) 확정, 클라우드 환경 설정' },
      { week: 2, title: 'QC 및 정렬 파이프라인 구현', description: 'FastQC → Trimmomatic → BWA-MEM2/STAR 파이프라인, 레퍼런스 지놈(hg38/GRCh38) 설정' },
      { week: 3, title: '변이 콜링 파이프라인', description: 'GATK HaplotypeCaller 또는 DeepVariant 구현, 변이 필터링 기준 적용, GVCF 처리' },
      { week: 4, title: '어노테이션 및 해석', description: 'VEP 또는 ANNOVAR 어노테이션, ClinVar/gnomAD 대조, 변이 분류(ACMG 기준) 자동화' },
      { week: 5, title: '보고서 생성 및 SME 검토', description: '분석 보고서 자동 생성 프로토타입, 임상/연구 팀 피드백, 분류 정확도 검증' },
      { week: 6, title: 'KPI 측정 및 확장 로드맵', description: '처리 속도·정확도 KPI 측정, 추가 적응증 확장 계획, 프로덕션 전환 로드맵' },
    ],
    kpis: [
      { metric: '샘플당 분석 처리 시간', target: '4시간 이내 (WES 기준)', baseline: '현재 수작업 2~5일' },
      { metric: '변이 콜링 재현성', target: '동일 샘플 재실행 시 99% 일치율', baseline: '현재 재현성 체계 없음' },
      { metric: '보고서 자동 생성률', target: '80% 이상 자동 완성', baseline: '현재 100% 수작업' },
    ],
    dataNeeded: {
      public: ['hg38/GRCh38 레퍼런스 지놈', 'ClinVar 변이 데이터베이스', 'gnomAD 집단 주파수 데이터베이스'],
      internal: ['샘플 FASTQ/BAM 파일', '기존 분석 결과물(비교 기준)', '임상 메타데이터(샘플-환자 매핑)'],
      extension: ['scRNA-seq / 다중 오믹스 통합 분석', 'CDx 규제 제출 패키지 자동화', 'FDA 변이 해석 데이터베이스 연동'],
    },
    risks: [
      { risk: '내부 IT 보안 정책으로 클라우드 데이터 업로드 차단', guardrail: '온프레미스 컨테이너(Nextflow + Singularity) 옵션 병행 설계' },
      { risk: 'FASTQ 데이터 품질이 낮아 파이프라인 수율 저하', guardrail: 'Week 1에 데이터 품질 사전 평가, 재시퀀싱 기준 확립' },
      { risk: '변이 해석 자동화의 임상적 유효성 불확실', guardrail: '파이프라인 출력을 보조 도구로만 포지셔닝, 임상 전문가 최종 검토 워크플로우 포함' },
    ],
    conceptNote:
      '본 PoC 제안은 개념 설계 가이드입니다. 본 앱은 유전체 분석을 실행하거나 변이 해석 결과를 생성하지 않습니다. 실제 구현은 전문 바이오인포매틱스 팀 또는 파트너사와 협력하여 진행됩니다.',
  },

  digital_health: {
    solutionArea: 'digital_health',
    areaLabel: '디지털 헬스 워크플로우 PoC',
    problemDefinition:
      '특정 임상 또는 연구 워크플로우가 수작업 또는 비효율적인 도구에 의존하고 있으며, 디지털화 및 AI 자동화를 통해 운영 효율과 데이터 품질을 향상할 수 있는 기회가 존재합니다.',
    whyAI:
      'NLP 기반 임상 문서 자동화, 이미지 AI(방사선·병리), 예측 모델 기반 위험 계층화 등이 임상 워크플로우의 반복적 병목을 해소할 수 있습니다. 특히 FHIR 표준화로 데이터 통합 비용이 크게 낮아졌습니다.',
    whyNow:
      '미국 21세기 치료법(2021)과 한국 마이데이터 정책으로 EHR 상호운용성 의무화가 진행 중입니다. SMART on FHIR 앱 프레임워크가 성숙해 EHR 벤더 종속 없이 임상 앱 개발이 가능해졌습니다.',
    solutionPattern: '임상 워크플로우 디지털화 MVP',
    solutionDescription:
      '단일 고통 포인트(예: 방사선 보고서 초안 생성, 퇴원 요약 자동화)를 선정하여 FHIR 기반 데이터 연동 → AI 처리 → 사용자 인터페이스까지의 MVP를 구축합니다.',
    sixWeekScope: [
      { week: 1, title: '워크플로우 매핑 및 사용 사례 확정', description: '현재 워크플로우 문서화, 사용자 인터뷰(의료진/연구팀), PoC 단일 사용 사례 선정' },
      { week: 2, title: '데이터 플로우 설계 및 FHIR 연동', description: 'EHR FHIR API 탐색, 필요 리소스 타입(Patient, Encounter, Observation 등) 정의, 테스트 환경 구성' },
      { week: 3, title: 'AI 모듈 구현', description: 'NLP 모델 또는 LLM 기반 자동화 모듈 구현, 임상 용어 처리, 출력 구조 정의' },
      { week: 4, title: '사용자 인터페이스 프로토타입', description: '임상의/연구자 포털 UI 구현, AI 출력 표시, 피드백 버튼(승인/거부) 포함' },
      { week: 5, title: '임상 사용자 파일럿 테스트', description: '소규모 사용자 그룹 파일럿, 워크플로우 인터럽션 최소화 검증, 사용성 피드백 수집' },
      { week: 6, title: 'KPI 측정 및 확장 계획', description: '시간 절감·정확도 KPI 측정, 규제 분류 재검토, 프로덕션 전환 및 추가 사용 사례 로드맵' },
    ],
    kpis: [
      { metric: '워크플로우 처리 시간', target: '50% 이상 단축', baseline: '현재 임상 문서 작성 평균 시간 측정 후 기준 설정' },
      { metric: '사용자 채택률', target: '4주 후 파일럿 그룹 70% 이상 활용', baseline: '새 도구 채택률 통상 50% 이하 (Week 4 기준)' },
      { metric: '데이터 완전성', target: '필수 임상 필드 95% 이상 자동 완성', baseline: '현재 수동 입력 누락률 20~30%' },
    ],
    dataNeeded: {
      public: ['HL7 FHIR R4 표준 명세', 'SNOMED CT / ICD-10 임상 용어 체계', 'SMART on FHIR 앱 프레임워크'],
      internal: ['EHR 시스템 FHIR API 엔드포인트', '파일럿 사용자 그룹 (5~10명)', '현재 워크플로우 SOP 문서'],
      extension: ['추가 임상 사용 사례 확장', '원격 모니터링(RPM) 디바이스 연동', 'FDA SaMD 규제 제출 패키지'],
    },
    risks: [
      { risk: 'EHR 벤더가 FHIR API 접근을 제한', guardrail: 'HL7 FHIR 샌드박스 환경에서 먼저 개발, 실제 EHR 연동은 Phase 2로 분리' },
      { risk: 'AI 출력의 임상적 안전성 검증 요건', guardrail: '"AI 보조 도구" 포지셔닝 유지, 최종 결정은 의료진이 수행하는 워크플로우 설계' },
      { risk: '규제 분류(SaMD) 상향으로 인증 요건 증가', guardrail: 'Week 1에 법무/규제팀과 사전 분류 검토, 범위를 낮은 위험도 사용 사례로 제한' },
    ],
  },
}

// ─── Public API ────────────────────────────────────────────────────────────────

export function getNonGenAIPoCProposal(area: SolutionArea): NonGenAIPoCProposal | null {
  return NON_GENAI_POC_MAP[area] ?? null
}
