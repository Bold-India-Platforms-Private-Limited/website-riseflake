'use client';

import React, { useState, useEffect } from 'react';
import { BASE_ASSETS_URL } from '../../lib/config';
import InitialsAvatar from './InitialsAvatar';

interface Testimonial {
  logoNumber: number;
  stars: number;
  review: string;
  name: string;
  title: string;
  id: string;
  image?: string;
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
      stars: 5,
      review: "The resume templates are clean, professional, and ATS-friendly. Got 7 offers from top tech firms using the designer templates!",
      name: 'Priya Sharma',
      title: 'SDE-1',
      id: 'priya-sharma',
      image: '/1.webp'
    },
    {
      logoNumber: 2,
      stars: 5,
      review: "Found amazing mentors and built my professional network within weeks. Professional Networking here is simple and effective.",
      name: 'Anjali Mehta',
      title: 'UX Designer',
      id: 'anjali-mehta',
      image: '/2.webp'
    },
    {
      logoNumber: 3,
      stars: 5,
      review: "The AI suggestions for job applications were spot on. Landed multiple interviews and my dream PM role within 21 days.",
      name: 'Rahul Verma',
      title: 'Product Manager',
      id: 'rahul-verma',
      image: '/3.webp'
    },
    {
      logoNumber: 4,
      stars: 5,
      review: "Upgraded my resume and saw an immediate 42% increase in interview callbacks. The best tool for any serious job seeker.",
      name: 'Sneha Kapoor',
      title: 'Data Scientist',
      id: 'sneha-kapoor',
      image: '/4.webp'
    },
    {
      logoNumber: 5,
      stars: 5,
      review: "This comprehensive job search platform changed my career path. Efficiently managed my search and got my dream role.",
      name: 'Neha Gupta',
      title: 'HR Manager',
      id: 'neha-gupta',
      image: '/5.webp'
    },
  ];

  const companyLogos: string[] = [
    `${BASE_ASSETS_URL}/logos/review-company-2.webp`,
    `${BASE_ASSETS_URL}/logos/review-company-3.webp`,
    `${BASE_ASSETS_URL}/logos/review-company-4.webp`,
  ];

  const [isTablet, setIsTablet] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = (): void => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      setIsTablet(w >= 768 && w < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show 3 cards for desktop, 2 for tablet, 1 for mobile
  const itemsToShow: number = isMobile ? 1 : isTablet ? 2 : 3;
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
      className="py-20 px-[5%] md:px-[3%] w-full bg-none relative mx-auto overflow-hidden"
      style={{ maxWidth: '1200px' }} // Limit to 1200px for desktop
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
                    className={`rounded-full transition-all duration-300 ${i === currentIndex ? 'w-4 h-2 bg-[#5f72e4]' : 'w-2 h-2 bg-[#c8ccf5]'
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
            className="grid mb-12 w-full gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          >
            {visibleTestimonials.map((testimonial, index) => (
              <div
                key={currentIndex + index}
                className="flex flex-col overflow-hidden rounded-xl bg-white border border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] p-6"
                style={{ minHeight: '320px', minWidth: '0' }}
              >


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
                  {testimonial.image ? (
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-11 h-11 rounded-full object-cover shadow-md"
                    />
                  ) : (
                    <InitialsAvatar name={testimonial.name} seed={testimonial.name} size={44} className="shadow-md" />
                  )}
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
              className={`flex flex-wrap items-center gap-14 transition-all duration-500 ease-in-out ${isMobile ? 'justify-center' : 'justify-start'
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