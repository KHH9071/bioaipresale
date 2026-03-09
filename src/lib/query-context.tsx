'use client'

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type {
  QueryInput,
  PoCOptions,
  BusinessObjective,
  Region,
  TimeYears,
  OpportunityOutput,
  PoCProposal,
} from './types'
import { generateOpportunityOutput } from './rules/opportunity'
import { generatePoCProposal } from './rules/poc-designer'

// ─── State ────────────────────────────────────────────────────────────────────

interface QueryState {
  input: QueryInput
  pocOptions: PoCOptions
  opportunity: OpportunityOutput | null
  pocProposal: PoCProposal | null
  hasSearched: boolean
  searchedAt: number | null  // epoch ms, for "Analyzed at HH:MM:SS"
}

const DEFAULT_INPUT: QueryInput = {
  disease: '',
  target: '',
  drug: '',
  objective: 'literature_intelligence',
  region: 'Global',
  timeYears: 5,
}

const DEFAULT_POC_OPTIONS: PoCOptions = {
  primaryUser: 'research_scientist',
  dataAvailability: 'medium',
  deliveryPreference: 'fast_poc',
}

const INITIAL_STATE: QueryState = {
  input: DEFAULT_INPUT,
  pocOptions: DEFAULT_POC_OPTIONS,
  opportunity: null,
  pocProposal: null,
  hasSearched: false,
  searchedAt: null,
}

// ─── Actions ──────────────────────────────────────────────────────────────────

type QueryAction =
  | { type: 'SET_INPUT'; payload: Partial<QueryInput> }
  | { type: 'SET_POC_OPTIONS'; payload: Partial<PoCOptions> }
  | { type: 'SUBMIT_SEARCH' }
  | { type: 'LOAD_FROM_URL'; payload: Partial<QueryInput> }

function queryReducer(state: QueryState, action: QueryAction): QueryState {
  switch (action.type) {
    case 'SET_INPUT': {
      const input = { ...state.input, ...action.payload }
      return { ...state, input }
    }
    case 'SET_POC_OPTIONS': {
      const pocOptions = { ...state.pocOptions, ...action.payload }
      const pocProposal = state.hasSearched
        ? generatePoCProposal(state.input, pocOptions)
        : null
      return { ...state, pocOptions, pocProposal }
    }
    case 'SUBMIT_SEARCH': {
      const opportunity = generateOpportunityOutput(state.input)
      const pocProposal = generatePoCProposal(state.input, state.pocOptions)
      return { ...state, opportunity, pocProposal, hasSearched: true, searchedAt: Date.now() }
    }
    case 'LOAD_FROM_URL': {
      const input = { ...state.input, ...action.payload }
      const opportunity = generateOpportunityOutput(input)
      const pocProposal = generatePoCProposal(input, state.pocOptions)
      return { ...state, input, opportunity, pocProposal, hasSearched: true, searchedAt: Date.now() }
    }
    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface QueryContextValue {
  state: QueryState
  setInput: (payload: Partial<QueryInput>) => void
  setPoCOptions: (payload: Partial<PoCOptions>) => void
  submitSearch: () => void
}

const QueryContext = createContext<QueryContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function QueryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(queryReducer, INITIAL_STATE)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Load from URL on mount
  useEffect(() => {
    const disease = searchParams.get('disease') ?? ''
    const target = searchParams.get('target') ?? ''
    const drug = searchParams.get('drug') ?? ''
    const objective = searchParams.get('objective') as BusinessObjective | null
    const region = searchParams.get('region') as Region | null
    const timeYears = searchParams.get('timeYears')

    if (disease || target || drug) {
      dispatch({
        type: 'LOAD_FROM_URL',
        payload: {
          disease,
          target,
          drug,
          objective: objective ?? 'literature_intelligence',
          region: region ?? 'Global',
          timeYears: timeYears ? (parseInt(timeYears) as TimeYears) : 5,
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setInput = useCallback((payload: Partial<QueryInput>) => {
    dispatch({ type: 'SET_INPUT', payload })
  }, [])

  const setPoCOptions = useCallback((payload: Partial<PoCOptions>) => {
    dispatch({ type: 'SET_POC_OPTIONS', payload })
  }, [])

  const submitSearch = useCallback(() => {
    dispatch({ type: 'SUBMIT_SEARCH' })

    // Sync to URL
    const params = new URLSearchParams()
    if (state.input.disease) params.set('disease', state.input.disease)
    if (state.input.target) params.set('target', state.input.target)
    if (state.input.drug) params.set('drug', state.input.drug)
    params.set('objective', state.input.objective)
    params.set('region', state.input.region)
    params.set('timeYears', String(state.input.timeYears))

    const newUrl = `${pathname}?${params.toString()}`
    router.replace(newUrl, { scroll: false })
  }, [state.input, pathname, router])

  return (
    <QueryContext.Provider value={{ state, setInput, setPoCOptions, submitSearch }}>
      {children}
    </QueryContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useQuery() {
  const ctx = useContext(QueryContext)
  if (!ctx) throw new Error('useQuery must be used within QueryProvider')
  return ctx
}
