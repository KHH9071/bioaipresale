/**
 * scenario-engine.ts
 *
 * scenario-aware 출력 생성 엔진.
 * activeScenarioId가 설정된 경우, 기존 generator의 objective-based 출력을
 * 시나리오별 presales 프레이밍으로 대체·보강합니다.
 *
 * activeScenarioId가 없으면 기존 generator를 그대로 호출합니다 (하위 호환).
 *
 * 사용처: query-context.tsx > SUBMIT_SEARCH reducer
 */

import type {
  QueryInput,
  PoCOptions,
  OpportunityOutput,
  PoCProposal,
  SolutionRouteResult,
} from '../types'
import type { BottleneckScenarioId } from './types'

import { generateOpportunityOutput } from '../rules/opportunity'
import { generatePoCProposal } from '../rules/poc-designer'
import { routeSolution } from '../rules/solution-router'
import { SCENARIO_TEMPLATES } from './scenario-templates'

// ─── Scenario-aware OpportunityOutput ────────────────────────────────────────

export function getScenarioAwareOpportunity(
  input: QueryInput,
  scenarioId: BottleneckScenarioId | null,
): OpportunityOutput {
  // 시나리오 없으면 기존 generator
  if (!scenarioId) return generateOpportunityOutput(input)

  const tmpl = SCENARIO_TEMPLATES[scenarioId]
  if (!tmpl) return generateOpportunityOutput(input)

  return {
    opportunityStatement: tmpl.opportunityStatement(input),
    painPoints: tmpl.painPoints,
    pocType: tmpl.pocType,
    pocTypeDescription: tmpl.pocTypeDescription,
    kpiPreview: tmpl.kpis,
  }
}

// ─── Scenario-aware PoCProposal ───────────────────────────────────────────────

// 기존 standard risks는 그대로 포함 (환각·의료오용·보안 등)
const STANDARD_RISKS = [
  { risk: '환각 / 허위 근거 생성', guardrail: '모든 출력에 PMID, NCT ID 또는 문서 섹션 출처 인용 필수 — 근거 없는 주장 불허' },
  { risk: '인덱싱 코퍼스 최신성 격차', guardrail: '마지막 인덱싱 날짜를 화면에 표시하고, 30일 이상 경과 시 재인덱싱 알림 발송' },
  { risk: '의료적·진단적 오용', guardrail: '고정 주의 문구: "본 결과는 연구 및 Presales 기획 전용이며 임상 의사결정 용도로 사용할 수 없습니다"' },
  { risk: '내부 문서 데이터 보안', guardrail: '공개/내부 문서 인덱스 네임스페이스 분리, 쿼리 레이어에서 접근 제어 적용' },
]

export function getScenarioAwarePoCProposal(
  input: QueryInput,
  options: PoCOptions,
  scenarioId: BottleneckScenarioId | null,
): PoCProposal {
  if (!scenarioId) return generatePoCProposal(input, options)

  const tmpl = SCENARIO_TEMPLATES[scenarioId]
  if (!tmpl) return generatePoCProposal(input, options)

  return {
    problemDefinition: tmpl.problemDefinition(input),
    whyAI: tmpl.whyAI,
    whyNow: tmpl.whyNow,
    solutionPattern: tmpl.solutionPattern,
    solutionDescription: tmpl.solutionDescription,
    dataNeeded: tmpl.dataNeeded,
    sixWeekScope: tmpl.sixWeekScope,
    kpis: tmpl.kpis,
    risks: [...STANDARD_RISKS, ...tmpl.scenarioRisks],
  }
}

// ─── Scenario-aware SolutionRouteResult ──────────────────────────────────────

export function getScenarioAwareSolutionRoute(
  input: QueryInput,
  scenarioId: BottleneckScenarioId | null,
): SolutionRouteResult {
  // 기존 area routing은 그대로 유지 (기존 탭 동작 유지)
  const base = routeSolution(input)

  if (!scenarioId) return base

  const tmpl = SCENARIO_TEMPLATES[scenarioId]
  if (!tmpl) return base

  // 시나리오가 area/areaLabel을 명시하면 base routing을 덮어씀.
  // (예: rwd_autoimmune 'data_infrastructure' → base 'edp' 대신 시나리오 서사에 맞춘 라벨)
  return {
    ...base,
    area: tmpl.area ?? base.area,
    areaLabel: tmpl.areaLabel ?? base.areaLabel,
    rationale: tmpl.rationale,
    discoveryQuestions: tmpl.discoveryQuestions,
    requiredDataAssets: tmpl.requiredDataAssets,
    architectureHint: tmpl.architectureHint,
  }
}

// ─── Convenience: generate all three at once ─────────────────────────────────

export interface ScenarioAwareOutputs {
  opportunity: OpportunityOutput
  pocProposal: PoCProposal
  solutionRoute: SolutionRouteResult
}

export function generateScenarioAwareOutputs(
  input: QueryInput,
  options: PoCOptions,
  scenarioId: BottleneckScenarioId | null,
): ScenarioAwareOutputs {
  return {
    opportunity: getScenarioAwareOpportunity(input, scenarioId),
    pocProposal: getScenarioAwarePoCProposal(input, options, scenarioId),
    solutionRoute: getScenarioAwareSolutionRoute(input, scenarioId),
  }
}

// ─── Preset → Scenario inference helper ──────────────────────────────────────
/**
 * 기존 disease preset이 선택됐을 때 관련 상위 시나리오를 제안하는 헬퍼.
 * 현재는 단순 매핑. 향후 rule-based inference로 확장 가능.
 *
 * 반환값: null이면 시나리오 연결 없음 (기존 동작 유지).
 */
export function inferScenarioHint(
  disease: string,
  target: string,
): BottleneckScenarioId | null {
  const d = disease.toLowerCase()
  const t = target.toLowerCase()

  if (t.includes('kras') || t.includes('mycn') || t.includes('myc')) return 'undruggable_target'
  if (d.includes('rheumatoid') || d.includes('lupus') || d.includes('crohn') || d.includes('autoimmune')) return 'rwd_autoimmune'
  if (d.includes('duchenne') || d.includes('dmd') || t.includes('dystrophin') || t.includes('exon')) return 'mutation_agnostic'
  if (t.includes('egfr') || t.includes('lnp') || t.includes('adc') || t.includes('tumor microenvironment')) return 'off_target_toxicity'

  return null
}
