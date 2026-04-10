import { NextRequest, NextResponse } from 'next/server'
import { XMLParser } from 'fast-xml-parser'
import type { PubMedPaper } from '@/lib/types'
import fallbackLungCancer from '@/lib/fixtures/pubmed-lungcancer.json'
import fallbackAlzheimer from '@/lib/fixtures/pubmed-alzheimer.json'
import fallbackHer2 from '@/lib/fixtures/pubmed-her2.json'

function selectFallback(disease: string, target: string, drug: string) {
  const q = `${disease} ${target} ${drug}`.toLowerCase()
  if (q.includes('alzheimer') || q.includes('amyloid') || q.includes('lecanemab') || q.includes('donanemab')) {
    return fallbackAlzheimer
  }
  if (q.includes('her2') || q.includes('breast cancer') || q.includes('t-dxd') || q.includes('trastuzumab deruxtecan')) {
    return fallbackHer2
  }
  if (
    q.includes('lung') ||
    q.includes('nsclc') ||
    q.includes('kras') ||
    q.includes('sotorasib') ||
    q.includes('adagrasib')
  ) {
    return fallbackLungCancer
  }
  // No matching fixture — signal "no cached data" rather than leaking unrelated disease data
  return null
}

const NCBI_BASE = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils'
const API_KEY = process.env.NCBI_API_KEY ? `&api_key=${process.env.NCBI_API_KEY}` : ''

// Convert slash-separated compound terms into PubMed OR expressions.
// Bottleneck scenario presets use modality descriptors like
// "PROTAC / Molecular glue degrader" or "EGFR / Tumor microenvironment"
// which PubMed esearch treats as a single literal, collapsing matches to zero.
// Splitting on "/" and joining with OR preserves the narrative intent.
function expandSlashOr(term: string): string {
  if (!term || !term.includes('/')) return term
  const parts = term.split('/').map((p) => p.trim()).filter(Boolean)
  if (parts.length <= 1) return term
  const quoted = parts.map((p) => (p.includes(' ') ? `"${p}"` : p))
  return `(${quoted.join(' OR ')})`
}

function buildQuery(disease: string, target: string, drug: string): string {
  const terms: string[] = []
  if (disease) terms.push(expandSlashOr(disease))
  if (target) terms.push(expandSlashOr(target))
  if (drug) terms.push(expandSlashOr(drug))
  return terms.join(' AND ')
}

function parsePubMedXml(xml: string): PubMedPaper[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '_',
    isArray: (name) => ['PubmedArticle', 'AbstractText', 'Author'].includes(name),
  })

  let parsed: Record<string, unknown>
  try {
    parsed = parser.parse(xml) as Record<string, unknown>
  } catch {
    return []
  }

  const articleSet = (parsed as {
    PubmedArticleSet?: { PubmedArticle?: unknown[] }
  })?.PubmedArticleSet?.PubmedArticle ?? []

  if (!Array.isArray(articleSet)) return []

  return articleSet.map((article: unknown) => {
    const a = article as Record<string, unknown>
    const medline = (a.MedlineCitation as Record<string, unknown>) ?? {}
    const articleNode = (medline.Article as Record<string, unknown>) ?? {}
    const journal = (articleNode.Journal as Record<string, unknown>) ?? {}
    const journalIssue = (journal.JournalIssue as Record<string, unknown>) ?? {}
    const pubDate = (journalIssue.PubDate as Record<string, unknown>) ?? {}
    const pmid = String(medline.PMID ?? '')
    const title = String((articleNode.ArticleTitle as string) ?? '')

    // Abstract can be string or array of objects
    const abstractNode = articleNode.Abstract as Record<string, unknown> | undefined
    let abstract = ''
    if (abstractNode) {
      const texts = abstractNode.AbstractText
      if (typeof texts === 'string') {
        abstract = texts
      } else if (Array.isArray(texts)) {
        abstract = texts
          .map((t) => (typeof t === 'string' ? t : (t as Record<string, unknown>)['#text'] ?? ''))
          .join(' ')
      }
    }

    const year = String(pubDate.Year ?? pubDate.MedlineDate ?? '')
    const journalTitle = String((journal.Title as string) ?? (journal.ISOAbbreviation as string) ?? '')

    return {
      pmid,
      title: title.replace(/<[^>]+>/g, ''),
      journal: journalTitle,
      year: year.slice(0, 4),
      abstract: (abstract as string).replace(/<[^>]+>/g, '').slice(0, 400),
    }
  }).filter((p: PubMedPaper) => p.pmid && p.title)
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const disease = searchParams.get('disease') ?? ''
  const target = searchParams.get('target') ?? ''
  const drug = searchParams.get('drug') ?? ''
  const timeYears = parseInt(searchParams.get('timeYears') ?? '5')
  const reviewOnly = searchParams.get('reviewOnly') === 'true'

  if (!disease && !target && !drug) {
    return NextResponse.json({ papers: [] })
  }

  try {
    const query = buildQuery(disease, target, drug)
    const reviewFilter = reviewOnly ? '+AND+review[pt]' : ''
    const minYear = new Date().getFullYear() - timeYears

    // Step 1: esearch
    const searchUrl = `${NCBI_BASE}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}${reviewFilter}&retmax=20&sort=pub+date&datetype=pdat&mindate=${minYear}&maxdate=3000&retmode=json${API_KEY}`

    const searchRes = await fetch(searchUrl, { next: { revalidate: 3600 } })
    if (!searchRes.ok) throw new Error(`esearch failed: ${searchRes.status}`)

    const searchJson = await searchRes.json()
    const ids: string[] = searchJson.esearchresult?.idlist ?? []

    if (ids.length === 0) {
      return NextResponse.json({ papers: [], fallback: false })
    }

    // Step 2: efetch
    const fetchUrl = `${NCBI_BASE}/efetch.fcgi?db=pubmed&id=${ids.join(',')}&rettype=abstract&retmode=xml${API_KEY}`
    const fetchRes = await fetch(fetchUrl, { next: { revalidate: 3600 } })
    if (!fetchRes.ok) throw new Error(`efetch failed: ${fetchRes.status}`)

    const xml = await fetchRes.text()
    const papers = parsePubMedXml(xml)

    return NextResponse.json({ papers, fallback: false })
  } catch (err) {
    console.error('[PubMed API] Error, serving fallback:', err)
    const fallbackData = selectFallback(disease, target, drug)
    if (fallbackData) {
      return NextResponse.json({ ...fallbackData, fallback: true })
    }
    return NextResponse.json({ papers: [], fallback: true, noCachedData: true })
  }
}
