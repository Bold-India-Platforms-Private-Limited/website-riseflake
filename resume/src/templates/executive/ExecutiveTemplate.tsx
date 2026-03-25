import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { StateContext } from '@/modules/builder/resume/ResumeLayout';
import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import { Section } from './components/Section';
import { SectionValidator } from '@/helpers/common/components/ValidSectionRenderer';
import Work from './components/Work';
import { Education } from './components/Education';
import Languages from './components/Languages';
import Achievements from './components/Achievements';
import Courses from './components/Courses';
import AboutMe from './components/AboutMe';
import UnratedSkills from './components/UnratedSkills';
import BasicIntro from './components/BasicIntro';
import { useThemes } from '@/stores/themes';

const ResumeContainer = styled.div`
  font-family: 'Inter', sans-serif;
  background-color: white;
  color: #1a1a1a;
  width: 210mm;
  height: 297mm;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 0 auto;

  @media print {
    width: 210mm;
    height: 297mm;
    border: none;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

const Header = styled.header<{ themeBg: string }>`
  background-color: ${(props) => props.themeBg || '#27345c'};
  color: white;
  padding: 30px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s ease;
  position: relative;
  z-index: 10;
`;

const Body = styled.div`
  display: grid;
  grid-template-columns: 1.85fr 1fr;
  gap: 30px;
  padding: 25px 40px;
  flex-grow: 1;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export default function ExecutiveTemplate() {
  const resumeData = useContext(StateContext);
  const activeTheme = useThemes((state) => state.selectedTheme);

  if (!resumeData) return null;

  const { basics, work, education, skills, activities } = resumeData;

  // Logic to separate technical keywords from spoken languages
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
    ...(skills?.technologies || []),
    ...(skills?.frameworks || []),
    ...(skills?.libraries || []),
    ...(skills?.tools || []),
    ...(skills?.databases || []),
    ...(skills?.practices || []),
  ];

  const spokenLanguages = (skills.languages || []).filter(
    (s: any) => !techKeywords.includes(s.name.toLowerCase())
  );

  const achievementsHTML = activities?.achievements || '';
  const courseItems =
    activities?.certifications || resumeData?.certificates || resumeData?.awards || [];
  const involvementsHTML = activities?.involvements || '';

  return (
    <ResumeContainer>
      <Header themeBg={activeTheme.titleColor}>
        <BasicIntro basics={basics} />

        {basics.image && (
          <img
            src={basics.image}
            alt={basics.name}
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid rgba(255, 255, 255, 0.2)',
            }}
          />
        )}
      </Header>

      <Body>
        <Column>
          <SectionValidator value={basics.summary}>
            <Section title="Summary" titleColor={activeTheme.titleColor}>
              <AboutMe summary={basics.summary} />
            </Section>
          </SectionValidator>

          <SectionValidator value={work}>
            <Section title="Experience" titleColor={activeTheme.titleColor}>
              <Work work={work} />
            </Section>
          </SectionValidator>

          <SectionValidator value={education}>
            <Section title="Education" titleColor={activeTheme.titleColor}>
              <Education education={education} />
            </Section>
          </SectionValidator>

          <SectionValidator value={spokenLanguages}>
            <Section title="Languages" titleColor={activeTheme.titleColor}>
              <Languages items={spokenLanguages} />
            </Section>
          </SectionValidator>
        </Column>

        <Column>
          <SectionValidator value={achievementsHTML}>
            <Section title="Key Achievements" isSidebar titleColor={activeTheme.titleColor}>
              <div style={{ fontSize: '11px', color: '#555', lineHeight: '1.4' }}>
                <Achievements data={achievementsHTML} />
              </div>
            </Section>
          </SectionValidator>

          <SectionValidator value={programmingSkills}>
            <Section title="Skills" isSidebar titleColor={activeTheme.titleColor}>
              <UnratedSkills items={programmingSkills} />
            </Section>
          </SectionValidator>

          <SectionValidator value={courseItems}>
            <Section title="Training / Courses" isSidebar titleColor={activeTheme.titleColor}>
              <Courses items={courseItems} />
            </Section>
          </SectionValidator>

          <SectionValidator value={involvementsHTML}>
            <Section title="Interests" isSidebar titleColor={activeTheme.titleColor}>
              <div style={{ fontSize: '11px', color: '#555', lineHeight: '1.4' }}>
                <HTMLRenderer htmlString={involvementsHTML} />
              </div>
            </Section>
          </SectionValidator>
        </Column>
      </Body>
    </ResumeContainer>
  );
}
