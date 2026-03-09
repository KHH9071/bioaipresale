'use client'

import { useQuery } from '@/lib/query-context'
import styles from './QuerySummaryBar.module.css'

const OBJECTIVE_SHORT: Record<string, string> = {
  literature_intelligence: '문헌 인텔리전스',
  trial_scouting: '임상시험 스카우팅',
  label_regulatory: '라벨 / 규제',
  scientific_qa: '과학 Q&A',
  kol_sponsor_landscape: 'KOL / 스폰서',
}

export default function QuerySummaryBar() {
  const { state } = useQuery()
  const { input, hasSearched, searchedAt } = state

  if (!hasSearched) return null

  const REGION_KO: Record<string, string> = { Global: '글로벌', US: '미국', KR: '한국', EU: '유럽' }

  const parts = [
    input.disease && { key: '질환', value: input.disease },
    input.target && { key: '타깃', value: input.target },
    input.drug && { key: '약물', value: input.drug },
    { key: '목표', value: OBJECTIVE_SHORT[input.objective] },
    { key: '지역', value: REGION_KO[input.region] ?? input.region },
    { key: '기간', value: `최근 ${input.timeYears}년` },
  ].filter(Boolean) as { key: string; value: string }[]

  const timeStr = searchedAt
    ? new Date(searchedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    : null

  return (
    <div className={styles.bar}>
      <span className={styles.queryLabel}>현재 분석 쿼리</span>

      <div className={styles.queryGroup}>
        {parts.map((p, i) => (
          <span key={p.key} className={styles.pill}>
            <span className={styles.pillKey}>{p.key}:</span>
            <span className={p.key === '목표' ? styles.pillMain : ''}>{p.value}</span>
            {i < parts.length - 1 && <span className={styles.separator} />}
          </span>
        ))}
      </div>

      <div className={styles.metaGroup}>
        <span className={`${styles.sourceBadge} ${styles.sourcePubmed}`}>PubMed</span>
        <span className={`${styles.sourceBadge} ${styles.sourceTrials}`}>ClinicalTrials.gov</span>
        <span className={`${styles.sourceBadge} ${styles.sourceRules}`}>규칙 엔진</span>

        {timeStr && (
          <span className={styles.timestamp}>분석 완료 {timeStr}</span>
        )}

        <span className={styles.dot} title="비진단용 데모" />
        <span className={styles.disclaimer}>연구 및 제안 설계 전용</span>
      </div>
    </div>
  )
}
