'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import IndiaCompanyCard from '../../../components/seo/IndiaCompanyCard'
import {
  fetchIndiaCompanyCount,
  fetchIndiaCompanyFacets,
  fetchIndiaCompanyList,
  type IndiaCompanyCard as IndiaCompany,
  type IndiaCompanyFacets,
} from '../../../../lib/indiaCompanyDirectory'

/*
 * The registry holds 3.6M+ companies, so it can never be pre-rendered. The page shell (breadcrumb,
 * h1, intro copy, metadata) is static — see page.tsx. The search form and the results below run
 * here, in the browser, against the public API.
 */

const PAGE_SIZE = 24

function titleCase(v: string): string {
  return v.replace(/\b\w/g, (c) => c.toUpperCase())
}

function useFilters() {
  const sp = useSearchParams()
  return {
    page: Math.max(parseInt(sp.get('page') || '1', 10) || 1, 1),
    state: sp.get('state')?.trim() || undefined,
    status: sp.get('status')?.trim() || undefined,
    q: sp.get('q')?.trim().slice(0, 80) || undefined,
  }
}

export function IndiaSearchForm() {
  const { state, status, q } = useFilters()
  const [facets, setFacets] = useState<IndiaCompanyFacets | null>(null)

  useEffect(() => {
    let live = true
    fetchIndiaCompanyFacets().then((f) => live && setFacets(f))
    return () => {
      live = false
    }
  }, [])

  return (
    <form action="/discover/companies/india" method="get" className="mt-6 flex flex-wrap gap-2 max-w-2xl">
      <input
        type="text"
        name="q"
        defaultValue={q}
        placeholder="Search company name…"
        className="flex-1 min-w-[200px] rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
      />
      {/* key: remount once the options arrive so defaultValue selects the current filter */}
      <select
        name="state"
        defaultValue={state || ''}
        key={`state-${facets ? 'ready' : 'wait'}-${state ?? ''}`}
        className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white"
      >
        <option value="">All states</option>
        {(facets?.result.states ?? []).map((s) => (
          <option key={s.value} value={s.value}>
            {titleCase(s.value)} ({s.count.toLocaleString('en-IN')})
          </option>
        ))}
      </select>
      <select
        name="status"
        defaultValue={status || ''}
        key={`status-${facets ? 'ready' : 'wait'}-${status ?? ''}`}
        className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white"
      >
        <option value="">All statuses</option>
        {(facets?.result.statuses ?? []).slice(0, 15).map((s) => (
          <option key={s.value} value={s.value}>
            {s.value} ({s.count.toLocaleString('en-IN')})
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors"
      >
        Search
      </button>
    </form>
  )
}

export function IndiaResults() {
  const { page, state, status, q } = useFilters()
  const [companies, setCompanies] = useState<IndiaCompany[]>([])
  const [total, setTotal] = useState<number | null>(null)
  const [phase, setPhase] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let live = true
    setPhase('loading')
    Promise.all([
      fetchIndiaCompanyList({ page, limit: PAGE_SIZE, state, status, q }),
      fetchIndiaCompanyCount({ state, status, q }),
    ]).then(([list, count]) => {
      if (!live) return
      if (!list) {
        setPhase('error')
        return
      }
      setCompanies(list.result ?? [])
      setTotal(count)
      setPhase('ready')
    })
    return () => {
      live = false
    }
  }, [page, state, status, q])

  const totalPages = useMemo(() => Math.max(1, Math.ceil((total ?? 0) / PAGE_SIZE)), [total])
  const href = (p: number) => {
    const qs = new URLSearchParams()
    if (state) qs.set('state', state)
    if (status) qs.set('status', status)
    if (q) qs.set('q', q)
    if (p > 1) qs.set('page', String(p))
    const s = qs.toString()
    return s ? `/discover/companies/india?${s}` : '/discover/companies/india'
  }

  if (phase === 'loading') return <p className="text-center text-slate-500 py-16">Loading companies…</p>
  if (phase === 'error') {
    return (
      <p className="text-center text-slate-500 py-16">
        The company registry is temporarily unavailable. Please try again shortly.
      </p>
    )
  }
  if (companies.length === 0) return <p className="text-center text-slate-500 py-16">No companies matched your filters.</p>

  return (
    <>
      {total != null && (
        <p className="mb-4 text-sm text-slate-500">{total.toLocaleString('en-IN')} companies</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map((c) => (
          <IndiaCompanyCard key={c.cin} company={c} />
        ))}
      </div>

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-3">
          {page > 1 && (
            <Link href={href(page - 1)} className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-sm font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
              ← Previous
            </Link>
          )}
          <span className="text-xs text-slate-400">Page {page} of {totalPages.toLocaleString('en-IN')}</span>
          {page < totalPages && (
            <Link href={href(page + 1)} className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-sm font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
              Next →
            </Link>
          )}
        </nav>
      )}
    </>
  )
}
