import type { NextPage } from 'next';
import Head from 'next/head';
import Script from 'next/script';
import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';
import { CheckCircle, XCircle, AlertCircle, Upload, FileText, ChevronDown, ChevronUp, Sparkles, Shield, Zap, Search, Layers, Check, ArrowRight, Star, Download } from 'lucide-react';
import Link from 'next/link';

// ─────────────────────────────── TYPES ───────────────────────────────
interface CheckResult {
    id: string;
    label: string;
    passed: boolean;
    tip: string;
    points: number;
    earned: number;
}

interface Category {
    name: string;
    icon: string;
    checks: CheckResult[];
}

// ─────────────────────────────── ATS ENGINE ───────────────────────────────
function runATSChecks(text: string, fileName: string, fileSize: number, pageCount: number): Category[] {
    const lower = text.toLowerCase();

    // Helper matchers
    const hasKeyword = (...words: string[]) => words.some((w) => lower.includes(w.toLowerCase()));
    const hasRegex = (re: RegExp) => re.test(text);
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const lines = text.split('\n');

    const actionVerbs = [
        'led', 'built', 'managed', 'developed', 'designed', 'implemented', 'created',
        'achieved', 'improved', 'increased', 'reduced', 'launched', 'delivered',
        'coordinated', 'collaborated', 'analyzed', 'resolved', 'streamlined', 'automated',
        'optimized', 'mentored', 'trained', 'spearheaded', 'drove', 'established',
        'engineered', 'architected', 'deployed', 'integrated', 'refactored', 'migrated',
        'scaled', 'negotiated', 'presented', 'published', 'researched', 'audited',
    ];

    const softSkills = [
        'communication', 'leadership', 'teamwork', 'problem solving', 'problem-solving',
        'critical thinking', 'adaptability', 'time management', 'collaboration',
        'creativity', 'analytical', 'attention to detail', 'multitasking',
        'interpersonal', 'decision making', 'decision-making',
    ];

    const techKeywords = [
        // Languages
        'python', 'javascript', 'typescript', 'java', 'c++', 'c#', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin',
        // Frameworks
        'react', 'angular', 'vue', 'node.js', 'nodejs', 'django', 'flask', 'spring', 'laravel', 'express',
        // Databases
        'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'oracle', 'dynamodb',
        // Cloud / DevOps
        'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'ci/cd', 'jenkins', 'terraform', 'ansible',
        // Other tools
        'git', 'linux', 'rest api', 'graphql', 'microservices', 'agile', 'scrum',
    ];

    const commonCerts = [
        'aws certified', 'google certified', 'azure certified', 'pmp', 'cpa', 'cfa',
        'cissp', 'comptia', 'cisco', 'ccna', 'ccnp', 'salesforce', 'scrum master',
        'six sigma', 'itil', 'gcp certified', 'kubernetes certified', 'oracle certified',
    ];

    // ── Contact & Identity ──
    const contactChecks: CheckResult[] = [
        {
            id: 'name',
            label: 'Full name present',
            passed: (() => {
                const firstLines = lines.slice(0, 8).join(' ');
                return /[A-Z][a-z]+\s+[A-Z][a-z]+/.test(firstLines);
            })(),
            tip: 'Add your full name prominently at the top of the resume.',
            points: 5, earned: 0,
        },
        {
            id: 'email',
            label: 'Email address present',
            passed: hasRegex(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/),
            tip: 'Include a professional email address (e.g. yourname@gmail.com).',
            points: 5, earned: 0,
        },
        {
            id: 'pro_email',
            label: 'Professional email domain used',
            passed: !hasRegex(/(hotmail\.|yahoo\.|rediffmail\.|ymail\.)/i),
            tip: 'Use a Gmail or professional domain email instead of Hotmail/Yahoo for a modern impression.',
            points: 2, earned: 0,
        },
        {
            id: 'phone',
            label: 'Phone number present',
            passed: hasRegex(/(\+?\d{1,3}[\s\-]?)?(\(?\d{3}\)?[\s\-]?)?[\d\s\-]{7,15}/) || hasKeyword('phone', 'mob', 'mobile', 'ph:', 'cell', 'contact no', 'tel'),
            tip: 'Add your 10-digit mobile number (with country code if international).',
            points: 5, earned: 0,
        },
        {
            id: 'linkedin',
            label: 'LinkedIn profile URL present',
            passed: hasKeyword('linkedin.com/in/', 'linkedin.com/pub/', 'linkedin:', 'linkedin.com'),
            tip: 'Add your LinkedIn profile URL (e.g. linkedin.com/in/yourname).',
            points: 5, earned: 0,
        },
        {
            id: 'github_contact',
            label: 'GitHub / Portfolio URL present',
            passed: hasKeyword('github.com/', 'portfolio', 'behance.net/', 'dribbble.com/'),
            tip: 'Add a GitHub or portfolio link to showcase your work.',
            points: 3, earned: 0,
        },
        {
            id: 'location',
            label: 'Location / city mentioned',
            passed: hasRegex(/\b(bangalore|bengaluru|mumbai|delhi|hyderabad|pune|chennai|kolkata|ahmedabad|jaipur|noida|gurgaon|gurugram|india|new york|london|remote|san francisco|berlin|singapore|dubai|toronto|sydney)\b/i) || hasKeyword('location:', 'address:', 'city:', 'state:'),
            tip: 'Include your current city or state, or indicate "Remote".',
            points: 3, earned: 0,
        },
    ];

    // ── Format & Compatibility ──
    const formatChecks: CheckResult[] = [
        {
            id: 'filetype',
            label: 'Correct file format (PDF or DOCX)',
            passed: /\.(pdf|docx)$/i.test(fileName),
            tip: 'Always submit resumes in PDF or DOCX format for ATS compatibility.',
            points: 10, earned: 0,
        },
        {
            id: 'selectable',
            label: 'Text is selectable (not a scanned image)',
            passed: text.length > 100,
            tip: 'Ensure your resume is not a scanned image. Use a real text-based PDF.',
            points: 15, earned: 0,
        },
        {
            id: 'filesize',
            label: 'File size under 2 MB',
            passed: fileSize < 2 * 1024 * 1024,
            tip: 'Keep your resume under 2 MB. Compress images or simplify formatting.',
            points: 5, earned: 0,
        },
        {
            id: 'pagecount',
            label: 'Appropriate length (1–3 pages)',
            passed: pageCount >= 1 && pageCount <= 3,
            tip: 'Keep your resume between 1 and 3 pages for best ATS readability.',
            points: 5, earned: 0,
        },
        {
            id: 'notables',
            label: 'No excessive special formatting detected',
            passed: (() => {
                const shortLines = lines.filter((l) => l.trim().length > 0 && l.trim().length < 10);
                return shortLines.length < 30;
            })(),
            tip: 'Avoid tables, multi-column layouts, and text boxes – ATS parsers struggle with them.',
            points: 5, earned: 0,
        },
        {
            id: 'consistent_dates',
            label: 'Consistent date format used',
            passed: (() => {
                const monthAbbr = (text.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/gi) || []).length;
                const monthFull = (text.match(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/gi) || []).length;
                // Good if using only one style consistently, or years only
                return !(monthAbbr > 0 && monthFull > 0);
            })(),
            tip: 'Use a consistent date format throughout — either "May 2022" or "05/2022", not both.',
            points: 3, earned: 0,
        },
    ];

    // ── Content Quality ──
    const contentChecks: CheckResult[] = [
        {
            id: 'wordcount',
            label: 'Sufficient word count (200+ words)',
            passed: wordCount >= 200,
            tip: `Your resume has ~${wordCount} words. Aim for at least 200 to provide enough detail.`,
            points: 5, earned: 0,
        },
        {
            id: 'experience',
            label: '"Experience" section present',
            passed: hasKeyword('experience', 'work experience', 'professional experience', 'employment history'),
            tip: 'Add an "Experience" section listing your past roles.',
            points: 5, earned: 0,
        },
        {
            id: 'education',
            label: '"Education" section present',
            passed: hasKeyword('education', 'academic', 'qualification', 'university', 'college', 'degree', 'b.tech', 'b.e.', 'mba', 'bca', 'mca', 'm.tech'),
            tip: 'Add an "Education" section with your degree details.',
            points: 5, earned: 0,
        },
        {
            id: 'skills',
            label: '"Skills" section present',
            passed: hasKeyword('skills', 'technical skills', 'core competencies', 'proficiencies', 'technologies', 'tools', 'languages', 'expertise', 'specialties'),
            tip: 'Add a "Skills" section with relevant technical and soft skills.',
            points: 5, earned: 0,
        },
        {
            id: 'projects',
            label: '"Projects" or "Achievements" section present',
            passed: hasKeyword('project', 'achievement', 'accomplishment', 'portfolio', 'publication', 'key initiative', 'opensource', 'open source'),
            tip: 'Add a "Projects" or "Achievements" section to showcase your work.',
            points: 4, earned: 0,
        },
        {
            id: 'summary',
            label: 'Professional summary/objective included',
            passed: hasKeyword('summary', 'objective', 'profile', 'about me', 'career objective', 'professional summary', 'executive summary', 'overview'),
            tip: 'Add a concise professional summary at the top to grab attention.',
            points: 4, earned: 0,
        },
        {
            id: 'dates',
            label: 'Employment dates/years present',
            passed: hasRegex(/(20\d{2}|19\d{2})\s*[-–—to\s]+\s*(20\d{2}|present|current|till date|now|today)/i) || hasRegex(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*(20\d{2})\b/i),
            tip: 'Include start and end dates (or "Present") for each position.',
            points: 5, earned: 0,
        },
        {
            id: 'jobtitles',
            label: 'Job titles are clearly stated',
            passed: hasRegex(/(engineer|developer|manager|analyst|designer|lead|specialist|consultant|intern|associate|executive|director|coordinator|architect)/i),
            tip: 'State your job title clearly at each position (e.g. "Software Engineer", "Product Manager").',
            points: 4, earned: 0,
        },
        {
            id: 'company_names',
            label: 'Company names are mentioned',
            passed: (() => {
                // Heuristic: Look for patterns like "at XYZ" or lines with company suffixes
                return hasRegex(/(pvt\.?\s*ltd|llc|inc\.|corp\.|technologies|solutions|systems|services|consulting|group|limited|private limited|co\.|corporation|agency|studio)/i) || hasRegex(/\b(at|for)\s+[A-Z][a-zA-Z0-9&\-\s]+(?:\n|\r|$)/);
            })(),
            tip: 'Always mention the company name where you worked for each experience entry.',
            points: 3, earned: 0,
        },
    ];

    // ── ATS Red Flags ──
    const redFlagChecks: CheckResult[] = [
        {
            id: 'nofancy_bullets',
            label: 'No fancy/non-ASCII bullet symbols',
            passed: !hasRegex(/[♦✔●►★▶◆■]/),
            tip: 'Replace special bullet symbols with standard dashes (-) or plain text bullets.',
            points: 5, earned: 0,
        },
        {
            id: 'noreferences',
            label: 'No "References available on request"',
            passed: !hasKeyword('references available on request', 'reference available upon request'),
            tip: 'Remove "References available on request" – it wastes space and ATS systems flag it.',
            points: 3, earned: 0,
        },
        {
            id: 'nogeneric',
            label: 'No overly generic objective statement',
            passed: !hasKeyword('seeking a challenging position', 'looking for a job', 'to work in a reputed company', 'to secure a position'),
            tip: 'Replace generic objective text with a specific, value-driven professional summary.',
            points: 3, earned: 0,
        },
        {
            id: 'nofirstperson',
            label: 'No excessive first-person pronouns',
            passed: (() => {
                const iCount = (text.match(/\bI\b|\bme\b|\bmy\b|\bI've\b|\bI'm\b/g) || []).length;
                return iCount < 10;
            })(),
            tip: 'Avoid starting bullet points with "I" – use action verbs instead (e.g. "Led a team of 5").',
            points: 3, earned: 0,
        },
        {
            id: 'no_photos',
            label: 'No mention of photo/headshot',
            passed: !hasKeyword('photograph', 'headshot', 'passport size photo', 'photo attached'),
            tip: 'Do not attach or mention photos in your resume — ATS systems cannot read them and some employers flag this.',
            points: 3, earned: 0,
        },
        {
            id: 'no_dob',
            label: 'No date of birth or age mentioned',
            passed: !hasKeyword('date of birth', 'd.o.b', 'dob', 'age:', 'born on'),
            tip: 'Remove date of birth — it is not required and can lead to bias-based rejections.',
            points: 3, earned: 0,
        },
        {
            id: 'no_marital',
            label: 'No marital status mentioned',
            passed: !hasKeyword('marital status', 'married', 'single', 'divorced', 'widowed'),
            tip: 'Remove marital status — it is irrelevant and can lead to biased rejections.',
            points: 3, earned: 0,
        },
    ];

    // ── Keyword & Skills ──
    const keywordChecks: CheckResult[] = [
        {
            id: 'actionverbs',
            label: 'Strong action verbs used (5+ required)',
            passed: actionVerbs.filter((v) => lower.includes(v)).length >= 5,
            tip: `Found ${actionVerbs.filter((v) => lower.includes(v)).length} of ${actionVerbs.length} action verbs. Use verbs like: Led, Built, Designed, Implemented, Achieved.`,
            points: 5, earned: 0,
        },
        {
            id: 'quantities',
            label: 'Quantified achievements (numbers/metrics)',
            passed: hasRegex(/\d+\s*(%|x|times|users|customers|projects|million|lakh|crore|k\b|hrs|hours|days|months)/i),
            tip: 'Quantify your impact: "Increased sales by 40%" or "Managed a team of 12 engineers".',
            points: 5, earned: 0,
        },
        {
            id: 'softskills',
            label: 'Soft skills mentioned (3+ required)',
            passed: softSkills.filter((s) => lower.includes(s)).length >= 3,
            tip: `Include soft skills like: ${softSkills.slice(0, 5).join(', ')}. Found: ${softSkills.filter((s) => lower.includes(s)).length}.`,
            points: 4, earned: 0,
        },
        {
            id: 'techkeywords',
            label: 'Technical keywords present (5+ required)',
            passed: techKeywords.filter((k) => lower.includes(k)).length >= 5,
            tip: `Include relevant tech stack keywords. Found ${techKeywords.filter((k) => lower.includes(k)).length}. Examples: Python, React, AWS, Docker, SQL.`,
            points: 5, earned: 0,
        },
        {
            id: 'certifications',
            label: 'Certifications mentioned',
            passed: hasKeyword('certif', 'certification', ...commonCerts),
            tip: 'Add any professional certifications (AWS, PMP, Google, etc.) to boost your ATS score.',
            points: 4, earned: 0,
        },
        {
            id: 'industry_terms',
            label: 'Industry-specific terms present',
            passed: hasKeyword('agile', 'scrum', 'sprint', 'kanban', 'devops', 'lean', 'stakeholder', 'roadmap', 'kpi', 'roi', 'mvp', 'saas', 'api', 'sdk', 'machine learning', 'data science', 'product management', 'ux', 'ui', 'b2b', 'b2c', 'sla', 'cloud', 'architecture', 'strategy'),
            tip: 'Include industry-specific terms that match the job description (Agile, KPIs, Stakeholders, API, SaaS etc.).',
            points: 4, earned: 0,
        },
    ];

    // ── Readability & Style ──
    const readabilityChecks: CheckResult[] = [
        {
            id: 'no_allcaps',
            label: 'No excessive ALL CAPS text',
            passed: (() => {
                const capsWords = (text.match(/\b[A-Z]{4,}\b/g) || []).filter(w => !['html', 'css', 'sql', 'aws', 'gcp', 'php', 'api', 'rest', 'json', 'xml', 'saas', 'paas', 'iaas', 'mdma', 'b2b', 'b2c', 'crm', 'erp', 'etl', 'sdk', 'iot', 'devops', 'cicd'].includes(w.toLowerCase()));
                return capsWords.length < 20;
            })(),
            tip: 'Avoid writing section headers or text in ALL CAPS — it can confuse ATS parsers. Use Title Case instead.',
            points: 3, earned: 0,
        },
        {
            id: 'bullet_usage',
            label: 'Bullet points used for experience',
            passed: (() => {
                const bulletLines = lines.filter((l) => /^\s*[-•*·]\s+/.test(l));
                return bulletLines.length >= 5;
            })(),
            tip: 'Use bullet points (- or •) to list responsibilities and achievements under each role.',
            points: 4, earned: 0,
        },
        {
            id: 'sentence_length',
            label: 'Concise bullet points (under 25 words avg)',
            passed: (() => {
                const bulletLines = lines.filter((l) => /^\s*[-•*·]\s+/.test(l));
                if (bulletLines.length === 0) return true;
                const avgWords = bulletLines.reduce((s, l) => s + l.split(/\s+/).length, 0) / bulletLines.length;
                return avgWords <= 25;
            })(),
            tip: 'Keep bullet points concise — aim for under 25 words per bullet for better readability.',
            points: 3, earned: 0,
        },
        {
            id: 'section_headers',
            label: 'Clear section headers present',
            passed: (() => {
                // Section headers are typically short lines (1-4 words) that are all caps or title case
                const headerLikeLines = lines.filter((l) => {
                    const trimmed = l.trim();
                    const words = trimmed.split(/\s+/);
                    return words.length >= 1 && words.length <= 4 && trimmed.length > 2 &&
                        (/^[A-Z\s&/]+$/.test(trimmed) || /^[A-Z][a-z]+(\s+[A-Z][a-z]*)*$/.test(trimmed));
                });
                return headerLikeLines.length >= 4;
            })(),
            tip: 'Use clear section headers like "Experience", "Education", "Skills" to organize your resume.',
            points: 4, earned: 0,
        },
        {
            id: 'no_typos_common',
            label: 'No common resume typos/misspellings',
            passed: !hasKeyword('recieve', 'managment', 'achivements', 'leadrship', 'developement', 'experince', 'comunication', 'definately', 'commitee', 'occured'),
            tip: 'Proofread carefully. Common typos: "recieve", "managment", "achivements", "experince".',
            points: 4, earned: 0,
        },
        {
            id: 'no_abbreviation_overload',
            label: 'Abbreviations are not overused',
            passed: (() => {
                const abbrs = (text.match(/\b[A-Z]{2,5}\b/g) || []).length;
                return abbrs < 50;
            })(),
            tip: 'Spell out abbreviations at first use (e.g. "Application Programming Interface (API)") to aid ATS parsing.',
            points: 3, earned: 0,
        },
    ];

    // ── Professional Extras ──
    const extrasChecks: CheckResult[] = [
        {
            id: 'awards',
            label: 'Awards / Honours mentioned',
            passed: hasKeyword('award', 'honor', 'honour', 'recognition', 'winner', 'top performer', 'employee of', 'scholarship', 'fellowship'),
            tip: 'Include any awards, scholarships, or recognition you\'ve received.',
            points: 3, earned: 0,
        },
        {
            id: 'volunteer',
            label: 'Volunteer / Community work mentioned',
            passed: hasKeyword('volunteer', 'ngo', 'community', 'social work', 'nonprofit', 'charity', 'open source', 'pro bono'),
            tip: 'Include volunteer work or open-source contributions to show community involvement.',
            points: 2, earned: 0,
        },
        {
            id: 'languages',
            label: 'Language proficiencies mentioned',
            passed: hasKeyword('english', 'hindi', 'french', 'spanish', 'german', 'mandarin', 'arabic', 'language') && hasKeyword('fluent', 'proficient', 'native', 'conversational', 'bilingual', 'multilingual'),
            tip: 'List languages you speak and your proficiency level (e.g. "English – Fluent, Hindi – Native").',
            points: 2, earned: 0,
        },
        {
            id: 'gpa_grades',
            label: 'Academic performance/GPA mentioned',
            passed: hasRegex(/(gpa|cgpa|percentage|marks|grade|distinction|first class|honors|cum laude)\s*[:–\-]?\s*\d/i),
            tip: 'Include your GPA/CGPA or percentage if it is 7.5+/75%+ — it signals strong academic performance.',
            points: 2, earned: 0,
        },
        {
            id: 'publications',
            label: 'Publications / Research mentioned',
            passed: hasKeyword('publication', 'published', 'research paper', 'conference', 'journal', 'ieee', 'springer', 'arxiv', 'patent'),
            tip: 'Include publications, research papers, or patents if applicable — especially valuable for technical roles.',
            points: 3, earned: 0,
        },
        {
            id: 'extracurricular',
            label: 'Extracurricular / Leadership activities',
            passed: hasKeyword('club', 'society', 'member', 'president', 'captain', 'delegate', 'toastmaster', 'nss', 'rotaract', 'debate', 'hackathon', 'model un', 'student council'),
            tip: 'Include extracurricular activities showing leadership, especially for fresher or early-career resumes.',
            points: 2, earned: 0,
        },
    ];

    // Set earned points
    const applyEarned = (checks: CheckResult[]) =>
        checks.map((c) => ({ ...c, earned: c.passed ? c.points : 0 }));

    return [
        { name: 'Contact & Identity', icon: '👤', checks: applyEarned(contactChecks) },
        { name: 'Format & Compatibility', icon: '📄', checks: applyEarned(formatChecks) },
        { name: 'Content Quality', icon: '✍️', checks: applyEarned(contentChecks) },
        { name: 'ATS Red Flags', icon: '🚩', checks: applyEarned(redFlagChecks) },
        { name: 'Keywords & Skills', icon: '🔑', checks: applyEarned(keywordChecks) },
        { name: 'Readability & Style', icon: '📐', checks: applyEarned(readabilityChecks) },
        { name: 'Professional Extras', icon: '🎖️', checks: applyEarned(extrasChecks) },
    ];
}


// ─────────────────────────────── SCORE RING ───────────────────────────────
function ScoreRing({ score }: { score: number }) {
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    const color =
        score >= 86 ? '#059669' : // Emerald-600 elegant
            score >= 66 ? '#2563eb' : // Blue-600 elegant
                score >= 41 ? '#d97706' : '#dc2626'; // Amber/Red

    const glowColor =
        score >= 86 ? 'rgba(5, 150, 105, 0.1)' :
            score >= 66 ? 'rgba(37, 99, 235, 0.1)' :
                score >= 41 ? 'rgba(217, 119, 6, 0.1)' : 'rgba(220, 38, 38, 0.1)';

    const label =
        score >= 86 ? 'Excellent 🏆' :
            score >= 66 ? 'Good 🟢' :
                score >= 41 ? 'Fair 🟡' : 'Needs Work 🔴';

    return (
        <div className="flex flex-col items-center gap-6 relative">
            <div className="absolute inset-0 blur-3xl rounded-full opacity-60 transition-colors duration-1000 bg-white" style={{ backgroundColor: glowColor, transform: 'scale(0.8)' }} />
            <div className="relative w-56 h-56 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 absolute inset-0 drop-shadow-xl" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r={radius} fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="8" />
                    <motion.circle
                        cx="100" cy="100" r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                        style={{ filter: `drop-shadow(0 0 12px ${glowColor})` }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <motion.span
                        className="text-6xl font-black text-slate-900 tracking-tight"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
                    >
                        {score}
                    </motion.span>
                    <span className="text-slate-500 text-sm font-medium tracking-widest uppercase mt-1">out of 100</span>
                </div>
            </div>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="text-xl font-bold tracking-wide"
                style={{ color }}
            >
                {label}
            </motion.div>
        </div>
    );
}

// ─────────────────────────────── CATEGORY CARD ───────────────────────────────
function CategoryCard({ category, index }: { category: Category; index: number }) {
    const [open, setOpen] = useState(index === 0);
    const passed = category.checks.filter((c) => c.passed).length;
    const total = category.checks.length;
    const earnedPts = category.checks.reduce((s, c) => s + c.earned, 0);
    const maxPts = category.checks.reduce((s, c) => s + c.points, 0);

    // Professional muted progression colors
    const passRatio = passed / total;
    const progressColor = passRatio === 1 ? 'bg-emerald-500' :
        passRatio >= 0.6 ? 'bg-blue-500' :
            passRatio >= 0.4 ? 'bg-amber-500' : 'bg-rose-500';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-white border border-slate-200 shadow-sm hover:shadow-md rounded-2xl overflow-hidden hover:border-indigo-100 transition-all duration-300"
        >
            <button
                className={`w-full flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 text-left transition-colors ${open ? 'bg-slate-50/50' : ''}`}
                onClick={() => setOpen(!open)}
            >
                <div className="flex items-center gap-5 w-full sm:w-auto">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-colors ${open ? 'bg-slate-100 text-slate-800' : 'bg-slate-50 border border-slate-100/60'}`}>
                        {category.icon}
                    </div>
                    <div>
                        <p className={`font-semibold text-base md:text-lg tracking-tight transition-colors ${open ? 'text-slate-900' : 'text-slate-700'}`}>{category.name}</p>
                        <p className="text-xs text-slate-500 font-medium tracking-wider uppercase mt-0.5">{passed}/{total} Passed <span className="mx-2 text-slate-300">|</span> {earnedPts}/{maxPts} XP</p>
                    </div>
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto mt-4 sm:mt-0">
                    <div className="flex-1 sm:w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full rounded-full ${progressColor}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${passRatio * 100}%` }}
                            transition={{ duration: 1, delay: index * 0.1 + 0.3, ease: "easeOut" }}
                        />
                    </div>
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors shrink-0 ${open ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-white border-transparent text-slate-400 group-hover:bg-slate-50 group-hover:text-slate-600 group-hover:border-slate-200'}`}>
                        {open ? <ChevronUp size={16} strokeWidth={2.5} /> : <ChevronDown size={16} strokeWidth={2.5} />}
                    </div>
                </div>
            </button>

            <AnimatePresence initial={false}>
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={`overflow-hidden bg-slate-50/50 print-force-show`}
                >
                    <div className="p-6 pt-0 space-y-3">
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-6" />
                        {category.checks.map((check) => (
                            <div key={check.id} className="flex items-start gap-4 group/check">
                                <div className="mt-0.5 shrink-0">
                                    {check.passed
                                        ? <div className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600"><Check size={14} strokeWidth={3} /></div>
                                        : <div className="w-6 h-6 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600"><XCircle size={14} /></div>
                                    }
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-4">
                                        <p className={`text-base font-medium ${check.passed ? 'text-slate-700' : 'text-slate-800'}`}>
                                            {check.label}
                                        </p>
                                        <span className={`text-xs font-mono font-medium px-2 py-0.5 rounded-full ${check.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                                            +{check.points} XP
                                        </span>
                                    </div>
                                    {!check.passed && (
                                        <p className="text-sm text-slate-600 mt-1.5 leading-relaxed bg-white rounded-lg p-3 border border-slate-200 border-l-4 border-l-rose-500 shadow-sm">
                                            <span className="text-rose-600 font-bold text-xs uppercase tracking-wider block mb-1">How to fix</span>
                                            {check.tip}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
}

// ─────────────────────────────── MAIN PAGE ───────────────────────────────
const ATSCheckerPage: NextPage = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [score, setScore] = useState<number | null>(null);
    const [loadingStep, setLoadingStep] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const loadingSteps = [
        { label: "Initializing engine...", icon: <Zap size={18} /> },
        { label: "Extracting document structure...", icon: <Layers size={18} /> },
        { label: "Analyzing typography & layout...", icon: <Search size={18} /> },
        { label: "Scanning for ATS keywords...", icon: <FileText size={18} /> },
        { label: "Calculating overall score...", icon: <Star size={18} /> }
    ];

    const processFile = useCallback(async (f: File) => {
        setError(null);
        setCategories(null);
        setScore(null);

        const ext = f.name.split('.').pop()?.toLowerCase();
        if (!['pdf', 'docx'].includes(ext || '')) {
            setError('Only PDF and DOCX files are supported.');
            return;
        }

        setFile(f);
        setLoading(true);
        setLoadingStep(0);

        try {
            // Simulate progression steps for the "AI" feel
            const stepInterval = setInterval(() => {
                setLoadingStep(curr => Math.min(curr + 1, 4));
            }, 800);

            let text = '';
            let pageCount = 1;

            if (ext === 'pdf') {
                // Use pdfjs loaded via <Script> tag (window.pdfjsLib)
                const pdfjsLib = (window as any).pdfjsLib;
                if (!pdfjsLib) {
                    throw new Error('PDF.js not loaded yet. Please try again in a moment.');
                }
                pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

                const arrayBuffer = await f.arrayBuffer();
                const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
                const pdf = await loadingTask.promise;
                pageCount = pdf.numPages;

                for (let i = 1; i <= Math.min(pageCount, 10); i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    text += content.items.map((item: any) => item.str || '').join(' ') + '\n';
                }
            } else if (ext === 'docx') {
                const mammoth = await import('mammoth');
                const arrayBuffer = await f.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer });
                text = result.value;
                // Estimate page count for docx (rough: 500 words/page)
                pageCount = Math.max(1, Math.ceil(text.split(/\s+/).length / 500));
            }

            const cats = runATSChecks(text, f.name, f.size, pageCount);
            const totalEarned = cats.reduce((sum, c) => sum + c.checks.reduce((s, ch) => s + ch.earned, 0), 0);
            const totalMax = cats.reduce((sum, c) => sum + c.checks.reduce((s, ch) => s + ch.points, 0), 0);
            const finalScore = Math.round((totalEarned / totalMax) * 100);

            clearInterval(stepInterval);

            // Artificial delay to let the last animation step finish smoothly if mapping was too fast
            await new Promise(r => setTimeout(r, 600));

            setCategories(cats);
            setScore(finalScore);
        } catch (err) {
            console.error(err);
            setError('Failed to parse the file. Please ensure it is a valid, text-based PDF or DOCX.');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            const f = e.dataTransfer.files[0];
            if (f) processFile(f);
        },
        [processFile]
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) processFile(f);
    };

    const reset = () => {
        setFile(null);
        setCategories(null);
        setScore(null);
        setError(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    const passed = categories ? categories.reduce((s, c) => s + c.checks.filter((ch) => ch.passed).length, 0) : 0;
    const total = categories ? categories.reduce((s, c) => s + c.checks.length, 0) : 0;

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500/30 selection:text-indigo-900 font-sans antialiased overflow-hidden print:bg-white print:overflow-visible">
            {/* Load PDF.js from public directory via script tag */}
            <Script src="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.min.js" strategy="lazyOnload" />
            <Head>
                <title>Enterprise ATS Engine – Riseflake</title>
                <meta name="description" content="Advanced AI-powered resume analysis. Deep scan your resume against 50+ enterprise ATS compatibility checks." />
                <link rel="icon" type="image/png" href="/hero.jpg" />
                <style>{`
                    @media print {
                        body { background: white; }
                        nav, footer, .print-hide { display: none !important; }
                        main { padding: 0 !important; max-width: 100% !important; margin: 0 !important; }
                        .print-break-inside-avoid { break-inside: avoid; }
                        .print-shadow-none { box-shadow: none !important; border: 1px solid #e2e8f0 !important; }
                        
                        /* Force expand all framer-motion category cards for print */
                        .print-force-show { 
                            display: block !important; 
                            height: auto !important; 
                            opacity: 1 !important; 
                            overflow: visible !important;
                        }
                    }
                `}</style>
            </Head>

            <div className="print-hide">
                <LandingNavbar />
            </div>

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-20 relative z-10 print:py-4">
                {/* Advanced Tech Background Gradients */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-200/40 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute top-40 -left-64 w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute top-40 -right-64 w-[500px] h-[500px] bg-sky-200/40 rounded-full blur-[100px] pointer-events-none" />

                {/* Header - Hidden when results are showing */}
                {!categories && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-center mb-16 relative print-hide"
                    >
                        <div className="inline-flex items-center gap-2 bg-white/80 border border-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-8 shadow-sm backdrop-blur-md">
                            <Sparkles size={14} className="text-indigo-500" />
                            Next-Gen Parsing Engine
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight">
                            Deep Scan Your <br />
                            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                                ATS Score
                            </span>
                        </h1>
                        <p className="mt-8 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
                            Industry-grade static analysis. Upload your resume to instantly audit its compatibility against the same parsing engines used by Fortune 500 companies.
                        </p>

                        {/* Trust pills */}
                        <div className="flex flex-wrap justify-center gap-4 mt-10">
                            {[
                                { icon: <Shield size={16} className="text-emerald-500" />, label: '100% Client-Side Private' },
                                { icon: <Zap size={16} className="text-amber-500" />, label: 'Zero Latency Analysis' },
                                { icon: <Layers size={16} className="text-blue-500" />, label: 'PDF & DOCX Support' },
                            ].map((item, i) => (
                                <span key={i} className="inline-flex items-center gap-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-full px-5 py-2 font-medium shadow-sm backdrop-blur-sm">
                                    {item.icon} {item.label}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Upload Zone */}
                {!categories && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="relative z-10 max-w-3xl mx-auto"
                    >
                        {/* Glow effect for the box */}
                        <div className={`absolute inset-0 bg-gradient-to-r from-indigo-200/50 to-purple-200/50 rounded-3xl blur-xl transition-opacity duration-500 ${isDragging ? 'opacity-100' : 'opacity-0'}`} />

                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            onClick={() => inputRef.current?.click()}
                            className={`
                                cursor-pointer relative group border-2 border-dashed rounded-3xl p-16 md:p-24 text-center transition-all duration-500 overflow-hidden
                                ${isDragging
                                    ? 'border-indigo-500 bg-indigo-50/80 scale-[1.01]'
                                    : 'border-slate-200 bg-white/70 hover:border-indigo-300 hover:bg-indigo-50/50'
                                }
                                shadow-sm backdrop-blur-md hover:shadow-lg hover:shadow-indigo-500/10
                            `}
                        >
                            <input
                                ref={inputRef}
                                type="file"
                                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            {loading ? (
                                <div className="flex flex-col items-center gap-10 py-6">
                                    <div className="relative">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                            className="w-32 h-32 border-2 border-slate-200 rounded-full"
                                        />
                                        <motion.div
                                            animate={{ rotate: -360 }}
                                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                            className="absolute inset-0 w-32 h-32 border-4 border-transparent border-t-indigo-500 border-b-purple-500 rounded-full drop-shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
                                            {loadingSteps[loadingStep].icon}
                                        </div>
                                    </div>

                                    <div className="space-y-4 w-full max-w-sm mx-auto text-left relative z-10">
                                        {loadingSteps.map((step, idx) => (
                                            <div key={idx} className="flex items-center gap-4">
                                                <div className={`
                                                    w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300
                                                    ${idx < loadingStep ? 'bg-indigo-500 border-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.2)]' :
                                                        idx === loadingStep ? 'border-indigo-400 text-indigo-600 bg-indigo-50 shadow-sm' :
                                                            'border-slate-300 text-slate-400 bg-slate-50'}
                                                `}>
                                                    {idx < loadingStep ? <Check size={14} strokeWidth={3} /> : <div className={`w-2 h-2 rounded-full ${idx === loadingStep ? 'bg-indigo-500 animate-pulse' : 'bg-slate-300'}`} />}
                                                </div>
                                                <span className={`text-[15px] font-medium tracking-wide transition-colors duration-300 ${idx === loadingStep ? 'text-indigo-900 font-bold' : idx < loadingStep ? 'text-slate-500' : 'text-slate-400'}`}>
                                                    {step.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className={`inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-8 transition-colors duration-500 shadow-sm border ${isDragging ? 'bg-indigo-100 border-indigo-200' : 'bg-slate-100 border-slate-200 group-hover:bg-indigo-50 group-hover:border-indigo-200'}`}>
                                        <Upload size={40} className={`transition-all duration-500 ${isDragging ? 'text-indigo-600 scale-110' : 'text-slate-400 group-hover:text-indigo-600 group-hover:scale-110'}`} />
                                    </div>
                                    <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
                                        {isDragging ? 'Drop to analyze' : 'Select a document'}
                                    </h3>
                                    <p className="text-slate-500 mt-4 text-lg font-light">
                                        Drag and drop or <span className="text-indigo-600 font-semibold hover:text-indigo-500 transition-colors underline underline-offset-4 decoration-indigo-200">browse files</span>
                                    </p>
                                    <p className="text-sm text-slate-400 mt-8 font-mono bg-slate-100 inline-block px-4 py-1.5 rounded-full">
                                        [ PDF, DOCX ] • END-TO-END ENCRYPTED
                                    </p>
                                </>
                            )}
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-6 flex items-center justify-center gap-3 text-red-700 bg-red-50 border border-red-200 rounded-2xl p-5 text-sm font-medium backdrop-blur-md shadow-sm"
                            >
                                <AlertCircle size={20} className="flex-shrink-0" />
                                {error}
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* Results - Sidebar Layout */}
                {categories && score !== null && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
                    >
                        {/* Left Sidebar */}
                        <div className="lg:col-span-4 space-y-8">
                            {/* Score Sticky Card */}
                            <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-[2rem] p-8 lg:p-10 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center relative overflow-hidden lg:sticky lg:top-24">
                                <ScoreRing score={score} />

                                <div className="mt-8 border-t border-slate-100 w-full pt-8">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Audit Complete</p>
                                    <p className="text-2xl font-black text-slate-900 truncate w-full mb-8" title={file?.name}>{file?.name}</p>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white rounded-2xl p-5 border border-slate-200 flex flex-col items-center shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
                                            <p className="text-3xl font-black text-slate-800 tracking-tight">{passed}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Passed Checks</p>
                                        </div>
                                        <div className="bg-white rounded-2xl p-5 border border-slate-200 flex flex-col items-center shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-rose-500" />
                                            <p className="text-3xl font-black text-slate-800 tracking-tight">{total - passed}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Issues Found</p>
                                        </div>
                                    </div>

                                    {/* Sidebar Actions */}
                                    <div className="mt-8 space-y-3">
                                        <button
                                            onClick={() => {
                                                const evt = new CustomEvent('expand-all-categories');
                                                window.dispatchEvent(evt);
                                                setTimeout(() => window.print(), 500);
                                            }}
                                            className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-sm focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                                        >
                                            <Download size={18} /> Download Full Report
                                        </button>
                                        <button
                                            onClick={reset}
                                            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 px-6 py-4 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm"
                                        >
                                            <Search size={18} className="text-slate-400" /> Scan Another File
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Content Area */}
                        <div className="lg:col-span-8 space-y-10">
                            {/* Premium Builder CTA inline above results */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="bg-slate-900 rounded-[2rem] p-8 md:p-12 shadow-xl shadow-slate-200 relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                                <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-slate-800/50 rounded-full blur-3xl pointer-events-none" />

                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div className="text-center md:text-left flex-1 max-w-lg">
                                        <div className="inline-flex items-center gap-2 text-indigo-300 font-semibold tracking-widest text-xs uppercase mb-4">
                                            <Sparkles size={14} /> Fix Issues Automatically
                                        </div>
                                        <h2 className="text-3xl font-black text-white mb-4 tracking-tight leading-tight">
                                            Build an <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">ATS-Perfect</span> Résumé.
                                        </h2>
                                        <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-6">
                                            Stop guessing. Use our professional builder to generate a resume that scores 90+ on every Applicant Tracking System natively.
                                        </p>
                                    </div>

                                    <div className="flex-shrink-0 w-full md:w-auto">
                                        <Link href="/" className="group/btn inline-flex items-center justify-center gap-3 bg-white text-indigo-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all hover:scale-[1.03] shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] w-full md:w-auto">
                                            Launch Builder
                                            <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Category Breakdown */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 px-2 print-hide">
                                    <Layers className="text-indigo-600" />
                                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Diagnostics Report</h2>
                                </div>
                                <div className="grid gap-4 print:gap-8">
                                    {categories.map((cat, i) => (
                                        <div key={cat.name} className="print-break-inside-avoid">
                                            <CategoryCard category={cat} index={i} />
                                        </div>
                                    ))}
                                </div>
                            </div>


                            {/* Final Disclaimer */}
                            <div className="mt-12 p-6 rounded-2xl bg-slate-50 border border-slate-200 print-hide">
                                <div className="flex items-start gap-3">
                                    <AlertCircle size={18} className="text-slate-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-slate-500 leading-relaxed italic">
                                        ATS scores depend on the individual software used by each company. Since this audit is based on the most critical industry-standard parameters, scores may vary across different parsing platforms.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </main>

            <div className="h-px w-full bg-slate-200 mt-10 print-hide" />
            <div className="print-hide">
                <LandingFooter />
            </div>
        </div>
    );
};

export default ATSCheckerPage;
