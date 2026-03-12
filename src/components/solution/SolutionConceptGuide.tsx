'use client'

import type { SolutionArea } from '@/lib/types'
import { SOLUTION_CONCEPT_CONTENT } from '@/lib/rules/solution-content'
import type { SolutionRouteResult } from '@/lib/types'
import styles from './SolutionConceptGuide.module.css'

interface Props {
  area: SolutionArea
  solutionRoute: SolutionRouteResult
}

export default function SolutionConceptGuide({ area, solutionRoute }: Props) {
  const content = SOLUTION_CONCEPT_CONTENT[area]

  if (!content) {
    return (
      <div className={styles.placeholder}>
        <div className={styles.placeholderTitle}>솔루션 탐색 콘텐츠 준비 중</div>
        <p className={styles.placeholderText}>
          현재 선택된 솔루션 경로({solutionRoute.areaLabel})의 상세 콘텐츠가 준비되고 있습니다.
          PoC 설계 탭에서 솔루션 프레임워크를 확인하세요.
        </p>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      {solutionRoute.conceptDiscussionOnly && (
        <div className={styles.conceptBanner}>
          이 화면은 <strong>개념 논의 가이드</strong>입니다. 실제 분석 또는 계산 결과를 생성하지 않습니다.
        </div>
      )}

      <div className={styles.header}>
        <div className={styles.title}>{content.conceptTitle}</div>
        <p className={styles.summary}>{content.conceptSummary}</p>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>핵심 구성 요소</div>
        <div className={styles.components}>
          {content.keyComponents.map((c, i) => (
            <div key={i} className={styles.componentCard}>
              <div className={styles.componentNum}>{String(i + 1).padStart(2, '0')}</div>
              <div>
                <div className={styles.componentTitle}>{c.title}</div>
                <div className={styles.componentDesc}>{c.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.row2}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>왜 지금인가 (Why Now)</div>
          <p className={styles.whyNow}>{content.whyNow}</p>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>대표 진입 패턴</div>
          <ul className={styles.list}>
            {content.commonEntryPatterns.map((p, i) => (
              <li key={i} className={styles.listItem}>{p}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.scopeNote}>
        <span className={styles.scopeIcon}>i</span>
        {content.scopeNote}
      </div>
    </div>
  )
}
