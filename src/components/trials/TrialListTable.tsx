import type { ClinicalTrial } from '@/lib/types'
import styles from './TrialListTable.module.css'

interface Props {
  studies: ClinicalTrial[]
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === 'Recruiting' ? styles.statusRecruiting
    : status === 'Active' ? styles.statusActive
    : status === 'Completed' ? styles.statusCompleted
    : styles.statusOther

  return <span className={`${styles.status} ${cls}`}>{status}</span>
}

export default function TrialListTable({ studies }: Props) {
  if (studies.length === 0) return null

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>NCT ID</th>
            <th>Title</th>
            <th>Phase</th>
            <th>Status</th>
            <th>Sponsor</th>
            <th>Country</th>
          </tr>
        </thead>
        <tbody>
          {studies.map((trial) => (
            <tr key={trial.nctId}>
              <td>
                <a
                  className={styles.nctId}
                  href={`https://clinicaltrials.gov/study/${trial.nctId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {trial.nctId}
                </a>
              </td>
              <td>
                <span className={styles.title}>{trial.title}</span>
              </td>
              <td>
                <span className={styles.phase}>{trial.phase}</span>
              </td>
              <td>
                <StatusBadge status={trial.status} />
              </td>
              <td>
                <span className={styles.sponsor}>{trial.sponsor}</span>
              </td>
              <td>
                <span className={styles.country}>{trial.country}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
