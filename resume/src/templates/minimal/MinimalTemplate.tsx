import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { StateContext } from '@/modules/builder/resume/ResumeLayout';
import { SectionValidator } from '@/helpers/common/components/ValidSectionRenderer';
import { useThemes } from '@/stores/themes';

import BasicIntro from './components/BasicIntro';
import { Education } from './components/Education';
import Work from './components/Work';
import Section from './components/Section';
import AboutMe from './components/AboutMe';
import UnratedSkills from './components/UnratedSkills';
import Courses from './components/Courses';
import { Objective } from './components/Objective';
import Achievements from './components/Achievements';

const PageWrapper = styled.div`
  background-color: #f3f4f6; /* builder background */
  padding: 24px 0;
  display: flex;
  justify-content: center;
`;

const ResumeContainer = styled.div`
  font-family:
    'Inter',
    -apple-system,
    sans-serif;
  width: 210mm;
  min-height: 297mm;

  /* Hardcoded to keep the resume body clean regardless of theme selection */
  background-color: #ffffff;
  color: #111827;

  padding: 10mm 15mm;
  margin: 0 auto;

  display: flex;
  flex-direction: column;

  box-shadow:
    0 0 0 1px #e5e7eb,
    0 10px 30px rgba(0, 0, 0, 0.08);

  @media print {
    box-shadow: none;
    margin: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

const HeaderWrapper = styled.div<{ accentColor: string }>`
  margin-bottom: 15px;
  padding-bottom: 10px;
  /* Keeps the top border matched to the theme color */
  border-bottom: 1px solid ${(props) => props.accentColor};
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 30% 1px 65%;
  gap: 20px;
  flex: 1;
`;

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const VerticalDivider = styled.div<{ accentColor: string }>`
  background-color: ${(props) => props.accentColor};
  opacity: 0.2;
  width: 1px;
  height: 100%;
`;

const ContentArea = styled.main`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export default function MinimalTemplate() {
  const resumeData = useContext(StateContext);
  const selectedTheme = useThemes((state) => state.selectedTheme);

  if (!resumeData) return null;

  const { basics, work, education, skills, activities } = resumeData;

  const courseItems =
    resumeData?.certifications || resumeData?.certificates || resumeData?.awards || [];

  const techKeywords = [
    'react',
    'sql',
    'javascript',
    'typescript',
    'python',
    'java',
    'html',
    'css',
    'node',
    'angular',
    'git',
    'docker',
    'aws',
    'php',
    'mongodb',
    'c++',
    'c#',
    'spring',
    'vue',
    'express',
    'postgresql',
    'redis',
    'linux',
  ];

  const programmingSkills = [
    ...(skills.languages || []).filter((s: any) => techKeywords.includes(s.name.toLowerCase())),
  ];

  return (
    <PageWrapper>
      <ResumeContainer>
        {/* ===== HEADER ===== */}
        <HeaderWrapper accentColor={selectedTheme.highlighterColor}>
          <BasicIntro basics={basics} />
        </HeaderWrapper>
        =
        <MainGrid>
          {/* ===== LEFT (Sidebar) ===== */}
          <Sidebar>
            <SectionValidator value={basics.objective}>
              <Section title="OBJECTIVE" titleColor={selectedTheme.titleColor}>
                <Objective objective={basics.objective} />
              </Section>
            </SectionValidator>

            <SectionValidator value={programmingSkills}>
              <Section title="LANGUAGES" titleColor={selectedTheme.titleColor}>
                <UnratedSkills items={programmingSkills} />
              </Section>
            </SectionValidator>

            <SectionValidator value={skills.technologies}>
              <Section title="TECHNOLOGIES" titleColor={selectedTheme.titleColor}>
                <UnratedSkills items={skills.technologies} />
              </Section>
            </SectionValidator>

            <SectionValidator value={[...(skills.frameworks || []), ...(skills.libraries || [])]}>
              <Section title="FRAMEWORKS & LIBRARIES" titleColor={selectedTheme.titleColor}>
                <UnratedSkills
                  items={[...(skills.frameworks || []), ...(skills.libraries || [])]}
                />
              </Section>
            </SectionValidator>

            <SectionValidator value={skills.tools}>
              <Section title="TOOLS" titleColor={selectedTheme.titleColor}>
                <UnratedSkills items={skills.tools} />
              </Section>
            </SectionValidator>

            <SectionValidator value={education}>
              <Section title="EDUCATION" titleColor={selectedTheme.titleColor}>
                <Education education={education} />
              </Section>
            </SectionValidator>

            <SectionValidator value={courseItems}>
              <Section title="VOLUNTEERING" titleColor={selectedTheme.titleColor}>
                <Courses items={courseItems} />
              </Section>
            </SectionValidator>
          </Sidebar>

          <VerticalDivider accentColor={selectedTheme.highlighterColor} />

          {/* ===== RIGHT (Main Content) ===== */}
          <ContentArea>
            <SectionValidator value={basics.summary}>
              <Section title="SUMMARY" titleColor={selectedTheme.titleColor}>
                <AboutMe summary={basics.summary} />
              </Section>
            </SectionValidator>

            <SectionValidator value={work}>
              <Section title="EXPERIENCE" titleColor={selectedTheme.titleColor}>
                <Work work={work} />
              </Section>
            </SectionValidator>

            <SectionValidator value={activities?.achievements}>
              <Section title="ACHIEVEMENTS" titleColor={selectedTheme.titleColor}>
                <Achievements data={activities.achievements} />
              </Section>
            </SectionValidator>
          </ContentArea>
        </MainGrid>
      </ResumeContainer>
    </PageWrapper>
  );
}
