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
    "LCAT",
    "Career Pathfinder",
    "Jobs & Internships",
  ];

  return (
    <section className="max-w-6xl mx-auto px-0 mt-10 mb-12">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-8 flex flex-col md:flex-row items-center gap-10 overflow-hidden">

        {/* Left: Content */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left gap-5">

          <h3 className="text-xl md:text-2xl font-semibold text-gray-900 leading-snug">
            Your complete career platform for students & early-career professionals
          </h3>

          <p className="text-sm md:text-base text-gray-600 max-w-lg">
            Learn from industry experts, compete in skill-based contests, test your aptitude, discover career paths, 
            and apply to verified jobs and internships — all in one place.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
            {featureTags.map((item, idx) => (
              <FeatureTag key={idx}>
                {item}
              </FeatureTag>
            ))}
          </div>

          <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-7 py-2.5 rounded-full shadow-sm transition">
            Explore now
          </button>
        </div>

        {/* Right: Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="https://boldanalytics.in/static/assets/job-portal-hero.webp"
            alt="Career Platform Illustration"
            className="w-full max-w-sm md:max-w-md object-contain"
          />
        </div>

      </div>
    </section>
  );
};

export default Introducing;