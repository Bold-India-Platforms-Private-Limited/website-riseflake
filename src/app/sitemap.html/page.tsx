
import Link from 'next/link';

const staticPages = [
  { url: 'https://app.riseflake.com/', label: 'RiseFlake App' },
  { url: 'https://riseflake.com/', label: 'Home' },
  { url: 'https://riseflake.com/jobs', label: 'Jobs' },
  { url: 'https://riseflake.com/internships', label: 'Internships' },
  { url: 'https://riseflake.com/colleges', label: 'Colleges' },
  { url: 'https://riseflake.com/companies', label: 'Companies' },
  { url: 'https://riseflake.com/about', label: 'About' },
  { url: 'https://riseflake.com/contact', label: 'Contact' },
  { url: 'https://riseflake.com/privacy-policy', label: 'Privacy Policy' },
  { url: 'https://riseflake.com/cookie-policy', label: 'Cookie Policy' },
  { url: 'https://riseflake.com/terms-of-service', label: 'Terms of Service' },
];

const sitemapEndpoints = [
  { url: '/sitemap-jobs.xml', label: 'Jobs Sitemap' },
  { url: '/sitemap-internships.xml', label: 'Internships Sitemap' },
  { url: '/sitemap-companies.xml', label: 'Companies Sitemap Index' },
  { url: '/sitemap-static.xml', label: 'Static Pages Sitemap' },
];

export default function SitemapHtml() {
  return (
    <main style={{ maxWidth: 800, margin: '2rem auto', fontFamily: 'Inter, sans-serif', background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #0001', padding: '2.5rem 2rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem', letterSpacing: '-1px', color: '#1a202c' }}>RiseFlake Sitemap</h1>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#2d3748', marginBottom: 12 }}>Static Pages</h2>
        <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1.5rem', listStyle: 'none', padding: 0 }}>
          {staticPages.map((page) => (
            <li key={page.url}>
              <a href={page.url} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>{page.label}</a>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#2d3748', marginBottom: 12 }}>XML Sitemaps</h2>
        <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1.5rem', listStyle: 'none', padding: 0 }}>
          {sitemapEndpoints.map((s) => (
            <li key={s.url}>
              <Link href={s.url} style={{ color: '#059669', textDecoration: 'none', fontWeight: 500 }}>{s.label}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: '2.5rem', color: '#64748b', fontSize: '1rem' }}>
        <p>For full dynamic listings (jobs, internships, companies), see the XML sitemaps above.<br />
        This page is for human visitors and search engines to easily discover all important sections of RiseFlake.</p>
      </section>
    </main>
  );
}
