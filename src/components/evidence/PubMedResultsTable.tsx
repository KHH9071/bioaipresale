import type { PubMedPaper } from '@/lib/types'
import styles from './PubMedResultsTable.module.css'

interface Props {
  papers: PubMedPaper[]
}

export default function PubMedResultsTable({ papers }: Props) {
  if (papers.length === 0) return null

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>PMID</th>
            <th>Title</th>
            <th>Journal</th>
            <th>Year</th>
            <th>Abstract Snippet</th>
          </tr>
        </thead>
        <tbody>
          {papers.map((paper) => (
            <tr key={paper.pmid}>
              <td>
                <a
                  className={styles.pmid}
                  href={`https://pubmed.ncbi.nlm.nih.gov/${paper.pmid}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {paper.pmid}
                </a>
              </td>
              <td>
                <span className={styles.title}>{paper.title}</span>
              </td>
              <td>
                <span className={styles.journal}>{paper.journal}</span>
              </td>
              <td>
                <span className={styles.year}>{paper.year}</span>
              </td>
              <td>
                <span className={styles.abstract}>{paper.abstract}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
