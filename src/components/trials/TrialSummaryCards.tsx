import type { ClinicalTrial } from '@/lib/types'
import styles from './TrialSummaryCards.module.css'

interface Props {
  studies: ClinicalTrial[]
  total: number
}

export default function TrialSummaryCards({ studies, total }: Props) {
  const recruiting = studies.filter((s) => s.status === 'Recruiting').length
  const active = studies.filter((s) => s.status === 'Active').length
  const sponsors = new Set(studies.map((s) => s.sponsor).filter(Boolean)).size

  return (
    <div className={styles.cards}>
      <div className={styles.card}>
        <div className={styles.cardLabel}>Total Trials</div>
        <div className={styles.cardValue}>{total}</div>
      </div>
      <div className={`${styles.card} ${styles.recruiting}`}>
        <div className={styles.cardLabel}>Recruiting</div>
        <div className={styles.cardValue}>{recruiting}</div>
      </div>
      <div className={`${styles.card} ${styles.active}`}>
        <div className={styles.cardLabel}>Active</div>
        <div className={styles.cardValue}>{active}</div>
      </div>
      <div className={`${styles.card} ${styles.sponsors}`}>
        <div className={styles.cardLabel}>Unique Sponsors</div>
        <div className={styles.cardValue}>{sponsors}</div>
      </div>
    </div>
  )
}
