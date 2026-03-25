import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { StateContext } from '@/modules/builder/resume/ResumeLayout';
import { SectionValidator } from '@/helpers/common/components/ValidSectionRenderer';

import AboutMe from './components/AboutMe';
import Achievements from './components/Achievements';
import BasicIntro from './components/BasicIntro';
import { Education } from './components/Education';
import Involvement from './components/Involvement';
import RatedSkills from './components/RatedSkills';
import { Section } from './components/Section';
import UnratedSkills from './components/UnratedSkills';
import Work from './components/Work';

const ResumeContainer = styled.div`
  display: flex;
  background-color: white;
  width: 210mm;
  height: 297mm; /* Strict A4 Height Lock */
  margin: 0 auto;
  padding: 30px 25px;
  column-gap: 15px;
  overflow: hidden;

  @media print {
    border: none;
    height: 297mm;
    width: 210mm;
  }
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 64%;
  row-gap: 15px; /* Tightened for A4 density */
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 36%;
  row-gap: 15px;
  font-size: 11px; /* Scaled down */
`;

export default function ProfessionalTemplate() {
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
    'ruby',
    'c#',
  ];

  const techFromLanguages = (skills.languages || []).filter((s: any) =>
    techKeywords.includes((s.name || '').toLowerCase())
  );

  // Spoken languages only
  // const spokenLanguages = (skills.languages || []).filter(
  //   (s: any) => !techKeywords.includes((s.name || '').toLowerCase())
  // );

  // Combined technical expertise
  const technicalExpertise = [...techFromLanguages, ...(skills.frameworks || [])];

  return (
    <ResumeContainer>
      <LeftSection>
        <Section title={basics?.name} titleClassname="text-xl font-bold uppercase">
          <BasicIntro basics={basics} />
        </Section>

        <SectionValidator value={work}>
          <Section title="Work Experience">
            <Work work={work} />
          </Section>
        </SectionValidator>

        <SectionValidator value={activities.involvements}>
          <Section title="Key Projects / Involvements">
            <Involvement data={activities.involvements} />
          </Section>
        </SectionValidator>

        <SectionValidator value={activities.achievements}>
          <Section title="Certificates and Awards">
            <Achievements data={activities.achievements} />
          </Section>
        </SectionValidator>
      </LeftSection>

      <RightSection>
        <SectionValidator value={basics.summary}>
          <Section title="Summary">
            <AboutMe summary={basics.summary} profileImage={basics.image} />
          </Section>
        </SectionValidator>

        <SectionValidator value={technicalExpertise}>
          <Section title="Technical Expertise">
            <RatedSkills items={technicalExpertise} />
          </Section>
        </SectionValidator>

        {/* <SectionValidator value={spokenLanguages}>
          <Section title="Languages">
            <RatedSkills items={spokenLanguages} />
          </Section>
        </SectionValidator> */}

        <SectionValidator value={skills.frameworks.concat(skills.libraries)}>
          <Section title="Frameworks & Libraries">
            <UnratedSkills items={skills.frameworks.concat(skills.libraries)} />
          </Section>
        </SectionValidator>
        <SectionValidator value={skills.databases}>
          <Section title="Databases">
            <UnratedSkills items={skills.databases} />
          </Section>
        </SectionValidator>

        <SectionValidator value={skills.practices}>
          <Section title="Methodology / Approach">
            <UnratedSkills items={skills.practices} />
          </Section>
        </SectionValidator>
        <SectionValidator value={skills.technologies}>
          <Section title="Technologies">
            <UnratedSkills items={skills.technologies} />
          </Section>
        </SectionValidator>

        <SectionValidator value={skills.tools}>
          <Section title="Tools">
            <UnratedSkills items={skills.tools} />
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
