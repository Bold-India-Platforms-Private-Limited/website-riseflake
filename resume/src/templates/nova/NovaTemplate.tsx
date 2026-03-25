import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { StateContext } from '@/modules/builder/resume/ResumeLayout';
import { useThemes } from '@/stores/themes';

import BasicInfo from './components/BasicInfo';
import AboutMe from './components/AboutMe';
import Work from './components/Work';
import Education from './components/Education';
import Achievements from './components/Achievements';
import Skills from './components/Skills';
import { Section } from './components/Section';

/* ================= PAGE ================= */

const Page = styled.div<{ bg: string; color: string }>`
  width: 210mm;
  height: 297mm; /* ✅ fixed */
  padding: 28px 32px;
  overflow: hidden; /* ✅ one page only */
  font-family: Inter, sans-serif;
  background: ${(p) => p.bg};
  color: ${(p) => p.color};
`;

/* ================= HELPERS ================= */

const HUMAN_LANGUAGES = [
  'english',
  'hindi',
  'marathi',
  'urdu',
  'sindhi',
  'french',
  'german',
  'spanish',
];

/* ================= TEMPLATE ================= */

export default function NovaTemplate() {
  const resume = useContext(StateContext);
  const theme = useThemes((s) => s.selectedTheme);
  if (!resume) return null;

  const { basics, skills, work, education, activities } = resume;

  /* ================= SKILLS SPLIT ================= */

  // 🗣 Spoken Languages
  const spokenLanguages = (skills.languages || []).filter((s: any) =>
    HUMAN_LANGUAGES.includes(String(s.name).toLowerCase())
  );

  // 💻 Core Technical Skills
  const coreSkills = [
    ...(skills.languages || []).filter(
      (s: any) => !HUMAN_LANGUAGES.includes(String(s.name).toLowerCase())
    ),
    ...(skills.frameworks || []),
    ...(skills.libraries || []),
    ...(skills.technologies || []),
  ];

  // 🛠 Tools & Practices
  const toolSkills = [
    ...(skills.tools || []),
    ...(skills.practices || []),
    ...(skills.databases || []),
  ];

  return (
    <Page bg={theme.backgroundColor} color={theme.fontColor}>
      {/* HEADER */}
      <BasicInfo basics={basics} />

      {/* ABOUT */}
      <AboutMe summary={basics.summary} />

      {/* SKILLS (3 SECTIONS) */}
      <Section title="Skills" titleColor={theme.titleColor}>
        <Skills spoken={spokenLanguages} core={coreSkills} tools={toolSkills} />
      </Section>

      {/* EXPERIENCE */}
      <Section title="Experience" titleColor={theme.titleColor}>
        <Work work={work} />
      </Section>

      {/* EDUCATION */}
      <Section title="Education" titleColor={theme.titleColor}>
        <Education education={education} />
      </Section>

      {/* ACHIEVEMENTS */}
      {activities?.achievements && (
        <Section title="Achievements" titleColor={theme.titleColor}>
          <Achievements data={activities.achievements} />
        </Section>
      )}
    </Page>
  );
}
