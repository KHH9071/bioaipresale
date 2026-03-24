import type { PresalesScenario, BottleneckScenarioId } from './types'

// ─── 4 Presales Bottleneck Scenarios ─────────────────────────────────────────
// 각 시나리오는 기존 5탭 위에 얹히는 "presales 병목 프레임"이며
// 탭별 콘텐츠를 시나리오 문맥으로 해석·보강하는 데 사용됩니다.

const SCENARIOS: PresalesScenario[] = [
  // ── 시나리오 1 ────────────────────────────────────────────────────────────
  {
    id: 'undruggable_target',
    title: '공략 불가 표적 / 단백질 분해 전략',
    shortLabel: '공략 불가 표적 / 단백질 분해',
    category: '신약 발굴 병목',
    bottleneckSummary:
      '저분자 억제제로 공략이 어려운 표적에서 degrader/PROTAC 전략 기회를 빠르게 탐색하려 하지만, 문헌·특허·기전 정보가 분산되어 있어 병목이 발생합니다.',
    tags: ['undruggable', 'PROTAC', 'degrader', 'target triage', 'literature synthesis', 'KRAS', 'MYCN'],
    presetInput: {
      disease: 'KRAS-mutant non-small cell lung cancer',
      target: 'KRAS G12C',
      drug: 'PROTAC / Molecular glue degrader',
      objective: 'literature_intelligence',
      region: 'Global',
      timeYears: 5,
      problemDomain: 'literature_regulatory',
      dataMaturity: 'developing',
    },
    tabContent: {
      overview: {
        customerRequest:
          '"KRAS 변이에서 기존 억제제의 한계를 넘는 새로운 접근을 더 빠르게 탐색하고 싶습니다."',
        rootProblem:
          '저분자 억제제는 shallow/disordered pocket 문제로 공략이 어렵고, degrader/분자 접착제 전략으로의 전환을 검토하려 해도 관련 문헌·특허·기전 데이터가 여러 소스에 분산되어 있어 탐색·통합에 많은 시간이 소요됩니다.',
        whyNow:
          'Sotorasib·Adagrasib 이후 내성 기전이 확인되면서 다음 전략으로의 전환 압력이 커졌습니다. 동시에 PROTAC/분자 접착제 데이터가 폭발적으로 증가해, 수동 탐색만으로는 경쟁 우위를 유지하기 어렵습니다.',
        opportunityNote:
          '문헌 인텔리전스 PoC로 degrader 전략 탐색 속도를 높이고, 고객 내부 가설 수립 사이클을 단축할 수 있는 명확한 기회입니다.',
        aiOpportunities: [
          'Evidence aggregation — 분산된 PubMed·특허·preprint 데이터를 단일 검색 레이어로 통합',
          'Target-context mapping — 표적-기전-적응증 연결 관계를 구조화',
          'Degrader strategy framing — literature 기반 degrader/PROTAC 접근법 비교·우선순위화',
          'Resistance signal monitoring — 내성 기전 출현 신호 조기 포착',
        ],
      },
      evidence: {
        signalNote:
          '문헌 신호가 핵심입니다. KRAS G12C 억제제 및 degrader 관련 논문은 최근 5년간 급증했으며, 임상시험 신호보다 문헌/preprint 신호가 앞서 있습니다.',
        aiOpportunities: [
          '논문 클러스터링으로 degrader·PROTAC 전략별 근거 수준 비교',
          '기전 키워드(ubiquitin-proteasome, E3 ligase, ternary complex) 중심 탐색',
          '내성 기전 논문 군집 식별 → 차세대 전략 공백 탐색',
        ],
        searchHint:
          '검색 시 "PROTAC", "degrader", "molecular glue", "resistance mechanism" 키워드를 포함하면 더 관련성 높은 문헌을 탐색할 수 있습니다.',
      },
      trials: {
        signalMode: 'moderate',
        signalNote:
          '저분자 억제제(Sotorasib·Adagrasib) 임상시험은 풍부하지만, PROTAC/degrader 기반 임상시험은 아직 초기 단계(Phase I 소수)입니다. 임상 신호보다 문헌·플랫폼 신호가 이 시나리오의 핵심입니다.',
        guidance:
          '임상 데이터는 경쟁 구도 파악과 내성 패턴 분석에 활용하되, PoC의 핵심 가치는 임상 이전 단계의 문헌 인텔리전스에 집중하는 것이 적절합니다.',
      },
      poc: {
        objective:
          '분산된 degrader/PROTAC 관련 문헌·특허 데이터를 통합 검색·합성해 내부 가설 수립 속도를 높이는 Literature Intelligence PoC 검증',
        inScope: [
          'PubMed·preprint·특허 공개 데이터 기반 검색 및 클러스터링',
          '표적-기전-적응증 연결 관계 매핑',
          'Degrader 전략 유형별(PROTAC·분자 접착제·autophagy degrader) 근거 수준 비교',
          '내성 기전 관련 논문 군집 식별',
        ],
        outOfScope: [
          '신약 설계·분자 최적화 (in silico design은 별도 PoC)',
          '내부 임상·전임상 데이터 통합 (PoC 이후 확장 단계)',
          '안전성·독성 평가',
          '규제 제출용 근거 생성',
        ],
        successKpis: [
          '문헌 탐색 시간 60% 이상 단축 (기준: 수동 검색 대비)',
          '가설 후보 논문 정확도 — 전문가 평가 Top-10 논문 중 7개 이상 일치',
          '6주 내 degrader 전략 비교 요약 초안 1건 생성',
        ],
        riskNote:
          '공개 데이터만으로는 내부 전임상 근거와 격차가 있을 수 있습니다. 전문가 검토 게이트를 통해 AI 출력이 내부 의사결정의 보조 도구임을 명확히 해야 합니다.',
      },
      architecture: {
        highlightedComponents: [
          'PubMed + preprint + 특허 공개 DB — 핵심 소스 레이어',
          '메타데이터 정규화 — 표적·기전·적응증 용어 통일',
          '하이브리드 검색 인덱스 — 시맨틱+키워드 병합',
          '전문가 검토 게이트 — AI 출력 → 내부 SME 검토 필수',
          'Proposal flow 출력 — 고객 가설 초안 지원',
        ],
        deliveryNote:
          '6주 PoC는 공개 데이터 기반으로 설계합니다. 특허 DB 연동이 필요할 경우 라이선스 검토 후 확장 단계에서 진행합니다. 전문가 검토 없는 자동 출력은 PoC 단계에서 허용하지 않습니다.',
        governanceNote:
          '모든 근거 출력은 PubMed PMID·특허 번호 기반 출처를 포함합니다. 신약 설계 권고로 오인될 수 있는 표현은 UI 수준에서 차단합니다.',
      },
    },
  },

  // ── 시나리오 2 ────────────────────────────────────────────────────────────
  {
    id: 'rwd_autoimmune',
    title: 'RWD 이질성 / 자가면역 치료 최적화',
    shortLabel: 'RWD 이질성 / 자가면역 치료',
    category: '임상 데이터 병목',
    bottleneckSummary:
      'RWD·EMR이 파편화되어 있고 자가면역 환자의 이질성이 높아, 치료 반응 예측과 switching 전략 수립이 체계적으로 이뤄지지 못하고 있습니다.',
    tags: ['RWD', 'EMR', 'patient stratification', 'treatment switching', 'autoimmune', 'JAK', 'TNF', 'response prediction'],
    presetInput: {
      disease: 'Rheumatoid arthritis',
      target: 'TNF-α / JAK1-2',
      drug: 'Baricitinib / Adalimumab',
      objective: 'scientific_qa',
      region: 'Global',
      timeYears: 5,
      problemDomain: 'data_infrastructure',
      dataMaturity: 'developing',
    },
    tabContent: {
      overview: {
        customerRequest:
          '"류마티스 관절염 환자에서 바이오로직·JAK 억제제 치료 반응을 더 정확하게 예측하고 switching 시점을 최적화하고 싶습니다."',
        rootProblem:
          'RCT와 실제 진료 데이터 간의 간극이 크고, EMR·청구·레지스트리 데이터가 파편화되어 환자 이질성을 체계적으로 분석하기 어렵습니다. 바이오시밀러 경쟁이 치열해지면서 치료 선택 실패 비용이 높아지고 있습니다.',
        whyNow:
          '바이오시밀러 진입으로 차별화 압력이 증가했고, 각국 보건 당국이 RWE 기반 의사결정을 점점 더 요구하고 있습니다. AI 기반 환자 세분화 솔루션의 성숙도도 높아졌습니다.',
        opportunityNote:
          '데이터 통합 + 환자 세분화 + 반응 예측 워크플로우를 PoC로 검증하면 실제 진료 환경에서의 차별화된 의사결정 지원 가치를 입증할 수 있습니다.',
        aiOpportunities: [
          'Patient stratification — 치료 반응군·비반응군 세분화',
          'Response prediction — 바이오마커 기반 반응 예측 모델',
          'Longitudinal view — EMR 기반 장기 치료 패턴 추적',
          'Switching risk scoring — 치료 전환 리스크 정량화',
        ],
      },
      evidence: {
        signalNote:
          '문헌 신호는 강합니다. JAK 억제제·바이오로직 비교 RCT 및 RWE 연구가 풍부하며, 환자 세분화·예측 모델 관련 논문이 최근 급증하고 있습니다.',
        aiOpportunities: [
          'RWE 연구 군집화 — 실제 진료 vs RCT 간극 정량화',
          '환자 특성-반응군 연결 관계 문헌 합성',
          'Subgroup analysis 관련 논문 우선 탐색',
        ],
        searchHint:
          '"real-world evidence", "treatment switching", "patient stratification", "JAK inhibitor response" 키워드로 탐색하면 시나리오에 높은 관련성을 가진 논문을 찾을 수 있습니다.',
      },
      trials: {
        signalMode: 'strong',
        signalNote:
          '임상시험 신호가 강합니다. RA·JAK 억제제 관련 Phase II~III 임상시험 데이터가 풍부하며, 복수의 스폰서가 활발히 연구 중입니다. 다만 RWD 이질성 문제는 임상시험 데이터보다 EMR·레지스트리 데이터에서 더 명확히 드러납니다.',
        guidance:
          '임상시험 데이터는 경쟁 구도와 승인 근거 파악에 유용합니다. PoC의 핵심 차별화는 RCT 대상군 밖 환자에서의 실제 반응 예측이므로, 내부 EMR 데이터 연동 가능성 탐색이 병행되어야 합니다.',
      },
      poc: {
        objective:
          '파편화된 공개 RWE 근거를 통합 검색·합성해 환자 세분화 프레임을 구조화하고, 내부 데이터 연동 후 반응 예측 워크플로우로 확장 가능한 기반을 구축합니다.',
        inScope: [
          '공개 RWE·RCT 문헌 통합 검색 및 환자 특성별 군집화',
          '치료 반응군/비반응군 관련 바이오마커 신호 합성',
          '치료 전환(switching) 패턴 문헌 요약',
          'PoC 데이터 파이프라인 설계 (공개 데이터 기반)',
        ],
        outOfScope: [
          '내부 EMR·청구 데이터 직접 연동 (PoC 이후 확장)',
          '예측 모델 실 운영 및 임상 의사결정 적용',
          '개인정보 처리·HIPAA/GDPR 준수 인프라 구축',
          '바이오시밀러 경제성 분석',
        ],
        successKpis: [
          '환자 세분화 관련 문헌 탐색 시간 50% 단축',
          '치료 반응 예측 관련 공개 근거 요약 보고서 6주 내 산출',
          'PoC 데이터 파이프라인 설계 완료 후 내부 데이터 연동 feasibility 평가',
        ],
        riskNote:
          '공개 데이터만으로는 실제 환자 이질성의 전체 범위를 포착하기 어렵습니다. PoC는 근거 합성과 파이프라인 설계에 집중하고, 예측 모델의 임상적 유효성은 내부 데이터 연동 이후에 검증합니다.',
      },
      architecture: {
        highlightedComponents: [
          '구조화 데이터(EMR·청구·레지스트리) 통합 레이어 — PoC 이후 핵심 확장 포인트',
          '반정형 데이터(논문·가이드라인) 처리 파이프라인',
          'Governed analytics — 데이터 접근 제어 및 감사 로깅',
          'ML 세분화 모듈 — 공개 데이터 학습 → 내부 데이터 fine-tuning 경로',
        ],
        deliveryNote:
          'PoC는 공개 RWE 문헌 기반으로 시작합니다. 내부 EMR 연동은 데이터 거버넌스 협의 후 2단계에서 진행합니다. GDPR/HIPAA 준수 프레임은 내부 데이터 연동 전에 설계합니다.',
        governanceNote:
          '환자 수준 데이터는 PoC 범위 외입니다. 공개 데이터 분석 결과는 집계 수준으로만 제공하며, 개별 환자 식별이 가능한 출력은 허용하지 않습니다.',
      },
    },
  },

  // ── 시나리오 3 ────────────────────────────────────────────────────────────
  {
    id: 'mutation_agnostic',
    title: '돌연변이 의존 확장성 한계 / 편집 전략',
    shortLabel: '돌연변이 의존 한계 / 편집 전략',
    category: '플랫폼 전략 병목',
    bottleneckSummary:
      '돌연변이마다 별도 치료를 설계하는 방식의 확장성 한계를 공통 기전축·편집 전략으로 우회하려 하지만, 근거 합성과 후보 우선순위화가 체계적으로 이뤄지지 않고 있습니다.',
    tags: ['mutation-agnostic', 'gene editing', 'exon skipping', 'base editing', 'common pathway', 'DMD', 'scalability'],
    presetInput: {
      disease: 'Duchenne Muscular Dystrophy',
      target: 'Dystrophin / Exon 51',
      drug: 'Base editing / Exon skipping',
      objective: 'scientific_qa',
      region: 'Global',
      timeYears: 5,
      problemDomain: 'drug_discovery_computational',
      dataMaturity: 'nascent',
    },
    tabContent: {
      overview: {
        customerRequest:
          '"돌연변이 유형마다 다른 치료를 개발하는 것은 한계가 있습니다. 더 확장 가능한 공통 접근이 필요합니다."',
        rootProblem:
          '돌연변이별 개발 전략은 환자 수가 적은 적응증에서 경제성이 낮고, 승인을 받더라도 커버 범위가 제한적입니다. 공통 병인축·편집 기반 접근을 탐색하려 해도, 이를 뒷받침하는 근거가 여러 플랫폼과 학술지에 분산되어 있습니다.',
        whyNow:
          '유전자 편집(base editing·prime editing) 기술이 임상 적용 가능 수준으로 성숙했습니다. FDA/EMA가 플랫폼 기반 희귀질환 치료에 우호적인 신호를 보이고 있으며, 경쟁사들이 mutation-agnostic 포지셔닝을 빠르게 선점하고 있습니다.',
        opportunityNote:
          'AI 기반 공통 경로 탐색·후보 우선순위화로 연구 초기 단계의 의사결정 속도를 높이는 것이 핵심 기회입니다. 임상 이전 단계의 hypothesis support가 적합한 PoC 범위입니다.',
        aiOpportunities: [
          'Common pathway framing — 돌연변이 유형 간 공유 병인 경로 탐색',
          'Candidate prioritization — 편집 전략 후보 우선순위화 (근거 수준 기반)',
          'Delivery consideration mapping — 전달 전략(AAV, LNP, 나노입자)별 적용 맥락 정리',
          'Evidence synthesis — 플랫폼별 전임상·임상 근거 통합 요약',
        ],
      },
      evidence: {
        signalNote:
          '문헌·플랫폼 신호가 중심입니다. 임상시험 데이터보다 전임상 연구·플랫폼 검증 논문이 앞서 있으며, 편집 기술별(base editing vs exon skipping) 근거 수준 차이가 큽니다.',
        aiOpportunities: [
          '편집 기술 유형별 논문 군집화 — 근거 성숙도 지도 작성',
          '공통 병인 경로 관련 키워드(dystrophin, exon, splice, pathway) 탐색',
          'Delivery modality 관련 전임상 논문 필터링',
        ],
        searchHint:
          '"mutation-agnostic", "exon skipping", "base editing", "prime editing", "common pathway", "delivery vector" 키워드를 조합하면 시나리오에 적합한 문헌을 탐색할 수 있습니다.',
      },
      trials: {
        signalMode: 'limited',
        signalNote:
          '임상시험 신호는 현재 제한적입니다. 기존 엑손 스키핑(예: Eteplirsen)의 임상 데이터는 있지만, base editing·prime editing 기반 mutation-agnostic 접근법은 대부분 전임상 또는 초기 Phase I 단계입니다. 이 사실을 솔직하게 전달하는 것이 신뢰를 높입니다.',
        guidance:
          '임상 데이터 부족 자체가 고객 Pain Point의 증거입니다. "임상 근거가 희박하기 때문에 빠른 문헌 합성과 플랫폼 지식 통합이 더욱 필요하다"는 방향으로 PoC를 프레이밍하는 것이 적합합니다.',
      },
      poc: {
        objective:
          '분산된 편집 전략 관련 전임상·임상 근거를 통합 탐색·합성해 공통 병인 경로 기반 후보 우선순위화 프레임을 구축합니다.',
        inScope: [
          'PubMed 기반 mutation-agnostic 접근법 관련 문헌 탐색 및 군집화',
          '편집 전략 유형별(base editing·exon skipping·gene replacement) 근거 수준 비교',
          '공통 병인 경로 관련 논문 합성 및 요약',
          'Delivery modality 관련 공개 전임상 근거 정리',
        ],
        outOfScope: [
          '실제 분자 편집 설계 및 최적화',
          '안전성·면역원성·전달 효율 실험 데이터 생성',
          '내부 전임상 데이터 연동 (PoC 이후)',
          '규제 제출용 문서 생성',
        ],
        successKpis: [
          '편집 전략 비교 근거 요약 보고서 6주 내 산출',
          '공통 병인 경로 후보 3개 이상 식별 (전문가 검토 확인)',
          '탐색 시간 단축 — 수동 대비 50% 이상',
        ],
        riskNote:
          '이 영역은 과학적 불확실성이 높습니다. AI 출력이 "전략 결론"이 아닌 "가설 지지 근거"임을 명확히 프레이밍해야 합니다. 전문가 검토 없는 자동 권고는 PoC 단계에서 제공하지 않습니다.',
      },
      architecture: {
        highlightedComponents: [
          '다중 소스 지식 통합 — PubMed + bioRxiv + 플랫폼 공개 데이터',
          '분야별 용어 정규화 — 편집 기술·경로 명칭 통일',
          '전문가 검토 게이트 — 높은 과학적 불확실성 반영 필수',
          '가설 지지 출력 — "결론"이 아닌 "근거" 제공 명시',
        ],
        deliveryNote:
          '과학적 불확실성이 높은 영역이므로 모든 출력에 근거 수준(전임상/임상/리뷰)을 명시합니다. PoC는 "무엇을 알고 있는가"와 "무엇이 아직 불확실한가"를 함께 보여주는 구조로 설계합니다.',
        governanceNote:
          '편집 기술 관련 출력은 신약 설계 권고로 오인될 수 있어 명확한 비진단·비처방 면책 문구가 필수입니다. 모든 근거에 출처를 포함합니다.',
      },
    },
  },

  // ── 시나리오 4 ────────────────────────────────────────────────────────────
  {
    id: 'off_target_toxicity',
    title: '전신 독성 한계 / 국소 스마트 전달',
    shortLabel: '전신 독성 / 스마트 전달 전략',
    category: '전달 전략 병목',
    bottleneckSummary:
      '효능은 검증된 후보가 전신 독성 때문에 개발이 막힌 상황에서, 국소·스마트 전달 전략으로 재구성하기 위한 데이터/AI 지원이 필요합니다.',
    tags: ['off-target toxicity', 'smart delivery', 'LNP', 'ADC', 'nanoparticle', 'local release', 'formulation', 'TME'],
    presetInput: {
      disease: 'Colorectal cancer',
      target: 'EGFR / Tumor microenvironment',
      drug: 'LNP / ADC / Local delivery system',
      objective: 'literature_intelligence',
      region: 'Global',
      timeYears: 5,
      problemDomain: 'literature_regulatory',
      dataMaturity: 'developing',
    },
    tabContent: {
      overview: {
        customerRequest:
          '"효능은 확인됐는데 전신 독성이 걸림돌입니다. 국소 전달이나 스마트 전달 전략으로 전환 가능성을 빠르게 평가하고 싶습니다."',
        rootProblem:
          '전신 투여 시 독성-효능 tradeoff가 치명적으로 작용하며, 전달 전략 전환(LNP·ADC·국소 방출)을 검토하려 해도 formulation별 근거와 독성 데이터가 분산되어 체계적 평가가 어렵습니다.',
        whyNow:
          'ADC, 지질 나노입자(LNP), 국소 방출 시스템 기술이 임상 적용 가능 수준으로 성숙했으며, 전달 최적화로 개발 실패 후보를 구제한 사례가 늘고 있습니다. 경쟁사들이 전달 전략 차별화를 빠르게 추진 중입니다.',
        opportunityNote:
          '문헌 기반 전달 전략 탐색·근거 합성으로 후보 재구성 평가 속도를 높이는 PoC가 명확한 기회입니다. Formulation 선택과 적응증별 전달 전략 매핑이 핵심 가치입니다.',
        aiOpportunities: [
          'Delivery strategy exploration — 전달 모달리티 유형별(LNP·ADC·나노입자) 근거 탐색',
          'Local release framing — 국소 방출 전략의 적응증별 적용 맥락 정리',
          'Formulation-toxicity correlation — 제형별 독성 프로파일 비교 문헌 합성',
          'Translation risk mapping — 전임상 → 임상 전환 리스크 신호 포착',
        ],
      },
      evidence: {
        signalNote:
          '문헌 신호가 강합니다. ADC·LNP·국소 전달 관련 논문이 최근 급증했으며, 적응증별 전달 전략 비교 연구도 풍부합니다. 다만 특정 후보 재구성 사례는 아직 초기 단계인 경우가 많습니다.',
        aiOpportunities: [
          '전달 모달리티별 논문 군집화 — 적응증-전달 전략 매핑',
          '독성 프로파일 관련 키워드(off-target, systemic toxicity, therapeutic window) 중심 탐색',
          'Local release 관련 전임상 논문 필터링 및 근거 수준 평가',
        ],
        searchHint:
          '"ADC", "LNP", "nanoparticle delivery", "local release", "off-target toxicity", "formulation optimization", "therapeutic index" 키워드를 활용하면 시나리오에 적합한 문헌을 탐색할 수 있습니다.',
      },
      trials: {
        signalMode: 'moderate',
        signalNote:
          'ADC·LNP 관련 임상시험 데이터는 존재하지만, 특정 후보의 국소 전달 재구성 전략은 아직 임상 단계보다 전임상·문헌 단계가 앞서 있는 경우가 많습니다. 과장 없이 신호 강도를 정직하게 전달하는 것이 신뢰를 높입니다.',
        guidance:
          '임상 데이터는 ADC·LNP 일반적 경쟁 구도 파악에 활용합니다. PoC의 핵심 가치는 고객 후보 특이적 전달 전략 평가에 있으므로, 문헌 합성과 hypothesis framing에 집중합니다.',
      },
      poc: {
        objective:
          '전달 전략 관련 공개 문헌·데이터를 통합 탐색해 후보별 국소/스마트 전달 가능성을 구조적으로 평가하는 delivery hypothesis 프레임을 구축합니다.',
        inScope: [
          '전달 모달리티 유형별(LNP·ADC·나노입자·국소 방출) 공개 문헌 탐색 및 군집화',
          '적응증-전달 전략 매핑 — 어떤 전략이 어떤 적응증에서 어떤 근거를 가지는지',
          '독성-효능 tradeoff 관련 논문 합성',
          '전임상 → 임상 전환 리스크 신호 문헌 정리',
        ],
        outOfScope: [
          '신규 formulation 설계 및 물리화학적 최적화',
          '안전성·생체적합성 실험 데이터 생성',
          '내부 전임상 독성 데이터 연동 (PoC 이후)',
          '규제 제출용 CMC 문서 생성',
        ],
        successKpis: [
          '전달 전략 비교 근거 요약 보고서 6주 내 산출',
          '후보별 전달 전략 feasibility 매핑 완료 (전문가 검토 확인)',
          '탐색 시간 50% 이상 단축 (수동 검색 대비)',
        ],
        riskNote:
          '전달 전략은 후보 특이적 물성에 크게 의존합니다. 공개 데이터 기반 PoC 출력이 특정 후보에 직접 적용 가능하다는 잘못된 인상을 주지 않도록 명확한 가정과 제한 사항을 명시해야 합니다.',
      },
      architecture: {
        highlightedComponents: [
          'PubMed + formulation 관련 공개 DB — 핵심 소스 레이어',
          '전달 모달리티 지식 베이스 — ADC·LNP·나노입자 특성 데이터 구조화',
          '메타데이터 정규화 — 전달 전략·독성 용어 통일',
          'Proposal decision support — 가설 초안 생성 → 전문가 검토',
          '가드레일 — 신약 설계 권고 오인 방지',
        ],
        deliveryNote:
          'PoC는 공개 데이터 기반으로 전달 전략 hypothesis를 구조화하는 데 집중합니다. 특정 후보의 실제 formulation 적용 가능성은 내부 전임상 데이터와 전문가 검토를 통해 확인합니다.',
        governanceNote:
          '전달 전략 출력은 처방·임상 권고가 아닌 "근거 기반 가설 지지"임을 명확히 합니다. 독성 관련 출력은 특히 비진단 면책 문구를 강화합니다.',
      },
    },
  },
]

// ─── Registry Access Functions ────────────────────────────────────────────────

export function getAllScenarios(): PresalesScenario[] {
  return SCENARIOS
}

export function getScenario(id: BottleneckScenarioId): PresalesScenario | undefined {
  return SCENARIOS.find((s) => s.id === id)
}

export function getScenarioIds(): BottleneckScenarioId[] {
  return SCENARIOS.map((s) => s.id)
}
