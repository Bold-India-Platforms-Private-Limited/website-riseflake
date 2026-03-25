import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { StateContext } from '@/modules/builder/resume/ResumeLayout';
import { useThemes } from '@/stores/themes';
import { SectionValidator } from '@/helpers/common/components/ValidSectionRenderer';

import BasicIntro from './components/BasicIntro';
import AboutMe from './components/AboutMe';
import { Objective } from './components/Objective';
import Work from './components/Work';
import { Education } from './components/Education';
import UnratedSkills from './components/UnratedSkills';
import Achievements from './components/Achievements';
import Courses from './components/Courses';
import Interests from './components/Interests';
import Volunteering from './components/Volunteering';
import Section from './components/Section';

/* ================= PAGE ================= */

const Page = styled.div<{ bg: string; color: string }>`
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 36px 32px;
  box-sizing: border-box;
  background: ${(p) => p.bg};
  color: ${(p) => p.color};
  font-family: 'Inter', sans-serif;
`;

/* ================= LAYOUT ================= */

const Layout = styled.div`
  display: grid;
  grid-template-columns: 28% 1px 1fr;
  gap: 28px;
`;

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
`;

const Divider = styled.div`
  width: 1px;
  background-color: #e5e7eb;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
`;

/* ================= HELPERS ================= */

const normalizeSkill = (name: string = '') => name.toLowerCase().replace(/[^a-z+#]/g, '');

const TECH_KEYWORDS = [
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
  'redux',
  'firebase',
  'webpack',
  'jira',
  'bitbucket',
  'eclipse',
];

/* ================= TEMPLATE ================= */

const BerlinTemplate = () => {
  const resume = useContext(StateContext);
  const theme = useThemes((s) => s.selectedTheme);

  if (!resume) return null;

  const { basics, work, education, skills, activities, certificates, interests, volunteer } =
    resume;

  /* ================= SKILLS SPLIT ================= */

  // 🗣 SPOKEN LANGUAGES (English, Hindi)
  const spokenLanguages = (skills?.languages || []).filter(
    (l: any) => !TECH_KEYWORDS.includes(normalizeSkill(l.name))
  );

  // 💻 TECHNICAL SKILLS (NO human languages)
  const technicalSkills = [
    ...(skills?.languages || []).filter((l: any) => TECH_KEYWORDS.includes(normalizeSkill(l.name))),
    ...(skills?.technologies || []),
    ...(skills?.frameworks || []),
    ...(skills?.libraries || []),
    ...(skills?.databases || []),
    ...(skills?.tools || []),
  ].filter(Boolean);

  /* ================= EXPERIENCE ================= */

  const limitedWork = work?.slice(0, 3);

  /* ================= COURSES ================= */

  const courseData = activities?.certifications || activities?.courses || certificates || [];

  return (
    <Page bg={theme.backgroundColor} color={theme.fontColor}>
      <Layout>
        {/* ================= LEFT ================= */}
        <Sidebar>
          <BasicIntro basics={basics} />

          {/* ✅ SKILLS */}
          <SectionValidator value={technicalSkills}>
            <Section title="SKILLS" isSidebar titleColor={theme.titleColor}>
              <UnratedSkills items={technicalSkills} />
            </Section>
          </SectionValidator>

          {/* ✅ LANGUAGES */}
          <SectionValidator value={spokenLanguages}>
            <Section title="LANGUAGES" isSidebar titleColor={theme.titleColor}>
              <UnratedSkills items={spokenLanguages} />
            </Section>
          </SectionValidator>

          <SectionValidator value={activities?.achievements}>
            <Section title="ACHIEVEMENTS" isSidebar titleColor={theme.titleColor}>
              <Achievements data={activities?.achievements} />
            </Section>
          </SectionValidator>

          {interests && interests !== '<p><br></p>' && (
            <Section title="INTERESTS" isSidebar titleColor={theme.titleColor}>
              <Interests data={interests} />
            </Section>
          )}

          <SectionValidator value={volunteer}>
            <Section title="VOLUNTEERING" titleColor={theme.titleColor}>
              <Volunteering items={volunteer || []} />
            </Section>
          </SectionValidator>
        </Sidebar>

        <Divider />

        {/* ================= RIGHT ================= */}
        <Main>
          <SectionValidator value={basics?.summary}>
            <Section title="ABOUT ME" titleColor={theme.titleColor}>
              <AboutMe summary={basics.summary} />
            </Section>
          </SectionValidator>

          <SectionValidator value={basics?.objective}>
            <Section title="OBJECTIVE" titleColor={theme.titleColor}>
              <Objective objective={basics.objective} />
            </Section>
          </SectionValidator>

          <SectionValidator value={limitedWork}>
            <Section title="EMPLOYMENT HISTORY" titleColor={theme.titleColor}>
              <Work work={limitedWork || []} />
            </Section>
          </SectionValidator>

          <SectionValidator value={education}>
            <Section title="EDUCATION" titleColor={theme.titleColor}>
              <Education education={education || []} />
            </Section>
          </SectionValidator>

          <SectionValidator value={courseData}>
            <Section title="COURSES" titleColor={theme.titleColor}>
              <Courses data={courseData} />
            </Section>
          </SectionValidator>
        </Main>
      </Layout>
    </Page>
  );
};

export default BerlinTemplate;
