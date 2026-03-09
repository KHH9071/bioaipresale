import type { KPIItem } from '@/lib/types'
import styles from './KPIPreviewList.module.css'

interface Props {
  kpis: KPIItem[]
}

export default function KPIPreviewList({ kpis }: Props) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>예상 성과 지표 (KPI)</div>
      <div className={styles.list}>
        {kpis.map((kpi, i) => (
          <div key={i} className={styles.item}>
            <div className={styles.metric}>{kpi.metric}</div>
            <div className={styles.target}>{kpi.target}</div>
            <div className={styles.baseline}>{kpi.baseline}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
