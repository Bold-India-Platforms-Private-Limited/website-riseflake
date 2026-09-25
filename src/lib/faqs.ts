/**
 * RiseFlake FAQ content — the single source for /faq and /faq/[topic].
 *
 * Each topic page renders its questions as visible HTML *and* as FAQPage JSON-LD built from
 * the same list, so the two can never disagree. A question lives in exactly one topic (Google
 * wants each FAQ marked up once per site); the /faq hub only links to them.
 *
 * Keep answers short, factual and self-contained (they are quoted by search engines and AI
 * assistants out of context), and keep them consistent with the Privacy / Cookie Policy.
 */

export type FaqItem = { q: string; a: string }
export type FaqLink = { label: string; href: string }

export type FaqTopic = {
  slug: string
  /** Short label for cards and chips */
  label: string
  /** Visible H1 */
  h1: string
  /** <title> (the root layout appends the site name) */
  metaTitle: string
  metaDescription: string
  /** One or two sentences under the H1 — answer-first summary of the topic */
  intro: string
  faqs: FaqItem[]
  links: FaqLink[]
}

export const FAQ_LAST_UPDATED = '2026-09-25'
export const FAQ_LAST_UPDATED_LABEL = 'September 25, 2026'

export const FAQ_TOPICS: FaqTopic[] = [
  {
    slug: 'about-riseflake',
    label: 'About RiseFlake',
    h1: 'About RiseFlake — Frequently Asked Questions',
    metaTitle: 'What is RiseFlake? Job Portal & Networking FAQs',
    metaDescription:
      'What is RiseFlake, who is it for and is it free? Quick answers about India’s job portal with verified jobs, professional networking, employer branding and a College Operating System.',
    intro:
      'RiseFlake is an Indian job portal and professional networking platform with thousands of verified jobs and internships, tools for employer branding, and a College Operating System for placement cells.',
    faqs: [
      {
        q: 'What is RiseFlake?',
        a: 'RiseFlake is an Indian job portal and professional networking platform. It brings together thousands of verified jobs and internships, public company pages, professional networking, hackathons and assessments, employer branding for companies, and a College Operating System for training and placement cells — in one place.',
      },
      {
        q: 'Who can use RiseFlake?',
        a: 'RiseFlake is built for four groups: job seekers (students, freshers and experienced professionals), recruiters, companies and colleges. Everyone must be 18 or older to create an account.',
      },
      {
        q: 'Is RiseFlake free to use?',
        a: 'Yes. Creating a profile, searching jobs and internships, applying and networking are free for job seekers. Companies can post jobs for free. Optional premium plans are available for users who want higher daily limits and extra features.',
      },
      {
        q: 'Who operates RiseFlake?',
        a: 'RiseFlake is operated by Bold India Platforms Private Limited (CIN U85499PN2025PTC246360), a company registered in Pune, Maharashtra, India.',
      },
      {
        q: 'How is RiseFlake different from other job portals?',
        a: 'RiseFlake combines a job portal, a professional network and campus placement tools. Candidates can find verified jobs, connect with professionals and mentors, and take part in hackathons; companies can build their employer brand; and colleges can manage placements through the same platform.',
      },
      {
        q: 'Is there a RiseFlake mobile app?',
        a: 'Yes. RiseFlake is available on Google Play for Android and on the Apple App Store for iPhone, and on the web at app.riseflake.com.',
      },
      {
        q: 'Which cities does RiseFlake cover?',
        a: 'RiseFlake lists jobs and internships across India, including Bangalore, Mumbai, Delhi NCR, Hyderabad, Pune, Chennai, Kolkata and Ahmedabad, as well as remote and work-from-home roles.',
      },
      {
        q: 'How do I contact RiseFlake support?',
        a: 'Email support@riseflake.com or call / WhatsApp +91 92252 20170. For privacy questions write to privacy@riseflake.com, and for complaints write to our Grievance Officer at grievance@riseflake.com.',
      },
    ],
    links: [
      { label: 'About us', href: '/about' },
      { label: 'Support & help', href: '/support' },
      { label: 'Contact us', href: '/contact' },
    ],
  },
  {
    slug: 'job-seekers',
    label: 'Job Seekers',
    h1: 'Jobs on RiseFlake — FAQs for Job Seekers',
    metaTitle: 'How to Find & Apply for Verified Jobs — FAQs',
    metaDescription:
      'How to search and apply for verified jobs on RiseFlake, build your profile and resume, track applications and stay safe from fake job offers. Answers for job seekers in India.',
    intro:
      'Job seekers can search thousands of verified jobs on RiseFlake by role, city, skill, salary and work mode, apply with one profile, and track every application in one place — free of charge.',
    faqs: [
      {
        q: 'How do I find jobs on RiseFlake?',
        a: 'Open the Jobs page and filter by role, city, skill, experience, salary and work mode (on-site, hybrid or remote). You can also browse ready-made pages such as jobs by city, by company or by skill.',
      },
      {
        q: 'Are the jobs on RiseFlake verified?',
        a: 'Yes. Job listings are checked for authenticity before and after they go live, and any listing can be reported. If a post looks suspicious, report it and our team will review and remove it if needed.',
      },
      {
        q: 'How do I apply for a job on RiseFlake?',
        a: 'Create a free account, complete your profile and upload your resume, then click Apply on any job. The recruiter receives your profile and resume, and you can follow the status of your application from your dashboard.',
      },
      {
        q: 'Do I need to pay to get a job through RiseFlake?',
        a: 'No. RiseFlake never asks candidates to pay for a job, interview or offer letter. If anyone asks you for money in RiseFlake’s name, do not pay — report it to support@riseflake.com.',
      },
      {
        q: 'Can I build a resume on RiseFlake?',
        a: 'Yes. You can upload an existing resume or create one with the RiseFlake resume builder, then use it to apply for jobs and internships.',
      },
      {
        q: 'How can I track my job applications?',
        a: 'Every job you apply to appears in your applications list with its current status, interview schedule and updates from the recruiter.',
      },
      {
        q: 'Can I find remote or work-from-home jobs?',
        a: 'Yes. Use the work-mode filter to show remote or hybrid roles only, or browse the work-from-home pages for jobs and internships.',
      },
      {
        q: 'Can recruiters find me without me applying?',
        a: 'Yes, if you allow it. When Profile Visibility is on, recruiters can discover your profile. Your email and phone number are shown only if you switch on Email or Phone Number Visibility in Settings.',
      },
    ],
    links: [
      { label: 'Browse all jobs', href: '/jobs' },
      { label: 'Jobs by role, city & company', href: '/jobs/browse' },
      { label: 'Jobs by skill', href: '/skills' },
      { label: 'Companies hiring', href: '/companies' },
    ],
  },
  {
    slug: 'internships-and-freshers',
    label: 'Internships & Freshers',
    h1: 'Internships & Fresher Jobs — FAQs for Students',
    metaTitle: 'Internships & Fresher Jobs for Students — FAQs',
    metaDescription:
      'How students and freshers can find verified internships, work-from-home internships, fresher jobs and hackathons on RiseFlake. Eligibility, stipends and certificates explained.',
    intro:
      'Students and fresh graduates can use RiseFlake to find verified internships and entry-level jobs, join hackathons, and build a profile that recruiters can discover.',
    faqs: [
      {
        q: 'Can students and freshers use RiseFlake?',
        a: 'Yes. RiseFlake has internships and entry-level jobs for students and fresh graduates, along with hackathons and assessments to show your skills. You must be 18 or older to register.',
      },
      {
        q: 'How do I find internships on RiseFlake?',
        a: 'Open the Internships page and filter by role, city, duration, stipend and work mode. You can also browse internships by city, company or skill.',
      },
      {
        q: 'Are there work-from-home internships?',
        a: 'Yes. RiseFlake has a dedicated page for work-from-home and remote internships, and you can apply the remote filter on any internship search.',
      },
      {
        q: 'Are internships on RiseFlake paid?',
        a: 'Many are. Each internship shows its stipend (or states that it is unpaid) so you can filter by stipend range before applying.',
      },
      {
        q: 'What are hackathons on RiseFlake?',
        a: 'Hackathons are online and on-campus challenges hosted by companies and colleges. You can register alone or as a team, submit your project, and get noticed by the organisers — often with prizes, certificates or interview opportunities.',
      },
      {
        q: 'How can a fresher with no experience stand out?',
        a: 'Complete every section of your profile, add projects, certificates and skills, take part in hackathons and assessments, and connect with professionals and mentors in your field. A complete profile is easier for recruiters to find.',
      },
      {
        q: 'What is the RiseFlake Campus Ambassador programme?',
        a: 'Campus Ambassadors represent RiseFlake at their college, help classmates discover verified jobs and internships, and gain leadership and marketing experience along the way.',
      },
    ],
    links: [
      { label: 'Browse internships', href: '/internships' },
      { label: 'Work-from-home internships', href: '/internships/work-from-home' },
      { label: 'Internships by role & city', href: '/internships/browse' },
      { label: 'Hackathons', href: '/hackathons' },
      { label: 'Campus Ambassador', href: '/campus-ambassador' },
    ],
  },
  {
    slug: 'professional-networking',
    label: 'Professional Networking',
    h1: 'Professional Networking on RiseFlake — FAQs',
    metaTitle: 'Professional Networking, Mentors & Chat — FAQs',
    metaDescription:
      'How professional networking works on RiseFlake: connections, messaging, mentors, Find Nearby and public profiles. Learn how to grow your network and control your visibility.',
    intro:
      'RiseFlake lets you build a professional network in India: connect with people in your field, message them, find mentors, and choose exactly how visible your profile is.',
    faqs: [
      {
        q: 'What is professional networking on RiseFlake?',
        a: 'It is a way to connect with students, professionals, recruiters and mentors on RiseFlake. You can send connection requests, chat with your connections and grow a network that helps you find opportunities.',
      },
      {
        q: 'How do I connect with other professionals?',
        a: 'Open My Network, browse suggested people or search by name, role or company, and send a connection request. Once it is accepted you can message each other.',
      },
      {
        q: 'Can I find a mentor on RiseFlake?',
        a: 'Yes. RiseFlake has a mentors section where you can discover experienced professionals and connect with them for career guidance.',
      },
      {
        q: 'What is Find Nearby?',
        a: 'Find Nearby is an optional feature that shows professionals near you. It works only if you allow location access and turn it on, and others see only an approximate position. You can switch it off at any time.',
      },
      {
        q: 'Is my RiseFlake profile public?',
        a: 'Only if you want it to be. With Profile Visibility on, parts of your profile (such as name, headline, education, experience and skills) can appear on a public page. Turn it off in Settings → Profile Visibility to hide it.',
      },
      {
        q: 'How long are chat messages kept?',
        a: 'Chat messages and images are deleted automatically after 30 days.',
      },
      {
        q: 'How do I report spam or harassment?',
        a: 'If someone sends spam, harassment or a fake offer, email support@riseflake.com with their profile link and a screenshot. Our team reviews every report and can suspend accounts that break our rules.',
      },
    ],
    links: [
      { label: 'Professional network', href: '/network' },
      { label: 'Trust & Safety', href: '/trust-and-safety' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
    ],
  },
  {
    slug: 'employers-and-recruiters',
    label: 'Employers & Recruiters',
    h1: 'Hiring on RiseFlake — FAQs for Employers & Recruiters',
    metaTitle: 'Post Jobs Free & Employer Branding — Recruiter FAQs',
    metaDescription:
      'How companies and recruiters post jobs for free, run assessments and hackathons, manage applicants and build their employer brand on RiseFlake.',
    intro:
      'Companies and recruiters can post jobs and internships on RiseFlake for free, screen candidates with assessments, host hackathons, and build their employer brand with a public company page.',
    faqs: [
      {
        q: 'How do I post a job on RiseFlake?',
        a: 'Register as a recruiter or company, complete your company profile, and create a job or internship from your dashboard. Once published, it appears in RiseFlake search and on your company page.',
      },
      {
        q: 'Is posting jobs on RiseFlake free?',
        a: 'Yes. Companies can post jobs and internships on RiseFlake for free, with no commission on hires. Optional paid plans add higher limits and extra hiring tools.',
      },
      {
        q: 'What is employer branding on RiseFlake?',
        a: 'Employer branding helps your company attract talent. You get a public company page with your open roles, and you can host hackathons, case competitions and challenges to engage students and professionals.',
      },
      {
        q: 'How do I manage applicants?',
        a: 'Every applicant appears in your hiring pipeline, where you can review profiles and resumes, move candidates between stages, add notes, and schedule interviews.',
      },
      {
        q: 'Can I run online assessments for candidates?',
        a: 'Yes. You can create assessments for any role and invite candidates. Optional integrity checks such as tab-switch and full-screen monitoring can be turned on, and results are shared with you — the hiring decision stays yours.',
      },
      {
        q: 'Can I search for candidates on RiseFlake?',
        a: 'Yes. Recruiters can discover candidates who have made their profiles visible, filter by skills, education, experience and location, and reach out through the platform.',
      },
      {
        q: 'How do I remove or close a job post?',
        a: 'Close or delete the job from your dashboard. If a job about your company was posted without your permission, send a removal request and our team will take it down.',
      },
      {
        q: 'What are a recruiter’s responsibilities for candidate data?',
        a: 'Candidate data received through RiseFlake may be used only for that recruitment, must be kept secure, and must be deleted on request, in line with India’s DPDP Act and our Terms of Service.',
      },
    ],
    links: [
      { label: 'Company pages', href: '/companies' },
      { label: 'Hackathons', href: '/hackathons' },
      { label: 'Terms of Service', href: '/terms-of-service' },
      { label: 'Contact sales', href: '/contact' },
    ],
  },
  {
    slug: 'colleges-and-placement-cells',
    label: 'Colleges & Placement Cells',
    h1: 'College Operating System — FAQs for Colleges & TPOs',
    metaTitle: 'College Operating System for Placement Cells — FAQs',
    metaDescription:
      'What is the RiseFlake College Operating System? How training and placement officers manage students, placement eligibility, campus drives and company connections in one place.',
    intro:
      'The RiseFlake College Operating System gives training and placement cells one place to manage students, share verified opportunities, track placements and connect with hiring companies.',
    faqs: [
      {
        q: 'What is the RiseFlake College Operating System?',
        a: 'It is a platform for colleges and their training and placement officers (TPOs). It brings the college profile, student records, placement eligibility, job and internship opportunities, and company connections together in one system.',
      },
      {
        q: 'How does a college join RiseFlake?',
        a: 'Register through the college login at app.riseflake.com, complete your college profile, and our team will verify it. Once verified, your placement cell can start adding students.',
      },
      {
        q: 'How do we add students?',
        a: 'Use Student Management to import your student list, then verify and manage the roster. Students are linked to your college and can use RiseFlake to apply for opportunities.',
      },
      {
        q: 'What can a training and placement officer (TPO) do?',
        a: 'A TPO can manage the student roster, set placement eligibility, share job and internship opportunities with students, and follow placement activity — all from the college dashboard.',
      },
      {
        q: 'Can companies run campus hiring and hackathons with our college?',
        a: 'Yes. Companies on RiseFlake can reach students through their college, host hackathons and challenges, and run assessments, which helps colleges bring more hiring partners to campus.',
      },
      {
        q: 'What student data can the college see?',
        a: 'Authorised college staff can see the profile, academic details and placement-related activity of students linked to their college. Student data is used only for placement work, as explained in our Privacy Policy.',
      },
    ],
    links: [
      { label: 'Campus Ambassador programme', href: '/campus-ambassador' },
      { label: 'Hackathons', href: '/hackathons' },
      { label: 'Contact us', href: '/contact' },
    ],
  },
  {
    slug: 'account-safety-and-privacy',
    label: 'Account, Safety & Privacy',
    h1: 'Account, Safety & Privacy — FAQs',
    metaTitle: 'Account, Fake Job Safety & Privacy — FAQs',
    metaDescription:
      'How RiseFlake protects your data, how to spot and report fake jobs, and how to hibernate or delete your account. Your privacy rights under India’s DPDP Act explained.',
    intro:
      'RiseFlake does not sell your personal data, never charges candidates for jobs, and lets you access, correct, hibernate or delete your data at any time.',
    faqs: [
      {
        q: 'Does RiseFlake sell my personal data?',
        a: 'No. RiseFlake does not sell personal data and does not use your profile to target advertising. Recruiters see only what you apply with or choose to make visible.',
      },
      {
        q: 'How do I spot a fake job offer?',
        a: 'Be careful if anyone asks for money, bank details or OTPs, offers a job without an interview, or contacts you from a personal email or number. RiseFlake never charges candidates. Report anything suspicious to support@riseflake.com.',
      },
      {
        q: 'How do I report a fake or suspicious job?',
        a: 'Use the Report option on the job listing or email support@riseflake.com with the job link. Our team reviews every report and removes listings that break our rules.',
      },
      {
        q: 'How do I delete my RiseFlake account?',
        a: 'Go to Settings → Delete Account, use the delete-account form on our website, or email privacy@riseflake.com. Your profile is hidden right away, and your personal data is erased from live systems within 30 days.',
      },
      {
        q: 'Can I take a break without deleting my account?',
        a: 'Yes. Hibernate your account from Settings. It stays saved but hidden from other users and recruiters, and you receive no messages until you reactivate it.',
      },
      {
        q: 'Where is my data stored?',
        a: 'RiseFlake’s servers, databases and backups run on Amazon Web Services in Mumbai, India, and your data is protected with encryption in transit and role-based access controls.',
      },
      {
        q: 'What are my privacy rights?',
        a: 'Under India’s DPDP Act you can access, correct and erase your data, withdraw consent, nominate someone to act for you, and raise a grievance. Write to privacy@riseflake.com; we reply within 30 days.',
      },
      {
        q: 'Does RiseFlake use cookies?',
        a: 'Yes. Essential cookies keep you signed in and secure. Analytics and advertising cookies are optional and load only after you accept them.',
      },
    ],
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Cookie Policy', href: '/cookie-policy' },
      { label: 'Trust & Safety', href: '/trust-and-safety' },
      { label: 'Delete account', href: '/delete-account' },
    ],
  },
]

export function getFaqTopic(slug: string): FaqTopic | undefined {
  return FAQ_TOPICS.find((t) => t.slug === slug)
}

/** Stable in-page anchor for a question, e.g. "is-riseflake-free-to-use". */
export function faqAnchor(question: string): string {
  return question
    .toLowerCase()
    .replace(/’/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
