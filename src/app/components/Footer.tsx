'use client'

import { useEffect, useRef, useState } from 'react'
import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { BASE_ASSETS_URL } from '../../lib/config'

type SectionKey = 'resources' | 'company' | 'quickLinks'

const BRAND_NAME = 'Riseflake'

const links = {
  resources: [
    { label: 'Support', href: '/support' },
    { label: 'Login & Register', href: '/login' },
    { label: 'HTML Sitemap', href: '/html-sitemap' },
    { label: 'XML Sitemap', href: '/xml-sitemap' },
  ],
  company: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Disclaimer', href: '/disclaimer' },
  ],
  quickLinks: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Refund Policy', href: '/refund-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
    { label: 'Trust & Safety', href: '/trust-and-safety' },
  ],
}

const socialLinks = [
  {
    name: 'Facebook',
    href: '#',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" className="fill-current">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: '#',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" className="fill-current">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: 'Twitter',
    href: '#',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" className="fill-current">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: '#',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" className="fill-current">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
]

const businessLogos = [
  { id: 1, src: `${BASE_ASSETS_URL}/logos/cloud-partner-1.webp`, alt: 'Razorpay' },
  { id: 2, src: `${BASE_ASSETS_URL}/logos/cloud-partner-2.webp`, alt: 'AWS' },
  { id: 3, src: `${BASE_ASSETS_URL}/logos/cloud-partner-3.webp`, alt: 'Azure' },
  { id: 4, src: `${BASE_ASSETS_URL}/logos/cloud-partner-4.webp`, alt: 'Cloudflare' },
  { id: 5, src: `${BASE_ASSETS_URL}/logos/cloud-partner-5.webp`, alt: 'Firebase' },
  { id: 6, src: `${BASE_ASSETS_URL}/logos/cloud-partner-6.webp`, alt: 'Google Cloud' },
]

const bottomLinks = [
  { label: 'Regulatory & Other Info', href: '/regulatory-info' },
  { label: 'Disclaimer Disclosure', href: '/disclaimer' },
  { label: 'Information Security Practices', href: '/information-security' },
  { label: 'Investors', href: '/investors' },
  { label: 'Bug Bounty', href: '/bug-bounty' },
  { label: 'Fraud alert', href: '/fraud-alert' },
  { label: 'Cookie Policy', href: '/cookie-policy' },
]

const contactInfo = {
  phone: '+012 (345) 678 99',
  description: 'Sed ut perspiciatis undmnis is iste natus error sit amet voluptatem totam rem aperiam.',
}

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [isMobile, setIsMobile] = useState(false)
  const [showLogos, setShowLogos] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<SectionKey, boolean>>({
    resources: false,
    company: false,
    quickLinks: false,
  })

  const logosContainerRef = useRef<HTMLDivElement | null>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      setShowLogos(true) // Always show logos on all screen sizes
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const container = logosContainerRef.current
    if (!container || !showLogos) return

    let position = 0
    const scrollSpeed = 1

    const animate = () => {
      position -= scrollSpeed
      if (Math.abs(position) >= container.scrollWidth / 2) {
        position = 0
      }

      container.style.transform = `translateX(${position}px)`
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [showLogos])

  const toggleSection = (section: SectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <footer className="border-t bg-white pt-12 pb-8">
      <div className="mx-auto max-w-[1300px] px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:gap-x-6 lg:mb-16 lg:grid-cols-5 lg:gap-x-12">
          <div className="lg:col-span-1">
            <div className="mb-8">
              <a href="/" className="md:inline-block">
                <img src="/logo-main.webp" alt="Company Logo" className="h-10" />
              </a>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-medium text-gray-800">Connect with us</h4>
              <div className="flex items-center space-x-3">
                {socialLinks.map((social) => (
                  <SocialLink key={social.name} href={social.href} name={social.name} icon={social.icon} />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-8 lg:col-span-3">
            <div className="border-b border-gray-200 pb-3 sm:border-b-0 sm:pb-0">
              <div
                className="flex cursor-pointer items-center justify-between sm:cursor-auto"
                onClick={() => isMobile && toggleSection('resources')}
              >
                <h4 className="mb-2 text-sm font-medium text-gray-800 sm:mb-6">Resources</h4>
                {isMobile && (
                  <span className="text-lg text-gray-500 sm:hidden">
                    {expandedSections.resources ? '−' : '+'}
                  </span>
                )}
              </div>
              <div className={isMobile && !expandedSections.resources ? 'hidden sm:block' : ''}>
                <ul className="space-y-3">
                  {links.resources.map((link) => (
                    <li key={link.href}>
                      <FooterLink href={link.href}>{link.label}</FooterLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-3 sm:border-b-0 sm:pb-0">
              <div
                className="flex cursor-pointer items-center justify-between sm:cursor-auto"
                onClick={() => isMobile && toggleSection('company')}
              >
                <h4 className="mb-2 text-sm font-medium text-gray-800 sm:mb-6">Company</h4>
                {isMobile && (
                  <span className="text-lg text-gray-500 sm:hidden">
                    {expandedSections.company ? '−' : '+'}
                  </span>
                )}
              </div>
              <div className={isMobile && !expandedSections.company ? 'hidden sm:block' : ''}>
                <ul className="space-y-3">
                  {links.company.map((link) => (
                    <li key={link.href}>
                      <FooterLink href={link.href}>{link.label}</FooterLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-3 sm:border-b-0 sm:pb-0">
              <div
                className="flex cursor-pointer items-center justify-between sm:cursor-auto"
                onClick={() => isMobile && toggleSection('quickLinks')}
              >
                <h4 className="mb-2 text-sm font-medium text-gray-800 sm:mb-6">Quick Links</h4>
                {isMobile && (
                  <span className="text-lg text-gray-500 sm:hidden">
                    {expandedSections.quickLinks ? '−' : '+'}
                  </span>
                )}
              </div>
              <div className={isMobile && !expandedSections.quickLinks ? 'hidden sm:block' : ''}>
                <ul className="space-y-3">
                  {links.quickLinks.map((link) => (
                    <li key={link.href}>
                      <FooterLink href={link.href}>{link.label}</FooterLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-16 flex w-full justify-center sm:flex lg:col-span-1 lg:mb-0 lg:-ml-[90px] lg:h-[150px] lg:w-[380px] lg:justify-start">
            <div className="h-[150px] w-[300px] rounded-xl border border-gray-200 bg-white p-4 shadow-md">
              <h4 className="mb-1 font-semibold text-gray-900">Apply on the go</h4>
              <p className="mb-4 text-sm text-gray-600">Get real-time job updates on our App</p>
              <div className="flex justify-center gap-2">
                <a href="#" className="w-1/2 max-w-[130px]">
                  <img src="https://assets.riseflake.com/images/illustrations/play-store.jpg" alt="Get it on Google Play" className="h-auto w-full object-contain" />
                </a>
                <a href="#" className="w-1/2 max-w-[130px]">
                  <img src="https://assets.riseflake.com/images/illustrations/app-store.jpg" alt="Download on the App Store" className="h-auto w-full object-contain" />
                </a>
              </div>
              <div className="mt-10 flex justify-center lg:justify-start">
                <iframe
                  src="https://riseflake.betteruptime.com/badge?theme=light"
                  width="250"
                  height="30"
                  frameBorder="0"
                  scrolling="no"
                  style={{ colorScheme: 'normal' }}
                  title="Service Status"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-gray-200 pt-2">
          <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start lg:items-center lg:gap-6">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-500">
                <FooterLink href="/">{BRAND_NAME}</FooterLink>
              </div>

              <div className="space-y-1 text-xs text-gray-500">
                <p>All logos are trademarks of their respective owners. Used for identification purposes only.</p>
                <p>
                  © {currentYear} {BRAND_NAME}.{' '}
                  <FooterLink href="https://boldindia.in" target="_blank" rel="noopener noreferrer">
                    Bold India Platforms Pvt. Ltd.
                  </FooterLink>{' '}
                  All rights reserved.
                </p>
              </div>
            </div>

            {showLogos && (
              <div className="flex-1 overflow-hidden">
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
                  <span className="flex-shrink-0 whitespace-nowrap text-xs text-gray-500">
                    Cloud & Infrastructure Partner
                  </span>
                  <div className="w-full overflow-x-auto no-scrollbar">
                    <div ref={logosContainerRef} className="flex min-w-max items-center space-x-6">
                      {[...businessLogos, ...businessLogos].map((logo, index) => (
                        <img
                          key={`${logo.id}-${index}`}
                          src={logo.src}
                          alt={logo.alt}
                          className="h-6 flex-shrink-0 opacity-60 transition-opacity duration-300 hover:opacity-100"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="sm:block">
          <div className="relative mt-6 flex flex-col gap-3 pt-6">
            <div className="absolute left-1/2 top-0 h-px w-full -translate-x-1/2 bg-gray-200" />
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
              <span className="font-semibold text-gray-600">Others:</span>
              {bottomLinks.map((link, index) => (
                <span key={link.href} className="flex items-center">
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                  {index < bottomLinks.length - 1 && (
                    <span className="mx-3 text-gray-300">|</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden sm:block">
          <div className="mb-8 mt-8">
            <h3 className="mb-4 mt-4 text-base font-semibold text-gray-800">Location based jobs</h3>
            <div className="grid grid-cols-1 gap-x-5 gap-y-3 text-sm text-gray-600 sm:grid-cols-2 lg:grid-cols-4">
              <FooterLink href="/jobs">Jobs in Kolkata</FooterLink>
              <FooterLink href="/jobs">Jobs in Coimbatore</FooterLink>
              <FooterLink href="/jobs">Jobs in Lucknow</FooterLink>
              <FooterLink href="/jobs">Jobs in Indore</FooterLink>
              <FooterLink href="/jobs">Jobs in Ahmedabad</FooterLink>
              <FooterLink href="/jobs">Jobs in Nagpur</FooterLink>
              <FooterLink href="/jobs">Jobs in Chandigarh</FooterLink>
              <FooterLink href="/jobs">Jobs in Jaipur</FooterLink>
              <FooterLink href="/jobs">Jobs in Cochin</FooterLink>
              <FooterLink href="/jobs">Jobs in Surat</FooterLink>
              <FooterLink href="/jobs">Jobs in Bangalore</FooterLink>
              <FooterLink href="/jobs">Jobs in Delhi</FooterLink>
              <FooterLink href="/jobs">Jobs in Hyderabad</FooterLink>
              <FooterLink href="/jobs">Jobs in Mumbai</FooterLink>
              <FooterLink href="/jobs">Jobs in Pune</FooterLink>
              <FooterLink href="/jobs">Jobs in Chennai</FooterLink>
              <FooterLink href="/jobs">Jobs in Noida</FooterLink>
              <FooterLink href="/jobs">Jobs in Gurgaon</FooterLink>
            </div>
          </div>

          <div
            className={`overflow-hidden transition-[max-height] duration-500 ${
              isExpanded ? 'max-h-[2000px] mb-8' : 'max-h-0'
            }`}
          >
            <div className="flex flex-col gap-8 border-t border-white pt-5">
              <div>
                <h4 className="mb-3 text-sm font-semibold text-gray-800">Skill based jobs</h4>
                <div className="grid grid-cols-1 gap-x-5 gap-y-3 text-sm text-gray-600 sm:grid-cols-2 lg:grid-cols-4">
                  <FooterLink href="#">Data Entry Jobs</FooterLink>
                  <FooterLink href="#">Content Writing Jobs</FooterLink>
                  <FooterLink href="#">AI Engineering Jobs</FooterLink>
                  <FooterLink href="#">Digital Marketing Jobs</FooterLink>
                  <FooterLink href="#">Data Analyst Jobs</FooterLink>
                  <FooterLink href="#">Business Analyst Jobs</FooterLink>
                  <FooterLink href="#">Data Scientist Jobs</FooterLink>
                  <FooterLink href="#">Software Engineer Jobs</FooterLink>
                  <FooterLink href="#">Data Engineer Jobs</FooterLink>
                  <FooterLink href="#">Product Manager Jobs</FooterLink>
                  <FooterLink href="#">Financial Analyst Jobs</FooterLink>
                  <FooterLink href="#">Analyst Jobs</FooterLink>
                  <FooterLink href="#">Management Trainee Jobs</FooterLink>
                  <FooterLink href="#">Accounts Jobs</FooterLink>
                  <FooterLink href="#">HR Jobs</FooterLink>
                  <FooterLink href="#">Finance Jobs</FooterLink>
                  <FooterLink href="#">Marketing Jobs</FooterLink>
                  <FooterLink href="#">Customer Service Jobs</FooterLink>
                  <FooterLink href="#">Engineering Jobs</FooterLink>
                  <FooterLink href="#">Graduate Engineer Trainee Jobs</FooterLink>
                  <FooterLink href="#">Software Development Jobs</FooterLink>
                  <FooterLink href="#">Sales Jobs</FooterLink>
                  <FooterLink href="#">Operations Jobs</FooterLink>
                  <FooterLink href="#">Business Jobs</FooterLink>
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-sm font-semibold text-gray-800">Location based internships</h4>
                <div className="grid grid-cols-1 gap-x-5 gap-y-3 text-sm text-gray-600 sm:grid-cols-2 lg:grid-cols-4">
                  <FooterLink href="#">Internship in Kolkata</FooterLink>
                  <FooterLink href="#">Internship in Gurgaon</FooterLink>
                  <FooterLink href="#">Internship in Coimbatore</FooterLink>
                  <FooterLink href="#">Internship in Lucknow</FooterLink>
                  <FooterLink href="#">Internship in Indore</FooterLink>
                  <FooterLink href="#">Internship in Ahmedabad</FooterLink>
                  <FooterLink href="#">Internship in Nagpur</FooterLink>
                  <FooterLink href="#">Internship in Chandigarh</FooterLink>
                  <FooterLink href="#">Internship in Jaipur</FooterLink>
                  <FooterLink href="#">Internship in Cochin</FooterLink>
                  <FooterLink href="#">Internship in Surat</FooterLink>
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-sm font-semibold text-gray-800">Skill based internships</h4>
                <div className="grid grid-cols-1 gap-x-5 gap-y-3 text-sm text-gray-600 sm:grid-cols-2 lg:grid-cols-4">
                  <FooterLink href="#">Accounts Internship</FooterLink>
                  <FooterLink href="#">Engineering Internship</FooterLink>
                  <FooterLink href="#">Sales Internship</FooterLink>
                  <FooterLink href="#">Operations Internship</FooterLink>
                  <FooterLink href="#">Data Entry Internship</FooterLink>
                  <FooterLink href="#">Content Writing Internship</FooterLink>
                  <FooterLink href="#">AI Engineer Internship</FooterLink>
                  <FooterLink href="#">HR Internship</FooterLink>
                  <FooterLink href="#">Digital Marketing Internship</FooterLink>
                  <FooterLink href="#">Finance Internship</FooterLink>
                  <FooterLink href="#">Research Internship</FooterLink>
                  <FooterLink href="#">Content Writing Internship</FooterLink>
                  <FooterLink href="#">Software Development Internship</FooterLink>
                  <FooterLink href="#">Business Development Internship</FooterLink>
                  <FooterLink href="#">Marketing Internship</FooterLink>
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-sm font-semibold text-gray-800">Work from Home Jobs</h4>
                <div className="grid grid-cols-1 gap-x-5 gap-y-3 text-sm text-gray-600 sm:grid-cols-2 lg:grid-cols-4">
                  <FooterLink href="#">Work from Home Jobs in Bangalore</FooterLink>
                  <FooterLink href="#">Work from Home Jobs in Chennai</FooterLink>
                  <FooterLink href="#">Work from Home Jobs in Hyderabad</FooterLink>
                  <FooterLink href="#">Work from Home Jobs in Delhi</FooterLink>
                  <FooterLink href="#">Work from Home Jobs in Pune</FooterLink>
                  <FooterLink href="#">Work from Home Jobs in Kolkata</FooterLink>
                  <FooterLink href="#">Work from Home Jobs in Mumbai</FooterLink>
                  <FooterLink href="#">Work from Home Jobs in Coimbatore</FooterLink>
                  <FooterLink href="#">Work from Home Jobs in Ahmedabad</FooterLink>
                  <FooterLink href="#">Work from Home Jobs in Gurgaon</FooterLink>
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-sm font-semibold text-gray-800">Mentorships</h4>
                <div className="grid grid-cols-1 gap-x-5 gap-y-3 text-sm text-gray-600 sm:grid-cols-2 lg:grid-cols-4">
                  <FooterLink href="#">Mentors for CV Review</FooterLink>
                  <FooterLink href="#">Mentors for MBA Preparation</FooterLink>
                  <FooterLink href="#">Mentors for Case Competition</FooterLink>
                  <FooterLink href="#">Mentors for Placement Support</FooterLink>
                  <FooterLink href="#">Mentors for Career Guidance</FooterLink>
                  <FooterLink href="#">Mentors for Personal Branding</FooterLink>
                  <FooterLink href="#">Mentors for Study Abroad</FooterLink>
                  <FooterLink href="#">Mentors for Interview Preparation</FooterLink>
                  <FooterLink href="#">Mentors for Coding & Software</FooterLink>
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-sm font-semibold text-gray-800">Practice</h4>
                <div className="grid grid-cols-1 gap-x-5 gap-y-3 text-sm text-gray-600 sm:grid-cols-2 lg:grid-cols-4">
                  <FooterLink href="#">Skill Based Mock Assessments</FooterLink>
                  <FooterLink href="#">Company Preparation</FooterLink>
                  <FooterLink href="#">Machine Learning Projects</FooterLink>
                  <FooterLink href="#">AI-Powered Mock Tests</FooterLink>
                  <FooterLink href="#">AI-Powered Mock Interview</FooterLink>
                  <FooterLink href="#">100 Days Coding Sprint</FooterLink>
                  <FooterLink href="#">AI-Powered Skill Based Mock Tests</FooterLink>
                  <FooterLink href="#">Code Conquest</FooterLink>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-start pt-5">
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 transition hover:text-emerald-500"
            >
              {isExpanded ? 'View Less' : 'View More'}
              <span
                className={`inline-flex items-center justify-center text-sm font-bold transition-transform ${
                  isExpanded ? 'rotate-180' : 'rotate-0'
                }`}
              >
                ∨
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="hidden">
        <p>{contactInfo.description}</p>
        <ContactItem
          icon={
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_941_15626)">
                <path
                  d="M15.1875 19.4688C14.3438 19.4688 13.375 19.25 12.3125 18.8438C10.1875 18 7.84377 16.375 5.75002 14.2813C3.65627 12.1875 2.03127 9.84377 1.18752 7.68752C0.250019 5.37502 0.343769 3.46877 1.43752 2.40627C1.46877 2.37502 1.53127 2.34377 1.56252 2.31252L4.18752 0.750025C4.84377 0.375025 5.68752 0.562525 6.12502 1.18752L7.96877 3.93753C8.40627 4.59378 8.21877 5.46877 7.59377 5.90627L6.46877 6.68752C7.28127 8.00002 9.59377 11.2188 13.2813 13.5313L13.9688 12.5313C14.5 11.7813 15.3438 11.5625 16.0313 12.0313L18.7813 13.875C19.4063 14.3125 19.5938 15.1563 19.2188 15.8125L17.6563 18.4375C17.625 18.5 17.5938 18.5313 17.5625 18.5625C17 19.1563 16.1875 19.4688 15.1875 19.4688ZM2.37502 3.46878C1.78127 4.12503 1.81252 5.46877 2.50002 7.18752C3.28127 9.15627 4.78127 11.3125 6.75002 13.2813C8.68752 15.2188 10.875 16.7188 12.8125 17.5C14.5 18.1875 15.8438 18.2188 16.5313 17.625L18.0313 15.0625C18.0313 15.0313 18.0313 15.0313 18.0313 15L15.2813 13.1563C15.2813 13.1563 15.2188 13.1875 15.1563 13.2813L14.4688 14.2813C14.0313 14.9063 13.1875 15.0938 12.5625 14.6875C8.62502 12.25 6.18752 8.84377 5.31252 7.46877C4.90627 6.81252 5.06252 5.96878 5.68752 5.53128L6.81252 4.75002V4.71878L4.96877 1.96877C4.96877 1.93752 4.93752 1.93752 4.90627 1.96877L2.37502 3.46878Z"
                  fill="currentColor"
                />
                <path
                  d="M18.3125 8.90633C17.9375 8.90633 17.6563 8.62508 17.625 8.25008C17.375 5.09383 14.7813 2.56258 11.5938 2.34383C11.2188 2.31258 10.9063 2.00008 10.9375 1.59383C10.9688 1.21883 11.2813 0.906333 11.6875 0.937583C15.5625 1.18758 18.7188 4.25008 19.0313 8.12508C19.0625 8.50008 18.7813 8.84383 18.375 8.87508C18.375 8.90633 18.3438 8.90633 18.3125 8.90633Z"
                  fill="currentColor"
                />
                <path
                  d="M15.2187 9.18755C14.875 9.18755 14.5625 8.93755 14.5312 8.56255C14.3437 6.87505 13.0312 5.56255 11.3437 5.3438C10.9687 5.31255 10.6875 4.93755 10.7187 4.56255C10.75 4.18755 11.125 3.9063 11.5 3.93755C13.8437 4.2188 15.6562 6.0313 15.9375 8.37505C15.9687 8.75005 15.7187 9.0938 15.3125 9.1563C15.25 9.18755 15.2187 9.18755 15.2187 9.18755Z"
                  fill="currentColor"
                />
              </g>
              <defs>
                <clipPath id="clip0_941_15626">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
          }
          text={contactInfo.phone}
        />
      </div>
    </footer>
  )
}

type ContactItemProps = {
  icon: ReactNode
  text: string
}

const ContactItem = ({ icon, text }: ContactItemProps) => (
  <p className="flex items-center text-sm text-gray-700">
    <span className="mr-3 text-blue-600">{icon}</span>
    <span>{text}</span>
  </p>
)

type SocialLinkProps = {
  href: string
  name: string
  icon: ReactNode
}

const SocialLink = ({ href, name, icon }: SocialLinkProps) => (
  <a
    href={href}
    aria-label={name}
    className="flex h-8 w-8 items-center justify-center text-gray-500 transition-colors duration-200 hover:text-blue-600"
  >
    {icon}
  </a>
)

type FooterLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode
}

const FooterLink = ({ children, className = '', ...props }: FooterLinkProps) => (
  <a
    {...props}
    className={`text-sm text-gray-600 transition-colors duration-200 hover:text-blue-600 ${className}`}
  >
    {children}
  </a>
)
