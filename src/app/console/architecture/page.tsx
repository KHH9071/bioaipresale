'use client'

import { useQuery } from '@/lib/query-context'
import { getArchPattern } from '@/lib/rules/architecture-patterns'
import type { BottleneckScenarioId } from '@/lib/types'
import SectionHeader from '@/components/common/SectionHeader'
import ScenarioBottleneckBanner from '@/components/common/ScenarioBottleneckBanner'
import styles from './architecture.module.css'

// ── Scenario Architecture Overlay Config ─────────────────────────────────────

interface ArchOverlay {
  emphasisBlockIds: string[]
  callout: { title: string; text: string; color: string }
}

const SCENARIO_ARCH_OVERLAY: Partial<Record<BottleneckScenarioId, ArchOverlay>> = {
  undruggable_target: {
    emphasisBlockIds: ['public-data', 'metadata', 'search-index', 'guardrail'],
    callout: {
      title: '핵심 레이어: 근거 집계 + 출처 추적 가능성',
      text: '이 시나리오에서 가장 중요한 구성요소는 다중 공개 소스 통합(Public Data), 표적-기전 용어 정규화(메타데이터), 하이브리드 검색 인덱스, 그리고 전문가 검토 게이트(가드레일)입니다. Evidence aggregation의 신뢰성과 출처 추적 가능성이 PoC 성공을 결정합니다.',
      color: '#BC8CFF',
    },
  },
  rwd_autoimmune: {
    emphasisBlockIds: ['internal-data', 'ingestion', 'metadata', 'logging'],
    callout: {
      title: '핵심 레이어: Governed Analytics + 종단적 환자 뷰',
      text: '이 시나리오의 핵심은 내부 데이터 연동 레이어(EMR/청구/레지스트리)와 데이터 수집 파이프라인입니다. 데이터 이질성 관리와 규제 대응을 위해 Governed analytics(로깅/감사)와 메타데이터 정규화가 특히 강조됩니다.',
      color: '#58A6FF',
    },
  },
  mutation_agnostic: {
    emphasisBlockIds: ['public-data', 'llm-orchestration', 'guardrail'],
    callout: {
      title: '핵심 레이어: Human-in-the-loop + 불확실성 명시 출력',
      text: '과학적 불확실성이 높은 이 시나리오에서는 LLM 오케스트레이션의 다단계 추론과 가드레일/전문가 검토 게이트가 핵심입니다. "결론" 대신 "근거 수준이 명시된 가설"을 출력하는 구조가 PoC의 신뢰성을 보장합니다. 모든 출력에는 전임상/임상/리뷰 근거 수준이 함께 표시되어야 합니다.',
      color: '#D29922',
    },
  },
  off_target_toxicity: {
    emphasisBlockIds: ['public-data', 'ingestion', 'llm-orchestration', 'guardrail'],
    callout: {
      title: '핵심 레이어: 전달 전략 지식 베이스 + 가설 초안 생성',
      text: '전달 모달리티 지식 베이스(수집/ETL 레이어)와 LLM 기반 가설 합성이 이 시나리오의 핵심입니다. 가드레일은 신약 설계 권고 오인을 방지하고, 전문가 검토 전 모든 출력에 물성 의존성과 제한 사항을 명시합니다.',
      color: '#3FB950',
    },
  },
}

const LAYER_LABELS: Record<string, string> = {
  source: '데이터 소스',
  processing: '처리',
  intelligence: '인텔리전스',
  delivery: '딜리버리',
  observability: '관측성',
  ingestion: '수집',
  analysis: '분석',
  storage: '스토리지',
  visualization: '시각화',
  governance: '거버넌스',
  pipeline: '파이프라인',
  integration: '연동',
  workflow: '워크플로우',
  network: '네트워크',
}

const LAYER_ORDER = ['source', 'processing', 'intelligence', 'delivery', 'observability']

// Legacy static data kept for reference (replaced by architecture-patterns.ts)
const _BLOCKS = [
  {
    id: 'public-data',
    label: '외부 공개 데이터',
    description: 'PubMed/NCBI, ClinicalTrials.gov, FDA DailyMed, EMA 제품 정보, bioRxiv. 사실적 근거의 기반을 제공하는 데이터 소스로, PoC 라이선스 위험 없이 모두 공개 접근 가능합니다.',
    layer: 'source',
    color: '#58A6FF',
  },
  {
    id: 'internal-data',
    label: '고객 내부 콘텐츠',
    description: '내부 연구 보고서, SOP, 규제 제출 서류, 메디컬 어페어스 문서. 프로덕션 환경에서만 접근하며 — 고객이 통제된 접근을 제공하지 않는 한 PoC에서는 사용하지 않습니다.',
    layer: 'source',
    color: '#3FB950',
  },
  {
    id: 'ingestion',
    label: '수집 / ETL',
    description: '문서 수집, PDF 파싱, 포맷 정규화. 이 레이어는 다양한 소스 포맷이 인덱스에 들어가기 전 처리합니다. 여기서의 안정성이 하위 데이터 품질 장애를 방지합니다.',
    layer: 'processing',
    color: '#D29922',
  },
  {
    id: 'metadata',
    label: '메타데이터 정규화',
    description: 'PubMed MeSH 용어, ClinicalTrials 질환명, 고객 내부 명명법에 걸쳐 용어를 통일합니다. 이 없이는 서로 다른 어휘의 동일 개념이 검색 실패를 일으킵니다.',
    layer: 'processing',
    color: '#D29922',
  },
  {
    id: 'search-index',
    label: '검색 인덱스 / 벡터 스토어',
    description: '밀집 벡터 임베딩(시맨틱 유사도)과 BM25 키워드 인덱스(정확 매칭 재현율)를 결합한 하이브리드 인덱스. 제약 도메인 검색에는 둘 다 필요하며 하나만으로는 충분하지 않습니다.',
    layer: 'processing',
    color: '#D29922',
  },
  {
    id: 'llm-orchestration',
    label: 'LLM 오케스트레이션',
    description: '검색 → 프롬프트 구성 → 생성 파이프라인을 관리합니다. 컨텍스트 윈도우 사용 제어, 인용 요건 강제 적용, 복잡 쿼리에 대한 다단계 추론을 조율합니다.',
    layer: 'intelligence',
    color: '#BC8CFF',
  },
  {
    id: 'guardrail',
    label: '가드레일 / 인용 엔진',
    description: 'AI 생성 모든 답변에 추적 가능한 출처 참조를 포함하도록 보장합니다. 환각이 사실로 제시되는 것을 방지합니다. 규제 책임이 있는 모든 제약/바이오텍 배포에 필수입니다.',
    layer: 'intelligence',
    color: '#BC8CFF',
  },
  {
    id: 'web-app',
    label: '웹 앱 / 사용자 레이어',
    description: '최종 사용자가 상호작용하는 쿼리 인터페이스, 근거 카드, 해석 패널. 연구원 및 BD팀을 위해 설계되었으며 범용 채팅 인터페이스가 아닙니다.',
    layer: 'delivery',
    color: '#F85149',
  },
  {
    id: 'logging',
    label: '로깅 / 평가',
    description: '쿼리 로그, 검색 결과, 사용자 피드백, 지연 시간 지표를 수집합니다. PoC 기간 KPI 측정 및 배포 후 지속적 개선에 필수적입니다.',
    layer: 'observability',
    color: '#8B949E',
  },
]

const DEPLOYMENT_OPTIONS = [
  {
    title: '클라우드 빠른 PoC',
    description: '관리형 벡터 DB (Pinecone / Weaviate Cloud), 서버리스 LLM API, Vercel 등에 배포하는 Next.js 프론트엔드. 1주일 이내 배포 가능. 인프라팀 불필요.',
    color: '#3FB950',
  },
  {
    title: '엔터프라이즈 배포',
    description: '자체 호스팅 벡터 DB, VPC 격리 LLM 추론, SSO 통합, 감사 로깅. 데이터 민감도 요건이 있는 고객 내부 문서 PoC에 적합합니다.',
    color: '#58A6FF',
  },
  {
    title: '하이브리드 데이터 접근',
    description: '공개 데이터는 클라우드 인덱스, 내부 데이터는 온프레미스 인덱스에 저장. 쿼리 라우터가 쿼리별로 어느 인덱스를 참조할지 결정합니다. 속도와 데이터 거버넌스를 균형 있게 유지합니다.',
    color: '#D29922',
  },
]

const GOVERNANCE = [
  { label: '출처 추적 가능성', text: '모든 답변에 문서, 섹션, 버전 출처 포함. 출처 없는 주장은 사용자에게 전달되지 않습니다.' },
  { label: '전문가 검토 게이트', text: '고위험 출력(규제, 메디컬 어페어스)은 배포 전 SME 검토를 거칩니다.' },
  { label: '접근 제어', text: '공개 문서와 내부 문서 간 네임스페이스 분리. 사용자 역할 기반 쿼리 범위 제한.' },
  { label: '비진단용 주의 문구', text: '고정 UI 주의 문구 및 시스템 수준 지시사항: 연구 및 Presales 기획 전용.' },
]

export default function ArchitecturePage() {
  const { state } = useQuery()
  const { solutionRoute, activeScenarioId } = state

  const area = solutionRoute?.area ?? 'genai'
  const pattern = getArchPattern(area)
  const overlay = activeScenarioId ? SCENARIO_ARCH_OVERLAY[activeScenarioId] : undefined

  const layers = Array.from(new Set(pattern.blocks.map((b) => b.layer)))
  const orderedLayers = [
    ...LAYER_ORDER.filter((l) => layers.includes(l)),
    ...layers.filter((l) => !LAYER_ORDER.includes(l)),
  ]

  // Secondary area — 같은 problemDomain의 병치 가능한 "또 다른 접근" 패턴.
  const secondary = solutionRoute?.secondary
  const secondaryPattern = secondary ? getArchPattern(secondary.area) : undefined
  const secondaryLayers = secondaryPattern
    ? Array.from(new Set(secondaryPattern.blocks.map((b) => b.layer)))
    : []
  const secondaryOrderedLayers = [
    ...LAYER_ORDER.filter((l) => secondaryLayers.includes(l)),
    ...secondaryLayers.filter((l) => !LAYER_ORDER.includes(l)),
  ]

  return (
    <div>
      <SectionHeader
        title="참조 아키텍처"
        subtitle={pattern.subtitle}
      />

      <div className={styles.content}>
        {/* Pattern title badge */}
        <div className={styles.patternHeader}>
          <span className={styles.patternBadge}>{area.toUpperCase()}</span>
          <span className={styles.patternTitle}>{pattern.title}</span>
        </div>

        {/* Architecture Diagram */}
        <div className={styles.diagramSection}>
          <div className={styles.sectionLabel}>아키텍처 블록</div>

          {/* Scenario-specific callout */}
          {overlay && (
            <div
              className={styles.scenarioCallout}
              style={{
                borderColor: `${overlay.callout.color}30`,
                borderLeftColor: overlay.callout.color,
                background: `${overlay.callout.color}08`,
              }}
            >
              <div className={styles.scenarioCalloutTitle} style={{ color: overlay.callout.color }}>
                {overlay.callout.title}
              </div>
              <p className={styles.scenarioCalloutText}>{overlay.callout.text}</p>
            </div>
          )}

          <div className={styles.diagram}>
            {orderedLayers.map((layer, i) => (
              <div key={layer}>
                <div className={styles.layerRow}>
                  <div className={styles.layerLabel}>{LAYER_LABELS[layer] ?? layer}</div>
                  <div className={styles.layerBlocks}>
                    {pattern.blocks.filter((b) => b.layer === layer).map((block) => {
                      const isEmphasized = overlay?.emphasisBlockIds.includes(block.id) ?? false
                      return (
                        <div
                          key={block.id}
                          className={`${styles.block} ${isEmphasized ? styles.blockEmphasized : ''}`}
                          style={isEmphasized
                            ? {
                                borderColor: overlay!.callout.color,
                                ['--emphasis-color' as string]: `${overlay!.callout.color}30`,
                              }
                            : { borderColor: `${block.color}40` }
                          }
                        >
                          {isEmphasized && (
                            <div
                              className={styles.emphasizedBadge}
                              style={{
                                color: overlay!.callout.color,
                                borderColor: `${overlay!.callout.color}50`,
                                background: `${overlay!.callout.color}12`,
                              }}
                            >
                              핵심
                            </div>
                          )}
                          <div className={styles.blockDot} style={{ background: isEmphasized ? overlay!.callout.color : block.color }} />
                          <div className={styles.blockName}>{block.label}</div>
                          <div className={styles.tooltip}>{block.description}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                {i < orderedLayers.length - 1 && <div className={styles.arrow}>↓</div>}
              </div>
            ))}
          </div>
          <p className={styles.diagramNote}>각 블록에 마우스를 올리면 아키텍처에서의 역할을 확인할 수 있습니다.{overlay ? ' · 핵심 배지가 붙은 블록이 이 시나리오의 주요 구성요소입니다.' : ''}</p>
        </div>

        {/* Deployment Options */}
        <div className={styles.sectionLabel}>배포 옵션</div>
        <div className={styles.deployCards}>
          {pattern.deploymentOptions.map((opt) => (
            <div
              key={opt.title}
              className={styles.deployCard}
              style={{ borderColor: `${opt.color}30` }}
            >
              <div className={styles.deployTitle} style={{ color: opt.color }}>{opt.title}</div>
              <p className={styles.deployDesc}>{opt.description}</p>
            </div>
          ))}
        </div>

        {/* Governance */}
        <div className={styles.sectionLabel}>거버넌스 및 가드레일</div>
        <div className={styles.governanceList}>
          {pattern.governance.map((item) => (
            <div key={item.label} className={styles.govItem}>
              <div className={styles.govLabel}>{item.label}</div>
              <div className={styles.govText}>{item.text}</div>
            </div>
          ))}
        </div>

        {/* Scenario-specific architecture notes */}
        <ScenarioBottleneckBanner tab="architecture" />

        {/* Delivery Notes */}
        <div className={styles.deliveryNotes}>
          <div className={styles.sectionLabel}>납품 노트</div>
          <div className={styles.noteGrid}>
            {pattern.deliveryNotes.map((note) => (
              <div key={note.title} className={styles.noteItem}>
                <div className={styles.noteTitle}>{note.title}</div>
                <p className={styles.noteText}>{note.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Architecture — 같은 problemDomain의 "또 다른 접근 방향" */}
        {secondary && secondaryPattern && (
          <details className={styles.secondarySection}>
            <summary className={styles.secondarySummary}>
              <span className={styles.secondaryLabel}>또 다른 접근 방향</span>
              <span className={styles.secondaryTitle}>{secondary.areaLabel}</span>
              <span className={styles.secondaryHint}>클릭하여 보조 참조 아키텍처 보기</span>
            </summary>

            <div className={styles.secondaryBody}>
              <div className={styles.secondaryPatternHeader}>
                <span className={styles.secondaryBadge}>{secondary.area.toUpperCase()}</span>
                <span className={styles.secondaryPatternTitle}>{secondaryPattern.title}</span>
              </div>
              <p className={styles.secondarySubtitle}>{secondaryPattern.subtitle}</p>

              {secondary.conceptDiscussionOnly && secondary.disclaimerText && (
                <div className={styles.secondaryDisclaimer}>
                  <span className={styles.secondaryDisclaimerIcon}>!</span>
                  {secondary.disclaimerText}
                </div>
              )}

              <div className={styles.secondaryDiagram}>
                {secondaryOrderedLayers.map((layer, i) => (
                  <div key={layer}>
                    <div className={styles.secondaryLayerRow}>
                      <div className={styles.secondaryLayerLabel}>{LAYER_LABELS[layer] ?? layer}</div>
                      <div className={styles.secondaryLayerBlocks}>
                        {secondaryPattern.blocks.filter((b) => b.layer === layer).map((block) => (
                          <div
                            key={block.id}
                            className={styles.secondaryBlock}
                            style={{ borderColor: `${block.color}40` }}
                          >
                            <div className={styles.blockDot} style={{ background: block.color }} />
                            <div className={styles.secondaryBlockName}>{block.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {i < secondaryOrderedLayers.length - 1 && <div className={styles.secondaryArrow}>↓</div>}
                  </div>
                ))}
              </div>
              <p className={styles.secondaryNote}>
                이 접근은 같은 문제 도메인(신약 발굴 / 컴퓨테이셔널 분석) 안에서 병치 가능한 또 다른 AI 솔루션 패턴입니다.
                고객 상황에 따라 주 접근과 보완 또는 전환 검토가 가능합니다.
              </p>
            </div>
          </details>
        )}
      </div>
    </div>
  )
}
