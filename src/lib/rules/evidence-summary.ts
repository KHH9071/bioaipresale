import type { BusinessObjective, KeywordEntry, PubMedPaper } from '../types'

// ─── Keyword Extraction ────────────────────────────────────────────────────────

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'of', 'in', 'to', 'for', 'with', 'on', 'at',
  'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'being',
  'this', 'that', 'these', 'those', 'it', 'its', 'we', 'our', 'their',
  'study', 'studies', 'analysis', 'results', 'patients', 'patient', 'clinical',
  'using', 'used', 'use', 'data', 'based', 'associated', 'between', 'during',
  'after', 'before', 'treatment', 'treated', 'compared', 'including', 'showed',
  'show', 'significant', 'significantly', 'may', 'can', 'also', 'have', 'has',
  'had', 'not', 'but', 'than', 'more', 'less', 'high', 'low', 'new', 'novel',
])

export function extractKeywords(papers: PubMedPaper[]): KeywordEntry[] {
  const freq: Record<string, number> = {}

  for (const paper of papers) {
    const text = `${paper.title} ${paper.abstract}`.toLowerCase()
    const words = text.match(/\b[a-z][a-z-]{3,}\b/g) ?? []

    for (const word of words) {
      if (!STOP_WORDS.has(word)) {
        freq[word] = (freq[word] ?? 0) + 1
      }
    }
  }

  return Object.entries(freq)
    .filter(([, count]) => count >= 2)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([term, count]) => ({ term, count }))
}

// ─── Presales Interpretation ───────────────────────────────────────────────────

const EVIDENCE_INTERPRETATIONS: Record<BusinessObjective, (paperCount: number, topKeywords: string[]) => string> = {
  literature_intelligence: (count, kw) =>
    `${count}편의 논문이 확인되었으며, 근거가 ${kw.slice(0, 3).join(', ')} 주제를 중심으로 집중되어 있습니다. 이 수준의 문헌 규모와 다양성은 수작업 검색의 한계를 명확히 보여주며, AI 근거 어시스턴트가 가장 높은 가치를 제공하는 구간입니다.`,

  trial_scouting: (count, kw) =>
    `${count}편의 논문이 확인되었으며, ${kw.slice(0, 3).join(', ')} 관련 연구 주제가 주를 이루고 있습니다. 이 수준의 논문 발표 활동은 활발한 전임상 및 중개 연구를 시사하며, 선제적 임상 인텔리전스 구축의 필요성을 뒷받침합니다.`,

  label_regulatory: (count, kw) =>
    `${count}편의 논문이 식별되었으며 ${kw.slice(0, 3).join(', ')} 등 규제·라벨 관련 주제가 포함되어 있습니다. 이처럼 밀도 높은 기술 문헌에서는 키워드 검색이 아닌 라벨 인텔리전스 검색이 핵심 선례 누락을 방지합니다.`,

  scientific_qa: (count, kw) =>
    `${kw.slice(0, 3).join(', ')} 등의 주제를 다루는 ${count}편의 논문이 확인되었습니다. 이 문헌 폭은 과학 Q&A 어시스턴트가 기반으로 삼아야 할 정확한 지식 범위를 나타내며, 현재 수시간이 걸리는 도메인 질문에 즉각 인용 기반 답변이 가능해집니다.`,

  kol_sponsor_landscape: (count, kw) =>
    `${kw.slice(0, 3).join(', ')} 관련 연구에 걸쳐 ${count}편의 논문이 확인되었습니다. 이 논문 발표 데이터는 KOL 식별 및 영향력 매핑의 원천 자료로, 현재 관계 기반 수작업 정보 수집을 AI로 체계화할 수 있는 기반이 됩니다.`,
}

export function generateEvidenceInterpretation(
  papers: PubMedPaper[],
  objective: BusinessObjective,
): string {
  const keywords = extractKeywords(papers)
  const topKeywords = keywords.slice(0, 5).map((k) => k.term)
  return EVIDENCE_INTERPRETATIONS[objective](papers.length, topKeywords)
}

// ─── Evidence Summary Themes ───────────────────────────────────────────────────

export function summarizeEvidenceThemes(papers: PubMedPaper[]): string[] {
  if (papers.length === 0) return []

  const keywords = extractKeywords(papers)
  const topKeywords = keywords.slice(0, 6).map((k) => k.term)

  return [
    `주요 연구 주제: ${topKeywords.slice(0, 2).join(', ')}`,
    `부수 연구 주제: ${topKeywords.slice(2, 4).join(', ')}`,
    `신흥 신호: ${topKeywords.slice(4, 6).join(', ')}`,
  ].filter((t) => !t.endsWith(': '))
}
