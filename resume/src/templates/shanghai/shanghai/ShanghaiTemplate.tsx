import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { StateContext } from '@/modules/builder/resume/ResumeLayout';
import { useThemes } from '@/stores/themes';

import BasicIntro from './components/BasicIntro';
import Profession from './components/Profession';
import AboutMe from './components/AboutMe';
import Work from './components/Work';
import Education from './components/Education';
import RatedSkills from './components/RatedSkills';
import UnratedSkills from './components/UnratedSkills';
import Achievements from './components/Achievements';
import Section from './components/Section';

/* ================= PAGE ================= */
const Page = styled.div<{ bg: string; color: string }>`
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 26px 32px; /* 🔥 PROPER PAGE MARGIN */
  background: ${(p) => p.bg};
  color: ${(p) => p.color};
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

/* ================= HELPERS ================= */

const normalizeSkill = (name: string = '') => name.toLowerCase().replace(/[^a-z+#]/g, '');

/* ================= TEMPLATE ================= */

export default function ShanghaiTemplate() {
  const resume = useContext(StateContext);
  const theme = useThemes((s) => s.selectedTheme);

  if (!resume) return null;

  const { basics, work, education, skills, activities } = resume;

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

  const spokenLanguages = (skills.languages || []).filter(
    (l: any) => !techKeywords.includes(normalizeSkill(l.name))
  );

  const technicalSkills = [
    ...(skills.languages || []).filter((l: any) => techKeywords.includes(normalizeSkill(l.name))),
    ...(skills.technologies || []),
    ...(skills.frameworks || []),
    ...(skills.libraries || []),
    ...(skills.tools || []),
  ];

  return (
    <Page bg={theme.backgroundColor} color={theme.fontColor}>
      {/* ===== HEADER ===== */}
      <BasicIntro basics={basics} />

      {/* ===== ROLE ===== */}
      <Profession label={basics.label} />

      {/* ❌ NO HEADING HERE */}
      <AboutMe summary={basics.summary} />

      {/* ===== EXPERIENCE ===== */}
      <Section title="EXPERIENCE" titleColor={theme.titleColor}>
        <Work work={work} />
      </Section>

      {/* ===== EDUCATION ===== */}
      <Section title="EDUCATION" titleColor={theme.titleColor}>
        <Education education={education} />
      </Section>

      {/* ===== SKILLS ===== */}
      <Section title="SKILLS" titleColor={theme.titleColor}>
        <UnratedSkills items={technicalSkills} />
      </Section>

      {/* ===== LANGUAGES ===== */}
      <Section title="LANGUAGES" titleColor={theme.titleColor}>
        <RatedSkills items={spokenLanguages} />
      </Section>

      {/* ===== ACHIEVEMENTS ===== */}
      {activities?.achievements && (
        <Section title="ACHIEVEMENTS" titleColor={theme.titleColor}>
          <Achievements data={activities.achievements} />
        </Section>
      )}
    </Page>
  );
}
