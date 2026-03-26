import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BsGithub } from 'react-icons/bs';
import { ChevronDown } from 'lucide-react';
import { withBasePath } from '@/utils/withBasePath';

const LandingFooter = () => {
  const [open, setOpen] = useState<string | null>(null);

  const toggle = (key: string) => {
    setOpen(open === key ? null : key);
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-5">
            <div className="flex items-center space-x-3">
              <Image
                src={withBasePath('/hero.jpg')}
                alt="Riseflake"
                width={42}
                height={42}
                className="rounded-lg"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Riseflake
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              India's most trusted resume builder & job platform. Used by{' '}
              <strong>10K+ professionals</strong> to land jobs at top companies.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/company/riseflake-com/" className="text-gray-500 hover:text-indigo-600 transition">
                LinkedIn
              </a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition">
                Twitter
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="flex flex-col md:flex-row md:justify-between gap-6">
              <div className="min-w-[220px]">
                <button
                  onClick={() => toggle('job')}
                  className="w-full flex justify-between items-center font-bold text-gray-900 md:cursor-default"
                >
                  For Job Seekers
                  <ChevronDown
                    size={18}
                    className={`md:hidden transition-transform ${open === 'job' ? 'rotate-180' : ''}`}
                  />
                </button>

                <ul
                  className={`mt-3 space-y-2 text-gray-600 md:block ${open === 'job' ? 'block' : 'hidden'
                    }`}
                >
                  <li>
                    <Link href="https://app.riseflake.com/jobs">Browse Jobs</Link>
                  </li>
                  <li>
                    <Link href="https://app.riseflake.com/companies">Top Companies</Link>
                  </li>
                  <li>
                    <Link href="https://app.riseflake.com/companies">Salary Insights</Link>
                  </li>
                  <li>
                    <Link href="https://app.riseflake.com/home">Interview Prep</Link>
                  </li>
                </ul>
              </div>

              <div className="min-w-[220px]">
                <button
                  onClick={() => toggle('emp')}
                  className="w-full flex justify-between items-center font-bold text-gray-900 md:cursor-default"
                >
                  For Employers
                  <ChevronDown
                    size={18}
                    className={`md:hidden transition-transform ${open === 'emp' ? 'rotate-180' : ''}`}
                  />
                </button>

                <ul
                  className={`mt-3 space-y-2 text-gray-600 md:block ${open === 'emp' ? 'block' : 'hidden'
                    }`}
                >
                  <li>
                    <Link href="https://app.riseflake.com/register-recruiter">Post a Job</Link>
                  </li>
                  <li>
                    <Link href="https://app.riseflake.com/network">Search Resumes</Link>
                  </li>
                  <li>
                    <Link href="/plans">Pricing Plans</Link>
                  </li>
                  <li>
                    <Link href="https://app.riseflake.com/home">Employer Branding</Link>
                  </li>
                </ul>
              </div>

              <div className="min-w-[220px]">
                <button
                  onClick={() => toggle('company')}
                  className="w-full flex justify-between items-center font-bold text-gray-900 md:cursor-default"
                >
                  Company
                  <ChevronDown
                    size={18}
                    className={`md:hidden transition-transform ${open === 'company' ? 'rotate-180' : ''}`}
                  />
                </button>

                <ul
                  className={`mt-3 space-y-2 text-gray-600 md:block ${open === 'company' ? 'block' : 'hidden'
                    }`}
                >

                  <li>
                    <Link href="/blog">Blog</Link>
                  </li>
                  <li>
                    <Link href="/privacy-policy">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link href="/terms-of-service">Terms of Service</Link>
                  </li>
                  <li>
                    <Link href="/contact-us">Contact Us</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; 2026 Bold India Platforms Pvt. Ltd. All rights reserved. Made in India 🇮🇳</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="flex items-center">
              <span className="text-green-600 mr-1">✓</span> ATS Friendly
            </span>
            <span className="flex items-center">
              <span className="text-indigo-600 mr-1">✓</span> Freemium Resume Builder
            </span>
            <span className="flex items-center">
              <span className="text-purple-600 mr-1">✓</span> Trusted by 10K+ Users
            </span>
          </div>
        </div>

        {/* Big brand name at the very end */}
        <div className="w-full flex justify-center mt-12">
          <span className="text-[2.5rem] md:text-[4rem] font-extrabold tracking-tight text-gray-200 select-none" style={{letterSpacing: '0.05em', lineHeight: 1}}>
            Riseflake
          </span>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
