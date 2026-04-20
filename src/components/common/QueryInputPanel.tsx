'use client'

import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQuery } from '@/lib/query-context'
import type { BusinessObjective, Region, TimeYears, ProblemDomain, DataMaturity, BottleneckScenarioId } from '@/lib/types'
import { getAllScenarios, getScenario } from '@/lib/scenarios/registry'
import { inferScenarioHint } from '@/lib/scenarios/scenario-engine'
import styles from './QueryInputPanel.module.css'

// ─── 기존 예시 프리셋 (질환 예시) ─────────────────────────────────────────────

const EXAMPLE_PRESETS = [
  {
    label: '★ 대표 예시 — 폐암 / KRAS G12C',
    disease: 'Non-small cell lung cancer',
    target: 'KRAS G12C',
    drug: 'Sotorasib',
    objective: 'literature_intelligence' as BusinessObjective,
    region: 'Global' as Region,
    timeYears: 5 as TimeYears,
    problemDomain: 'literature_regulatory' as ProblemDomain,
    dataMaturity: 'developing' as DataMaturity,
    scenarioId: null as BottleneckScenarioId | null,
  },
  {
    label: '알츠하이머 / Amyloid-β',
    disease: 'Alzheimer disease',
    target: 'Amyloid beta',
    drug: 'Lecanemab',
    objective: 'trial_scouting' as BusinessObjective,
    region: 'US' as Region,
    timeYears: 3 as TimeYears,
    problemDomain: 'trial_competitive' as ProblemDomain,
    dataMaturity: 'developing' as DataMaturity,
    scenarioId: null as BottleneckScenarioId | null,
  },
  {
    label: 'HER2+ 유방암',
    disease: 'HER2-positive breast cancer',
    target: 'HER2',
    drug: 'Trastuzumab deruxtecan',
    objective: 'label_regulatory' as BusinessObjective,
    region: 'Global' as Region,
    timeYears: 5 as TimeYears,
    problemDomain: 'literature_regulatory' as ProblemDomain,
    dataMaturity: 'developing' as DataMaturity,
    scenarioId: null as BottleneckScenarioId | null,
  },
  {
    label: '★ EDP — 데이터 플랫폼',
    disease: '',
    target: '',
    drug: '',
    objective: 'scientific_qa' as BusinessObjective,
    region: 'Global' as Region,
    timeYears: 5 as TimeYears,
    problemDomain: 'data_infrastructure' as ProblemDomain,
    dataMaturity: 'developing' as DataMaturity,
    scenarioId: null as BottleneckScenarioId | null,
  },
  {
    label: '★ 신약 발굴 — 구조 예측',
    disease: 'Parkinson disease',
    target: 'LRRK2',
    drug: '',
    objective: 'scientific_qa' as BusinessObjective,
    region: 'Global' as Region,
    timeYears: 5 as TimeYears,
    problemDomain: 'drug_discovery_computational' as ProblemDomain,
    dataMaturity: 'nascent' as DataMaturity,
    scenarioId: null as BottleneckScenarioId | null,
  },
]

export default function QueryInputPanel() {
  const { state, setInput, submitSearch, setScenario } = useQuery()
  const { input, activeScenarioId } = state
  const searchParams = useSearchParams()
  const [captureMode, setCaptureMode] = useState(false)
  const [scenarioHint, setScenarioHint] = useState<BottleneckScenarioId | null>(null)
  const [examplesOpen, setExamplesOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('theme')
      if (stored === 'light') setIsDark(false)
    } catch { /* ignore */ }
  }, [])

  const toggleTheme = useCallback(() => {
    const next = !isDark
    setIsDark(next)
    try {
      if (next) {
        document.documentElement.removeAttribute('data-theme')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.setAttribute('data-theme', 'light')
        localStorage.setItem('theme', 'light')
      }
    } catch { /* ignore */ }
  }, [isDark])

  // 시나리오 레지스트리에서 4개 병목 시나리오 프리셋 생성
  const scenarioPresets = getAllScenarios().map((s) => ({
    label: s.shortLabel,
    disease: s.presetInput.disease,
    target: s.presetInput.target,
    drug: s.presetInput.drug,
    objective: s.presetInput.objective as BusinessObjective,
    region: s.presetInput.region as Region,
    timeYears: s.presetInput.timeYears as TimeYears,
    problemDomain: s.presetInput.problemDomain as ProblemDomain,
    dataMaturity: s.presetInput.dataMaturity as DataMaturity,
    scenarioId: s.id as BottleneckScenarioId,
  }))

  // Auto-enable capture mode when ?capture=1 is in URL
  useEffect(() => {
    if (searchParams.get('capture') === '1') {
      setCaptureMode(true)
      document.body.classList.add('capture-mode')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleCaptureMode = useCallback(() => {
    setCaptureMode((prev) => {
      const next = !prev
      document.body.classList.toggle('capture-mode', next)
      return next
    })
  }, [])

  function applyPreset(preset: typeof EXAMPLE_PRESETS[0] | typeof scenarioPresets[0]) {
    setInput({
      disease: preset.disease,
      target: preset.target,
      drug: preset.drug,
      objective: preset.objective,
      region: preset.region,
      timeYears: preset.timeYears,
      problemDomain: preset.problemDomain,
      dataMaturity: preset.dataMaturity,
    })
    setScenario(preset.scenarioId)

    // 예시 케이스 선택 시 관련 병목 시나리오 힌트 추론
    if (preset.scenarioId === null) {
      const hint = inferScenarioHint(preset.disease, preset.target)
      setScenarioHint(hint)
    } else {
      setScenarioHint(null)
    }
  }

  function applyScenarioHint() {
    if (!scenarioHint) return
    const scenario = getScenario(scenarioHint)
    if (!scenario) return
    setInput({
      disease: scenario.presetInput.disease,
      target: scenario.presetInput.target,
      drug: scenario.presetInput.drug,
      objective: scenario.presetInput.objective as BusinessObjective,
      region: scenario.presetInput.region as Region,
      timeYears: scenario.presetInput.timeYears as TimeYears,
      problemDomain: scenario.presetInput.problemDomain as ProblemDomain,
      dataMaturity: scenario.presetInput.dataMaturity as DataMaturity,
    })
    setScenario(scenarioHint)
    setScenarioHint(null)
  }

  return (
    <div className={styles.panel}>
      <div className={styles.appHeader}>
        <div>
          <div className={styles.appTitle}>Bio AI Presales 진단 콘솔</div>
          <div className={styles.appSubtitle}>고객 문제 유형을 6개 Bio AI 솔루션 경로로 진단하고 PoC 제안을 구조화합니다</div>
        </div>
        <div className={styles.headerBtns}>
          <button
            className={styles.themeBtn}
            onClick={toggleTheme}
            title={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
          >
            {isDark ? '☀ Light' : '☾ Dark'}
          </button>
          <button
            className={`${styles.captureBtn} ${captureMode ? styles.captureBtnActive : ''}`}
            onClick={toggleCaptureMode}
            title="캡처/발표 모드 토글"
          >
            {captureMode ? '📌 캡처 모드 해제' : '📸 캡처 모드'}
          </button>
        </div>
      </div>

      <div className={styles.form} data-no-capture>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>질환 / 적응증</label>
            <input
              className={styles.input}
              type="text"
              placeholder="예) Non-small cell lung cancer"
              value={input.disease}
              onChange={(e) => setInput({ disease: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>타깃 / 바이오마커</label>
            <input
              className={styles.input}
              type="text"
              placeholder="예) KRAS G12C"
              value={input.target}
              onChange={(e) => setInput({ target: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>약물 / 모달리티</label>
            <input
              className={styles.input}
              type="text"
              placeholder="예) Sotorasib"
              value={input.drug}
              onChange={(e) => setInput({ drug: e.target.value })}
            />
          </div>
        </div>

        <div className={styles.rowWide}>
          <div className={styles.field}>
            <label className={styles.label}>문제 유형</label>
            <select
              className={styles.select}
              value={input.problemDomain}
              onChange={(e) => setInput({ problemDomain: e.target.value as ProblemDomain })}
            >
              <option value="literature_regulatory">문헌 / 규제 인텔리전스</option>
              <option value="trial_competitive">임상 / 경쟁 인텔리전스</option>
              <option value="data_infrastructure">데이터 인프라 / 플랫폼 구축</option>
              <option value="drug_discovery_computational">신약 발굴 / 컴퓨테이셔널 분석</option>
              <option value="patient_digital_health">환자 데이터 / 디지털 헬스</option>
              <option value="kol_landscape">KOL / 랜드스케이프 인텔리전스</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>비즈니스 목표</label>
            <select
              className={styles.select}
              value={input.objective}
              onChange={(e) => setInput({ objective: e.target.value as BusinessObjective })}
            >
              <option value="literature_intelligence">문헌 인텔리전스</option>
              <option value="trial_scouting">임상시험 탐색</option>
              <option value="label_regulatory">라벨 / 규제 인텔리전스</option>
              <option value="scientific_qa">과학 Q&amp;A</option>
              <option value="kol_sponsor_landscape">KOL / 스폰서 랜드스케이프</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>데이터 성숙도</label>
            <select
              className={styles.select}
              value={input.dataMaturity}
              onChange={(e) => setInput({ dataMaturity: e.target.value as DataMaturity })}
            >
              <option value="nascent">초기 단계 (분산·비구조화)</option>
              <option value="developing">구축 중 (일부 구조화)</option>
              <option value="established">성숙 단계 (통합 파이프라인)</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>지역</label>
            <select
              className={styles.select}
              value={input.region}
              onChange={(e) => setInput({ region: e.target.value as Region })}
            >
              <option value="Global">글로벌</option>
              <option value="US">미국</option>
              <option value="KR">한국</option>
              <option value="EU">유럽</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>검색 기간</label>
            <select
              className={styles.select}
              value={input.timeYears}
              onChange={(e) => setInput({ timeYears: parseInt(e.target.value) as TimeYears })}
            >
              <option value={3}>최근 3년</option>
              <option value={5}>최근 5년</option>
              <option value={10}>최근 10년</option>
            </select>
          </div>
          <div className={styles.field} style={{ justifyContent: 'flex-end' }}>
            <label className={styles.label}>&nbsp;</label>
            <button className={styles.submitBtn} onClick={submitSearch}>
              진단 실행
            </button>
          </div>
        </div>

        {/* ── 빠른 시나리오 영역 ── */}
        <div className={styles.scenarioArea}>
          {/* 병목 시나리오 — 상단 고정 */}
          <div className={styles.presetGroup}>
            <span className={styles.presetLabelScenario}>병목 시나리오:</span>
            <div className={styles.presets}>
              {scenarioPresets.map((preset) => (
                <button
                  key={preset.scenarioId}
                  className={`${styles.presetBtnScenario} ${activeScenarioId === preset.scenarioId ? styles.presetBtnScenarioActive : ''}`}
                  onClick={() => applyPreset(preset)}
                  title={getAllScenarios().find(s => s.id === preset.scenarioId)?.bottleneckSummary}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* 예시 케이스 — 기본 숨김, 접기/펼치기 */}
          <div className={styles.presetGroup}>
            <button
              className={styles.examplesToggle}
              onClick={() => setExamplesOpen((o) => !o)}
            >
              <span className={`${styles.examplesChevron} ${examplesOpen ? styles.examplesChevronOpen : ''}`}>›</span>
              예시 케이스
            </button>
            {examplesOpen && (
              <div className={styles.presets}>
                {EXAMPLE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    className={styles.presetBtn}
                    onClick={() => applyPreset(preset)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 시나리오 힌트 카드 — 예시 케이스와 병목 프레임의 연결 */}
          {scenarioHint && !activeScenarioId && (
            <div className={styles.scenarioHintCard}>
              <span className={styles.scenarioHintIcon}>💡</span>
              <span className={styles.scenarioHintText}>
                이 예시 케이스는{' '}
                <span className={styles.scenarioHintName}>
                  [{getScenario(scenarioHint)?.shortLabel ?? scenarioHint}]
                </span>{' '}
                병목 프레임과 연결됩니다 — 시나리오를 적용하면 PoC / 아키텍처 해석이 더 구체화됩니다.
              </span>
              <button className={styles.scenarioHintBtn} onClick={applyScenarioHint}>
                이 프레임 적용 →
              </button>
              <button className={styles.scenarioHintClose} onClick={() => setScenarioHint(null)} title="닫기">
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
