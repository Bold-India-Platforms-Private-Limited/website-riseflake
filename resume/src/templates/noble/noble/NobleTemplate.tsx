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
import { Section } from './components/Section';

const Page = styled.div<{ bg: string }>`
  width: 210mm;
  height: 297mm; /* A4 FIXED */
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
  background: ${(p) => p.bg};
  overflow: hidden; /* 🔥 NO OVERFLOW */
  box-sizing: border-box;

  @media print {
    margin: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

const Scale = styled.div`
  transform: scale(0.95); /* 🔥 MAGIC LINE */
  transform-origin: top center;
  width: 100%;
  height: 100%;
`;

const Body = styled.div<{ color: string }>`
  display: grid;
  grid-template-columns: 32% 68%;
  gap: 28px;
  padding: 28px 32px;
  color: ${(p) => p.color};
  box-sizing: border-box;
`;

const Left = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Right = styled.main`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const normalizeSkill = (name: string = '') => name.toLowerCase().replace(/[^a-z+#]/g, '');

export default function NobleTemplate() {
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
    'mysql',
    'postgresql',
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
    <Page bg={theme.backgroundColor}>
      <Scale>
        <BasicIntro basics={basics} />

        <Body color={theme.fontColor}>
          <Left>
            <SectionValidator value={technicalSkills}>
              <Section title="SKILLS" titleColor={theme.titleColor}>
                <RatedSkills items={technicalSkills} />
              </Section>
            </SectionValidator>

            <SectionValidator value={spokenLanguages}>
              <Section title="SPOKEN LANGUAGES" titleColor={theme.titleColor}>
                <UnratedSkills items={spokenLanguages} />
              </Section>
            </SectionValidator>
          </Left>

          <Right>
            <SectionValidator value={basics.summary}>
              <Section title="PROFILE" titleColor={theme.titleColor}>
                <AboutMe summary={basics.summary} />
              </Section>
            </SectionValidator>

            <SectionValidator value={work}>
              <Section title="HISTORY" titleColor={theme.titleColor}>
                <Work work={work} />
              </Section>
            </SectionValidator>

            <SectionValidator value={education}>
              <Section title="EDUCATION" titleColor={theme.titleColor}>
                <Education education={education} />
              </Section>
            </SectionValidator>

            <SectionValidator value={activities?.achievements}>
              <Section title="ACHIEVEMENTS" titleColor={theme.titleColor}>
                <Achievements data={activities.achievements} />
              </Section>
            </SectionValidator>
          </Right>
        </Body>
      </Scale>
    </Page>
  );
}
