import { useContext } from 'react';
import { StateContext } from '@/modules/builder/resume/ResumeLayout';
import { useThemes } from '@/stores/themes';
import { useBasicDetails } from '@/stores/basic';
import { SectionValidator } from '@/helpers/common/components/ValidSectionRenderer';

import { Header } from './components/Header';
import { WorkSection, SkillsSection } from './components/InfoSections';
import { EducationSection, SummarySection } from './components/SecondarySections';
import { SectionTitle } from './atoms';
import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';

export default function CyberMatrixTemplate() {
    const resumeData = useContext(StateContext);
    const activeTheme = useThemes((state) => state.selectedTheme);
    const values = useBasicDetails((s) => s.values);
    const setImage = useBasicDetails((s) => s.setImage);

    if (!resumeData) return null;

    const { work, education, skills, volunteer, awards } = resumeData;
    const activities = (resumeData as any).activities;

    const techKeywords = [
        'react', 'sql', 'javascript', 'typescript', 'python', 'java', 'html', 'css', 'node',
        'angular', 'git', 'docker', 'aws', 'php', 'mongodb', 'c++', 'c#', 'spring', 'vue',
        'express', 'postgresql', 'redis', 'linux'
    ];

    const techSkills = [
        ...(skills.languages || []).filter((s: any) => techKeywords.includes(s.name.toLowerCase())),
        ...(skills.frameworks || []),
        ...(skills.technologies || []),
        ...(skills.practices || []),
        ...(skills.libraries || []),
        ...(skills.databases || []),
        ...(skills.tools || []),
    ];

    const softSkills = (skills.languages || []).filter(
        (s: any) => !techKeywords.includes(s.name.toLowerCase())
    );

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

            <div className="flex gap-12 print:block print:gap-0">
                {/* Main Content */}
                <div className="flex-[1.8] print:w-full print:mb-10">
                    <SectionValidator value={values.summary}>
                        <div className="print:break-inside-avoid">
                            <SummarySection summary={values.summary} titleColor={activeTheme.titleColor} />
                        </div>
                    </SectionValidator>

                    <SectionValidator value={work}>
                        <div className="print:break-inside-auto">
                            <WorkSection experience={work} titleColor={activeTheme.titleColor} />
                        </div>
                    </SectionValidator>

                    <SectionValidator value={volunteer}>
                        <div className="print:break-inside-avoid">
                            <SectionTitle label="Volunteer Work" color={activeTheme.titleColor} />
                            {volunteer.map((item: any, index: number) => (
                                <div key={index} className="mb-6 last:mb-0 relative pl-6 border-l border-slate-100">
                                    <div className="absolute w-2 h-2 bg-white border border-slate-300 rounded-full -left-[4.5px] top-1.5" />
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="text-md font-bold text-slate-900">{item.organization}</h4>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                            {item.startDate} — {item.endDate}
                                        </p>
                                    </div>
                                    <p className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-tight">{item.position}</p>
                                    <div className="text-[13px] text-slate-600 leading-relaxed font-medium">
                                        {item.summary}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionValidator>

                    <SectionValidator value={education}>
                        <div className="print:break-inside-avoid">
                            <EducationSection education={education} titleColor={activeTheme.titleColor} />
                        </div>
                    </SectionValidator>
                </div>

                {/* Sidebar */}
                <div className="flex-1 print:w-full">
                    <SectionValidator value={techSkills}>
                        <div className="print:break-inside-avoid">
                            <SkillsSection
                                title="Technical Stack"
                                list={techSkills}
                                titleColor={activeTheme.titleColor}
                            />
                        </div>
                    </SectionValidator>

                    {softSkills.length > 0 && (
                        <SectionValidator value={softSkills}>
                            <div className="print:break-inside-avoid">
                                <SkillsSection
                                    title="Languages"
                                    list={softSkills}
                                    titleColor={activeTheme.titleColor}
                                />
                            </div>
                        </SectionValidator>
                    )}

                    {activities && (
                        <div className="mb-8 font-sans print:break-inside-avoid">
                            {activities.involvements && (
                                <>
                                    <SectionTitle label="Involvements" color={activeTheme.titleColor} />
                                    <div className="text-[12px] text-slate-600 mb-6 prose prose-sm max-w-none prose-ul:pl-4 prose-li:my-1">
                                        <HTMLRenderer htmlString={activities.involvements} />
                                    </div>
                                </>
                            )}
                            {activities.achievements && (
                                <>
                                    <SectionTitle label="Key Accomplishments" color={activeTheme.titleColor} />
                                    <div className="text-[12px] text-slate-600 prose prose-sm max-w-none prose-ul:pl-4 prose-li:my-1">
                                        <HTMLRenderer htmlString={activities.achievements} />
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Add a placeholder for Certifications if needed or reuse Awards */}
                    {awards.length > 0 && (
                        <div className="mb-8 font-sans print:break-inside-avoid">
                            <SectionTitle label="Awards & Certs" color={activeTheme.titleColor} />
                            {awards.map((award: any, i: number) => (
                                <div key={i} className="mb-4">
                                    <p className="text-sm font-bold text-slate-900 leading-tight">{award.title}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{award.awarder}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
