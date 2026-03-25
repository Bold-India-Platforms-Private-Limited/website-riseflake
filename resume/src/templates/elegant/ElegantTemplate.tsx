import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { StateContext } from '@/modules/builder/resume/ResumeLayout';
import { SectionValidator } from '@/helpers/common/components/ValidSectionRenderer';

import AboutMe from './components/AboutMe';
import Achievements from './components/Achievements';
import BasicIntro from './components/BasicIntro';
import { Education } from './components/Education';
import Involvement from './components/Involvement';
import { Section } from './components/Section';
import Work from './components/Work';
import Courses from './components/Courses';
import Languages from './components/Languages';

import { useThemes } from '@/stores/themes';

const ResumeContainer = styled.div<{ bgColor: string; fontColor: string }>`
  display: flex;
  background-color: ${(props) => props.bgColor || 'white'};
  color: ${(props) => props.fontColor || '#1a1a1a'};
  width: 210mm;
  height: 297mm;
  overflow: hidden;
  position: relative;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;

  @media print {
    width: 210mm;
    height: 297mm;
    overflow: hidden;
    margin: 0;
    border: none;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

const MainColumn = styled.div`
  flex: 1.6;
  padding: 30px 40px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Sidebar = styled.div<{ sidebarBg: string }>`
  flex: 1;
  background-color: ${(props) => props.sidebarBg || '#004d40'};
  color: white;
  padding: 25px 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  transition: background-color 0.3s ease;
`;

const SidebarImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 5px;

  img {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid rgba(255, 255, 255, 0.2);
  }
`;

export default function ElegantTemplate() {
  const resumeData = useContext(StateContext);

  const activeTheme = useThemes((state) => state.selectedTheme);

  if (!resumeData) return null;

  const { basics, work, education, skills, activities } = resumeData;

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
    ...(skills.frameworks || []),
    ...(skills.technologies || []),
    ...(skills.libraries || []),
    ...(skills.databases || []),
    ...(skills.tools || []),
  ];

  const spokenLanguages = (skills.languages || []).filter(
    (s: any) => !techKeywords.includes(s.name.toLowerCase())
  );

  const courseData =
    activities?.certifications || resumeData?.certificates || resumeData?.awards || '';

  return (
    <ResumeContainer bgColor={activeTheme.backgroundColor} fontColor={activeTheme.fontColor}>
      <MainColumn>
        <BasicIntro basics={basics} />

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

        <SectionValidator value={spokenLanguages}>
          <Section title="Languages" titleColor={activeTheme.titleColor}>
            <Languages items={spokenLanguages} />
          </Section>
        </SectionValidator>

        <SectionValidator value={activities.involvements}>
          <Section title="Interests" titleColor={activeTheme.titleColor}>
            <Involvement data={activities.involvements} />
          </Section>
        </SectionValidator>
      </MainColumn>

      <Sidebar sidebarBg={activeTheme.titleColor}>
        {basics.image && (
          <SidebarImageWrapper>
            <img src={basics.image} alt={basics.name} />
          </SidebarImageWrapper>
        )}

        <SectionValidator value={activities.achievements}>
          <Section title="Key Achievements" isSidebar titleColor="white">
            <Achievements data={activities.achievements} />
          </Section>
        </SectionValidator>

        <SectionValidator value={education}>
          <Section title="Education" isSidebar titleColor="white">
            <Education education={education} />
          </Section>
        </SectionValidator>

        <SectionValidator value={programmingSkills}>
          <Section title="Skills" isSidebar titleColor="white">
            <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.6' }}>
              {programmingSkills.map((s: any, i: number) => (
                <span key={i}>
                  {s.name}
                  {i < programmingSkills.length - 1 && ' • '}
                </span>
              ))}
            </div>
          </Section>
        </SectionValidator>

        <SectionValidator value={courseData}>
          <Section title="TRAINING / COURSES" isSidebar titleColor="white">
            <Courses data={courseData} />
          </Section>
        </SectionValidator>
      </Sidebar>
    </ResumeContainer>
  );
}
