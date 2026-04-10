'use client'

import type { SolutionArea } from '@/lib/types'
import { getNonGenAIPoCProposal } from '@/lib/rules/non-genai-poc'
import ScenarioBottleneckBanner from '@/components/common/ScenarioBottleneckBanner'
import styles from './NonGenAIPoCPanel.module.css'

interface Props {
  area: SolutionArea
}

export default function NonGenAIPoCPanel({ area }: Props) {
  const proposal = getNonGenAIPoCProposal(area)

  if (!proposal) {
    return (
      <div className={styles.placeholder}>
        <ScenarioBottleneckBanner tab="poc" />
        <div className={styles.placeholderTitle}>PoC 프레임워크 준비 중</div>
        <p className={styles.placeholderText}>선택된 솔루션 영역의 PoC 설계 프레임워크가 준비되고 있습니다.</p>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      {/* 병목 시나리오가 active한 경우 상단에 시나리오 framing 노출 (self-gating). */}
      <ScenarioBottleneckBanner tab="poc" />

      {proposal.conceptNote && (
        <div className={styles.conceptNote}>
          <span className={styles.conceptNoteIcon}>!</span>
          {proposal.conceptNote}
        </div>
      )}

      <div className={styles.header}>
        <div className={styles.patternBadge}>{proposal.solutionPattern}</div>
        <div className={styles.areaLabel}>{proposal.areaLabel}</div>
      </div>

      <div className={styles.row2}>
        <div className={styles.card}>
          <div className={styles.cardLabel}>문제 정의</div>
          <p className={styles.cardText}>{proposal.problemDefinition}</p>
        </div>
        <div className={styles.card}>
          <div className={styles.cardLabel}>솔루션 방향</div>
          <p className={styles.cardText}>{proposal.solutionDescription}</p>
        </div>
      </div>

      <div className={styles.row2}>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Why AI?</div>
          <p className={styles.cardText}>{proposal.whyAI}</p>
        </div>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Why Now?</div>
          <p className={styles.cardText}>{proposal.whyNow}</p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardLabel}>6주 PoC 타임라인</div>
        <div className={styles.timeline}>
          {proposal.sixWeekScope.map((w) => (
            <div key={w.week} className={styles.weekRow}>
              <div className={styles.weekBadge}>W{w.week}</div>
              <div>
                <div className={styles.weekTitle}>{w.title}</div>
                <div className={styles.weekDesc}>{w.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardLabel}>성공 KPI (6주 후)</div>
        <div className={styles.kpiGrid}>
          {proposal.kpis.map((kpi, i) => (
            <div key={i} className={styles.kpiCard}>
              <div className={styles.kpiMetric}>{kpi.metric}</div>
              <div className={styles.kpiTarget}>{kpi.target}</div>
              <div className={styles.kpiBaseline}>{kpi.baseline}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardLabel}>필요 데이터 자산</div>
        <div className={styles.dataGrid}>
          <div>
            <div className={styles.dataSubLabel}>공개 데이터</div>
            <ul className={styles.dataList}>
              {proposal.dataNeeded.public.map((d, i) => (
                <li key={i} className={styles.dataItem}>{d}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className={styles.dataSubLabel}>내부 데이터 (필수)</div>
            <ul className={styles.dataList}>
              {proposal.dataNeeded.internal.map((d, i) => (
                <li key={i} className={styles.dataItem}>{d}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className={styles.dataSubLabel}>Phase 2 확장</div>
            <ul className={styles.dataList}>
              {proposal.dataNeeded.extension.map((d, i) => (
                <li key={i} className={styles.dataItem}>{d}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardLabel}>리스크 & 가드레일</div>
        <div className={styles.riskList}>
          {proposal.risks.map((r, i) => (
            <div key={i} className={styles.riskRow}>
              <div className={styles.riskText}>
                <span className={styles.riskIcon}>R</span>
                {r.risk}
              </div>
              <div className={styles.guardrailText}>
                <span className={styles.guardrailIcon}>G</span>
                {r.guardrail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
