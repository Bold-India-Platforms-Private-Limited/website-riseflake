import { useContext } from 'react';
import { StateContext } from '@/modules/builder/resume/ResumeLayout';
import { useThemes } from '@/stores/themes';
import { useBasicDetails } from '@/stores/basic';
import { SectionValidator } from '@/helpers/common/components/ValidSectionRenderer';

import { Header } from './components/Header';
import { InfoSection, SkillsSection } from './components/Sections';
import { SectionTitle } from './atoms';
import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';

export default function AcademicProTemplate() {
    const resumeData = useContext(StateContext);
    const activeTheme = useThemes((state) => state.selectedTheme);
    const values = useBasicDetails((s) => s.values);
    const setImage = useBasicDetails((s) => s.setImage);

    if (!resumeData) return null;

    const { work, education, skills, awards, volunteer } = resumeData;
    const activities = (resumeData as any).activities;

    // Group skills for academic focus
    const techSkills = [
        ...(skills.languages || []),
        ...(skills.frameworks || []),
        ...(skills.technologies || []),
        ...(skills.practices || []),
    ];

    return (
        <div className="pt-4 px-10 pb-8 bg-white h-full print:h-auto font-sans print:pt-4 print:px-8">
            <Header
                name={values.name}
                label={values.label}
                email={values.email}
                phone={values.phone}
                city={values.location.city}
                image={values.image}
                profiles={values.profiles}
                themeColor={activeTheme.titleColor}
                setImage={setImage}
            />

            {/* Main Content - Single Column but expansive for Senior Impact */}
            <div className="w-full">
                <SectionValidator value={values.summary}>
                    <div className="mb-10 font-sans print:break-inside-avoid">
                        <SectionTitle label="Professional Summary" color={activeTheme.titleColor} />
                        <div className="text-[14px] text-slate-600 leading-relaxed font-medium">
                            <HTMLRenderer htmlString={values.summary} />
                        </div>
                    </div>
                </SectionValidator>

                <SectionValidator value={education}>
                    <div className="print:break-inside-avoid">
                        <InfoSection
                            title="Education"
                            items={education}
                            titleColor={activeTheme.titleColor}
                            type="education"
                        />
                    </div>
                </SectionValidator>

                <SectionValidator value={techSkills}>
                    <div className="print:break-inside-avoid">
                        <SkillsSection
                            title="Technical Expertise"
                            list={techSkills}
                            titleColor={activeTheme.titleColor}
                        />
                    </div>
                </SectionValidator>

                <SectionValidator value={work}>
                    <div className="print:break-inside-auto">
                        <InfoSection
                            title="Professional Experience"
                            items={work}
                            titleColor={activeTheme.titleColor}
                            type="work"
                        />
                    </div>
                </SectionValidator>

                <SectionValidator value={volunteer}>
                    <div className="print:break-inside-avoid">
                        <InfoSection
                            title="Community & Volunteer Work"
                            items={volunteer.map((v: any) => ({ ...v, name: v.organization }))}
                            titleColor={activeTheme.titleColor}
                            type="work"
                        />
                    </div>
                </SectionValidator>

                {activities && (
                    <div className="mb-10 font-sans print:break-inside-avoid">
                        {activities.involvements && (
                            <>
                                <SectionTitle label="Involvements" color={activeTheme.titleColor} />
                                <div className="text-[13px] text-slate-600 mb-8 prose prose-sm max-w-none prose-ul:pl-5 prose-li:my-1">
                                    <HTMLRenderer htmlString={activities.involvements} />
                                </div>
                            </>
                        )}
                        {activities.achievements && (
                            <>
                                <SectionTitle label="Key Accomplishments" color={activeTheme.titleColor} />
                                <div className="text-[13px] text-slate-600 prose prose-sm max-w-none prose-ul:pl-5 prose-li:my-1">
                                    <HTMLRenderer htmlString={activities.achievements} />
                                </div>
                            </>
                        )}
                    </div>
                )}

                {awards.length > 0 && (
                    <SectionValidator value={awards}>
                        <div className="print:break-inside-avoid">
                            <InfoSection
                                title="Key Projects & Achievements"
                                items={awards}
                                titleColor={activeTheme.titleColor}
                                type="work"
                            />
                        </div>
                    </SectionValidator>
                )}
            </div>
        </div>
    );
}
