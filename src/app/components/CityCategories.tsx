'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type City = {
  name: string
  image: string
  gradientClass: string
  jobs: string
}

const cities: City[] = [
  {
    name: 'Bengaluru',
    image: '/city/bengloru.webp',
    gradientClass: 'bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)]',
    jobs: '12.5K',
  },
  {
    name: 'Pune',
    image: '/city/pune.webp',
    gradientClass: 'bg-[linear-gradient(135deg,#4facfe_0%,#00f2fe_100%)]',
    jobs: '8.2K',
  },
  {
    name: 'Mumbai',
    image: '/city/mumbai.webp',
    gradientClass: 'bg-[linear-gradient(135deg,#f093fb_0%,#f5576c_100%)]',
    jobs: '15.8K',
  },
  {
    name: 'Chennai',
    image: '/city/chennai.webp',
    gradientClass: 'bg-[linear-gradient(135deg,#4ade80_0%,#22c55e_100%)]',
    jobs: '7.3K',
  },
  {
    name: 'Hyderabad',
    image: '/city/hydrabad.webp',
    gradientClass: 'bg-[linear-gradient(135deg,#a8edea_0%,#fed6e3_100%)]',
    jobs: '9.6K',
  },
  {
    name: 'Gurugram',
    image: '/city/gurugram.avif',
    gradientClass: 'bg-[linear-gradient(135deg,#fbc2eb_0%,#a6c1ee_100%)]',
    jobs: '11.2K',
  },
]

export default function CityCategories() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({})
  const scrollRef = useRef<HTMLDivElement>(null)

  const checkScroll = () => {
    const element = scrollRef.current
    if (!element) return

    const { scrollLeft, scrollWidth, clientWidth } = element
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    setScrollPosition(scrollLeft)
  }

  const scroll = (direction: 'left' | 'right') => {
    const element = scrollRef.current
    if (!element) return

    const scrollAmount = 300
    const nextPosition = direction === 'left' ? element.scrollLeft - scrollAmount : element.scrollLeft + scrollAmount

    element.scrollTo({
      left: nextPosition,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    checkScroll()
    const element = scrollRef.current

    if (!element) return

    element.addEventListener('scroll', checkScroll)
    window.addEventListener('resize', checkScroll)

    return () => {
      element.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [])

  return (
    <section className="bg-white px-4 py-12 sm:px-6">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="mb-8 px-4 text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-extrabold text-slate-900">
              Find Jobs & Connections in your city
            </h2>
            <p className="mt-2 text-[clamp(0.875rem,2vw,1rem)] font-normal text-slate-500">
              Explore opportunities across India's top tech hubs
            </p>
          </div>
        </div>

        <div className="relative py-4">
          <button
            type="button"
            onClick={() => scroll('left')}
            className={`absolute left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-600 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition md:flex hover:scale-105 hover:bg-slate-200 hover:shadow-[0_3px_10px_rgba(0,0,0,0.12)] active:scale-95 ${
              canScrollLeft ? 'opacity-100' : 'pointer-events-none opacity-40'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>

          <div
            ref={scrollRef}
            className="[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex min-w-max items-center justify-center gap-6 px-[60px] py-4">
              {cities.map((city, index) => (
                <div
                  key={city.name}
                  className="group flex min-w-[clamp(120px,15vw,140px)] flex-col items-center gap-3 rounded-3xl p-4 transition-transform duration-300 hover:-translate-y-2"
                >
                  <div
                    className={`relative flex h-[clamp(90px,12vw,110px)] w-[clamp(90px,12vw,110px)] items-center justify-center overflow-hidden rounded-full bg-slate-100 shadow-[0_10px_25px_rgba(0,0,0,0.12)] transition-all duration-300 group-hover:rotate-[5deg] group-hover:scale-[1.08] group-hover:shadow-[0_15px_35px_rgba(0,0,0,0.2)]`}
                  >
                    {!failedImages[index] && (
                      <Image
                        src={city.image}
                        alt={city.name}
                        fill
                        sizes="(max-width: 768px) 90px, 110px"
                        quality={100}
                        className="rounded-full object-cover"
                        onError={() => setFailedImages((prev) => ({ ...prev, [index]: true }))}
                      />
                    )}
                    {failedImages[index] && (
                      <div
                        className={`${city.gradientClass} absolute inset-0 flex items-center justify-center rounded-full text-[clamp(2.25rem,4vw,2.75rem)] font-bold text-white`}
                      >
                        {city.name.charAt(0)}
                      </div>
                    )}

                    <div className="pointer-events-none absolute -left-1/2 -top-1/2 h-[200%] w-[200%] animate-[spin_8s_linear_infinite] bg-[radial-gradient(circle,rgba(255,255,255,0.3)_0%,transparent_70%)]" />
                    <div
                      className={`${city.gradientClass} pointer-events-none absolute -inset-2 blur-[15px] opacity-20 transition-opacity duration-300 group-hover:opacity-40`}
                    />
                  </div>

                  <div className="text-center text-[clamp(0.9rem,2vw,1rem)] font-bold text-slate-900 transition-transform duration-300 group-hover:scale-105 group-hover:text-indigo-500">
                    {city.name}
                  </div>

                  <div className="rounded-full bg-white/80 px-3 py-1 text-[clamp(0.8rem,1.5vw,0.875rem)] font-medium text-slate-500 backdrop-blur-sm">
                    {city.jobs} Jobs
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => scroll('right')}
            className={`absolute right-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-600 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition md:flex hover:scale-105 hover:bg-slate-200 hover:shadow-[0_3px_10px_rgba(0,0,0,0.12)] active:scale-95 ${
              canScrollRight ? 'opacity-100' : 'pointer-events-none opacity-40'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight size={22} strokeWidth={2.5} />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 md:hidden">
          {cities.slice(0, -1).map((city, index) => {
            const cardWidth = 160
            const isActive = Math.abs(scrollPosition - index * cardWidth) < 80
            return (
              <span
                key={`${city.name}-dot`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-6 bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)]'
                    : 'w-2 bg-slate-300'
                }`}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
