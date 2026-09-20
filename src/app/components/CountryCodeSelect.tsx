'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

type Country = {
  name: string
  iso2: string
  dial: string
}

const COUNTRIES: Country[] = [
  { name: 'India', iso2: 'in', dial: '+91' },
  { name: 'United States', iso2: 'us', dial: '+1' },
  { name: 'United Kingdom', iso2: 'gb', dial: '+44' },
  { name: 'Australia', iso2: 'au', dial: '+61' },
  { name: 'Singapore', iso2: 'sg', dial: '+65' },
  { name: 'United Arab Emirates', iso2: 'ae', dial: '+971' },
  { name: 'Pakistan', iso2: 'pk', dial: '+92' },
  { name: 'Bangladesh', iso2: 'bd', dial: '+880' },
  { name: 'Sri Lanka', iso2: 'lk', dial: '+94' },
  { name: 'China', iso2: 'cn', dial: '+86' },
  { name: 'Germany', iso2: 'de', dial: '+49' },
  { name: 'France', iso2: 'fr', dial: '+33' },
  { name: 'Japan', iso2: 'jp', dial: '+81' },
  { name: 'South Korea', iso2: 'kr', dial: '+82' },
  { name: 'New Zealand', iso2: 'nz', dial: '+64' },
  { name: 'South Africa', iso2: 'za', dial: '+27' },
  { name: 'Brazil', iso2: 'br', dial: '+55' },
  { name: 'Russia', iso2: 'ru', dial: '+7' },
  { name: 'Netherlands', iso2: 'nl', dial: '+31' },
  { name: 'Switzerland', iso2: 'ch', dial: '+41' },
]

const flagUrl = (iso2: string) => `https://flagcdn.com/20x15/${iso2}.png`

export default function CountryCodeSelect({
  onChange,
}: {
  onChange?: (country: { iso2: string; dial: string }) => void
}) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(COUNTRIES[0])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  const select = (country: Country) => {
    setSelected(country)
    setOpen(false)
    onChange?.(country)
  }

  return (
    <div ref={containerRef} className="relative w-[110px] shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-3 text-sm text-slate-800 transition focus:border-slate-300 focus:outline-none"
      >
        <img
          src={flagUrl(selected.iso2)}
          alt=""
          width={20}
          height={15}
          className="h-[15px] w-5 shrink-0 rounded-[2px] object-cover"
        />
        <span className="flex-1 text-left">{selected.dial}</span>
        <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-[calc(100%+4px)] z-20 max-h-64 w-64 overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
        >
          {COUNTRIES.map((country) => (
            <li key={country.iso2}>
              <button
                type="button"
                role="option"
                aria-selected={country.iso2 === selected.iso2}
                onClick={() => select(country)}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition hover:bg-slate-50 ${
                  country.iso2 === selected.iso2 ? 'bg-slate-50 font-medium text-slate-900' : 'text-slate-700'
                }`}
              >
                <img
                  src={flagUrl(country.iso2)}
                  alt=""
                  width={20}
                  height={15}
                  className="h-[15px] w-5 shrink-0 rounded-[2px] object-cover"
                />
                <span className="flex-1 truncate">{country.name}</span>
                <span className="shrink-0 text-slate-500">{country.dial}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
