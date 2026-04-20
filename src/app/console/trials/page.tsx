'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useQuery } from '@/lib/query-context'
import { fetchTrials } from '@/lib/api/trials'
import { isGenAIPath } from '@/lib/rules/solution-router'
import { getScenario } from '@/lib/scenarios/registry'
import type { ClinicalTrial, PhaseCount, SponsorEntry } from '@/lib/types'
import type { SignalMode } from '@/lib/scenarios/types'
import SectionHeader from '@/components/common/SectionHeader'
import InterpretationBox from '@/components/common/InterpretationBox'
import TrialSummaryCards from '@/components/trials/TrialSummaryCards'
import SponsorTable from '@/components/trials/SponsorTable'
import TrialListTable from '@/components/trials/TrialListTable'
import DataMarketGuide from '@/components/solution/DataMarketGuide'
import ScenarioBottleneckBanner from '@/components/common/ScenarioBottleneckBanner'
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

const SIGNAL_COLORS: Record<SignalMode, string> = {
  strong: '#3FB950',
  moderate: '#58A6FF',
  limited: '#8B949E',
}

const SIGNAL_LABELS: Record<SignalMode, string> = {
  strong: '임상 신호 강함',
  moderate: '임상 신호 중간',
  limited: '임상 신호 제한적',
}

interface ScenarioSignalContext {
  signalMode: SignalMode
  title: string
  body: string
  primaryAxis: string | null
  dimTrialData: boolean
}

function getScenarioSignalContext(activeScenarioId: string | null): ScenarioSignalContext | null {
  if (!activeScenarioId) return null
  const scenario = getScenario(activeScenarioId as Parameters<typeof getScenario>[0])
  if (!scenario) return null

  const { signalMode, signalNote, guidance } = scenario.tabContent.trials

  if (signalMode === 'limited') {
    return {
      signalMode,
      title: '주요 근거 축 전환 — 문헌 & 플랫폼 신호 우선',
      body: `${signalNote} ${guidance}`,
      primaryAxis: '주요 근거 축: 문헌 합성 · 플랫폼 신호',
      dimTrialData: true,
    }
  }
  if (signalMode === 'moderate') {
    return {
      signalMode,
      title: '임상 신호 맥락 — 문헌 합성과 함께 읽기',
      body: `${signalNote} ${guidance}`,
      primaryAxis: null,
      dimTrialData: false,
    }
  }
  // strong
  return {
    signalMode,
    title: '임상 신호 해석 — 시나리오 관점',
    body: `${signalNote} ${guidance}`,
    primaryAxis: null,
    dimTrialData: false,
  }
}

function generateTrialInterpretation(
  studies: ClinicalTrial[],
  total: number,
  activeScenarioId: string | null,
): string {
  const recruiting = studies.filter((s) => s.status === 'Recruiting').length
  const sponsorCount = new Set(studies.map((s) => s.sponsor).filter(Boolean)).size
  const phaseIIICount = studies.filter((s) => s.phase === 'Phase III').length

  // limited 시나리오: 임상 데이터 부족 자체가 Pain Point의 증거
  if (activeScenarioId) {
    const scenario = getScenario(activeScenarioId as Parameters<typeof getScenario>[0])
    if (scenario?.tabContent.trials.signalMode === 'limited') {
      if (total === 0) {
        return '임상시험 데이터 부재는 이 시나리오의 핵심 Pain Point를 반영합니다. 현재 단계는 clinical validation이 아닌 hypothesis support / translation framing이 적합하며, 문헌 합성과 플랫폼 지식 통합이 주요 근거 축입니다.'
      }
      return `임상시험 ${total}건이 확인되나, 이 시나리오에서 임상 신호는 보조적 맥락입니다. 기존 접근법(엑손 스키핑 등) 데이터는 경쟁 구도 파악에 활용하고, PoC의 핵심 가치는 분산된 전임상·문헌 근거의 통합 탐색에 있습니다.`
    }
    if (scenario?.tabContent.trials.signalMode === 'strong') {
      if (total === 0) return '해당 쿼리에서 활성 임상시험 데이터를 찾을 수 없습니다. 다른 키워드로 재시도하거나 문헌 탭을 먼저 확인하세요.'
      return `임상 신호가 강합니다: 총 ${total}건, ${recruiting}건 모집 중, ${sponsorCount}개 스폰서. 다만 이 시나리오의 차별화 포인트는 RCT 대상군 밖 실제 환자(RWD)의 반응 예측에 있으므로, 임상 데이터는 경쟁 구도와 승인 근거 파악에 활용하고 내부 EMR 데이터 연동 가능성을 병행 탐색하는 것이 중요합니다.`
    }
  }

  if (total === 0) return '해당 쿼리에서 활성 임상시험 데이터를 찾을 수 없습니다. 초기 단계 적응증이거나 데이터가 부족한 경우일 수 있으며, 이 단계에서는 문헌 인텔리전스 PoC가 더 적합할 수 있습니다.'

  if (phaseIIICount >= 3) {
    return `높은 임상 활동이 감지되었습니다: 총 ${total}건, 현재 모집 중 ${recruiting}건, 고유 스폰서 ${sponsorCount}개사. ${phaseIIICount}건의 Phase III 임상시험은 성숙한 경쟁 구도를 시사하며, 스폰서 인텔리전스 및 임상시험 탐색의 BD 우선순위가 높습니다.`
  }

  return `중간 수준의 임상 활동이 확인됩니다: 총 ${total}건, ${sponsorCount}개 스폰서에 걸쳐 ${recruiting}건 모집 중. 초기~중기 단계 집중은 신흥 적응증임을 시사하며, 선제적 임상 모니터링과 경쟁사 탐색이 유의미한 BD 우위를 제공할 수 있습니다.`
}

export default function TrialsPage() {
  const { state } = useQuery()
  const { input, solutionRoute, hasSearched, activeScenarioId } = state

  const [studies, setStudies] = useState<ClinicalTrial[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFallback, setIsFallback] = useState(false)
  const [noCachedData, setNoCachedData] = useState(false)
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null)

  // 병목 시나리오가 active할 때는 consulting 모드(임상 동향 가이드)를 우회하고
  // 공개 근거 데이터(ClinicalTrials.gov)를 항상 노출한다. signal-aware 렌더링이
  // limited/moderate/strong 맥락을 제공하므로, 사용자는 시나리오 관점에서
  // 실제 임상 데이터를 직접 확인할 수 있다.
  const showGenAI = !solutionRoute || isGenAIPath(solutionRoute.area) || activeScenarioId !== null

  const load = useCallback(async () => {
    if (!hasSearched || !showGenAI) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchTrials(input)
      setStudies(data.studies)
      setTotal(data.total)
      setIsFallback(data.fallback)
      setNoCachedData(Boolean(data.noCachedData))
      setFetchedAt(new Date())
    } catch {
      setError('Failed to fetch trial data. Showing example results.')
      setIsFallback(true)
      setNoCachedData(false)
    } finally {
      setLoading(false)
    }
  }, [input, hasSearched, showGenAI])

  useEffect(() => {
    load()
  }, [load])

  const phaseData = computePhaseCounts(studies)
  const sponsorData = computeSponsorCounts(studies)
  const interpretation = hasSearched && showGenAI && !noCachedData
    ? generateTrialInterpretation(studies, total, activeScenarioId)
    : null
  const signalContext = hasSearched && showGenAI ? getScenarioSignalContext(activeScenarioId) : null

  return (
    <div>
      <SectionHeader
        title="임상 동향"
        subtitle={showGenAI
          ? 'ClinicalTrials.gov 기반 경쟁 환경·스폰서 랜드스케이프 파악'
          : '데이터 성숙도 진단 및 시장 맥락 가이드'
        }
      />

      <div className={styles.content}>
        {!hasSearched ? (
          <div className={styles.empty}>
            <div className={styles.emptyTitle}>먼저 진단을 실행하세요</div>
            <p className={styles.emptyText}>문제 유형을 선택하고 진단 실행을 클릭하면 임상 동향 콘텐츠가 로드됩니다.</p>
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
            <ScenarioBottleneckBanner tab="trials" />

            {/* ── Scenario Signal Context Card ── */}
            {signalContext && (
              <div
                className={`${styles.signalContextCard} ${
                  signalContext.signalMode === 'limited' ? styles.signalContextLimited :
                  signalContext.signalMode === 'moderate' ? styles.signalContextModerate :
                  styles.signalContextStrong
                }`}
              >
                <div className={styles.signalContextHeader}>
                  <span
                    className={styles.signalModeBadge}
                    style={{
                      color: SIGNAL_COLORS[signalContext.signalMode],
                      borderColor: `${SIGNAL_COLORS[signalContext.signalMode]}40`,
                    }}
                  >
                    {SIGNAL_LABELS[signalContext.signalMode]}
                  </span>
                  <span className={styles.signalContextTitle}>{signalContext.title}</span>
                </div>
                <p className={styles.signalContextBody}>{signalContext.body}</p>
                {signalContext.primaryAxis && (
                  <span className={styles.primaryAxisTag}>{signalContext.primaryAxis}</span>
                )}
              </div>
            )}

            <div className={styles.dataBar}>
              <span className={styles.sourceBadge}>출처: ClinicalTrials.gov v2</span>
              {isFallback && !noCachedData ? (
                <span className={styles.fallbackBadge}>⚠ 예비 데이터 사용 중 — 실시간 API 미응답</span>
              ) : noCachedData ? (
                <span className={styles.fallbackBadge}>⚠ 캐시된 샘플 없음 — 이 쿼리는 실시간 API 응답이 필요합니다</span>
              ) : fetchedAt ? (
                <span className={styles.fetchedAt}>
                  조회 {fetchedAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                </span>
              ) : null}
            </div>
            {error && <div className={styles.error}>{error}</div>}

            {noCachedData ? (
              <div className={styles.empty}>
                <div className={styles.emptyTitle}>이 쿼리에 대한 캐시된 샘플이 없습니다</div>
                <p className={styles.emptyText}>
                  실시간 ClinicalTrials.gov API가 응답하지 않으면 임상시험 결과를 표시할 수 없습니다. 시나리오 해석·PoC 설계·아키텍처 탭은 임상 데이터 없이도 정상 동작합니다.
                </p>
              </div>
            ) : (
              /* limited 시나리오: 임상 데이터 섹션을 dimmed wrapper로 감쌈 */
              <div className={signalContext?.dimTrialData ? styles.trialDataDimmed : undefined}>
                <TrialSummaryCards studies={studies} total={total} />

                <div className={styles.chartRow}>
                  <PhaseChart data={phaseData} />
                  <SponsorTable sponsors={sponsorData} />
                </div>

                <div className={styles.section}>
                  <div className={styles.sectionLabel}>임상시험 목록 ({studies.length}건)</div>
                  <TrialListTable studies={studies} />
                </div>
              </div>
            )}

            {interpretation && (
              <InterpretationBox text={interpretation} />
            )}
          </>
        )}
      </div>
    </div>
  )
}
