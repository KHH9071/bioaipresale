'use client'

import { useQuery } from '@/lib/query-context'
import SectionHeader from '@/components/common/SectionHeader'
import InterpretationBox from '@/components/common/InterpretationBox'
import OpportunityStatement from '@/components/overview/OpportunityStatement'
import PainPointCard from '@/components/overview/PainPointCard'
import KPIPreviewList from '@/components/overview/KPIPreviewList'
import SolutionPathSection from '@/components/overview/SolutionPathSection'
import styles from './overview.module.css'

export default function OverviewPage() {
  const { state } = useQuery()
  const { opportunity, solutionRoute, input, hasSearched } = state

  return (
    <div>
      <SectionHeader
        title="문제 진단"
        subtitle="고객 문제 유형을 Bio AI 솔루션 경로로 진단하고 기회를 구조화"
      />

      <div className={styles.content}>
        {!hasSearched ? (
          <div className={styles.empty}>
            <div className={styles.emptyTitle}>문제 유형을 선택하고 진단을 실행하세요</div>
            <p className={styles.emptyText}>
              시나리오를 선택하거나 문제 유형을 직접 설정한 후 <strong>진단 실행</strong>을 클릭하면 솔루션 경로 진단 및 Presales 기회 요약이 생성됩니다.
            </p>
          </div>
        ) : (
          <>
            {solutionRoute && (
              <SolutionPathSection solutionRoute={solutionRoute} />
            )}

            {opportunity && (
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
                  text={`이 기회는 ${opportunity.pocType} 패턴에 해당하며, 6~8주 내 검증된 납품 실적을 가진 잘 알려진 솔루션 아키텍처입니다. 상단의 솔루션 경로 카드의 발견 질문을 활용해 고객 인터뷰를 구조화하고, 이후 탭에서 솔루션별 상세 콘텐츠를 확인하세요.`}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
