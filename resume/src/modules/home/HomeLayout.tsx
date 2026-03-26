import { motion } from 'framer-motion';
import { BsGithub } from 'react-icons/bs';
import { Button } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
// import FeatureSection from './components/Feature';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
// import Person from './components/Person';
import { ChevronDown, Menu as MenuIcon, X } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { getCurrentPlan } from '@/lib/authApi';
import InitialsAvatar from '@/components/common/InitialsAvatar';
import { COMPANY_LOGO_URLS } from '@/config/companyLogos';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';
import { withBasePath } from '@/utils/withBasePath';
const templates = [
  { id: 'compact', src: withBasePath('/templates/berlin.png') },
  { id: 'elegant', src: withBasePath('/templates/amsterdam.png') },
  { id: 'modern', src: withBasePath('/templates/atlas.png') },
  { id: 'professional', src: withBasePath('/templates/minimal.png') },
];
const HomeLayout = () => {
  // const controls = useAnimation();

  // const hoverEnter = { scale: 1.04, y: -8 };
  // const hoverLeave = { scale: 1, y: 0 };

  const fadeUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: 'easeOut' as const },
  };
  const [open, setOpen] = useState<string | null>(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const firstName = useMemo(() => {
    if (!user?.first_name) return '';
    return user.first_name;
  }, [user]);

  const toggle = (key: string) => {
    setOpen(open === key ? null : key);
  };

  const openProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const closeProfileMenu = () => {
    setProfileAnchorEl(null);
  };

  const toggleMobileNav = () => {
    setMobileNavOpen((prev) => !prev);
  };

  const closeMobileNav = () => {
    setMobileNavOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeProfileMenu();
    window.location.reload();
  };

  const handleProfile = () => {
    closeProfileMenu();
    closeMobileNav();
    router.push('/profile');
  };

  const [isNavigating, setIsNavigating] = useState(false);

  const handlePaidNavigation = async () => {
    setIsNavigating(true);
    closeMobileNav();

    if (!token) {
      router.push('/plans?auth=register');
      return;
    }

    try {
      const response = await getCurrentPlan(token);
      if (response.hasAnyPlan) {
        router.push('/builder-paid');
        return;
      }
    } catch (_error) {
      // fallback to plans page
      setIsNavigating(false);
    }

    router.push('/plans?auth=register');
  };

  const handleFreeNavigation = () => {
    setIsNavigating(true);
    closeMobileNav();
    router.push('/builder-free');
  };

  const handleTrialNavigation = () => {
    setIsNavigating(true);
    closeMobileNav();
    router.push('/builder-trial');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="scroll-smooth bg-white"
    >
      <LoadingOverlay isVisible={isNavigating} />

      <LandingNavbar />

      {/* Hero Section - AmbitionBox Level Trust & Conversion */}

      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <motion.div {...fadeUp} className="space-y-8">
              <div className="inline-flex items-center bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold">
                <span className="mr-2">✨</span> Used by 10K+ professionals worldwide
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Build a{' '}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Job-Winning Resume
                </span>
                <br />
                in Minutes
              </h1>

              <p className="text-xl text-gray-600 max-w-2xl">
                Trusted by candidates at top companies. ATS-friendly templates. 10,000+ people got
                their dream job using Riseflake.
              </p>

              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-4 pt-4">
                <motion.div
                  className="relative group w-full sm:w-auto"
                  whileHover={{ scale: 1.05, rotate: 0.5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Outer Glow Pulse */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg blur-lg opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>

                  <Button
                    size="large"
                    variant="contained"
                    fullWidth
                    className="relative bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-white px-8 h-[48px] font-bold shadow-lg overflow-hidden group-hover:scale-[1.02] transition-all duration-300 rounded-xl"
                    onClick={handlePaidNavigation}
                  >
                    {/* Shimmer Sweep Animation */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 w-[200%]"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 3,
                        ease: 'linear',
                        repeatDelay: 1,
                      }}
                    />

                    <span className="relative flex items-center gap-2">
                      Buy now at ₹299
                      <span className="bg-white/20 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] uppercase font-black tracking-tighter border border-white/10">
                        25 % off
                      </span>
                    </span>
                  </Button>

                  {/* Floating Urgency Label */}
                  <motion.div
                    className="absolute -bottom-7 left-0 right-0 text-center pointer-events-none hidden sm:block"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  >
                    <span className="inline-flex items-center gap-1.5 text-[10px] text-indigo-700 font-extrabold uppercase tracking-widest bg-indigo-50/80 backdrop-blur-sm px-3 py-1 rounded-full border border-indigo-100 shadow-sm">
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                      </span>
                      Limited period offer
                    </span>
                  </motion.div>
                </motion.div>

                <div className="flex gap-3 w-full sm:w-auto">
                  <Button
                    size="large"
                    variant="outlined"
                    fullWidth
                    onClick={handleTrialNavigation}
                    className="px-8 h-[48px] border-2 border-indigo-100 text-[#4338ca] font-bold hover:bg-indigo-50 hover:border-indigo-200 transition-all rounded-xl"
                  >
                    Trial
                  </Button>

                  <Button
                    size="large"
                    variant="outlined"
                    fullWidth
                    onClick={handleFreeNavigation}
                    className="px-8 h-[48px] border-2 border-slate-100 text-slate-600 font-bold hover:bg-slate-50 hover:border-slate-200 transition-all rounded-xl"
                  >
                    Free
                  </Button>
                </div>


              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-8 pt-10 flex-wrap">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600">10K+</div>
                  <div className="text-gray-600">Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600">1K+</div>
                  <div className="text-gray-600">Resumes Built Daily</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600">4.9★</div>
                  <div className="text-gray-600">User Rating</div>
                </div>
              </div>
            </motion.div>

            {/* Right - Hero Image with floating effect */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
              className="relative"
            >
              <div className="relative z-10">
                <Image
                  src={withBasePath('/hero.jpg')}
                  alt="Professional Resume Preview"
                  width={650}
                  height={750}
                  className="rounded-2xl shadow-2xl border border-gray-100 my-8"
                  priority
                />
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-15 right- left-5 bg-yellow-400 text-yellow-900 px-5 py-2 my-10 rounded-xl shadow-lg font-bold animate-bounce">
                +300% More Interviews
              </div>
              <div className="absolute -bottom-13 left-48 right-1 bg-green-500 text-white px-6 py-2 rounded-xl shadow-lg font-bold">
                ATS Passed ✓
              </div>
            </motion.div>
          </div>
        </div>

        <br></br>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>
      {/* ===== Our Users Work At (3-Row Smooth Movement) ===== */}
      <section className="py-24 bg-slate-50/50 overflow-hidden relative">
        {/* Background decorative blobs */}
        <div className="absolute top-0 -left-20 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />

        <div className="w-full relative z-10">
          <div className="max-w-7xl mx-auto px-4 mb-16 text-center">
            <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Our Users Work At{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Top Companies
              </span>
            </h3>
            <p className="mt-4 text-gray-600 text-lg">
              Empowering careers at world-class organizations
            </p>
          </div>

          <div className="flex flex-col gap-6 md:gap-10">
            {/* Row 1 - Forward */}
            <div className="marquee-wrapper">
              <div className="animate-marquee duration-fast flex gap-8 md:gap-12 px-4">
                {[...COMPANY_LOGO_URLS.slice(0, 23), ...COMPANY_LOGO_URLS.slice(0, 23)].map(
                  (logo, i) => (
                    <div
                      key={`row1-${i}`}
                      className="flex-shrink-0 bg-white/40 backdrop-blur-md border border-white/40
                       rounded-2xl flex items-center justify-center py-4 px-10
                       shadow-[0_4px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] 
                       hover:-translate-y-1 transition-all duration-300 group"
                    >
                      <img
                        src={logo}
                        alt="company"
                        className="h-10 w-auto object-contain transition-all duration-500"
                        loading="lazy"
                      />
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Row 2 - Same Direction, Staggered */}
            <div className="marquee-wrapper">
              <div className="animate-marquee duration-slow flex gap-8 md:gap-12 px-4 ml-[65px]">
                {[...COMPANY_LOGO_URLS.slice(23, 46), ...COMPANY_LOGO_URLS.slice(23, 46)].map(
                  (logo, i) => (
                    <div
                      key={`row2-${i}`}
                      className="flex-shrink-0 bg-white/40 backdrop-blur-md border border-white/40
                       rounded-2xl flex items-center justify-center py-4 px-10
                       shadow-[0_4px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] 
                       hover:-translate-y-1 transition-all duration-300 group"
                    >
                      <img
                        src={logo}
                        alt="company"
                        className="h-10 w-auto object-contain transition-all duration-500"
                        loading="lazy"
                      />
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Row 3 - Same Direction */}
            <div className="marquee-wrapper">
              <div className="animate-marquee duration-normal flex gap-8 md:gap-12 px-4">
                {[...COMPANY_LOGO_URLS.slice(46, 70), ...COMPANY_LOGO_URLS.slice(46, 70)].map(
                  (logo, i) => (
                    <div
                      key={`row3-${i}`}
                      className="flex-shrink-0 bg-white/40 backdrop-blur-md border border-white/40
                       rounded-2xl flex items-center justify-center py-4 px-10
                       shadow-[0_4px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] 
                       hover:-translate-y-1 transition-all duration-300 group"
                    >
                      <img
                        src={logo}
                        alt="company"
                        className="h-10 w-auto object-contain transition-all duration-500"
                        loading="lazy"
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 1. Feature Highlights (Like AmbitionBox) ==================== */}
      <section className="py-20 bg-gradient-to-b from-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
              10K+ Indians Choose{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                riseflake.com/resume
              </span>
            </h2>
            <p className="mt-4 text-xl text-gray-600">Everything you need to get hired faster</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🚀',
                title: 'ATS-Optimized Resumes',
                desc: 'Beat 99% of applicant tracking systems used by Google, Amazon, Deloitte',
              },
              {
                icon: '✨',
                title: '1-Click Apply',
                desc: 'Apply to 1M+ jobs in seconds with pre-filled details',
              },
              {
                icon: '⭐',
                title: 'Expert Reviewed Templates',
                desc: 'Designed by recruiters from FAANG & top Indian startups',
              },
              {
                icon: '📈',
                title: '300% More Interview Calls',
                desc: 'Users report 3x higher response rate within 7 days',
              },
              {
                icon: '🆓',
                title: 'Freemium Resume Builder',
                desc: 'Start for free, upgrade for premium templates & features',
              },
              {
                icon: '🔒',
                title: '100% Private & Secure',
                desc: 'Your data is encrypted. We never sell or share it',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 2. Resume Templates Showcase ==================== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose From <span className="text-indigo-600">22+</span> Stunning Templates
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Freshers • Experienced • Designers • Managers • Tech • Non-Tech
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {templates.map((template, i) => (
              <motion.div
                key={template.id}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-xl shadow-xl">
                  <Image
                    src={template.src}
                    alt={`Template ${i + 1}`}
                    width={400}
                    height={550}
                    className="transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition" />
                  <div className="absolute bottom-4 left-4 text-white font-bold opacity-0 group-hover:opacity-100 transition">
                    Use This Template →
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <Link href="/builder-free">
            <Button
              size="large"
              variant="contained"
              className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 px-12 py-4 text-lg font-bold"
            >
              Explore All Templates →
            </Button>
          </Link>
        </div>
      </section>

      {/* ==================== 3. Success Stories / Testimonials ==================== */}
      <section className="py-20 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
            Dream Jobs Unlocked with Riseflake
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Priya Sharma',
                role: 'SDE-1',
                story: 'Got 7 offers including Google & Microsoft after using Riseflake template',
              },
              {
                name: 'Rahul Verma',
                role: 'Product Manager',
                story: 'Landed PM role with 28 LPA within 21 days of building resume',
              },
              {
                name: 'Anjali Mehta',
                role: 'UX Designer',
                story: 'Returned to work with 42% salary hike using designer template',
              },
            ].map((person, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-xl"
              >
                <div className="flex items-center mb-4">
                  <InitialsAvatar name={person.name} seed={person.name} size={64} className="mr-4 shadow-sm" />
                  <div>
                    <h4 className="font-bold text-gray-900">{person.name}</h4>
                    <p className="text-indigo-600 font-medium">{person.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{person.story}"</p>
                <div className="mt-4 flex text-yellow-500">★★★★★</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 4. How It Works (3-Step) ==================== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get Hired in Just <span className="text-indigo-600">3 Simple Steps</span>
          </h2>
          <p className="text-xl text-gray-600 mb-16">Takes less than 10 minutes</p>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: '1',
                title: 'Choose Template',
                desc: 'Pick from 22+ ATS-friendly designs',
                icon: '🎨',
              },
              {
                step: '2',
                title: 'Fill Your Details',
                desc: 'Auto-suggestions & smart content tips',
                icon: '✍️',
              },
              {
                step: '3',
                title: 'Download & Apply',
                desc: 'Get PDF in 1 click. Start applying instantly',
                icon: '🚀',
              },
            ].map((item, i) => (
              <div key={i}>
                <div className="text-8xl mb-6">{item.icon}</div>
                <div className="text-6xl font-bold text-indigo-600 mb-4">{item.step}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 5. Final CTA Section (Last Push Before Footer) ==================== */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready 2 Land Your Dream Job?
          </h2>
          <p className="text-xl text-indigo-100 mb-10">
            Join 10K+ professionals who built their career with Riseflake
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/builder-trial">
              <Button
                size="large"
                variant="outlined"
                className="border-white text-white hover:bg-white/10 px-12 py-5 text-sm font-bold"
              >
                Try Trial Builder
              </Button>
            </Link>
            <Button
              size="large"
              variant="outlined"
              className="border-white text-white hover:bg-white/10 px-12 py-5 text-sm font-bold"
              onClick={handlePaidNavigation}
            >
              Buy Resume
            </Button>
            <Link href="https://riseflake.com/jobs">
              <Button
                size="large"
                variant="outlined"
                className="border-white text-white hover:bg-white/10 px-12 py-5 text-sm font-bold"
              >
                Browse 50,000+ Jobs
              </Button>
            </Link>
          </div>
          <p className="text-indigo-200 mt-8 text-sm">
            ✓ Quick signup • ✓ Takes only 3 minutes • ✓ ATS+
          </p>
        </div>
      </section>
      <LandingFooter />
    </motion.div>
  );
};

export default HomeLayout;
