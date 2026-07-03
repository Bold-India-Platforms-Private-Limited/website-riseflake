import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  const type     = p.get('type') || 'default'   // job | internship | app | default
  const title    = p.get('title') || 'Find Your Dream Job'
  const company  = p.get('company') || ''
  const location = p.get('location') || 'India'
  const salary   = p.get('salary') || ''
  const jobType  = p.get('jobType') || ''
  const logo     = p.get('logo') || ''
  const subtitle = p.get('subtitle') || ''

  const isInternship = type === 'internship'
  const isApp        = type === 'app'
  const accentFrom   = isInternship ? '#7c3aed' : '#4f46e5'
  const accentTo     = isInternship ? '#4f46e5' : '#0ea5e9'
  const typeLabel    = isInternship ? 'INTERNSHIP' : 'JOB'
  const salaryLabel  = isInternship ? 'Stipend' : 'Salary'

  // ── Simple branded card for app.riseflake.com auth pages (login/register) ──
  if (isApp) {
    return new ImageResponse(
      (
        <div
          style={{
            width: 1200,
            height: 630,
            backgroundColor: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <div style={{ height: 8, background: 'linear-gradient(90deg, #4f46e5, #0ea5e9)', width: '100%', display: 'flex' }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 80px', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 48 }}>
              <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 26, height: 26, background: 'white', borderRadius: 6, display: 'flex' }} />
              </div>
              <span style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>Riseflake</span>
            </div>
            <div style={{ fontSize: 52, fontWeight: 800, color: '#0f172a', lineHeight: 1.2, letterSpacing: '-1px', maxWidth: 960, display: 'flex' }}>
              {title}
            </div>
            {subtitle && (
              <div style={{ fontSize: 24, color: '#64748b', fontWeight: 500, marginTop: 20, maxWidth: 800, display: 'flex' }}>
                {subtitle}
              </div>
            )}
          </div>
          <div style={{ height: 72, background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 64px' }}>
            <span style={{ fontSize: 16, color: '#94a3b8', fontWeight: 500 }}>India&apos;s #1 job platform for students &amp; freshers</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#4f46e5' }}>app.riseflake.com</span>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          backgroundColor: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* Top gradient bar */}
        <div style={{
          height: 8,
          background: `linear-gradient(90deg, ${accentFrom}, ${accentTo})`,
          width: '100%',
          display: 'flex',
        }} />

        {/* Main content */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '52px 64px 40px',
          gap: 0,
        }}>
          {/* Top row: Riseflake brand + type badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40, height: 40,
                background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ width: 20, height: 20, background: 'white', borderRadius: 4, display: 'flex' }} />
              </div>
              <span style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
                Riseflake
              </span>
            </div>
            <div style={{
              background: `linear-gradient(135deg, ${accentFrom}, ${accentTo})`,
              color: 'white',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '1.5px',
              padding: '6px 16px',
              borderRadius: 100,
            }}>
              {typeLabel}
            </div>
          </div>

          {/* Company + logo row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo}
                alt={company}
                width={56}
                height={56}
                style={{ borderRadius: 12, objectFit: 'contain', background: 'white', border: '1.5px solid #e2e8f0' }}
              />
            ) : (
              <div style={{
                width: 56, height: 56,
                background: `linear-gradient(135deg, ${accentFrom}22, ${accentTo}22)`,
                border: `1.5px solid ${accentFrom}33`,
                borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24,
              }}>
                🏢
              </div>
            )}
            {company && (
              <span style={{ fontSize: 22, color: '#64748b', fontWeight: 600 }}>{company}</span>
            )}
          </div>

          {/* Job title */}
          <div style={{
            fontSize: title.length > 40 ? 42 : 52,
            fontWeight: 800,
            color: '#0f172a',
            lineHeight: 1.15,
            letterSpacing: '-1px',
            marginBottom: 36,
            maxWidth: 900,
          }}>
            {title}
          </div>

          {/* Badges row */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {location && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'white', border: '1.5px solid #e2e8f0',
                borderRadius: 100, padding: '10px 20px',
                fontSize: 18, color: '#374151', fontWeight: 600,
              }}>
                <span>📍</span> {location}
              </div>
            )}
            {salary && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#f0fdf4', border: '1.5px solid #bbf7d0',
                borderRadius: 100, padding: '10px 20px',
                fontSize: 18, color: '#15803d', fontWeight: 700,
              }}>
                <span>💰</span> {salaryLabel}: {salary}
              </div>
            )}
            {jobType && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#eff6ff', border: '1.5px solid #bfdbfe',
                borderRadius: 100, padding: '10px 20px',
                fontSize: 18, color: '#1d4ed8', fontWeight: 600,
              }}>
                💼 {jobType}
              </div>
            )}
          </div>
        </div>

        {/* Footer strip */}
        <div style={{
          height: 72,
          background: 'white',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 64px',
        }}>
          <span style={{ fontSize: 16, color: '#94a3b8', fontWeight: 500 }}>
            India's #1 job platform for students &amp; freshers
          </span>
          <span style={{ fontSize: 18, fontWeight: 700, color: accentFrom }}>
            riseflake.com
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
