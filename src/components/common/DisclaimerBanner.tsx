import { AlertTriangle } from 'lucide-react'
import styles from './DisclaimerBanner.module.css'

export default function DisclaimerBanner() {
  return (
    <div className={styles.banner}>
      <AlertTriangle size={13} className={styles.icon} />
      <span className={styles.text}>
        본 데모는 공개 데이터 기반 근거 탐색 및 Presales 제안 설계 전용입니다. 의료적 판단, 진단, 치료 권고를 제공하지 않습니다.
      </span>
    </div>
  )
}
