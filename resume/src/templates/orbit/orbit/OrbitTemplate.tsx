import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { StateContext } from '@/modules/builder/resume/ResumeLayout';
import { useThemes } from '@/stores/themes';
import { SectionValidator } from '@/helpers/common/components/ValidSectionRenderer';
import { ISkillItem } from '@/stores/skill.interface';

import BasicIntro from './components/BasicIntro';
import { Section } from './components/Section';
import RatedSkills from './components/RatedSkills';
import UnratedSkills from './components/UnratedSkills';
import AboutMe from './components/AboutMe';
import Work from './components/Work';
import { Education } from './components/Education';

/* ================= PAGE ================= */

const Page = styled.div`
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
`;

/* ================= BODY ================= */

const Body = styled.div`
  display: grid;
  grid-template-columns: 30% 70%;
`;

const Left = styled.div`
  padding: 18px;
`;

const Right = styled.div`
  padding: 18px 26px;
`;
/* ================= DETAILS LIST ================= */
const DetailsList = styled.div`
  line-height: 1.6;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const DetailLink = styled.a`
  color: #000;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: none;
  }
`;

/* ================= TEMPLATE ================= */

export default function OrbitTemplate() {
  const resume = useContext(StateContext);
  const theme = useThemes((s) => s.selectedTheme);

  if (!resume) return null;

  const { basics, skills, work, education } = resume;
  const linkedIn = basics.profiles?.find(
    (p: { network: string }) => p.network?.toLowerCase() === 'linkedin'
  );

  /* ---------- SKILL SPLIT (IMPORTANT) ---------- */

  /* normalize: HTML5 → html | CSS4 → css | JavaScript → javascript */
  const normalize = (name: string = '') => name.toLowerCase().replace(/[^a-z]/g, '');

  /* base technical keywords */
  const techBase = [
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
    'cplusplus',
  ];

  /* 🔍 is technical skill */
  const isTechnical = (skillName: string) => {
    const n = normalize(skillName);

    return techBase.some((tech) => n.startsWith(tech));
  };

  /* 🗣 SPOKEN LANGUAGES (ONLY real languages) */
  const spokenLanguages: ISkillItem[] = (skills.languages || []).filter(
    (l: ISkillItem) => !isTechnical(l.name)
  );

  /* 💻 TECHNICAL SKILLS */
  const technicalSkills: ISkillItem[] = [
    ...(skills.languages || []).filter((l: ISkillItem) => isTechnical(l.name)),
    ...(skills.technologies || []),
    ...(skills.frameworks || []),
    ...(skills?.libraries || []),
    ...(skills?.databases || []),
  ];

  return (
    <Page>
      {/* ===== TOP ===== */}
      <BasicIntro basics={basics} />

      {/* ===== BODY ===== */}
      <Body>
        {/* ===== LEFT ===== */}
        <Left>
          <Section title="Details" icon="○" titleColor={theme.titleColor}>
            <DetailsList>
              {basics.email && (
                <DetailItem>
                  ✉️
                  <DetailLink href={`mailto:${basics.email}`}>{basics.email}</DetailLink>
                </DetailItem>
              )}

              {basics.phone && (
                <DetailItem>
                  📞
                  <DetailLink href={`tel:${basics.phone}`}>{basics.phone}</DetailLink>
                </DetailItem>
              )}

              {linkedIn?.url && (
                <DetailItem>
                  🔗
                  <DetailLink href={linkedIn.url} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </DetailLink>
                </DetailItem>
              )}

              {basics.url && (
                <DetailItem>
                  🌐
                  <DetailLink href={basics.url} target="_blank" rel="noopener noreferrer">
                    Website
                  </DetailLink>
                </DetailItem>
              )}
            </DetailsList>
          </Section>

          <SectionValidator value={technicalSkills}>
            <Section title="Technical Skills" icon="○" titleColor={theme.titleColor}>
              <RatedSkills items={technicalSkills} />
            </Section>
          </SectionValidator>

          <SectionValidator value={spokenLanguages}>
            <Section title="Languages" icon="○" titleColor={theme.titleColor}>
              <UnratedSkills items={spokenLanguages} />
            </Section>
          </SectionValidator>
        </Left>

        {/* ===== RIGHT ===== */}
        <Right>
          <SectionValidator value={basics.summary}>
            <Section title="Profile" icon="👤" titleColor={theme.titleColor}>
              <AboutMe summary={basics.summary} />
            </Section>
          </SectionValidator>

          <SectionValidator value={work}>
            <Section title="Employment History" icon="💼" titleColor={theme.titleColor}>
              <Work work={work} />
            </Section>
          </SectionValidator>

          <SectionValidator value={education}>
            <Section title="Education" icon="🎓" titleColor={theme.titleColor}>
              <Education education={education} />
            </Section>
          </SectionValidator>
        </Right>
      </Body>
    </Page>
  );
}
