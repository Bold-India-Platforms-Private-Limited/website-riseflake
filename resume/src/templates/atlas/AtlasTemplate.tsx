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
import Courses from './components/Courses';
import { Objective } from './components/Objective';
import { Section } from './components/Section';

const Page = styled.div<{ bg: string; color: string }>`
  width: 210mm;
  height: 297mm; /* 🔥 FIXED */
  margin: 0 auto;
  background: ${(p) => p.bg};
  color: ${(p) => p.color};
  font-family: 'Inter', sans-serif;
  padding: 26px 30px;
  box-sizing: border-box;

  overflow: hidden; /* 🔥 HARD CLAMP */

  @media print {
    margin: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: 90px 1fr;
  gap: 16px;
  align-items: center;
`;

const Photo = styled.div`
  width: 90px;
  height: 90px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 6px;
  }
`;

const ContactRow = styled.div<{ accent: string }>`
  font-size: 11px;
  margin-top: 4px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  line-height: 1.4;

  span {
    color: ${(p) => p.accent};
    font-weight: 600;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #d1d5db;
  margin: 10px 0;
`;

const Body = styled.div`
  display: grid;
  grid-template-columns: 35% 65%;
  gap: 22px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden; /* 🔥 column clamp */
`;

const Clamp = styled.div`
  overflow: hidden;
  max-height: 100%;
`;

const normalizeSkill = (name: string = '') => name.toLowerCase().replace(/[^a-z+#]/g, '');

export default function AtlasTemplate() {
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
    'postgresql',
    'mysql',
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
    ...(skills.databases || []),
    ...(skills.tools || []),
  ];

  const courseData =
    activities?.certifications || activities?.courses || resume?.certificates || [];

  return (
    <Page bg={theme.backgroundColor} color={theme.fontColor}>
      <Header>
        {basics.image && (
          <Photo>
            <img src={basics.image} alt={basics.name} />
          </Photo>
        )}
        <div>
          <BasicIntro basics={basics} />
          <ContactRow accent={theme.titleColor}>
            {basics.email && (
              <div>
                <span>Email:</span> {basics.email}
              </div>
            )}
            {basics.phone && (
              <div>
                <span>Phone:</span> {basics.phone}
              </div>
            )}
            {basics.location?.city && (
              <div>
                <span>Location:</span> {basics.location.city}
              </div>
            )}
          </ContactRow>
        </div>
      </Header>

      <Divider />

      <Body>
        <Column>
          <Clamp>
            <SectionValidator value={basics.objective}>
              <Section title="OBJECTIVE" titleColor={theme.titleColor}>
                <Objective objective={basics.objective} />
              </Section>
            </SectionValidator>

            <SectionValidator value={spokenLanguages}>
              <Section title="LANGUAGES" titleColor={theme.titleColor}>
                <RatedSkills items={spokenLanguages} />
              </Section>
            </SectionValidator>

            <SectionValidator value={technicalSkills}>
              <Section title="TECHNICAL SKILLS" titleColor={theme.titleColor}>
                <UnratedSkills items={technicalSkills} />
              </Section>
            </SectionValidator>

            <SectionValidator value={education}>
              <Section title="EDUCATION" titleColor={theme.titleColor}>
                <Education education={education} />
              </Section>
            </SectionValidator>
          </Clamp>
        </Column>

        <Column>
          <Clamp>
            <SectionValidator value={basics.summary}>
              <Section title="SUMMARY" titleColor={theme.titleColor}>
                <AboutMe summary={basics.summary} />
              </Section>
            </SectionValidator>

            <SectionValidator value={work}>
              <Section title="EXPERIENCE" titleColor={theme.titleColor}>
                <Work work={work} />
              </Section>
            </SectionValidator>

            <SectionValidator value={activities?.achievements}>
              <Section title="ACHIEVEMENTS" titleColor={theme.titleColor}>
                <Achievements data={activities.achievements} />
              </Section>
            </SectionValidator>

            <SectionValidator value={courseData}>
              <Section title="CERTIFICATIONS" titleColor={theme.titleColor}>
                <Courses data={courseData} />
              </Section>
            </SectionValidator>
          </Clamp>
        </Column>
      </Body>
    </Page>
  );
}
