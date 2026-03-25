import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import { SectionTitle } from '../atoms';

export const EducationSection = ({ education, titleColor }: any) => {
    return (
        <div className="mb-8 font-sans">
            <SectionTitle label="Education" color={titleColor} />
            {education.map((item: any, index: number) => (
                <div key={index} className="mb-4 last:mb-0">
                    <div className="flex justify-between items-baseline">
                        <h4 className="text-md font-bold text-slate-900">{item.institution}</h4>
                        <p className="text-[10px] font-black text-slate-400 tracking-widest">{item.score}</p>
                    </div>
                    <p className="text-sm font-bold text-slate-500 mt-0.5 tracking-tight uppercase">
                        {item.studyType} <span className="text-slate-300 mx-1">/</span> {item.area}
                    </p>
                </div>
            ))}
        </div>
    );
};

export const SummarySection = ({ summary, titleColor }: any) => {
    return (
        <div className="mb-8 font-sans">
            <SectionTitle label="Professional Summary" color={titleColor} />
            <div className="text-[13px] text-slate-600 leading-relaxed font-medium">
                <HTMLRenderer htmlString={summary} />
            </div>
        </div>
    );
};
