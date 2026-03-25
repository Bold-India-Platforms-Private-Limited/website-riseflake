import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { StateContext } from '@/modules/builder/resume/ResumeLayout';
import { useThemes } from '@/stores/themes';
import Awards from './components/Awards';
import AboutMe from './components/AboutMe';
import Work from './components/Work';
import { Education } from './components/Education';
import RatedSkills from './components/RatedSkills';
import UnratedSkills from './components/UnratedSkills';
import { Section } from './components/Section';
import { SectionValidator } from '@/helpers/common/components/ValidSectionRenderer';

/* ================= PAGE ================= */

const Page = styled.div`
  width: 210mm;
  min-height: 297mm;

  margin: 0 auto;

  padding-top: 12mm;
  padding-bottom: 16mm;
  padding-left: 8mm; /* 🔥 THIS FIXES BLUE MARK */
  padding-right: 14mm;

  box-sizing: border-box;
  background: #fff;

  @media print {
    margin: 0 auto;
    padding-top: 12mm;
    padding-bottom: 16mm;
    padding-left: 8mm;
    padding-right: 14mm;

    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

/* ================= HEADER ================= */

const Header = styled.div`
  margin-bottom: 10px; /* ⬅️ reduced top gap */
`;

const Name = styled.h1<{ color: string }>`
  font-size: 34px;
  font-weight: 800;
  margin: 0;
  color: ${(p) => p.color};
`;

const Role = styled.div`
  font-size: 18px;
  font-weight: 500;
  margin-top: 2px;
  margin-bottom: 8px; /* ⬅️ gap before PROFILE */
  color: #374151;
`;

/* ================= BODY ================= */

const Body = styled.div`
  display: grid;
  grid-template-columns: 70% 30%;
  column-gap: 24px;
`;

/* ================= LEFT ================= */

const Left = styled.div`
  padding-left: 0; /* 🔥 MAIN FIX */
  margin-left: 0;
`;

/* ================= RIGHT ================= */

const Right = styled.aside`
  font-size: 12px;
  line-height: 1.55;
  padding-left: 4px;
`;

// const InfoBlock = styled.div`
//   margin-bottom: 12px;

//   strong {
//     display: block;
//     font-weight: 600;
//     margin-bottom: 2px;
//   }

//   a {
//     color: inherit;
//     text-decoration: none;
//   }
// `;

/* ================= HELPERS ================= */

const normalize = (name: string = '') => name.toLowerCase().replace(/[^a-z+#]/g, '');

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
  'docker',
  'aws',
  'git',
  'linux',
  'mongodb',
  'postgresql',
  'mysql',
];

/* ================= TEMPLATE ================= */

export default function BrusselsTemplate() {
  const resume = useContext(StateContext);
  const theme = useThemes((s) => s.selectedTheme);

  if (!resume) return null;

  const { basics, skills, work, education } = resume;

  const technicalSkills = [
    ...(skills.languages || []).filter((s: any) => TECH_KEYWORDS.includes(normalize(s.name))),
    ...(skills.technologies || []),
    ...(skills.frameworks || []),
    ...(skills.tools || []),
  ];

  const spokenLanguages = (skills.languages || []).filter(
    (s: any) => !TECH_KEYWORDS.includes(normalize(s.name))
  );

  return (
    <Page>
      <Header>
        <Name color={theme.titleColor}>{basics.name}</Name>
        {basics.label && <Role>{basics.label}</Role>}
      </Header>

      <Body>
        {/* LEFT */}
        <Left>
          <Section title="Profile" titleColor={theme.titleColor}>
            <AboutMe summary={basics.summary} />
          </Section>

          <Section title="Employment History" titleColor={theme.titleColor}>
            <Work work={work} />
          </Section>

          <Section title="Education" titleColor={theme.titleColor}>
            <Education education={education} />
          </Section>
          <SectionValidator value={resume.awards}>
            <Section title="AWARDS" titleColor={theme.titleColor}>
              <Awards items={resume.awards || []} />
            </Section>
          </SectionValidator>
        </Left>

        {/* RIGHT */}
        <Right>
          {basics.location?.city && (
            <Section title="Location" titleColor={theme.titleColor}>
              {basics.location.city}
            </Section>
          )}

          {basics.email && (
            <Section title="Email" titleColor={theme.titleColor}>
              <a href={`mailto:${basics.email}`}>{basics.email}</a>
            </Section>
          )}

          {basics.phone && (
            <Section title="Phone" titleColor={theme.titleColor}>
              <a href={`tel:${basics.phone}`}>{basics.phone}</a>
            </Section>
          )}

          <Section title="Spoken Languages" titleColor={theme.titleColor}>
            <RatedSkills items={spokenLanguages} />
          </Section>

          <Section title="Technical Skills" titleColor={theme.titleColor}>
            <UnratedSkills items={technicalSkills} />
          </Section>
        </Right>
      </Body>
    </Page>
  );
}
