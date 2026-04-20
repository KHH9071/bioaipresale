import type { KeywordEntry } from '@/lib/types'
import styles from './KeywordClusterChips.module.css'

interface Props {
  keywords: KeywordEntry[]
}

export default function KeywordClusterChips({ keywords }: Props) {
  if (keywords.length === 0) return null

  return (
    <div className={styles.section}>
      <div className={styles.label}>주요 용어 / 클러스터</div>
      <div className={styles.chips}>
        {keywords.slice(0, 15).map((kw) => (
          <span key={kw.term} className={styles.chip}>
            {kw.term}
            <span className={styles.count}>{kw.count}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
