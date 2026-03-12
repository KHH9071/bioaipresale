'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useQuery } from '@/lib/query-context'
import { fetchTrials } from '@/lib/api/trials'
import { isGenAIPath } from '@/lib/rules/solution-router'
import type { ClinicalTrial, PhaseCount, SponsorEntry } from '@/lib/types'
import SectionHeader from '@/components/common/SectionHeader'
import InterpretationBox from '@/components/common/InterpretationBox'
import TrialSummaryCards from '@/components/trials/TrialSummaryCards'
import SponsorTable from '@/components/trials/SponsorTable'
import TrialListTable from '@/components/trials/TrialListTable'
import DataMarketGuide from '@/components/solution/DataMarketGuide'
import styles from './trials.module.css'

const PhaseChart = dynamic(() => import('@/components/trials/PhaseChart'), { ssr: false })

function computePhaseCounts(studies: ClinicalTrial[]): PhaseCount[] {
  const counts: Record<string, number> = {}
  for (const s of studies) {
    const phase = s.phase || 'N/A'
    counts[phase] = (counts[phase] ?? 0) + 1
  }
  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([phase, count]) => ({ phase, count }))
}

function computeSponsorCounts(studies: ClinicalTrial[]): SponsorEntry[] {
  const map: Record<string, { count: number; condition: string }> = {}
  for (const s of studies) {
    const name = s.sponsor
    if (!name) continue
    if (!map[name]) map[name] = { count: 0, condition: s.condition }
    map[name].count++
  }
  return Object.entries(map)
    .sort(([, a], [, b]) => b.count - a.count)
    .map(([name, { count, condition }]) => ({ name, count, condition }))
}

function generateTrialInterpretation(studies: ClinicalTrial[], total: number): string {
  const recruiting = studies.filter((s) => s.status === 'Recruiting').length
  const sponsorCount = new Set(studies.map((s) => s.sponsor).filter(Boolean)).size
  const phaseIIICount = studies.filter((s) => s.phase === 'Phase III').length

  if (total === 0) return '해당 쿼리에서 활성 임상시험 데이터를 찾을 수 없습니다. 초기 단계 적응증이거나 데이터가 부족한 경우일 수 있으며, 이 단계에서는 문헌 인텔리전스 PoC가 더 적합할 수 있습니다.'

  if (phaseIIICount >= 3) {
    return `높은 임상 활동이 감지되었습니다: 총 ${total}건, 현재 모집 중 ${recruiting}건, 고유 스폰서 ${sponsorCount}개사. ${phaseIIICount}건의 Phase III 임상시험은 성숙한 경쟁 구도를 시사하며, 스폰서 인텔리전스 및 임상 스카우팅의 BD 우선순위가 높습니다.`
  }

  return `중간 수준의 임상 활동이 확인됩니다: 총 ${total}건, ${sponsorCount}개 스폰서에 걸쳐 ${recruiting}건 모집 중. 초기~중기 단계 집중은 신흥 적응증임을 시사하며, 선제적 임상 모니터링과 경쟁사 스카우팅이 유의미한 BD 우위를 제공할 수 있습니다.`
}

export default function TrialsPage() {
  const { state } = useQuery()
  const { input, solutionRoute, hasSearched } = state

  const [studies, setStudies] = useState<ClinicalTrial[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFallback, setIsFallback] = useState(false)
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null)

  const showGenAI = !solutionRoute || isGenAIPath(solutionRoute.area)

  const load = useCallback(async () => {
    if (!hasSearched || !showGenAI) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchTrials(input)
      setStudies(data.studies)
      setTotal(data.total)
      setIsFallback(data.fallback)
      setFetchedAt(new Date())
    } catch {
      setError('Failed to fetch trial data. Showing example results.')
      setIsFallback(true)
    } finally {
      setLoading(false)
    }
  }, [input, hasSearched, showGenAI])

  useEffect(() => {
    load()
  }, [load])

  const phaseData = computePhaseCounts(studies)
  const sponsorData = computeSponsorCounts(studies)
  const interpretation = hasSearched && showGenAI ? generateTrialInterpretation(studies, total) : null

  return (
    <div>
      <SectionHeader
        title="데이터 & 시장"
        subtitle={showGenAI
          ? '분산된 임상시험 신호를 비즈니스 판독 가능한 랜드스케이프로 전환'
          : '데이터 성숙도 진단 및 시장 맥락 가이드'
        }
      />

      <div className={styles.content}>
        {!hasSearched ? (
          <div className={styles.empty}>
            <div className={styles.emptyTitle}>먼저 진단을 실행하세요</div>
            <p className={styles.emptyText}>문제 유형을 선택하고 진단 실행을 클릭하면 데이터 & 시장 콘텐츠가 로드됩니다.</p>
          </div>
        ) : !showGenAI && solutionRoute ? (
          <DataMarketGuide
            area={solutionRoute.area}
            dataMaturity={input.dataMaturity}
            solutionRoute={solutionRoute}
          />
        ) : loading ? (
          <div className={styles.skeleton}>
            {[...Array(4)].map((_, i) => <div key={i} className={styles.skeletonCard} />)}
          </div>
        ) : (
          <>
            <div className={styles.dataBar}>
              <span className={styles.sourceBadge}>출처: ClinicalTrials.gov v2</span>
              {isFallback ? (
                <span className={styles.fallbackBadge}>⚠ 예비 데이터 사용 중 — 실시간 API 미응답</span>
              ) : fetchedAt ? (
                <span className={styles.fetchedAt}>
                  조회 {fetchedAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                </span>
              ) : null}
            </div>
            {error && <div className={styles.error}>{error}</div>}

            <TrialSummaryCards studies={studies} total={total} />

            <div className={styles.chartRow}>
              <PhaseChart data={phaseData} />
              <SponsorTable sponsors={sponsorData} />
            </div>

            <div className={styles.section}>
              <div className={styles.sectionLabel}>임상시험 목록 ({studies.length}건)</div>
              <TrialListTable studies={studies} />
            </div>

            {interpretation && (
              <InterpretationBox text={interpretation} />
            )}
          </>
        )}
      </div>
    </div>
  )
}
