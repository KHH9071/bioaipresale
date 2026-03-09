import type { OpportunityOutput, QueryInput } from '@/lib/types'
import styles from './OpportunityStatement.module.css'

interface Props {
  opportunity: OpportunityOutput
  input: QueryInput
}

const OBJECTIVE_LABELS: Record<string, string> = {
  literature_intelligence: '문헌 인텔리전스',
  trial_scouting: '임상시험 스카우팅',
  label_regulatory: '라벨 / 규제',
  scientific_qa: '과학 Q&A',
  kol_sponsor_landscape: 'KOL / 스폰서 랜드스케이프',
}

export default function OpportunityStatement({ opportunity, input }: Props) {
  const subject = [input.disease, input.target, input.drug].filter(Boolean).join(' / ')

  return (
    <div className={styles.card}>
      <div className={styles.label}>고객 기회 요약</div>
      <p className={styles.statement}>{opportunity.opportunityStatement}</p>
      <div className={styles.meta}>
        {subject && <span className={styles.tag}>{subject}</span>}
        <span className={styles.tag}>{OBJECTIVE_LABELS[input.objective]}</span>
        <span className={styles.tag}>{input.region} · 최근 {input.timeYears}년</span>
        <span className={styles.tag}>{opportunity.pocType}</span>
      </div>
    </div>
  )
}
