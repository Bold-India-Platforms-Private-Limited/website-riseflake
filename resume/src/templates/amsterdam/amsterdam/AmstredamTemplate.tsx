import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { StateContext } from '@/modules/builder/resume/ResumeLayout';
import { useThemes } from '@/stores/themes';
import { SectionValidator } from '@/helpers/common/components/ValidSectionRenderer';

import BasicIntro from './components/BasicIntro';
import AboutMe from './components/AboutMe';
import Work from './components/Work';
import { Education } from './components/Education';
import RatedSkills from './components/RatedSkills';
import UnratedSkills from './components/UnratedSkills';
import { Section } from './components/Section';
import Awards from './components/Awards';

/* ================= PAGE ================= */

const Page = styled.div<{ bg: string }>`
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  background: ${(p) => p.bg};

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

const Body = styled.div`
  display: grid;
  grid-template-columns: 30% 70%;
  margin-top: -12px; /* 🔥 CONTENT UP */
  min-height: calc(297mm - 110px);
`;

/* ================= LEFT / RIGHT ================= */

const Left = styled.aside`
  background: #f3f4f6;
  padding: 24px 18px;
`;

const Right = styled.main`
  padding: 24px 28px;
  break-inside: avoid;
  page-break-inside: avoid;
`;

/* ================= HELPERS ================= */

/** normalize tech names */
const normalize = (name: string = '') => name.toLowerCase().replace(/[^a-z+#]/g, '');

/** all known tech keywords */
const TECH_KEYWORDS = [
  'html',
  'css',
  'javascript',
  'typescript',
  'react',
  'angular',
  'vue',
  'node',
  'java',
  'python',
  'sql',
  'c',
  'c++',
  'c#',
  'spring',
  'springboot',
  'mongodb',
  'postgresql',
  'mysql',
  'aws',
  'docker',
  'git',
  'linux',
];

/* ================= TEMPLATE ================= */

export default function AmstredamTemplate() {
  const resume = useContext(StateContext);
  const theme = useThemes((s) => s.selectedTheme);

  if (!resume) return null;

  const { basics, work, education, skills } = resume;

  /* ================= SKILLS FIX ================= */

  /** 🗣 ONLY spoken languages (NO JS / HTML / CSS) */
  const spokenLanguages = (skills.languages || []).filter(
    (l: any) => !TECH_KEYWORDS.includes(normalize(l.name))
  );

  /** 💻 ALL technical skills (EVERYTHING) */
  const technicalSkills = [
    ...(skills.languages || []).filter((l: any) => TECH_KEYWORDS.includes(normalize(l.name))),
    ...(skills.technologies || []),
    ...(skills.frameworks || []),
    ...(skills.libraries || []),
    ...(skills.tools || []),
  ];

  return (
    <Page bg={theme.backgroundColor}>
      {/* ================= HEADER ================= */}
      <BasicIntro basics={basics} />

      {/* ================= BODY ================= */}
      <Body>
        {/* ========== LEFT (30%) ========== */}
        <Left>
          <Section title="DETAILS" titleColor={theme.titleColor}>
            <div style={{ fontSize: '12px', lineHeight: 1.5, color: '#1f2937' }}>
              {basics.email && (
                <>
                  <div>
                    <strong>Email</strong>
                  </div>
                  <a
                    href={`mailto:${basics.email}`}
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    {basics.email}
                  </a>
                </>
              )}

              {basics.location?.city && (
                <>
                  <div style={{ marginTop: 10 }}>
                    <strong>Location</strong>
                  </div>
                  <div>{basics.location.city}</div>
                </>
              )}

              {basics.phone && (
                <>
                  <div style={{ marginTop: 10 }}>
                    <strong>Phone</strong>
                  </div>
                  <a
                    href={`tel:${basics.phone}`}
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    {basics.phone}
                  </a>
                </>
              )}
            </div>
          </Section>

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

        {/* ========== RIGHT (70%) ========== */}
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
          <SectionValidator value={resume.awards}>
            <Section title="AWARDS" titleColor={theme.titleColor}>
              <Awards items={resume.awards || []} />
            </Section>
          </SectionValidator>
        </Right>
      </Body>
    </Page>
  );
}
