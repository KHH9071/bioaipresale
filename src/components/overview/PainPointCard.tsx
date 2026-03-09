import styles from './PainPointCard.module.css'

interface Props {
  painPoints: string[]
}

export default function PainPointCard({ painPoints }: Props) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>예상 고객 Pain Points</div>
      <div className={styles.list}>
        {painPoints.map((point, i) => (
          <div key={i} className={styles.item}>
            <span className={styles.num}>{i + 1}</span>
            <span className={styles.text}>{point}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
