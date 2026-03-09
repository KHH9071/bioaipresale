'use client'

import { useQuery } from '@/lib/query-context'
import SectionHeader from '@/components/common/SectionHeader'
import InterpretationBox from '@/components/common/InterpretationBox'
import OpportunityStatement from '@/components/overview/OpportunityStatement'
import PainPointCard from '@/components/overview/PainPointCard'
import KPIPreviewList from '@/components/overview/KPIPreviewList'
import styles from './overview.module.css'

export default function OverviewPage() {
  const { state } = useQuery()
  const { opportunity, input, hasSearched } = state

  return (
    <div>
      <SectionHeader
        title="개요"
        subtitle="바이오 질문을 AI Presales 기회로 구조화"
      />

      <div className={styles.content}>
        {!hasSearched ? (
          <div className={styles.empty}>
            <div className={styles.emptyTitle}>질환, 타깃 또는 약물을 입력하세요</div>
            <p className={styles.emptyText}>
              시나리오를 선택하거나 항목을 직접 입력한 후 <strong>기회 분석 실행</strong>을 클릭하면 Presales 기회 요약이 생성됩니다.
            </p>
          </div>
        ) : opportunity ? (
          <>
            <OpportunityStatement opportunity={opportunity} input={input} />

            <div className={styles.grid}>
              <div>
                <PainPointCard painPoints={opportunity.painPoints} />
              </div>
              <div>
                <div className={styles.pocBox}>
                  <div className={styles.pocLabel}>권장 PoC 유형</div>
                  <div className={styles.pocType}>{opportunity.pocType}</div>
                  <div className={styles.pocDesc}>{opportunity.pocTypeDescription}</div>
                </div>
              </div>
            </div>

            <KPIPreviewList kpis={opportunity.kpiPreview} />

            <InterpretationBox
              label="Presales 전략 노트"
              text={`이 기회는 ${opportunity.pocType} 패턴에 해당하며, 6~8주 내 검증된 납품 실적을 가진 잘 알려진 솔루션 아키텍처입니다. 이후 탭의 근거 데이터 및 임상 동향을 통해 PoC 제안 전 비즈니스 케이스를 구체화하시기 바랍니다.`}
            />
          </>
        ) : null}
      </div>
    </div>
  )
}
