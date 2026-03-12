'use client'

import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQuery } from '@/lib/query-context'
import type { BusinessObjective, Region, TimeYears, ProblemDomain, DataMaturity } from '@/lib/types'
import styles from './QueryInputPanel.module.css'

const PRESETS = [
  {
    label: '★ 대표 시나리오 — 폐암 / KRAS G12C',
    disease: 'Non-small cell lung cancer',
    target: 'KRAS G12C',
    drug: 'Sotorasib',
    objective: 'literature_intelligence' as BusinessObjective,
    region: 'Global' as Region,
    timeYears: 5 as TimeYears,
    problemDomain: 'literature_regulatory' as ProblemDomain,
    dataMaturity: 'developing' as DataMaturity,
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
  },
  {
    label: '★ 데이터 플랫폼 시나리오 — EDP',
    disease: '',
    target: '',
    drug: '',
    objective: 'scientific_qa' as BusinessObjective,
    region: 'Global' as Region,
    timeYears: 5 as TimeYears,
    problemDomain: 'data_infrastructure' as ProblemDomain,
    dataMaturity: 'developing' as DataMaturity,
  },
  {
    label: '★ 신약 발굴 시나리오 — 구조 예측',
    disease: 'Parkinson disease',
    target: 'LRRK2',
    drug: '',
    objective: 'scientific_qa' as BusinessObjective,
    region: 'Global' as Region,
    timeYears: 5 as TimeYears,
    problemDomain: 'drug_discovery_computational' as ProblemDomain,
    dataMaturity: 'nascent' as DataMaturity,
  },
]

export default function QueryInputPanel() {
  const { state, setInput, submitSearch } = useQuery()
  const { input } = state
  const searchParams = useSearchParams()
  const [captureMode, setCaptureMode] = useState(false)

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

  function applyPreset(preset: typeof PRESETS[0]) {
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
  }

  return (
    <div className={styles.panel}>
      <div className={styles.appHeader}>
        <div>
          <div className={styles.appTitle}>Bio AI Presales 진단 콘솔</div>
          <div className={styles.appSubtitle}>고객 문제 유형을 6개 Bio AI 솔루션 경로로 진단하고 PoC 제안을 구조화합니다</div>
        </div>
        <button
          className={`${styles.captureBtn} ${captureMode ? styles.captureBtnActive : ''}`}
          onClick={toggleCaptureMode}
          title="캡처/발표 모드 토글"
        >
          {captureMode ? '📌 캡처 모드 해제' : '📸 캡처 모드'}
        </button>
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
              <option value="trial_scouting">임상시험 스카우팅</option>
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
              <option value="developing">개발 중 (일부 구조화)</option>
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

        <div className={styles.actions}>
          <span className={styles.presetLabel}>빠른 시나리오:</span>
          <div className={styles.presets}>
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                className={styles.presetBtn}
                onClick={() => applyPreset(preset)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
