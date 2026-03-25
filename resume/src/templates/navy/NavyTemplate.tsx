import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { StateContext } from '@/modules/builder/resume/ResumeLayout';
import { SectionValidator } from '@/helpers/common/components/ValidSectionRenderer';
import { Section } from './components/Section';
import { Education } from './components/Education';
import { Objective } from './components/Objective';

import AboutMe from './components/AboutMe';
import Achievements from './components/Achievements';
import BasicIntro from './components/BasicIntro';
import Involvement from './components/Involvement';
import RatedSkills from './components/RatedSkills';
import UnratedSkills from './components/UnratedSkills';
import Work from './components/Work';
import Languages from './components/Languages';

const ResumeContainer = styled.div`
  display: flex;
  height: 100%;
  padding: 40px 25px;
  column-gap: 15px;

  @media print {
    border: none;
  }
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 66%;
  row-gap: 20px;
  height: 100%;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 34%;
  row-gap: 20px;
  height: 100%;
  font-size: 12px;
`;

export default function NavyTemplate() {
  const resumeData = useContext(StateContext);

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

  // Technical Skills Logic (Programming, Frameworks, etc.)
  const programmingSkills = [
    ...(skills.languages || []).filter((s: any) => techKeywords.includes(s.name.toLowerCase())),
    ...(skills?.frameworks || []),
  ];

  const toolsAndOthers = [
    ...(skills?.technologies || []),
    ...(skills?.libraries || []),
    ...(skills?.databases || []),
    ...(skills?.tools || []),
    ...(skills?.practices || []),
  ];

  // Spoken Languages Logic (Non-tech entries from the languages array)
  const spokenLanguages = (skills.languages || []).filter(
    (s: any) => !techKeywords.includes(s.name.toLowerCase())
  );

  const involvements = activities?.involvements;
  const achievements = activities?.achievements;

  return (
    <ResumeContainer>
      <LeftSection>
        <Section
          title={basics?.name}
          profiles={basics.profiles}
          portfolioUrl={basics.url}
          titleClassname="text-xl font-medium"
        >
          <BasicIntro basics={basics} />
        </Section>

        <SectionValidator value={work}>
          <Section title="Work Experience">
            <Work work={work} />
          </Section>
        </SectionValidator>

        <SectionValidator value={involvements}>
          <Section title="Key Projects / Involvements">
            <Involvement data={involvements} />
          </Section>
        </SectionValidator>

        <SectionValidator value={achievements}>
          <Section title="Certificates and Awards">
            <Achievements data={achievements} />
          </Section>
        </SectionValidator>
      </LeftSection>

      <RightSection>
        <SectionValidator value={basics.summary}>
          <Section title="Summary">
            <AboutMe summary={basics.summary} profileImage={basics.image} />
          </Section>
        </SectionValidator>

        <SectionValidator value={basics.objective}>
          <Section title="Career Objective">
            <Objective objective={basics.objective} />
          </Section>
        </SectionValidator>

        {/* Technical Expertise (Rated) */}
        <SectionValidator value={programmingSkills}>
          <Section title="Technical Expertise">
            <RatedSkills items={programmingSkills} />
          </Section>
        </SectionValidator>

        {/* Spoken Languages Section (Newly Added based on your Executive Logic) */}
        <SectionValidator value={spokenLanguages}>
          <Section title="Languages">
            <Languages items={spokenLanguages} />
          </Section>
        </SectionValidator>

        {/* Other Skills (Unrated) */}
        <SectionValidator value={toolsAndOthers}>
          <Section title="Skills / Exposure">
            <UnratedSkills items={toolsAndOthers} />
          </Section>
        </SectionValidator>

        <SectionValidator value={education}>
          <Section title="Education">
            <Education education={education} />
          </Section>
        </SectionValidator>
      </RightSection>
    </ResumeContainer>
  );
}
