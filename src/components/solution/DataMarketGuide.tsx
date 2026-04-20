'use client'

import type { SolutionArea, DataMaturity } from '@/lib/types'
import { DATA_MARKET_CONTENT } from '@/lib/rules/solution-content'
import type { SolutionRouteResult } from '@/lib/types'
import ScenarioBottleneckBanner from '@/components/common/ScenarioBottleneckBanner'
import styles from './DataMarketGuide.module.css'

interface Props {
  area: SolutionArea
  dataMaturity: DataMaturity
  solutionRoute: SolutionRouteResult
}

const MATURITY_LABEL: Record<DataMaturity, string> = {
  nascent: '초기 단계',
  developing: '구축 중',
  established: '성숙 단계',
}

export default function DataMarketGuide({ area, dataMaturity, solutionRoute }: Props) {
  const content = DATA_MARKET_CONTENT[area]

  if (!content) {
    return (
      <div className={styles.placeholder}>
        <ScenarioBottleneckBanner tab="trials" />
        <div className={styles.placeholderTitle}>임상 동향 콘텐츠 준비 중</div>
        <p className={styles.placeholderText}>
          현재 선택된 솔루션 경로({solutionRoute.areaLabel})의 임상 동향 가이드가 준비되고 있습니다.
        </p>
      </div>
    )
  }

  const currentStageIdx = content.maturityStages.findIndex((s) => {
    if (dataMaturity === 'nascent') return s.stage.includes('초기')
    if (dataMaturity === 'developing') return s.stage.includes('개발')
    if (dataMaturity === 'established') return s.stage.includes('성숙')
    return false
  })

  return (
    <div className={styles.wrapper}>
      {/* 병목 시나리오가 active한 경우 상단에 시나리오 framing 노출 (self-gating). */}
      <ScenarioBottleneckBanner tab="trials" />

      <div className={styles.header}>
        <div className={styles.title}>{content.title}</div>
        <p className={styles.summary}>{content.summary}</p>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>데이터 성숙도 단계별 권고</div>
        <div className={styles.maturityStages}>
          {content.maturityStages.map((stage, i) => (
            <div
              key={i}
              className={`${styles.stageCard} ${i === currentStageIdx ? styles.stageActive : ''}`}
            >
              <div className={styles.stageHeader}>
                <span className={styles.stageName}>{stage.stage}</span>
                {i === currentStageIdx && (
                  <span className={styles.currentBadge}>현재 고객 위치</span>
                )}
              </div>
              <ul className={styles.signalList}>
                {stage.signals.map((s, j) => (
                  <li key={j} className={styles.signalItem}>{s}</li>
                ))}
              </ul>
              <div className={styles.recommendation}>
                <span className={styles.recommendLabel}>권고사항</span>
                {stage.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.row2}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>시장 맥락</div>
          <p className={styles.marketText}>{content.marketContext}</p>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>준비도 신호 (Readiness Signals)</div>
          <ul className={styles.list}>
            {content.readinessSignals.map((s, i) => (
              <li key={i} className={styles.listItem}>{s}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.maturityNote}>
        현재 선택된 데이터 성숙도: <strong>{MATURITY_LABEL[dataMaturity]}</strong>
        {' — '}상단의 강조 카드가 고객의 현재 위치에 해당합니다.
      </div>
    </div>
  )
}
