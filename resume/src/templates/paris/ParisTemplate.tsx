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
import { Section } from './components/Section';

const Page = styled.div<{ bg: string; color: string }>`
  width: 210mm;
  min-height: 297mm;
  padding: 26px 28px;
  margin: 0 auto;
  font-family: Inter, sans-serif;
  background: ${(p) => p.bg};
  color: ${(p) => p.color};
`;

const HeaderWrap = styled.div`
  position: relative;
  margin-bottom: 22px;
`;

const HeaderLeft = styled.div`
  padding-right: 340px;
`;

const HeaderRight = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
`;

const Body = styled.div`
  padding-right: 340px;
`;
const normalizeSkill = (name: string = '') => name.toLowerCase().replace(/[^a-z+#]/g, '');
export default function ParisTemplate() {
  const resume = useContext(StateContext);
  const theme = useThemes((s) => s.selectedTheme);

  if (!resume) return null;

  const { basics, work, education, skills } = resume;

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

  /** 🗣 SPOKEN LANGUAGES */
  const spokenLanguages = (skills.languages || []).filter(
    (l: any) => !techKeywords.includes(normalizeSkill(l.name))
  );

  /** 💻 TECHNICAL SKILLS */
  const technicalSkills = [
    ...(skills.languages || []).filter((l: any) => techKeywords.includes(normalizeSkill(l.name))),
    ...(skills.technologies || []),
    ...(skills.frameworks || []),
    ...(skills.libraries || []),
    ...(skills.tools || []),
  ];

  return (
    <Page bg={theme.backgroundColor} color={theme.fontColor}>
      <HeaderWrap>
        <HeaderLeft>
          <BasicIntro basics={basics} />
        </HeaderLeft>

        <HeaderRight>
          <Section title="TECHNICAL SKILLS" titleColor={theme.titleColor}>
            <UnratedSkills items={technicalSkills} />
          </Section>

          <Section title="SPOKEN LANGUAGES" titleColor={theme.titleColor}>
            <RatedSkills items={spokenLanguages} />
          </Section>
        </HeaderRight>
      </HeaderWrap>

      <Body>
        <SectionValidator value={basics.summary}>
          <Section title="PROFILE" titleColor={theme.titleColor}>
            <AboutMe summary={basics.summary} />
          </Section>
        </SectionValidator>

        <SectionValidator value={work}>
          <Section title="EMPLOYMENT HISTORY" titleColor={theme.titleColor}>
            <Work work={work} />
          </Section>
        </SectionValidator>

        <SectionValidator value={education}>
          <Section title="EDUCATION" titleColor={theme.titleColor}>
            <Education education={education} />
          </Section>
        </SectionValidator>
      </Body>
    </Page>
  );
}
