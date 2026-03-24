'use client'

import { useQuery } from '@/lib/query-context'
import { getScenario } from '@/lib/scenarios/registry'
import type { SignalMode } from '@/lib/scenarios/types'
import styles from './ScenarioBottleneckBanner.module.css'

type TabKey = 'overview' | 'evidence' | 'trials' | 'poc' | 'architecture'

interface Props {
  tab: TabKey
}

const SIGNAL_LABELS: Record<SignalMode, string> = {
  strong:   '임상 신호 강함',
  moderate: '임상 신호 중간',
  limited:  '임상 신호 제한적',
}

const SIGNAL_COLORS: Record<SignalMode, string> = {
  strong:   '#3FB950',
  moderate: '#D29922',
  limited:  '#8B949E',
}

const CATEGORY_COLORS: Record<string, string> = {
  '신약 발굴 병목': '#BC8CFF',
  '임상 데이터 병목': '#58A6FF',
  '플랫폼 전략 병목': '#D29922',
  '전달 전략 병목': '#3FB950',
}

export default function ScenarioBottleneckBanner({ tab }: Props) {
  const { state } = useQuery()
  const { activeScenarioId, hasSearched } = state

  if (!hasSearched || !activeScenarioId) return null

  const scenario = getScenario(activeScenarioId)
  if (!scenario) return null

  const categoryColor = CATEGORY_COLORS[scenario.category] ?? '#58A6FF'
  const content = scenario.tabContent

  return (
    <div className={styles.banner} style={{ borderLeftColor: categoryColor }}>
      {/* ── 헤더 (모든 탭 공통) ── */}
      <div className={styles.header}>
        <span className={styles.categoryBadge} style={{ color: categoryColor, borderColor: `${categoryColor}40` }}>
          {scenario.category}
        </span>
        <span className={styles.title}>{scenario.title}</span>
        <div className={styles.tags}>
          {scenario.tags.slice(0, 4).map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>

      {/* ── 탭별 본문 ── */}
      {tab === 'overview' && (
        <div className={styles.body}>
          <div className={styles.row}>
            <div className={styles.col}>
              <div className={styles.fieldLabel}>고객 요청</div>
              <div className={styles.quoteText}>{content.overview.customerRequest}</div>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.col}>
              <div className={styles.fieldLabel}>핵심 병목</div>
              <p className={styles.fieldText}>{content.overview.rootProblem}</p>
            </div>
            <div className={styles.col}>
              <div className={styles.fieldLabel}>왜 지금</div>
              <p className={styles.fieldText}>{content.overview.whyNow}</p>
            </div>
          </div>
          <div className={styles.fieldLabel}>Presales 기회 포인트</div>
          <p className={styles.highlightText}>{content.overview.opportunityNote}</p>
          <div className={styles.fieldLabel} style={{ marginTop: 10 }}>AI 적용 포인트</div>
          <ul className={styles.bulletList}>
            {content.overview.aiOpportunities.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {tab === 'evidence' && (
        <div className={styles.body}>
          <div className={styles.fieldLabel}>데이터 신호 맥락</div>
          <p className={styles.fieldText}>{content.evidence.signalNote}</p>
          <div className={styles.fieldLabel} style={{ marginTop: 10 }}>솔루션 탐색 포인트</div>
          <ul className={styles.bulletList}>
            {content.evidence.aiOpportunities.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <div className={styles.hintBox}>
            <span className={styles.hintIcon}>💡</span>
            {content.evidence.searchHint}
          </div>
        </div>
      )}

      {tab === 'trials' && (
        <div className={styles.body}>
          <div className={styles.signalRow}>
            <span
              className={styles.signalBadge}
              style={{
                color: SIGNAL_COLORS[content.trials.signalMode],
                borderColor: `${SIGNAL_COLORS[content.trials.signalMode]}40`,
              }}
            >
              {SIGNAL_LABELS[content.trials.signalMode]}
            </span>
          </div>
          <p className={styles.fieldText}>{content.trials.signalNote}</p>
          <div className={styles.fieldLabel} style={{ marginTop: 8 }}>Presales 활용 가이던스</div>
          <p className={styles.fieldText}>{content.trials.guidance}</p>
        </div>
      )}

      {tab === 'poc' && (
        <div className={styles.body}>
          <div className={styles.fieldLabel}>PoC 목표</div>
          <p className={styles.highlightText}>{content.poc.objective}</p>
          <div className={styles.twoCol}>
            <div>
              <div className={styles.fieldLabel}>범위 내 (In-scope)</div>
              <ul className={styles.bulletList}>
                {content.poc.inScope.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className={styles.fieldLabel}>범위 외 (Out-of-scope)</div>
              <ul className={styles.bulletListMuted}>
                {content.poc.outOfScope.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className={styles.fieldLabel} style={{ marginTop: 10 }}>성공 KPI 힌트</div>
          <ul className={styles.bulletList}>
            {content.poc.successKpis.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <div className={styles.riskNote}>
            <span className={styles.riskIcon}>⚠</span>
            {content.poc.riskNote}
          </div>
        </div>
      )}

      {tab === 'architecture' && (
        <div className={styles.body}>
          <div className={styles.fieldLabel}>이 시나리오에서 강조되는 구성요소</div>
          <ul className={styles.bulletList}>
            {content.architecture.highlightedComponents.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <div className={styles.fieldLabel} style={{ marginTop: 10 }}>시나리오 납품 맥락</div>
          <p className={styles.fieldText}>{content.architecture.deliveryNote}</p>
          <div className={styles.fieldLabel} style={{ marginTop: 8 }}>거버넌스 강조점</div>
          <p className={styles.fieldText}>{content.architecture.governanceNote}</p>
        </div>
      )}
    </div>
  )
}
