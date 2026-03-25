import { BasicIntro } from './components/BasicIntro';
import { EducationSection } from './components/Education';
import { VolunteerSection } from './components/Volunteer';
import { Objective } from './components/Objective';
import { SkillsSection } from './components/Skills';
import { SummarySection } from './components/Summary';
import { WorkSection } from './components/Work';
import { AwardSection } from './components/Awards';
import { useContext } from 'react';
import { StateContext } from '@/modules/builder/resume/ResumeLayout';
import { SectionValidator } from '@/helpers/common/components/ValidSectionRenderer';
import { useThemes } from '@/stores/themes';
import { useBasicDetails } from '@/stores/basic';

export default function MordernTemplate() {
  const resumeData = useContext(StateContext);
  const activeTheme = useThemes((state) => state.selectedTheme);
  const values = useBasicDetails((s) => s.values);
  const setImage = useBasicDetails((s) => s.setImage);
  if (!resumeData) return null;

  const { work, education, skills, awards, volunteer } = resumeData;

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

  const programmingSkills = [
    ...(skills.languages || []).filter((s: any) => techKeywords.includes(s.name.toLowerCase())),
    ...(skills.frameworks || []),
    ...(skills.technologies || []),
    ...(skills.libraries || []),
    ...(skills.databases || []),
    ...(skills.tools || []),
  ];

  const spokenLanguages = (skills.languages || []).filter(
    (s: any) => !techKeywords.includes(s.name.toLowerCase())
  );

  return (
    <div className="p-2 bg-white min-h-full">
      <BasicIntro
        name={values.name}
        label={values.label}
        url={values.url}
        email={values.email}
        city={values.location.city}
        phone={values.phone}
        image={values.image}
        setImage={setImage}
        profiles={values.profiles}
        themeColor={activeTheme.titleColor}
      />

      <div className="flex">
        {/* Main Column */}
        <div className="basis-[60%] p-3 border-r border-gray-100">
          <SectionValidator value={values.summary}>
            <SummarySection summary={values.summary} titleColor={activeTheme.titleColor} />
          </SectionValidator>

          <SectionValidator value={work}>
            <WorkSection experience={work} titleColor={activeTheme.titleColor} />
          </SectionValidator>

          <SectionValidator value={awards}>
            <AwardSection awardsReceived={awards} titleColor={activeTheme.titleColor} />
          </SectionValidator>

          <SectionValidator value={spokenLanguages}>
            <SkillsSection
              title="Languages"
              list={spokenLanguages}
              titleColor={activeTheme.titleColor}
            />
          </SectionValidator>
        </div>

        {/* Sidebar Column */}
        <div className="basis-[40%] p-3">
          <SectionValidator value={values.objective}>
            <Objective objective={values.objective} titleColor={activeTheme.titleColor} />
          </SectionValidator>

          {/* Render grouped Programming/Tech skills in Sidebar */}
          <SectionValidator value={programmingSkills}>
            <SkillsSection
              title="Skills & Expertise"
              list={programmingSkills}
              titleColor={activeTheme.titleColor}
            />
          </SectionValidator>

          <SectionValidator value={education}>
            <EducationSection education={education} titleColor={activeTheme.titleColor} />
          </SectionValidator>

          <SectionValidator value={volunteer}>
            <VolunteerSection volunteer={volunteer} titleColor={activeTheme.titleColor} />
          </SectionValidator>
        </div>
      </div>
    </div>
  );
}
