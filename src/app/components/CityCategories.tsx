'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react'

type City = {
  name: string
  image: string
  gradient: string
  shadow: string
  jobs: string
}

const cities: City[] = [
  {
    name: 'Bengaluru',
    image: '/city/bengloru.webp',
    gradient: 'linear-gradient(135deg, rgba(109,40,217,0.88) 0%, rgba(79,70,229,0.82) 100%)',
    shadow: '0 8px 32px rgba(109,40,217,0.35)',
    jobs: '84',
  },
  {
    name: 'Pune',
    image: '/city/pune.webp',
    gradient: 'linear-gradient(135deg, rgba(219,39,119,0.88) 0%, rgba(147,51,234,0.82) 100%)',
    shadow: '0 8px 32px rgba(219,39,119,0.35)',
    jobs: '64',
  },
  {
    name: 'Mumbai',
    image: '/city/mumbai.webp',
    gradient: 'linear-gradient(135deg, rgba(37,99,235,0.88) 0%, rgba(109,40,217,0.82) 100%)',
    shadow: '0 8px 32px rgba(37,99,235,0.35)',
    jobs: '95',
  },
  {
    name: 'Chennai',
    image: '/city/chennai.webp',
    gradient: 'linear-gradient(135deg, rgba(124,58,237,0.88) 0%, rgba(236,72,153,0.82) 100%)',
    shadow: '0 8px 32px rgba(124,58,237,0.35)',
    jobs: '52',
  },
  {
    name: 'Hyderabad',
    image: '/city/hydrabad.webp',
    gradient: 'linear-gradient(135deg, rgba(67,56,202,0.88) 0%, rgba(139,92,246,0.82) 100%)',
    shadow: '0 8px 32px rgba(67,56,202,0.35)',
    jobs: '78',
  },
  {
    name: 'Gurugram',
    image: '/city/gurugram.webp',
    gradient: 'linear-gradient(135deg, rgba(190,24,93,0.88) 0%, rgba(67,56,202,0.82) 100%)',
    shadow: '0 8px 32px rgba(190,24,93,0.35)',
    jobs: '91',
  },
]

export default function CityCategories() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
    setScrollPosition(el.scrollLeft)
  }

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ left: el.scrollLeft + (direction === 'left' ? -320 : 320), behavior: 'smooth' })
  }

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll)
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [])

  return (
    <section className="bg-white px-4 py-12 sm:px-6">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="mb-8 px-4 text-center">
          <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-extrabold text-slate-900">
            Find Jobs &amp; Connections in your city
          </h2>
          <p className="mt-2 text-[clamp(0.875rem,2vw,1rem)] text-slate-500">
            Explore opportunities across India&apos;s top tech hubs
          </p>
        </div>

        <div className="relative py-4">
          <button
            type="button"
            onClick={() => scroll('left')}
            className={`absolute left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition md:flex hover:scale-105 active:scale-95 ${canScrollLeft ? 'opacity-100' : 'pointer-events-none opacity-30'}`}
            aria-label="Scroll left"
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>

          <div
            ref={scrollRef}
            className="overflow-x-auto overflow-y-hidden scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex min-w-max items-center gap-4 px-4 py-4 sm:gap-5 sm:px-10 md:justify-center md:px-16">
              {cities.map((city) => (
                <a
                  key={city.name}
                  href={`https://app.riseflake.com/jobs?location=${city.name.toLowerCase()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex w-[150px] flex-col justify-end overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-2"
                  style={{
                    height: 190,
                    boxShadow: city.shadow,
                  }}
                >
                  {/* City photo as low-opacity background */}
                  <Image
                    src={city.image}
                    alt={city.name}
                    fill
                    sizes="150px"
                    quality={80}
                    className="object-cover opacity-30 transition-opacity duration-300 group-hover:opacity-40"
                  />

                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0"
                    style={{ background: city.gradient }}
                  />

                  {/* Content */}
                  <div className="relative z-10 p-4">
                    <div className="mb-1 flex items-center gap-1 text-white/70">
                      <MapPin size={11} strokeWidth={2.5} />
                      <span className="text-[0.65rem] font-semibold uppercase tracking-wider">India</span>
                    </div>
                    <div className="text-[1rem] font-bold leading-tight text-white">{city.name}</div>
                    <div className="mt-2 inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-[0.72rem] font-semibold text-white backdrop-blur-sm">
                      {city.jobs} Jobs
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => scroll('right')}
            className={`absolute right-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition md:flex hover:scale-105 active:scale-95 ${canScrollRight ? 'opacity-100' : 'pointer-events-none opacity-30'}`}
            aria-label="Scroll right"
          >
            <ChevronRight size={22} strokeWidth={2.5} />
          </button>
        </div>

        {/* Mobile dots */}
        <div className="mt-4 flex items-center justify-center gap-2 md:hidden">
          {cities.map((city, index) => {
            const isActive = Math.abs(scrollPosition - index * 170) < 85
            return (
              <span
                key={`${city.name}-dot`}
                className={`h-2 rounded-full transition-all duration-300 ${isActive ? 'w-6 bg-violet-500' : 'w-2 bg-slate-300'}`}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
