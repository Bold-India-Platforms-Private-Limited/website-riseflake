import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { StateContext } from '@/modules/builder/resume/ResumeLayout';
import { SectionValidator } from '@/helpers/common/components/ValidSectionRenderer';
import { useThemes } from '@/stores/themes';

import BasicIntro from './components/BasicIntro';
import AboutMe from './components/AboutMe';
import Work from './components/Work';
import { Education } from './components/Education';
import RatedSkills from './components/RatedSkills';
import UnratedSkills from './components/UnratedSkills';
import Achievements from './components/Achievements';
import Courses from './components/Courses';
import { Section } from './components/Section';

/* ================= PAGE ================= */

const Page = styled.div<{ bg: string; color: string }>`
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 32px;
  box-sizing: border-box;
  background: ${(p) => p.bg};
  color: ${(p) => p.color};
  font-family: 'Inter', sans-serif;

  @media print {
    margin: 0;
    min-height: 297mm;
    padding-top: 42px;
    padding-bottom: 32px;
    overflow: hidden;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

/* ================= HEADER ================= */

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const ContactRow = styled.div<{ accent: string }>`
  font-size: 11.5px;
  color: #4b5563;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  span {
    font-weight: 600;
    color: ${(p) => p.accent};
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #d1d5db;
  margin: 14px 0 18px;
`;

/* ================= CONTENT ================= */

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

/* ================= HELPERS ================= */

/** normalize: HTML.5 → html | HTML5 → html | C++ → c++ */
const normalizeSkill = (name: string = '') => name.toLowerCase().replace(/[^a-z+#]/g, '');

/* ================= TEMPLATE ================= */

export default function PrimeTemplate() {
  const resume = useContext(StateContext);
  const theme = useThemes((s) => s.selectedTheme);

  if (!resume) return null;

  const { basics, work, education, skills, activities } = resume;

  const linkedInProfile = basics.profiles?.find(
    (p: any) => p.network?.toLowerCase() === 'linkedin'
  );

  /* ✅ EXPERIENCE (last company trimmed as before) */
  const trimmedWork = Array.isArray(work) ? work.slice(0, work.length - 1) : [];

  /* ---------- TECH KEYWORDS ---------- */
  const techKeywords = [
    'html',
    'css',
    'javascript',
    'typescript',
    'react',
    'angular',
    'node',
    'java',
    'python',
    'sql',
    'c',
    'c++',
    'c#',
    'spring',
    'mongodb',
    'postgresql',
    'mysql',
    'aws',
    'docker',
    'git',
    'linux',
  ];

  /* ---------- SKILLS SPLIT (FIXED) ---------- */

  /** 🗣 SPOKEN LANGUAGES */
  const spokenLanguages = (skills.languages || []).filter(
    (l: any) => !techKeywords.includes(normalizeSkill(l.name))
  );

  /** 💻 TECHNICAL SKILLS */
  const technicalSkills = [
    ...(skills.languages || []).filter((l: any) => techKeywords.includes(normalizeSkill(l.name))),
    ...(skills.technologies || []),
    ...(skills.frameworks || []),
    ...(skills.libraries || []),
    ...(skills.tools || []),
  ];

  return (
    <Page bg={theme.backgroundColor} color={theme.fontColor}>
      {/* ================= HEADER ================= */}
      <Header>
        <BasicIntro basics={basics} />

        <ContactRow accent={theme.titleColor}>
          {basics.email && (
            <div>
              <span>Email:</span> <a href={`mailto:${basics.email}`}>{basics.email}</a>
            </div>
          )}

          {basics.phone && (
            <div>
              <span>Phone:</span> <a href={`tel:${basics.phone}`}>{basics.phone}</a>
            </div>
          )}

          {linkedInProfile?.url && (
            <div>
              <span>LinkedIn:</span>{' '}
              <a href={linkedInProfile.url} target="_blank" rel="noopener noreferrer">
                {linkedInProfile.url.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}

          {basics.url && (
            <div>
              <span>Website:</span>{' '}
              <a
                href={basics.url.startsWith('http') ? basics.url : `https://${basics.url}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {basics.url.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </ContactRow>
      </Header>

      <Divider />

      {/* ================= CONTENT ================= */}
      <Content>
        <SectionValidator value={basics.summary}>
          <Section title="PROFILE" titleColor={theme.titleColor}>
            <AboutMe summary={basics.summary} />
          </Section>
        </SectionValidator>

        <SectionValidator value={trimmedWork}>
          <Section title="EXPERIENCE" titleColor={theme.titleColor}>
            <Work work={trimmedWork} />
          </Section>
        </SectionValidator>

        <SectionValidator value={technicalSkills}>
          <Section title="SKILLS" titleColor={theme.titleColor}>
            <UnratedSkills items={technicalSkills} />
          </Section>
        </SectionValidator>

        <SectionValidator value={education}>
          <Section title="EDUCATION" titleColor={theme.titleColor}>
            <Education education={education} />
          </Section>
        </SectionValidator>

        <SectionValidator value={spokenLanguages}>
          <Section title="LANGUAGES" titleColor={theme.titleColor}>
            <RatedSkills items={spokenLanguages} />
          </Section>
        </SectionValidator>

        <SectionValidator value={activities?.achievements}>
          <Section title="ACHIEVEMENTS / AWARDS" titleColor={theme.titleColor}>
            <Achievements data={activities.achievements} />
          </Section>
        </SectionValidator>

        <SectionValidator value={activities?.certifications}>
          <Section title="CERTIFICATIONS" titleColor={theme.titleColor}>
            <Courses data={activities.certifications} />
          </Section>
        </SectionValidator>
      </Content>
    </Page>
  );
}
