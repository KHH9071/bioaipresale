'use client'

import { useState, useRef } from 'react'
import { useQuery } from '@/lib/query-context'
import { isGenAIPath } from '@/lib/rules/solution-router'
import type { PrimaryUser, DataAvailability, DeliveryPreference } from '@/lib/types'
import SectionHeader from '@/components/common/SectionHeader'
import NonGenAIPoCPanel from '@/components/poc/NonGenAIPoCPanel'
import styles from './poc.module.css'

const WEEK_COLORS = ['#58A6FF', '#3FB950', '#D29922', '#BC8CFF', '#F85149', '#8B949E']

const OBJECTIVE_LABELS: Record<string, string> = {
  literature_intelligence: '문헌 인텔리전스',
  trial_scouting: '임상시험 스카우팅',
  label_regulatory: '라벨 / 규제 인텔리전스',
  scientific_qa: '과학 Q&A',
  kol_sponsor_landscape: 'KOL / 스폰서 랜드스케이프',
}

function generateBriefMarkdown(
  input: ReturnType<typeof useQuery>['state']['input'],
  opportunity: ReturnType<typeof useQuery>['state']['opportunity'],
  pocProposal: ReturnType<typeof useQuery>['state']['pocProposal'],
  generatedAt: string,
): string {
  if (!opportunity || !pocProposal) return ''

  const subject = [input.disease, input.target, input.drug].filter(Boolean).join(' / ')

  return `# Bio AI Presales PoC 제안 초안
생성 일시: ${generatedAt}
출처: Bio AI Presales 데모 콘솔 (규칙 기반 PoC 프레이밍, 공개 데이터 한정)
주의: 본 문서는 연구 및 Presales 기획 전용입니다. 임상적 의사결정에 사용할 수 없습니다.

---

## 쿼리 요약
- 질환 / 적응증: ${input.disease || '—'}
- 타깃 / 바이오마커: ${input.target || '—'}
- 약물 / 모달리티: ${input.drug || '—'}
- 비즈니스 목표: ${OBJECTIVE_LABELS[input.objective]}
- 지역: ${input.region} | 검색 기간: 최근 ${input.timeYears}년

---

## 고객 기회 요약
${opportunity.opportunityStatement}

## 권장 PoC 유형
**${opportunity.pocType}**
${pocProposal.solutionDescription}

---

## 고객 Pain Points
${opportunity.painPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}

---

## AI 도입 근거 / 도입 시점
**AI 도입 근거:** ${pocProposal.whyAI}

**지금 도입해야 하는 이유:** ${pocProposal.whyNow}

---

## 문제 정의
${pocProposal.problemDefinition}

---

## 6주 PoC 범위
${pocProposal.sixWeekScope.map(w => `- **${w.week}주차: ${w.title}** — ${w.description}`).join('\n')}

---

## 성공 KPI
${pocProposal.kpis.map(k => `- **${k.metric}**: ${k.target}\n  _(기준선: ${k.baseline})_`).join('\n')}

---

## 데이터 요건
**공개 데이터:** ${pocProposal.dataNeeded.public.join(', ')}
**내부 데이터:** ${pocProposal.dataNeeded.internal.join(', ')}
**PoC 이후 확장:** ${pocProposal.dataNeeded.extension.join(', ')}

---

## 주요 리스크 및 가드레일
${pocProposal.risks.map(r => `- ⚠ **${r.risk}** → ✓ ${r.guardrail}`).join('\n')}

---

## 참조 아키텍처 요약
외부 공개 데이터 → 수집/ETL → 메타데이터 정규화 → 검색 인덱스/벡터 스토어 → LLM 오케스트레이션 → 가드레일/인용 엔진 → 웹 앱/사용자 레이어 → 로깅/평가

---

*본 제안 초안은 공개 근거 신호와 규칙 기반 PoC 프레이밍 엔진으로 자동 생성되었습니다.
쿼리: ${subject} | 목표: ${OBJECTIVE_LABELS[input.objective]} | ${input.region} | 최근 ${input.timeYears}년*
`
}

export default function PoCPage() {
  const { state, setPoCOptions } = useQuery()
  const { pocProposal, pocOptions, solutionRoute, input, hasSearched, opportunity } = state

  const showGenAI = !solutionRoute || isGenAIPath(solutionRoute.area)

  const [briefOpen, setBriefOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const briefRef = useRef<HTMLTextAreaElement>(null)

  const generatedAt = new Date().toLocaleString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  })

  const briefText = briefOpen
    ? generateBriefMarkdown(input, opportunity, pocProposal, generatedAt)
    : ''

  function handleCopy() {
    if (!briefRef.current) return
    briefRef.current.select()
    navigator.clipboard.writeText(briefText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div>
      <SectionHeader
        title="PoC 설계"
        subtitle="근거 데이터를 실행 가능한 Presales 제안으로 구조화"
      />

      <div className={styles.content}>
        {!hasSearched ? (
          <div className={styles.empty}>
            <div className={styles.emptyTitle}>먼저 진단을 실행하세요</div>
            <p className={styles.emptyText}>문제 유형을 선택하고 진단 실행을 클릭하면 PoC 설계 프레임워크가 생성됩니다.</p>
          </div>
        ) : !showGenAI && solutionRoute ? (
          <NonGenAIPoCPanel area={solutionRoute.area} />
        ) : pocProposal ? (
          <>
            {/* Source badge */}
            <div className={styles.sourceBar}>
              <span className={styles.sourceBadge}>규칙 기반 PoC 프레이밍 엔진 생성</span>
              <span className={styles.sourceNote}>LLM 환각 없음 — 모든 출력은 결정론적 규칙 매핑 결과입니다</span>
            </div>

            {/* Additional Inputs */}
            <div className={styles.optionsBar} data-no-capture>
              <div className={styles.optionField}>
                <label className={styles.optionLabel}>주요 사용자</label>
                <select
                  className={styles.optionSelect}
                  value={pocOptions.primaryUser}
                  onChange={(e) => setPoCOptions({ primaryUser: e.target.value as PrimaryUser })}
                >
                  <option value="research_scientist">연구원 (Research Scientist)</option>
                  <option value="medical_affairs">메디컬 어페어스</option>
                  <option value="bd_strategy">BD / 전략</option>
                  <option value="regulatory">규제 / 라벨링</option>
                </select>
              </div>
              <div className={styles.optionField}>
                <label className={styles.optionLabel}>내부 데이터 가용성</label>
                <select
                  className={styles.optionSelect}
                  value={pocOptions.dataAvailability}
                  onChange={(e) => setPoCOptions({ dataAvailability: e.target.value as DataAvailability })}
                >
                  <option value="low">낮음</option>
                  <option value="medium">중간</option>
                  <option value="high">높음</option>
                </select>
              </div>
              <div className={styles.optionField}>
                <label className={styles.optionLabel}>납품 방식</label>
                <select
                  className={styles.optionSelect}
                  value={pocOptions.deliveryPreference}
                  onChange={(e) => setPoCOptions({ deliveryPreference: e.target.value as DeliveryPreference })}
                >
                  <option value="fast_poc">빠른 PoC</option>
                  <option value="reusable_platform">재사용 가능 플랫폼</option>
                  <option value="executive_demo">임원 데모</option>
                </select>
              </div>
            </div>

            <div className={styles.grid}>
              {/* Left column */}
              <div className={styles.leftCol}>
                {/* Problem Definition */}
                <div className={styles.block}>
                  <div className={styles.blockLabel}>문제 정의</div>
                  <p className={styles.blockText}>{pocProposal.problemDefinition}</p>
                </div>

                {/* Why AI / Why Now */}
                <div className={styles.block}>
                  <div className={styles.blockLabel}>AI 도입 근거</div>
                  <p className={styles.blockText}>{pocProposal.whyAI}</p>
                  <div className={styles.blockLabel} style={{ marginTop: 12 }}>지금 도입해야 하는 이유</div>
                  <p className={styles.blockText}>{pocProposal.whyNow}</p>
                </div>

                {/* Solution Pattern */}
                <div className={styles.block}>
                  <div className={styles.blockLabel}>권장 솔루션 패턴</div>
                  <div className={styles.solutionName}>{pocProposal.solutionPattern}</div>
                  <p className={styles.blockText}>{pocProposal.solutionDescription}</p>
                </div>

                {/* Data Needed */}
                <div className={styles.block}>
                  <div className={styles.blockLabel}>데이터 요건</div>
                  <div className={styles.dataSection}>
                    <div className={styles.dataLabel}>공개 데이터</div>
                    <ul className={styles.dataList}>
                      {pocProposal.dataNeeded.public.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.dataSection}>
                    <div className={styles.dataLabel}>내부 데이터</div>
                    <ul className={styles.dataList}>
                      {pocProposal.dataNeeded.internal.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.dataSection}>
                    <div className={styles.dataLabel}>확장 데이터 (PoC 이후)</div>
                    <ul className={styles.dataList}>
                      {pocProposal.dataNeeded.extension.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className={styles.rightCol}>
                {/* 6-Week Scope */}
                <div className={styles.block}>
                  <div className={styles.blockLabel}>6주 PoC 범위</div>
                  <div className={styles.timeline}>
                    {pocProposal.sixWeekScope.map((week, i) => (
                      <div key={i} className={styles.weekItem}>
                        <div
                          className={styles.weekDot}
                          style={{ background: WEEK_COLORS[i] }}
                        />
                        <div className={styles.weekContent}>
                          <div className={styles.weekTitle}>
                            <span style={{ color: WEEK_COLORS[i] }}>{week.week}주차</span>
                            {' — '}{week.title}
                          </div>
                          <div className={styles.weekDesc}>{week.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* KPIs */}
                <div className={styles.block}>
                  <div className={styles.blockLabel}>성공 KPI</div>
                  <div className={styles.kpiList}>
                    {pocProposal.kpis.map((kpi, i) => (
                      <div key={i} className={styles.kpiItem}>
                        <div className={styles.kpiMetric}>{kpi.metric}</div>
                        <div className={styles.kpiTarget}>{kpi.target}</div>
                        <div className={styles.kpiBaseline}>{kpi.baseline}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risks */}
                <div className={styles.block}>
                  <div className={styles.blockLabel}>주요 리스크 및 가드레일</div>
                  <div className={styles.riskList}>
                    {pocProposal.risks.map((item, i) => (
                      <div key={i} className={styles.riskItem}>
                        <div className={styles.riskText}>
                          <span className={styles.riskIcon}>⚠</span>
                          {item.risk}
                        </div>
                        <div className={styles.guardrailText}>
                          <span className={styles.guardrailIcon}>✓</span>
                          {item.guardrail}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Generate PoC Brief ─────────────────────────────── */}
            <div className={styles.briefSection}>
              <div className={styles.briefHeader}>
                <div className={styles.briefHeaderLeft}>
                  <div className={styles.briefTitle}>PoC 제안 초안 생성</div>
                  <div className={styles.briefSubtitle}>
                    이 화면의 내용을 복사 가능한 제안 초안으로 통합합니다 — Notion, 이메일, 슬라이드 노트에 바로 붙여넣을 수 있습니다.
                  </div>
                </div>
                <button
                  className={styles.briefBtn}
                  onClick={() => setBriefOpen(!briefOpen)}
                >
                  {briefOpen ? '초안 닫기' : 'PoC 제안 초안 생성 ↓'}
                </button>
              </div>

              {briefOpen && (
                <div className={styles.briefBody}>
                  <div className={styles.briefToolbar}>
                    <span className={styles.briefFormat}>Markdown · 일반 텍스트</span>
                    <button className={styles.copyBtn} onClick={handleCopy}>
                      {copied ? '✓ 복사 완료' : '클립보드에 복사'}
                    </button>
                  </div>
                  <textarea
                    ref={briefRef}
                    className={styles.briefTextarea}
                    readOnly
                    value={briefText}
                    rows={30}
                  />
                </div>
              )}
            </div>

            <div className={styles.footer}>
              <div className={styles.footerNote}>
                제안 대상: <strong>{[input.disease, input.target, input.drug].filter(Boolean).join(' / ')}</strong>
                {' · '}{OBJECTIVE_LABELS[input.objective]} · {input.region}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
