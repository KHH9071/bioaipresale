import type { SponsorEntry } from '@/lib/types'
import styles from './SponsorTable.module.css'

interface Props {
  sponsors: SponsorEntry[]
}

export default function SponsorTable({ sponsors }: Props) {
  if (sponsors.length === 0) return null

  return (
    <div className={styles.wrapper}>
      <div className={styles.label}>주요 스폰서</div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>스폰서</th>
            <th>임상시험 수</th>
            <th>주요 적응증</th>
          </tr>
        </thead>
        <tbody>
          {sponsors.slice(0, 10).map((sponsor) => (
            <tr key={sponsor.name}>
              <td>{sponsor.name}</td>
              <td><span className={styles.count}>{sponsor.count}</span></td>
              <td><span className={styles.condition}>{sponsor.condition}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
