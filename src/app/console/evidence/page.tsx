'use client'

import { useState, useEffect, useCallback } from 'react'
import { useQuery } from '@/lib/query-context'
import { fetchPubMed } from '@/lib/api/pubmed'
import { extractKeywords, generateEvidenceInterpretation, summarizeEvidenceThemes } from '@/lib/rules/evidence-summary'
import { isGenAIPath } from '@/lib/rules/solution-router'
import type { PubMedPaper, KeywordEntry } from '@/lib/types'
import SectionHeader from '@/components/common/SectionHeader'
import InterpretationBox from '@/components/common/InterpretationBox'
import PubMedResultsTable from '@/components/evidence/PubMedResultsTable'
import KeywordClusterChips from '@/components/evidence/KeywordClusterChips'
import SolutionConceptGuide from '@/components/solution/SolutionConceptGuide'
import ScenarioBottleneckBanner from '@/components/common/ScenarioBottleneckBanner'
import styles from './evidence.module.css'

export default function EvidencePage() {
  const { state } = useQuery()
  const { input, solutionRoute, hasSearched, activeScenarioId } = state

  const [papers, setPapers] = useState<PubMedPaper[]>([])
  const [keywords, setKeywords] = useState<KeywordEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFallback, setIsFallback] = useState(false)
  const [noCachedData, setNoCachedData] = useState(false)
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null)
  const [reviewOnly, setReviewOnly] = useState(false)

  // 병목 시나리오가 active할 때는 consulting 모드(개념 가이드)를 우회하고
  // 공개 근거 데이터(PubMed)를 항상 노출한다. 시나리오 배너 + signal context가
  // 서사 오버레이를 담당하므로, 사용자는 "외부 데이터가 사라진" UX 불일치 없이
  // 시나리오 관점에서 실제 문헌을 바로 읽을 수 있다.
  const showGenAI = !solutionRoute || isGenAIPath(solutionRoute.area) || activeScenarioId !== null

  const load = useCallback(async () => {
    if (!hasSearched || !showGenAI) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchPubMed(input, { reviewOnly })
      setPapers(data.papers)
      setKeywords(extractKeywords(data.papers))
      setIsFallback(data.fallback)
      setNoCachedData(Boolean(data.noCachedData))
      setFetchedAt(new Date())
    } catch {
      setError('Failed to fetch PubMed data. Showing example results.')
      setIsFallback(true)
      setNoCachedData(false)
    } finally {
      setLoading(false)
    }
  }, [input, hasSearched, reviewOnly, showGenAI])

  useEffect(() => {
    load()
  }, [load])

  const themes = summarizeEvidenceThemes(papers)
  const interpretation = papers.length > 0
    ? generateEvidenceInterpretation(papers, input.objective)
    : null

  return (
    <div>
      <SectionHeader
        title="솔루션 탐색"
        subtitle={showGenAI
          ? '문헌 검색·클러스터링을 통해 영업 제안용 인사이트로 전환'
          : '선택된 솔루션 영역의 개념 가이드 및 진단 질문'
        }
      />

      <div className={styles.content}>
        {!hasSearched ? (
          <div className={styles.empty}>
            <div className={styles.emptyTitle}>먼저 진단을 실행하세요</div>
            <p className={styles.emptyText}>문제 유형을 선택하고 진단 실행을 클릭하면 솔루션 탐색 콘텐츠가 로드됩니다.</p>
          </div>
        ) : !showGenAI && solutionRoute ? (
          <SolutionConceptGuide area={solutionRoute.area} solutionRoute={solutionRoute} />
        ) : (
          <>
            <ScenarioBottleneckBanner tab="evidence" />

            <div className={styles.filterBar}>
              <span className={styles.resultCount}>
                {loading ? '로딩 중...' : `논문 ${papers.length}편`}
              </span>
              <span className={styles.sourceBadge}>출처: PubMed / NCBI</span>
              {isFallback && !noCachedData && (
                <span className={styles.fallbackBadge}>⚠ 예비 데이터 사용 중 — 실시간 API 미응답</span>
              )}
              {noCachedData && (
                <span className={styles.fallbackBadge}>⚠ 캐시된 샘플 없음 — 이 쿼리는 실시간 API 응답이 필요합니다</span>
              )}
              {fetchedAt && !isFallback && (
                <span className={styles.fetchedAt}>
                  조회 {fetchedAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                </span>
              )}
              <label className={styles.filterToggle}>
                <input
                  type="checkbox"
                  checked={reviewOnly}
                  onChange={(e) => setReviewOnly(e.target.checked)}
                />
                리뷰 논문만
              </label>
            </div>

            {error && <div className={styles.error}>{error.replace('Failed to fetch PubMed data. Showing example results.', 'PubMed 데이터 조회 실패. 예시 결과를 표시합니다.')}</div>}

            {loading ? (
              <div className={styles.skeleton}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={styles.skeletonRow} />
                ))}
              </div>
            ) : noCachedData ? (
              <div className={styles.empty}>
                <div className={styles.emptyTitle}>이 쿼리에 대한 캐시된 샘플이 없습니다</div>
                <p className={styles.emptyText}>
                  실시간 PubMed API가 응답하지 않으면 문헌 결과를 표시할 수 없습니다. 시나리오 프레이밍·PoC 설계·아키텍처 탭은 문헌 데이터 없이도 정상 동작합니다.
                </p>
              </div>
            ) : (
              <>
                {keywords.length > 0 && (
                  <div className={styles.section}>
                    <KeywordClusterChips keywords={keywords} />
                  </div>
                )}

                {themes.length > 0 && (
                  <div className={styles.section}>
                    <div className={styles.sectionLabel}>근거 요약</div>
                    <div className={styles.themesList}>
                      {themes.map((theme, i) => (
                        <div key={i} className={styles.themeItem}>{theme}</div>
                      ))}
                    </div>
                  </div>
                )}

                <div className={styles.section}>
                  <div className={styles.sectionLabel}>주요 논문 ({papers.length}편)</div>
                  <PubMedResultsTable papers={papers} />
                </div>

                {interpretation && (
                  <InterpretationBox text={interpretation} />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
