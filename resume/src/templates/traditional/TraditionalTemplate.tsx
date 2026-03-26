import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { StateContext } from '@/modules/builder/resume/ResumeLayout';
import { SectionValidator } from '@/helpers/common/components/ValidSectionRenderer';
import { useThemes } from '@/stores/themes';
import { withBasePath } from '@/utils/withBasePath';

import AboutMe from './components/AboutMe';
import Work from './components/Work';
import { Education } from './components/Education';
import UnratedSkills from './components/UnratedSkills';
import RatedSkills from './components/RatedSkills';
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

/* ================= HEADER ================= */

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr 100px;
  gap: 20px;
  align-items: center;
  padding-bottom: 6px;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Name = styled.h1<{ color: string }>`
  font-size: 30px;
  font-weight: 800;
  margin: 0;
  text-transform: uppercase;
  color: ${(p) => p.color};
`;

const Role = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #4b5563;
`;

const ContactRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 11.5px;
  color: #4b5563;
`;

const PhotoWrapper = styled.div<{ border: string }>`
  width: 100px;
  height: 100px;
  border: 1px solid ${(p) => p.border};
  overflow: hidden;
`;

/* ================= CONTENT ================= */

const Content = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

/* ================= HELPERS ================= */

const normalize = (name: string = '') => name.toLowerCase().replace(/[^a-z]/g, '');

const TECH_KEYWORDS = [
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
  'cpp',
  'csharp',
  'spring',
  'mongodb',
  'postgresql',
  'mysql',
  'aws',
  'docker',
  'git',
  'linux',
];

/* ================= TEMPLATE ================= */

export default function TraditionalTemplate() {
  const resume = useContext(StateContext);
  const theme = useThemes((s) => s.selectedTheme);

  if (!resume) return null;

  const { basics, work, education, skills, activities } = resume;

  const trimmedWork = Array.isArray(work) ? work.slice(0, 2) : [];

  /* ---------- LANGUAGES (human only) ---------- */
  const spokenLanguages = (skills.languages || []).filter(
    (l: any) => !TECH_KEYWORDS.includes(normalize(l.name))
  );

  /* ---------- TECHNICAL SKILLS (NO languages) ---------- */
  const technicalSkills = [
    ...(skills.technologies || []),
    ...(skills.frameworks || []),
    ...(skills.libraries || []),
    ...(skills.tools || []),
  ];

  return (
    <Page bg={theme.backgroundColor} color={theme.fontColor}>
      {/* ================= HEADER ================= */}
      <Header>
        <HeaderLeft>
          <Name color={theme.titleColor}>{basics.name}</Name>
          {basics.label && <Role>{basics.label}</Role>}

          <ContactRow>
            {basics.email && <span>{basics.email}</span>}
            {basics.phone && <span>{basics.phone}</span>}
            {basics.url && <span>{basics.url}</span>}
          </ContactRow>
        </HeaderLeft>

        {basics.image && (
          <PhotoWrapper border={theme.titleColor}>
            <img
              src={withBasePath(basics.image)}
              alt="profile"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </PhotoWrapper>
        )}
      </Header>

      {/* ================= CONTENT ================= */}
      <Content>
        <SectionValidator value={basics.summary}>
          <Section title="Profile" titleColor={theme.titleColor}>
            <AboutMe summary={basics.summary} />
          </Section>
        </SectionValidator>

        <SectionValidator value={trimmedWork}>
          <Section title="Experience" titleColor={theme.titleColor}>
            <Work work={trimmedWork} />
          </Section>
        </SectionValidator>

        {/* ✅ SKILLS (TECHNICAL ONLY) */}
        <SectionValidator value={technicalSkills}>
          <Section title="Skills" titleColor={theme.titleColor}>
            <UnratedSkills items={technicalSkills} />
          </Section>
        </SectionValidator>

        <SectionValidator value={education}>
          <Section title="Education" titleColor={theme.titleColor}>
            <Education education={education} />
          </Section>
        </SectionValidator>

        {/* ✅ LANGUAGES */}
        <SectionValidator value={spokenLanguages}>
          <Section title="Languages" titleColor={theme.titleColor}>
            <RatedSkills items={spokenLanguages} />
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
