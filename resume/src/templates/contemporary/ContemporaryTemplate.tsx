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
import Work from './components/Work';
import Courses from './components/Courses';
import { useThemes } from '@/stores/themes';

const ResumeContainer = styled.div<{ bgColor: string; fontColor: string }>`
  display: flex;
  background-color: ${(props) => props.bgColor || 'white'};
  color: ${(props) => props.fontColor || '#1a1a1a'};
  width: 210mm;
  height: 297mm;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
  position: relative;

  @media print {
    margin: 0;
    width: 210mm;
    height: 297mm;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

const Sidebar = styled.aside`
  flex: 1;
  background-color: #fcfdfe;
  padding: 30px 25px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  border-right: 1px solid #f0f0f0;
`;

const MainColumn = styled.main`
  flex: 2;
  padding: 30px 40px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ProfileBlobWrapper = styled.div`
  position: relative;
  width: 110px;
  height: 110px;
  margin: 0 auto 10px auto;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    background-color: #f0f0f0;
    border: 3px solid white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const ContactList = styled.div<{ accentColor: string }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 11.5px;
  color: #4b5563;

  .contact-item {
    display: flex;
    align-items: center;
    gap: 8px;

    span {
      /* Apply the theme color to the contact icons/bullet points */
      color: ${(props) => props.accentColor};
      font-weight: 700;
      width: 14px;
      text-align: center;
    }
  }
`;

export default function ContemporaryTemplate() {
  const resumeData = useContext(StateContext);
  const activeTheme = useThemes((state) => state.selectedTheme);
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
  ];

  const techFromLanguages = (skills.languages || []).filter((s: any) =>
    techKeywords.includes((s.name || '').toLowerCase())
  );

  const spokenLanguages = (skills.languages || []).filter(
    (s: any) => !techKeywords.includes((s.name || '').toLowerCase())
  );

  const allTechnicalSkills = [
    ...techFromLanguages,
    ...(skills.frameworks || []),
    ...(skills.technologies || []),
    ...(skills.libraries || []),
    ...(skills.databases || []),
    ...(skills.tools || []),
  ];

  const courseData =
    activities?.certifications || activities?.courses || resumeData?.certificates || '';

  return (
    <ResumeContainer bgColor={activeTheme.backgroundColor} fontColor={activeTheme.fontColor}>
      {/* LEFT SIDEBAR */}
      <Sidebar>
        {basics.image && (
          <ProfileBlobWrapper>
            <img src={basics.image} alt={basics.name} />
          </ProfileBlobWrapper>
        )}

        <Section title="CONTACTS" icon="✉️" titleColor={activeTheme.titleColor}>
          <ContactList accentColor={activeTheme.titleColor}>
            {basics.email && <a href={`mailto:${basics.email}`}>✉️ {basics.email}</a>}
            {basics.url && (
              <div className="contact-item">
                <span>🔗</span> {basics.url.replace('https://', '')}
              </div>
            )}
            {basics.location?.city && (
              <div className="contact-item">
                <span>📍</span> {basics.location.city} {basics.location.region}
              </div>
            )}
          </ContactList>
        </Section>

        <SectionValidator value={allTechnicalSkills}>
          <Section title="SKILLS" icon="🚀" titleColor={activeTheme.titleColor}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                columnGap: '8px',
                rowGap: '4px',
                fontSize: '11px',
                color: '#4b5563',
              }}
            >
              {allTechnicalSkills.map((skill: any, i: number) => (
                <React.Fragment key={i}>
                  <span style={{ fontWeight: 600 }}>{skill.name}</span>
                  {i < allTechnicalSkills.length - 1 && <span style={{ color: '#cbd5e1' }}>•</span>}
                </React.Fragment>
              ))}
            </div>
          </Section>
        </SectionValidator>

        <SectionValidator value={activities.achievements}>
          <Section title="ACHIEVEMENTS" icon="🚩" titleColor={activeTheme.titleColor}>
            <Achievements data={activities.achievements} />
          </Section>
        </SectionValidator>

        <SectionValidator value={activities.involvements}>
          <Section title="PASSIONS" icon="❤️" titleColor={activeTheme.titleColor}>
            <Involvement data={activities.involvements} />
          </Section>
        </SectionValidator>
      </Sidebar>

      {/* MAIN RIGHT COLUMN */}
      <MainColumn>
        <BasicIntro basics={basics} />

        <SectionValidator value={basics.summary}>
          <Section title="SUMMARY" icon="👤" titleColor={activeTheme.titleColor}>
            <AboutMe summary={basics.summary} />
          </Section>
        </SectionValidator>

        <SectionValidator value={work}>
          <Section title="EXPERIENCE" icon="💼" titleColor={activeTheme.titleColor}>
            <Work work={work} />
          </Section>
        </SectionValidator>

        <SectionValidator value={education}>
          <Section title="EDUCATION" icon="🎓" titleColor={activeTheme.titleColor}>
            <Education education={education} />
          </Section>
        </SectionValidator>

        <SectionValidator value={courseData}>
          <Section title="TRAINING" icon="📜" titleColor={activeTheme.titleColor}>
            <Courses data={courseData} />
          </Section>
        </SectionValidator>

        <SectionValidator value={spokenLanguages}>
          <Section title="LANGUAGES" icon="🌐" titleColor={activeTheme.titleColor}>
            <RatedSkills items={spokenLanguages} />
          </Section>
        </SectionValidator>
      </MainColumn>
    </ResumeContainer>
  );
}
