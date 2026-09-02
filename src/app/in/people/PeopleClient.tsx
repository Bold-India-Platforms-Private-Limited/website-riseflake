'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { API_BASE_URL } from '../../../lib/config'
import PersonCard, { type PersonCardData } from './components/PersonCard'

export type Facets = {
  cities: { value: string; count: number }[]
  states: { value: string; count: number }[]
  roles: { value: string; count: number }[]
  skills: { value: string; count: number }[]
  types: { value: string; label: string }[]
  experience: { value: string; label: string }[]
}

type Filters = {
  type: string
  experience: string
  location: string
  role: string
  skill: string
}

const EMPTY: Filters = { type: '', experience: '', location: '', role: '', skill: '' }

function buildQuery(f: Filters, cursor?: string | null) {
  const p = new URLSearchParams()
  if (f.type) p.set('type', f.type)
  if (f.experience) p.set('experience', f.experience)
  if (f.location) p.set('location', f.location)
  if (f.role) p.set('role', f.role)
  if (f.skill) p.set('skill', f.skill)
  if (cursor) p.set('cursor', cursor)
  p.set('limit', '24')
  return p.toString()
}

const titleCase = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase())

export default function PeopleClient({
  initialItems,
  initialCursor,
  facets,
}: {
  initialItems: PersonCardData[]
  initialCursor: string | null
  facets: Facets
}) {
  const [filters, setFilters] = useState<Filters>(EMPTY)
  const [items, setItems] = useState<PersonCardData[]>(initialItems)
  const [cursor, setCursor] = useState<string | null>(initialCursor)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const firstRender = useRef(true)

  const fetchPage = useCallback(
    async (f: Filters, cur: string | null, append: boolean) => {
      setLoading(true)
      setError(false)
      try {
        const res = await fetch(`${API_BASE_URL}/people?${buildQuery(f, cur)}`)
        if (!res.ok) throw new Error('request failed')
        const json = await res.json()
        const next: PersonCardData[] = json.result ?? []
        setItems((prev) => (append ? [...prev, ...next] : next))
        setCursor(json.next_cursor ?? null)
      } catch {
        setError(true)
        if (!append) setItems([])
      } finally {
        setLoading(false)
      }
    },
    []
  )

  // Re-query whenever filters change (skip the very first mount — SSR gave us page 1).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    fetchPage(filters, null, false)
  }, [filters, fetchPage])

  const activeCount = Object.values(filters).filter(Boolean).length

  const Select = ({
    label,
    value,
    onChange,
    options,
  }: {
    label: string
    value: string
    onChange: (v: string) => void
    options: { value: string; label: string }[]
  }) => (
    <label className="flex flex-col gap-1 text-xs font-medium text-slate-500">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-[9rem] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-indigo-400 focus:outline-none"
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )

  return (
    <section className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <Select
          label="Profile type"
          value={filters.type}
          onChange={(v) => setFilters((f) => ({ ...f, type: v }))}
          options={facets.types.map((t) => ({ value: t.value, label: t.label }))}
        />
        <Select
          label="Experience"
          value={filters.experience}
          onChange={(v) => setFilters((f) => ({ ...f, experience: v }))}
          options={facets.experience.map((t) => ({ value: t.value, label: t.label }))}
        />
        <Select
          label="Location"
          value={filters.location}
          onChange={(v) => setFilters((f) => ({ ...f, location: v }))}
          options={facets.cities.map((c) => ({
            value: c.value,
            label: `${titleCase(c.value)} (${c.count})`,
          }))}
        />
        <Select
          label="Role"
          value={filters.role}
          onChange={(v) => setFilters((f) => ({ ...f, role: v }))}
          options={facets.roles.map((r) => ({
            value: r.value,
            label: `${r.value} (${r.count})`,
          }))}
        />
        <Select
          label="Skill"
          value={filters.skill}
          onChange={(v) => setFilters((f) => ({ ...f, skill: v }))}
          options={facets.skills.map((s) => ({
            value: s.value,
            label: `${titleCase(s.value)} (${s.count})`,
          }))}
        />
        {activeCount > 0 && (
          <button
            type="button"
            onClick={() => setFilters(EMPTY)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Clear ({activeCount})
          </button>
        )}
      </div>

      {/* Results */}
      {error && items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <h3 className="text-lg font-semibold text-slate-900">Unable to load profiles</h3>
          <p className="mt-2 text-sm text-slate-600">Please refresh or try again shortly.</p>
        </div>
      ) : items.length === 0 && !loading ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <h3 className="text-lg font-semibold text-slate-900">No profiles match these filters</h3>
          <p className="mt-2 text-sm text-slate-600">Try widening your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <PersonCard key={p.slug} person={p} />
          ))}
        </div>
      )}

      {/* Load more */}
      {cursor && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => fetchPage(filters, cursor, true)}
            className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? 'Loading…' : 'Load more profiles'}
          </button>
        </div>
      )}
    </section>
  )
}
