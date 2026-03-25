import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';

import LegalNav from './LegalNav';

interface InfoSection {
  heading: string;
  body: string | ReactNode;
}

interface InfoPageLayoutProps {
  title: string;
  breadcrumbLabel: string;
  intro: string;
  sections: InfoSection[];
  children?: ReactNode;
  hideMobileHeader?: boolean;
  showLegalNav?: boolean;
}

const InfoPageLayout = ({
  title,
  breadcrumbLabel,
  intro,
  sections,
  children,
  hideMobileHeader = false,
  showLegalNav = false,
}: InfoPageLayoutProps) => {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-50">
      {!hideMobileHeader && (
        <div className="md:hidden sticky top-0 z-20 border-b border-slate-200 bg-white px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100"
            aria-label="Go back"
          >
            <ArrowLeft size={16} />
          </button>
          <p className="text-sm font-semibold text-slate-800 truncate">{breadcrumbLabel}</p>
        </div>
      )}

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <nav className="hidden md:flex items-center text-sm text-slate-500 gap-1">
          <Link href="/" className="hover:text-indigo-600">
            Home
          </Link>
          <ChevronRight size={14} />
          <span className="text-slate-700">{breadcrumbLabel}</span>
        </nav>

        <article className="mt-4 md:mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 md:p-8 shadow-sm">
          {showLegalNav && <LegalNav />}
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{title}</h1>
          <p className="mt-3 text-sm md:text-base text-slate-600 leading-relaxed">{intro}</p>

          <div className="mt-6 md:mt-8 space-y-6">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-lg md:text-xl font-semibold text-slate-900">{section.heading}</h2>
                <p className="mt-2 text-sm md:text-base text-slate-600 leading-relaxed">{section.body}</p>
              </section>
            ))}
          </div>

          {children ? <div className="mt-8">{children}</div> : null}
        </article>
      </section>
    </main>
  );
};

export default InfoPageLayout;
