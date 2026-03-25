import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { StateContext } from '@/modules/builder/resume/ResumeLayout';
import { SectionValidator } from '@/helpers/common/components/ValidSectionRenderer';
import { useThemes } from '@/stores/themes';

import BasicInfo from './components/BasicInfo';
import AboutMe from './components/AboutMe';
import Work from './components/Work';
import { Education } from './components/Education';
import UnratedSkills from './components/UnratedSkills';
import Achievements from './components/Achievements';
import Courses from './components/Courses';
import { Section } from './components/Section';

/* ================= PAGE ================= */

const Page = styled.div<{ bg: string; color: string }>`
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 26px 32px;
  font-family: 'Inter', sans-serif;
  background: ${(p) => p.bg};
  color: ${(p) => p.color};
  box-sizing: border-box;
`;

const Content = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

/* ================= HELPERS ================= */

/** normalize: HTML.5 → html | HTML5 → html | C++ → c++ */
const normalizeSkill = (name: string = '') => name.toLowerCase().replace(/[^a-z+#]/g, '');
/* ================= TEMPLATE ================= */

export default function AthenaTemplate() {
  const resume = useContext(StateContext);
  const theme = useThemes((s) => s.selectedTheme);

  if (!resume) return null;

  const { basics, work, education, skills, activities } = resume;

  const trimmedWork = Array.isArray(work) ? work.slice(0, 3) : [];

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

  /** 💻 TECHNICAL SKILLS (programming + stack) */
  const technicalSkills = [
    ...(skills.languages || []).filter((l: any) => techKeywords.includes(normalizeSkill(l.name))),
    ...(skills.technologies || []),
    ...(skills.frameworks || []),
    ...(skills.libraries || []),
    ...(skills.databases || []),
    ...(skills.tools || []),
  ];

  return (
    <Page bg={theme.backgroundColor} color={theme.fontColor}>
      <BasicInfo basics={basics} />

      <Content>
        <SectionValidator value={basics.summary}>
          <AboutMe summary={basics.summary} />
        </SectionValidator>

        <SectionValidator value={trimmedWork}>
          <Section title="Professional Experience" titleColor={theme.titleColor}>
            <Work work={trimmedWork} />
          </Section>
        </SectionValidator>

        {/* SKILLS */}
        <SectionValidator value={technicalSkills}>
          <Section title="SKILLS" titleColor={theme.titleColor}>
            <UnratedSkills items={technicalSkills} />
          </Section>
        </SectionValidator>

        <SectionValidator value={education}>
          <Section title="Education" titleColor={theme.titleColor}>
            <Education education={education} />
          </Section>
        </SectionValidator>

        {/* LANGUAGES */}
        <SectionValidator value={spokenLanguages}>
          <Section title="LANGUAGES" titleColor={theme.titleColor}>
            <UnratedSkills items={spokenLanguages} />
          </Section>
        </SectionValidator>

        <SectionValidator value={activities?.achievements}>
          <Section title="Achievements" titleColor={theme.titleColor}>
            <Achievements data={activities.achievements} />
          </Section>
        </SectionValidator>

        <SectionValidator value={activities?.certifications}>
          <Section title="Certifications" titleColor={theme.titleColor}>
            <Courses data={activities.certifications} />
          </Section>
        </SectionValidator>
      </Content>
    </Page>
  );
}
