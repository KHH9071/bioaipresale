'use client'

import type { SolutionRouteResult } from '@/lib/types'
import styles from './SolutionPathSection.module.css'

interface Props {
  solutionRoute: SolutionRouteResult
}

export default function SolutionPathSection({ solutionRoute }: Props) {
  const {
    areaLabel,
    rationale,
    discoveryQuestions,
    requiredDataAssets,
    architectureHint,
    conceptDiscussionOnly,
    disclaimerText,
    secondary,
  } = solutionRoute

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.badgeRow}>
          <span className={styles.badge}>솔루션 경로</span>
          {conceptDiscussionOnly && (
            <span className={styles.badgeConcept}>개념 논의 전용</span>
          )}
        </div>
        <div className={styles.areaLabel}>{areaLabel}</div>
        <p className={styles.rationale}>{rationale}</p>
      </div>

      {conceptDiscussionOnly && disclaimerText && (
        <div className={styles.disclaimer}>
          <span className={styles.disclaimerIcon}>!</span>
          {disclaimerText}
        </div>
      )}

      <div className={styles.body}>
        <div className={styles.col}>
          <div className={styles.colTitle}>발견 질문 (Discovery Questions)</div>
          <ul className={styles.list}>
            {discoveryQuestions.map((q, i) => (
              <li key={i} className={styles.listItem}>{q}</li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <div className={styles.colTitle}>고객 준비 데이터 자산</div>
          <ul className={styles.list}>
            {requiredDataAssets.map((a, i) => (
              <li key={i} className={styles.listItem}>{a}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.archHint}>
        <span className={styles.archHintLabel}>아키텍처 방향</span>
        <span className={styles.archHintText}>{architectureHint}</span>
      </div>

      {secondary && (
        <div className={styles.secondaryHint}>
          <span className={styles.secondaryHintLabel}>또 다른 접근</span>
          <span className={styles.secondaryHintText}>
            같은 문제 도메인 안에서 <strong>{secondary.areaLabel}</strong> 접근도 병치 가능합니다 —
            참조 아키텍처 탭 하단에서 보조 패턴으로 확인할 수 있습니다.
          </span>
        </div>
      )}
    </section>
  )
}
