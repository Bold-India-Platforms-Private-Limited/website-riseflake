'use client';

import React from 'react';
import {
  Code, HelpCircle, Briefcase, FileText, Globe, Building2, Sparkles, Users,
  CreditCard, RotateCw, Monitor, Shield, Mic, XSquare, FileCheck, Calendar, Video,
  LucideIcon,
} from 'lucide-react';

// ─── Inline keyframe injection ──────────────────────────────────────────────
const STYLES = `
  @keyframes scrollLeft {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-33.333%); }
  }
  @keyframes scrollRight {
    0%   { transform: translateX(-33.333%); }
    100% { transform: translateX(0); }
  }
  .slider-track-top {
    display: flex;
    gap: 12px;
    width: max-content;
    animation: scrollLeft 70s linear infinite;
  }
  .slider-track-bottom {
    display: flex;
    gap: 12px;
    width: max-content;
    animation: scrollRight 70s linear infinite;
  }
  .slider-wrapper:hover .slider-track-top,
  .slider-wrapper:hover .slider-track-bottom {
    animation-play-state: paused;
  }
`;

// ─── Custom SVG icons ────────────────────────────────────────────────────────
const ListIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const LinkIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const TranslateIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" /><path d="M2 5h12" />
    <path d="M7 2h1" /><path d="m22 22-5-10-5 10" /><path d="M14 18h6" />
  </svg>
);

// ─── Types ───────────────────────────────────────────────────────────────────
type IconComponent = LucideIcon | React.FC;

interface CardDef {
  icon: IconComponent;
  title: string;
}

type GradientDirection = 'top' | 'bottom' | 'left' | 'right';

// ─── Decorative box gradient border ─────────────────────────────────────────
const gradientMap: Record<GradientDirection, string> = {
  top: 'linear-gradient(to top, rgb(191,220,249), white)',
  bottom: 'linear-gradient(to bottom, rgb(191,220,249), white)',
  left: 'linear-gradient(to left, rgb(191,220,249), white)',
  right: 'linear-gradient(to right, rgb(191,220,249), white)',
};

const DecorativeBox: React.FC<{ dir: GradientDirection }> = ({ dir }) => (
  <div
    className="relative w-[130px] h-[130px] rounded-[24px] bg-white flex-shrink-0"
    style={{
      position: 'relative',
    }}
  >
    {/* gradient border via pseudo-element equivalent using an absolutely positioned overlay */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '24px',
        padding: '1px',
        background: gradientMap[dir],
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  </div>
);

// ─── Small card ──────────────────────────────────────────────────────────────
const SmallCard: React.FC<{ card: CardDef; index: number }> = ({ card, index }) => {
  const Icon = card.icon as React.FC<{ className?: string }>;
  return (
    <div
      key={index}
      className="
        bg-white rounded-[24px] p-5 flex flex-col items-start cursor-pointer
        border border-[rgb(191,220,249)] box-border
        transition-all duration-200 ease-in-out flex-shrink-0
        w-[143px] h-[130px]
        hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]
        hover:border-[rgb(0,115,230)] hover:bg-[rgb(242,248,254)]
        max-md:w-[112px] max-md:h-24 max-md:p-2.5 max-md:rounded-2xl
      "
    >
      <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center mb-3 border border-gray-100 shadow-sm flex-shrink-0">
        <Icon className="w-[18px] h-[18px] text-[rgba(24,23,23,1)]" />
      </div>
      <h3 className="text-[13px] font-semibold text-[rgb(56,56,56)] m-0 leading-[1.3]">
        {card.title}
      </h3>
    </div>
  );
};

// ─── Feature list (mobile only) ──────────────────────────────────────────────
const FeatureList: React.FC<{ features: string[]; bulletColor: string }> = ({ features, bulletColor }) => (
  <ul className="hidden max-md:block list-none p-0 m-0">
    {features.map((f, i) => (
      <li
        key={i}
        className="text-sm text-[#374151] leading-[1.5] mb-2 last:mb-0 pl-6 relative"
      >
        <span
          className="absolute left-1 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white"
          style={{ background: bulletColor }}
        />
        {f}
      </li>
    ))}
  </ul>
);

// ─── Slider ──────────────────────────────────────────────────────────────────
const CardSlider: React.FC<{ cards: React.ReactNode[]; direction: 'top' | 'bottom' }> = ({ cards, direction }) => (
  <div className="slider-wrapper block md:hidden relative w-full mb-6 last:mt-6">
    <div className="overflow-hidden w-full">
      <div className={direction === 'top' ? 'slider-track-top' : 'slider-track-bottom'}>
        {cards}{cards}{cards}
      </div>
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
export default function Assessment() {
  const allCards: CardDef[] = [
    { icon: Code, title: 'Hackathons & Case Challenges' },
    { icon: HelpCircle, title: 'Innovation Challenges' },
    { icon: Briefcase, title: 'Jobs Listings' },
    { icon: FileText, title: 'Internship Listings' },
    { icon: Globe, title: 'Branded Microsite' },
    { icon: Building2, title: 'Resume Parsing' },
    { icon: Sparkles, title: 'AI Compatibility Score' },
    { icon: Users, title: 'Manage Candidates' },
    { icon: Monitor, title: 'Skill-based Assessments' },
    { icon: ListIcon, title: '50,000+ Question Bank' },
    { icon: LinkIcon, title: 'Assessment Unique Link' },
    { icon: TranslateIcon, title: 'Multi-lingual AI Interviews' },
    { icon: Calendar, title: 'Schedule Interview' },
    { icon: Video, title: 'Coding Live Interview' },
    { icon: FileCheck, title: 'Automated Evaluations' },
    { icon: RotateCw, title: '360° Proctoring' },
    { icon: CreditCard, title: 'Aadhaar Verification' },
    { icon: Monitor, title: 'Device Detection' },
    { icon: Shield, title: 'Facial Verification' },
    { icon: Mic, title: 'Voice Biometric' },
    { icon: XSquare, title: 'Screen Share Blocking' },
    { icon: FileCheck, title: 'Candidate Report' },
  ];

  const cardFeatures: Record<string, string[]> = {
    'Employer Branding': [
      'Hackathons, Case Competitions, Simulations, Challenges',
      'Internship & Job Listings',
      'Branded Employer Microsite',
    ],
    Source: [
      'Aadhaar & Facial Scan Based Verification',
      'Automated Resume Parsing & Shortlisting',
      'AI-based Candidate Mapping & Scoring',
    ],
    Screen: [
      'Versatile Assessments For All Roles & Skills',
      '50,000+ Question Bank',
      '360° Proctoring With Face Scan & Voice Biometrics',
    ],
    Assess: [
      'Versatile Assessments For All Roles & Skills',
      '50,000+ Question Bank',
      '360° Proctoring With Face Scan & Voice Biometrics',
    ],
    Interview: [
      'Multi-lingual AI Interviews',
      'Schedule Interviews Seamlessly',
      'Coding Live Interview Platform',
    ],
    'Recruitment Automation & AI-powered ATS': [
      'Automated Candidate Screening',
      'AI-Powered Shortlisting & Ranking',
      'End-to-End Recruitment Pipeline Management',
    ],
  };

  const renderedCards = allCards.map((card, i) => (
    <SmallCard card={card} index={i} key={i} />
  ));

  // ─── Featured card shared structure ────────────────────────────────────────
  const FeaturedCard: React.FC<{
    className: string;
    titleText: string;
    titleColor: string;
    bulletColor: string;
    featureKey: string;
    large?: boolean;
  }> = ({ className, titleText, titleColor, bulletColor, featureKey, large }) => (
    <div className={className}>
      {/* image area placeholder — flex-1 so content is pushed to bottom */}
      <div className="flex-1 flex items-center justify-center p-4" />
      <div className="px-5 pb-5 pt-4 max-md:p-5">
        <h2
          className={`${large ? 'text-[18px]' : 'text-[16px]'} font-semibold m-0 mb-3 leading-[1.3] max-md:text-[18px] max-md:mb-4`}
          style={{ color: titleColor }}
        >
          {titleText}
        </h2>
        <FeatureList features={cardFeatures[featureKey]} bulletColor={bulletColor} />
      </div>
    </div>
  );

  // ─── Card style variants ────────────────────────────────────────────────────
  const baseCard = `
    rounded-[24px] overflow-hidden cursor-pointer
    transition-all duration-200 ease-in-out box-border
    flex flex-col
    hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]
    hover:border-[rgb(0,115,230)]
    backdrop-blur-[12px]
  `;

  // Grid card dimensions (desktop) vs full-width on mobile
  const large = 'w-[296px] h-[270px] max-md:w-full max-md:h-[200px]';
  const medium = 'w-[296px] h-[130px] max-md:w-full max-md:h-[200px]';

  return (
    <>
      {/* Inject keyframe animations */}
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* ── Container ── */}
      <div className="min-h-screen bg-white box-border flex justify-center items-start max-md:p-4">
        <div className="relative inline-block max-md:w-full">

          {/* ── Header ── */}
          <div className="relative z-10 mb-[150px] max-md:mb-8">
            <h1 className="text-[42px] font-bold text-[#111827] text-center mb-3 max-md:text-2xl max-md:mb-2">
              Intelligent platform for career opportunity matching
            </h1>
            <p className="text-[18px] text-[#4b5563] text-center mb-16 max-md:text-sm max-md:mb-6">
              Full-stack Features / AI Tools For College, Students, Companies, Recruiter's
            </p>
          </div>

          {/* ── Mobile slider — top ── */}
          <CardSlider cards={renderedCards} direction="top" />

          {/* ── Grid + decorative boxes ── */}
          <div className="relative">

            {/* Decorative boxes — desktop only */}
            <div className="absolute -top-[140px] -left-[140px] -right-[140px] -bottom-[140px] pointer-events-none max-md:hidden">
              {/* Top row */}
              <div className="flex gap-[10px] justify-center absolute left-1/2 -translate-x-1/2 top-0">
                {Array.from({ length: 10 }).map((_, i) => <DecorativeBox key={`t${i}`} dir="top" />)}
              </div>
              {/* Bottom row */}
              <div className="flex gap-[10px] justify-center absolute left-1/2 -translate-x-1/2 bottom-0">
                {Array.from({ length: 10 }).map((_, i) => <DecorativeBox key={`b${i}`} dir="bottom" />)}
              </div>
              {/* Left column */}
              <div className="flex flex-col gap-[10px] absolute left-0 top-[140px] bottom-[140px] justify-center">
                {Array.from({ length: 5 }).map((_, i) => <DecorativeBox key={`l${i}`} dir="left" />)}
              </div>
              {/* Right column */}
              <div className="flex flex-col gap-[10px] absolute right-0 top-[140px] bottom-[140px] justify-center">
                {Array.from({ length: 5 }).map((_, i) => <DecorativeBox key={`r${i}`} dir="right" />)}
              </div>
            </div>

            {/*
              ── Desktop CSS Grid ──
              Columns: 143px 10px 296px 10px 296px 10px 296px 10px 143px
              Rows:    130px 10px 417px 10px 130px
            */}
            <div
              className="
                grid w-fit max-w-full relative
                max-md:flex max-md:flex-col max-md:gap-6 max-md:w-full
              "
              style={{
                gridTemplateColumns: '143px 10px 296px 10px 296px 10px 296px 10px 143px',
                gridTemplateRows: '130px 10px 417px 10px 130px',
              }}
            >
              {/* ── TOP ROW (cols 1–9, row 1) — desktop only ── */}
              <div
                className="flex gap-[10px] justify-center max-md:hidden"
                style={{ gridColumn: '1 / 10', gridRow: '1' }}
              >
                {allCards.slice(0, 8).map((card, i) => <SmallCard card={card} index={i} key={i} />)}
              </div>

              {/* ── LEFT COLUMN (col 1, row 3) — desktop only ── */}
              <div
                className="flex flex-col gap-[10px] max-md:hidden"
                style={{ gridColumn: '1', gridRow: '3' }}
              >
                {allCards.slice(8, 11).map((card, i) => <SmallCard card={card} index={i} key={i} />)}
              </div>

              {/* ── CENTER CONTENT (cols 3–7, row 3) ── */}
              <div
                className="flex gap-[10px] max-md:flex-col max-md:gap-4"
                style={{ gridColumn: '3 / 8', gridRow: '3' }}
              >
                {/* Column 1 */}
                <div className="flex flex-col gap-[10px] w-[296px] max-md:w-full max-md:gap-4">
                  {/* LargeCard1 — blue/indigo multi-color */}
                  <FeaturedCard
                    className={`${baseCard} ${large} bg-[linear-gradient(135deg,#EBEFFF_0%,#F3F8FF_50%,#DBEAFE_100%)] border-[#C7D2FE]`}
                    titleText="Employer Branding"
                    titleColor="rgba(38,127,228,1)"
                    bulletColor="rgba(38,127,228,1)"
                    featureKey="Employer Branding"
                    large
                  />
                  {/* MediumCard1 — purple/pink multi-color */}
                  <FeaturedCard
                    className={`${baseCard} ${medium} bg-[linear-gradient(135deg,#F8F5FF_0%,#F3E8FF_50%,#FFF0F6_100%)] border-[#DDD6FE]`}
                    titleText="Screen"
                    titleColor="rgb(101,72,238)"
                    bulletColor="rgb(101,72,238)"
                    featureKey="Screen"
                  />
                </div>

                {/* Column 2 */}
                <div className="flex flex-col gap-[10px] w-[296px] max-md:w-full max-md:gap-4">
                  {/* LargeCard2 — pink/peach/apricot multi-color */}
                  <FeaturedCard
                    className={`${baseCard} ${large} bg-[linear-gradient(135deg,#FFF5F7_0%,#FFE4E6_50%,#FFF3E1_100%)] border-[#FECACA]`}
                    titleText="Source"
                    titleColor="#c2185b"
                    bulletColor="#c2185b"
                    featureKey="Source"
                    large
                  />
                  {/* MediumCard2 — orange/gold/light-yellow multi-color */}
                  <FeaturedCard
                    className={`${baseCard} ${medium} bg-[linear-gradient(135deg,#FFF9F2_0%,#FFEDD5_50%,#FEFCE8_100%)] border-[#FED7AA]`}
                    titleText="Assess"
                    titleColor="rgb(211,101,11)"
                    bulletColor="rgb(211,101,11)"
                    featureKey="Assess"
                  />
                </div>

                {/* Column 3 */}
                <div className="flex flex-col gap-[10px] w-[296px] max-md:w-full max-md:gap-4">
                  {/* MediumCard3 — green/mint/light-sky multi-color */}
                  <FeaturedCard
                    className={`${baseCard} ${medium} bg-[linear-gradient(135deg,#F4FDF8_0%,#DCFCE7_50%,#E8F9FF_100%)] border-[#BBF7D0]`}
                    titleText="Interview"
                    titleColor="rgb(5,193,101)"
                    bulletColor="rgb(5,193,101)"
                    featureKey="Interview"
                  />
                  {/* LargeCard3 — yellow/amber/pale-red multi-color */}
                  <FeaturedCard
                    className={`${baseCard} ${large} bg-[linear-gradient(135deg,#FFFDF0_0%,#FEF3C7_50%,#FFF2F2_100%)] border-[#FEF08A]`}
                    titleText="Recruitment Automation & AI-powered ATS"
                    titleColor="rgb(153,119,0)"
                    bulletColor="rgb(153,119,0)"
                    featureKey="Recruitment Automation & AI-powered ATS"
                    large
                  />
                </div>
              </div>

              {/* ── RIGHT COLUMN (col 9, row 3) — desktop only ── */}
              <div
                className="flex flex-col gap-[10px] max-md:hidden"
                style={{ gridColumn: '9', gridRow: '3' }}
              >
                {allCards.slice(11, 14).map((card, i) => <SmallCard card={card} index={i} key={i} />)}
              </div>

              {/* ── BOTTOM ROW (cols 1–9, row 5) — desktop only ── */}
              <div
                className="flex gap-[10px] justify-center max-md:hidden"
                style={{ gridColumn: '1 / 10', gridRow: '5' }}
              >
                {allCards.slice(14).map((card, i) => <SmallCard card={card} index={i} key={i} />)}
              </div>
            </div>
          </div>

          {/* ── Mobile slider — bottom ── */}
          <CardSlider cards={renderedCards} direction="bottom" />

        </div>
      </div>
    </>
  );
}