import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { StateContext } from '@/modules/builder/resume/ResumeLayout';
import { SectionValidator } from '@/helpers/common/components/ValidSectionRenderer';
import { useThemes } from '@/stores/themes';

import BasicInfo from './components/BasicInfo';
import AboutMe from './components/AboutMe';
import Work from './components/Work';
import { Education } from './components/Education';
import Skills from './components/Skills';
import Involvement from './components/Involvement';
import Objective from './components/Objective';
import { Section } from './components/Section';

/* ================= PAGE ================= */

const Page = styled.div<{ bg: string; color: string }>`
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;

  padding: 30px 36px 28px;

  font-family: 'Inter', sans-serif;
  background: ${(p) => p.bg};
  color: ${(p) => p.color};
  box-sizing: border-box;
`;

/* ================= CONTENT ================= */

const Content = styled.div`
  margin-top: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

/* ================= TEMPLATE ================= */

export default function CambridgeTemplate() {
  const resume = useContext(StateContext);
  const theme = useThemes((s) => s.selectedTheme);

  if (!resume) return null;

  const { basics, work, education, skills, activities } = resume;
  const allSkills = [
    ...(skills.technologies || []),
    ...(skills.frameworks || []),
    ...(skills.libraries || []),
    ...(skills.tools || []),
  ];

  return (
    <Page bg={theme.backgroundColor} color={theme.fontColor}>
      {/* ================= BASIC INFO ================= */}
      <BasicInfo basics={basics} />

      <Content>
        {/* ================= PROFILE ================= */}
        <SectionValidator value={basics.summary}>
          <Section title="Profile" titleColor={theme.titleColor}>
            <AboutMe summary={basics.summary} />
          </Section>
        </SectionValidator>

        <SectionValidator value={basics.objective}>
          <Section title="Objective" titleColor={theme.titleColor}>
            <Objective objective={basics.objective || ''} />
          </Section>
        </SectionValidator>

        {/* ================= EMPLOYMENT HISTORY ================= */}
        <SectionValidator value={work}>
          <Section title="Employment History" titleColor={theme.titleColor}>
            <Work work={work} />
          </Section>
        </SectionValidator>

        {/* ================= EDUCATION ================= */}
        <SectionValidator value={education}>
          <Section title="Education" titleColor={theme.titleColor}>
            <Education education={education} />
          </Section>
        </SectionValidator>

        {/* ================= INVOLVEMENT ================= */}
        {activities?.involvements && (
          <Section title="Involvement" titleColor={theme.titleColor}>
            <Involvement data={activities.involvements} />
          </Section>
        )}

        {/* ================= SKILLS ================= */}
        <SectionValidator value={allSkills}>
          <Section title="Skills" titleColor={theme.titleColor}>
            <Skills skills={skills} />
          </Section>
        </SectionValidator>
      </Content>
    </Page>
  );
}
