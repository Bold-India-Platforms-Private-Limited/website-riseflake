'use client';
import React from 'react';

interface FeatureTagProps {
  children: string;
}

const FeatureTag: React.FC<FeatureTagProps> = ({ children }) => (
  <span className="text-sm font-medium px-4 py-1.5 bg-gray-50 border border-gray-200 rounded-full hover:bg-white hover:shadow-sm transition">
    {children}
  </span>
);

const Introducing: React.FC = () => {
  const featureTags: string[] = [
    "Upskill",
    "Riseflake V8",
    "Networking",
    "Jobs & Internships",
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 mt-12 mb-16">
      <div className="relative overflow-hidden bg-white rounded-[32px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] px-8 py-10 flex flex-col md:flex-row items-center gap-12">

        {/* Subtle Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50/50 blur-[80px] rounded-full pointer-events-none" />

        {/* Left: Content */}
        <div className="relative z-10 w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider">
            <span>New Release</span>
          </div>

          <h3 className="text-2xl md:text-4xl font-[800] text-slate-900 leading-[1.15] tracking-tight">
            Riseflake V8 - The Complete <br className="hidden md:block" />
            <span className="text-blue-600">Career Platform</span>
          </h3>

          <p className="text-sm md:text-base text-slate-600 font-medium max-w-lg leading-relaxed">
            Learn from industry experts, compete in skill-based contests, test your aptitude, discover career paths,
            and apply to jobs and internships — all in one place.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-2.5">
            {featureTags.map((item, idx) => (
              <FeatureTag key={idx}>
                {item}
              </FeatureTag>
            ))}
          </div>

          <a
            href="https://app.riseflake.com/home"
            className="mt-4 inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-10 py-3.5 rounded-full shadow-[0_10px_20px_rgba(37,99,235,0.2)] transition-all hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Explore now
          </a>
        </div>

        {/* Right: Image */}
        <div className="relative z-10 w-full md:w-1/2 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-100/20 blur-3xl rounded-full" />
            <img
              src="https://assets.riseflake.com/images/illustrations/job-portal-hero.webp"
              alt="Career Platform Illustration"
              className="relative w-full max-w-sm md:max-w-md object-contain transition-transform duration-700 hover:rotate-1"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Introducing;