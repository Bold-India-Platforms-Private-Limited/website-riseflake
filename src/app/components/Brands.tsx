import { BASE_ASSETS_URL } from '../../lib/config'

const BRAND_NAME = 'Riseflake'

const generateLogos = (count: number) => {
  const logos: string[] = []
  for (let i = 1; i <= count; i += 1) {
    logos.push(`${BASE_ASSETS_URL}/row-company-logo-${i}.webp`)
  }
  return logos
}

const logos = generateLogos(70)

const shuffleLogos = (arr: string[]) => {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  const result: string[] = []
  const counts = new Map<string, number>()

  for (const logo of shuffled) {
    counts.set(logo, (counts.get(logo) || 0) + 1)
  }

  const uniqueLogos = Array.from(counts.keys())

  for (let i = uniqueLogos.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[uniqueLogos[i], uniqueLogos[j]] = [uniqueLogos[j], uniqueLogos[i]]
  }

  let safety = 0
  while (result.length < shuffled.length) {
    for (const logo of uniqueLogos) {
      if ((counts.get(logo) || 0) > 0) {
        if (result.length === 0 || result[result.length - 1] !== logo) {
          result.push(logo)
          counts.set(logo, (counts.get(logo) || 0) - 1)
          if (result.length === shuffled.length) break
        }
      }
    }

    safety += 1
    if (safety > shuffled.length * 2) {
      for (const [logo, count] of counts.entries()) {
        for (let i = 0; i < count; i += 1) {
          result.push(logo)
        }
      }
      break
    }
  }

  return result
}

export default function Brands() {
  return (
    <section className="relative overflow-hidden bg-[#f7faff] py-12">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#f7faff] to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#f7faff] to-transparent"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-full">
        <h2 className="mb-6 text-center text-xl font-semibold md:text-2xl">
          Every 3rd software engineer is on {BRAND_NAME}
        </h2>

        <div className="mt-10 hidden space-y-3 md:block">
          {[0, 1, 2].map((row) => {
            const rowLogos = shuffleLogos([...logos, ...logos])

            return (
              <div key={row} className="overflow-hidden py-1">
                <div
                  className={`flex w-max gap-6 animate-scroll-ltr-desktop-smooth ${
                    row % 2 === 0 ? 'ml-0' : 'ml-[65px]'
                  }`}
                >
                  {rowLogos.map((logo, index) => (
                    <div
                      key={`desktop-${row}-${index}`}
                      className="flex h-[50px] max-w-[140px] items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-[0_3px_10px_rgba(15,23,42,0.12)]"
                    >
                      <img
                        src={logo}
                        alt={`Logo ${index + 1}`}
                        className="max-h-[40px] w-auto object-contain"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-10 block space-y-2 md:hidden">
          {[0, 1, 2, 3, 4].map((row) => {
            const rowLogos = shuffleLogos([...logos, ...logos])

            return (
              <div key={row} className="overflow-hidden py-1">
                <div
                  className={`flex w-max gap-5 animate-scroll-ltr-slow ${
                    row % 2 !== 0 ? 'flex-row-reverse' : ''
                  } ${row % 2 === 0 ? 'ml-0' : 'ml-[65px]'}`}
                >
                  {rowLogos.map((logo, index) => (
                    <div
                      key={`mobile-${row}-${index}`}
                      className="flex max-w-[140px] items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-[0_3px_10px_rgba(15,23,42,0.12)]"
                    >
                      <img
                        src={logo}
                        alt={`Logo ${index + 1}`}
                        className="max-h-[60px] w-auto object-contain"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
