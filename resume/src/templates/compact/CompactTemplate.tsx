import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { StateContext } from '@/modules/builder/resume/ResumeLayout';
import { SectionValidator } from '@/helpers/common/components/ValidSectionRenderer';

import BasicIntro from './components/BasicIntro';
import Work from './components/Work';
import { Education } from './components/Education';
import Languages from './components/Languages';
import Interests from './components/Interests';
import Courses from './components/Courses';
import Achievements from './components/Achievements';
import { Objective } from './components/Objective';
import Section from './components/Section';
import RatedSkills from './components/RatedSkills';
import { useThemes } from '@/stores/themes';

const ResumeContainer = styled.div<{ bgColor: string; fontColor: string }>`
  font-family:
    'Inter',
    -apple-system,
    sans-serif;
  background-color: ${(props) => props.bgColor};
  color: ${(props) => props.fontColor};
  width: 210mm;
  height: 297mm;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  margin: 0 auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  @media print {
    margin: 0;
    box-shadow: none;
    height: 297mm;
    width: 210mm;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

const HeaderWave = styled.div<{ accentColor: string }>`
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 180px;
  /* We use a slight transparency (15%) of the accent color for a modern look */
  background: ${(props) => props.accentColor};
  opacity: 0.15;
  clip-path: ellipse(100% 60% at 70% 20%);
  z-index: 0;
`;

const HeaderContent = styled.header`
  position: relative;
  z-index: 1;
  padding: 30px 45px 10px 45px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const ProfileImage = styled.img`
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Body = styled.div`
  display: grid;
  grid-template-columns: 1.7fr 1fr;
  gap: 25px;
  padding: 0 45px 20px 45px;
  position: relative;
  z-index: 1;
  flex-grow: 1;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export default function CompactTemplate() {
  const resumeData = useContext(StateContext);

  const activeTheme = useThemes((state) => state.selectedTheme);
  console.log('Active Theme:', activeTheme);
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
    'ruby',
    'c#',
  ];
  const techFromLanguages = (skills.languages || []).filter((s: any) =>
    techKeywords.includes((s.name || '').toLowerCase())
  );
  const spokenLanguages = (skills.languages || []).filter(
    (s: any) => !techKeywords.includes((s.name || '').toLowerCase())
  );
  const programmingSkills = [
    ...techFromLanguages,
    ...(skills.frameworks || []),
    ...(skills.technologies || []),
    ...(skills.libraries || []),
    ...(skills.databases || []),
    ...(skills.tools || []),
  ];

  const courseData =
    activities?.certifications || resumeData?.certificates || resumeData?.awards || '';
  const achievementsHTML = activities?.achievements || '';

  return (
    <ResumeContainer bgColor={activeTheme.backgroundColor} fontColor={activeTheme.fontColor}>
      <HeaderWave accentColor={activeTheme.highlighterColor} />

      <HeaderContent>
        <BasicIntro basics={basics} />
        {basics.image && <ProfileImage src={basics.image} alt={basics.name} />}
      </HeaderContent>

      <Body>
        <Column>
          <SectionValidator value={work}>
            <Section title="EXPERIENCE" titleColor={activeTheme.titleColor}>
              <Work work={work} />
            </Section>
          </SectionValidator>

          <SectionValidator value={education}>
            <Section title="EDUCATION" titleColor={activeTheme.titleColor}>
              <Education education={education} />
            </Section>
          </SectionValidator>

          <SectionValidator value={programmingSkills}>
            <Section title="SKILLS" titleColor={activeTheme.titleColor}>
              <RatedSkills items={programmingSkills} />
            </Section>
          </SectionValidator>

          <SectionValidator value={spokenLanguages}>
            <Section title="LANGUAGES" titleColor={activeTheme.titleColor}>
              <Languages items={spokenLanguages} />
            </Section>
          </SectionValidator>
        </Column>

        <Column>
          <SectionValidator value={basics.summary}>
            <Section title="SUMMARY" titleColor={activeTheme.titleColor}>
              <Objective objective={basics.summary} />
            </Section>
          </SectionValidator>

          <SectionValidator value={achievementsHTML}>
            <Section title="KEY ACHIEVEMENTS" titleColor={activeTheme.titleColor}>
              <Achievements data={achievementsHTML} />
            </Section>
          </SectionValidator>

          <SectionValidator value={courseData}>
            <Section title="COURSES" titleColor={activeTheme.titleColor}>
              <Courses data={courseData} />
            </Section>
          </SectionValidator>

          <SectionValidator value={activities.involvements}>
            <Section title="PASSIONS" titleColor={activeTheme.titleColor}>
              <Interests data={activities.involvements} />
            </Section>
          </SectionValidator>
        </Column>
      </Body>
    </ResumeContainer>
  );
}
