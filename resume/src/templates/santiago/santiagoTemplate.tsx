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
import Involvement from './components/Involvement';
import { Objective } from './components/Objective';
import { Section } from './components/Section';

/* ================= PAGE ================= */

const Page = styled.div<{ bg: string; color: string }>`
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  display: flex;
  font-family: 'Inter', sans-serif;
  background: ${(p) => p.bg};
  color: ${(p) => p.color};

  @media print {
    min-height: 297mm;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

/* ================= LEFT SIDEBAR ================= */

const Sidebar = styled.aside<{ accent: string }>`
  width: 32%;
  padding: 28px 22px;
  background: ${(p) => p.accent}14;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Photo = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto 8px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const Contact = styled.div<{ accent: string }>`
  font-size: 11.5px;
  color: #374151;
  display: flex;
  flex-direction: column;
  gap: 6px;

  span {
    font-weight: 600;
    color: ${(p) => p.accent};
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`;

/* ================= RIGHT ================= */

const Main = styled.main`
  width: 68%;
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

/* ================= HELPERS ================= */

/** normalize: HTML.5 → html | HTML5 → html | C++ → c++ */
const normalizeSkill = (name: string = '') => name.toLowerCase().replace(/[^a-z+#]/g, '');

/* ================= TEMPLATE ================= */

export default function SantiagoTemplate() {
  const resume = useContext(StateContext);
  const theme = useThemes((s) => s.selectedTheme);

  if (!resume) return null;

  const { basics, work, education, skills, activities } = resume;

  const linkedInProfile = basics.profiles?.find(
    (p: any) => p.network?.toLowerCase() === 'linkedin'
  );

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

  /** 🗣 SPOKEN LANGUAGES (ONLY human languages) */
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
      {/* ================= LEFT ================= */}
      <Sidebar accent={theme.titleColor}>
        {basics.image && (
          <Photo>
            <img src={basics.image} alt={basics.name} />
          </Photo>
        )}

        <BasicIntro basics={basics} />

        <Contact accent={theme.titleColor}>
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
        </Contact>

        <SectionValidator value={basics.objective}>
          <Section title="OBJECTIVE" titleColor={theme.titleColor}>
            <Objective objective={basics.objective} />
          </Section>
        </SectionValidator>

        <SectionValidator value={technicalSkills}>
          <Section title="SKILLS" titleColor={theme.titleColor}>
            <UnratedSkills items={technicalSkills} />
          </Section>
        </SectionValidator>

        <SectionValidator value={spokenLanguages}>
          <Section title="LANGUAGES" titleColor={theme.titleColor}>
            <RatedSkills items={spokenLanguages} />
          </Section>
        </SectionValidator>

        <SectionValidator value={education}>
          <Section title="EDUCATION" titleColor={theme.titleColor}>
            <Education education={education} />
          </Section>
        </SectionValidator>
      </Sidebar>

      {/* ================= RIGHT ================= */}
      <Main>
        <SectionValidator value={basics.summary}>
          <Section title="PROFILE" titleColor={theme.titleColor}>
            <AboutMe summary={basics.summary} />
          </Section>
        </SectionValidator>

        <SectionValidator value={work}>
          <Section title="EXPERIENCE" titleColor={theme.titleColor}>
            <Work work={work} />
          </Section>
        </SectionValidator>

        <SectionValidator value={activities?.achievements}>
          <Section title="ACHIEVEMENTS" titleColor={theme.titleColor}>
            <Achievements data={activities.achievements} />
          </Section>
        </SectionValidator>

        <SectionValidator value={activities?.certifications}>
          <Section title="CERTIFICATIONS" titleColor={theme.titleColor}>
            <Courses data={activities.certifications} />
          </Section>
        </SectionValidator>

        <SectionValidator value={activities?.involvements}>
          <Section title="INVOLVEMENTS" titleColor={theme.titleColor}>
            <Involvement data={activities.involvements} />
          </Section>
        </SectionValidator>
      </Main>
    </Page>
  );
}
