'use client';

import React, { useState, useEffect } from 'react';
import { BASE_ASSETS_URL } from '@/lib/config';

interface Testimonial {
  logoNumber: number;
  avatarNumber: number;
  stars: number;
  review: string;
  name: string;
  title: string;
}

interface Logo {
  src: string;
  key: number;
}

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [logoStartIndex, setLogoStartIndex] = useState<number>(0);

  const testimonials: Testimonial[] = [
    {
      logoNumber: 1,
      avatarNumber: 1,
      stars: 5,
      review: "A professional platform with growth and hiring at its core. Enables better matches and stronger career outcomes.",
      name: 'Eugenia Moore',
      title: 'Software Engineer, HubSpot',
    },
    {
      logoNumber: 2,
      avatarNumber: 2,
      stars: 5,
      review: "Created for job seekers and recruiters alike. Enables seamless hiring and career growth with powerful tools.",
      name: 'Curtis Fletcher',
      title: 'Design Lead, Dribbble',
    },
    {
      logoNumber: 3,
      avatarNumber: 3,
      stars: 4,
      review: "Developer-friendly with all requirements considered. Enables building any interface imaginable with great flexibility.",
      name: 'Sara Smith',
      title: 'Software Engineer, Continental',
    },
    {
      logoNumber: 4,
      avatarNumber: 4,
      stars: 5,
      review: "Built for modern professionals with real opportunities in mind. Enables smarter job search and meaningful networking.",
      name: 'John Davis',
      title: 'Product Manager, Airbnb',
    },
    {
      logoNumber: 5,
      avatarNumber: 5,
      stars: 5,
      review: "Designed for careers with every hiring need considered. Enables faster connections between professionals and top companies.",
      name: 'Emily Chen',
      title: 'CTO, Coinbase',
    },
  ];

  const companyLogos: string[] = [
    `${BASE_ASSETS_URL}/logos/review-company-1.webp`,
    `${BASE_ASSETS_URL}/logos/review-company-2.webp`,
    `${BASE_ASSETS_URL}/logos/review-company-3.webp`,
    `${BASE_ASSETS_URL}/logos/review-company-4.webp`,
    `${BASE_ASSETS_URL}/logos/review-company-5.webp`,
  ];

  useEffect(() => {
    const checkMobile = (): void => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show 2 cards for desktop, 1 for mobile
  const itemsToShow: number = isMobile ? 1 : 2;
  const visibleTestimonials: Testimonial[] = testimonials.slice(currentIndex, currentIndex + itemsToShow);

  useEffect(() => {
    const autoSwipe = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex > testimonials.length - itemsToShow) return 0;
        return nextIndex;
      });
      setLogoStartIndex((prevIndex) => {
        const nextIndex = prevIndex + 2;
        if (nextIndex >= companyLogos.length) return 0;
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(autoSwipe);
  }, [isMobile, testimonials.length, companyLogos.length, itemsToShow]);

  const getVisibleLogos = (): Logo[] => {
    const visible: Logo[] = [];
    for (let i = 0; i < 2; i++) {
      const index = (logoStartIndex + i) % companyLogos.length;
      visible.push({ src: companyLogos[index], key: logoStartIndex + i });
    }
    return visible;
  };

  const handlePrev = (): void => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex === 0) return testimonials.length - itemsToShow;
      return prevIndex - 1;
    });
  };

  const handleNext = (): void => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex > testimonials.length - itemsToShow) return 0;
      return nextIndex;
    });
  };

  const renderStars = (count: number): React.ReactElement => (
    <div className="flex gap-[0.3rem] mb-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            color: star <= count ? '#ffa726' : '#e0e0e0',
            fontSize: isMobile ? '1.2rem' : '1.1rem',
            filter: star <= count ? 'drop-shadow(0 1px 2px rgba(255,167,38,0.3))' : 'none',
          }}
        >
          ★
        </span>
      ))}
    </div>
  );

  return (
    <section 
    className="py-20 px-[5%] md:px-[1%] w-full bg-none relative mx-auto"
      style={{ maxWidth: isMobile ? '100%' : '1200px' }} // Limit to 1200px for desktop
    >
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row lg:items-start">

        {/* Section Header */}
        <div 
          className="lg:sticky lg:top-[120px] lg:flex-none lg:w-[320px] w-full"
          style={isMobile ? { textAlign: 'left' } : {}}
        >
          <span 
            className="inline-block bg-[rgba(95,114,228,0.15)] text-[#6b7ff5] px-5 py-2 rounded-[10px] font-semibold text-[0.80rem] mb-4"
            style={isMobile ? { marginBottom: '0.5rem' } : {}}
          >
            Real Customers Reviews
          </span>

          <h2 
            className="relative inline-block font-bold text-[#2D3A4B] leading-[1.3] text-[1.7rem] lg:text-[1.7rem]"
            style={isMobile ? { 
              margin: '0 0 0.3rem 0', 
              fontSize: '1.5rem',
              display: 'block'
            } : {}}
          >
            What people say
            <span
              className="absolute left-0 bottom-[-2px] w-full opacity-60"
              style={{ 
                height: '10px', 
                background: "url('/section-title-icon.png') no-repeat center/cover",
                ...(isMobile ? { width: '60%' } : {})
              }}
            />
          </h2>

          <p 
            className="text-[#6b7280] text-[0.95rem] leading-[1.5] mb-5 max-w-[300px]"
            style={isMobile ? { 
              margin: '0 0 1rem 0',
              textAlign: 'left',
              maxWidth: '100%'
            } : {}}
          >
            See what our customers have to say about their experience.
          </p>

          {/* Controls */}
          <div 
            className="flex items-center gap-4 mt-[30px]"
            style={isMobile ? { 
              justifyContent: 'flex-start',
              marginTop: '0.5rem',
              marginBottom: '1rem'
            } : {}}
          >
            <button
              onClick={handlePrev}
              className="flex items-center justify-center w-[52px] h-[52px] rounded-xl bg-[#eef0ff] text-[#5f72e4] transition-colors duration-200 hover:bg-[#dfe3ff] text-[1.8rem] shrink-0"
            >
              ‹
            </button>
            <button
              onClick={handleNext}
              className="flex items-center justify-center w-[52px] h-[52px] rounded-xl bg-[#eef0ff] text-[#5f72e4] transition-colors duration-200 hover:bg-[#dfe3ff] text-[1.8rem] shrink-0"
            >
              ›
            </button>

            {/* Mobile dot indicators */}
            {isMobile && (
              <div className="flex items-center gap-1.5">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === currentIndex ? 'w-4 h-2 bg-[#5f72e4]' : 'w-2 h-2 bg-[#c8ccf5]'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Cards and Logos */}
        <div className="flex-1 min-w-0 relative" style={isMobile ? { width: '100%' } : {}}>
          
          {/* Cards Grid */}
          <div 
            className={`grid mb-12 w-full ${
              isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-2 gap-8'
            }`}
            style={isMobile ? { marginBottom: '2rem' } : {}}
          >
            {visibleTestimonials.map((testimonial, index) => (
              <div
                key={currentIndex + index}
                className="flex flex-col overflow-hidden rounded-xl bg-white border border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] p-8"
                style={!isMobile ? { height: '340px' } : { 
                  height: 'auto',
                  minHeight: '320px',
                  padding: '2rem',
                  margin: '0 auto',
                  maxWidth: '95%',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  border: '1px solid rgba(0,0,0,0.06)'
                }}
              >
                {/* Company Logo */}
                <img
                  src={`/logo.webp`}
                  alt={`Company Logo ${testimonial.logoNumber}`}
                  className="object-contain mb-5"
                  style={{ 
                    height: '22px', 
                    width: 'auto', 
                    maxWidth: '110px' 
                  }}
                />

                {/* Stars */}
                {renderStars(testimonial.stars)}

                {/* Review */}
                <p
                  className="flex-1 text-[#5f6368] text-sm leading-[1.6] overflow-hidden"
                  style={{
                    marginBottom: 'auto',
                    display: '-webkit-box',
                    WebkitLineClamp: isMobile ? 4 : 6,
                    WebkitBoxOrient: 'vertical',
                    fontSize: '0.9rem',
                    minHeight: isMobile ? 'auto' : '120px',
                  }}
                >
                  {testimonial.review}
                </p>

                {/* Reviewer */}
                <div className="flex items-center gap-4 mt-5 shrink-0">
                  <img
                    src={`/${testimonial.avatarNumber}.png`}
                    alt={testimonial.name}
                    className="rounded-full object-cover shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
                    style={{ width: '44px', height: '44px' }}
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-[#2c3e50] text-[0.9rem] whitespace-nowrap overflow-hidden text-ellipsis mb-0.5">
                      {testimonial.name}
                    </p>
                    <p className="text-[#80868b] text-[0.8rem] font-normal whitespace-nowrap overflow-hidden text-ellipsis">
                      {testimonial.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Logos Section */}
          <div 
            className="pt-14 border-t border-black/[0.08]"
            style={isMobile ? { 
              marginTop: '3rem',
              paddingTop: '0',
              borderTop: 'none',
              textAlign: 'center'
            } : {}}
          >
            <div 
              className={`flex flex-wrap items-center gap-8 transition-all duration-500 ease-in-out ${
                isMobile ? 'justify-center' : 'justify-start'
              }`}
              style={isMobile ? { 
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                maxWidth: '500px',
                margin: '0 auto',
                padding: '0 1rem'
              } : {}}
            >
              {isMobile ? (
                getVisibleLogos().map((logo) => (
                  <img
                    key={logo.key}
                    src={logo.src}
                    alt="Company Logo"
                    className="opacity-70 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0"
                    style={{ 
                      height: '24px', 
                      width: 'auto',
                      margin: '0 auto',
                      justifySelf: 'center'
                    }}
                  />
                ))
              ) : (
                companyLogos.map((logo, index) => (
                  <img
                    key={index}
                    src={logo}
                    alt={`Company Logo ${index + 1}`}
                    className="opacity-70 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0"
                    style={{ height: '30px', width: 'auto' }}
                  />
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Testimonials;