import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import { dateParser } from '@/helpers/utils';
import { SectionTitle } from '../atoms';

export const WorkSection = ({ experience, titleColor }: any) => {
    return (
        <div className="mb-8 font-sans">
            <SectionTitle label="Professional Experience" color={titleColor} />
            {experience.map((item: any, index: number) => (
                <div key={index} className="mb-6 last:mb-0 relative pl-6 border-l border-slate-100">
                    <div className="absolute w-2 h-2 bg-white border border-slate-300 rounded-full -left-[4.5px] top-1.5 transition-colors group-hover:border-slate-900"></div>
                    <div className="flex justify-between items-baseline mb-2">
                        <div>
                            <h4 className="text-lg font-bold text-slate-900 leading-tight">{item.name}</h4>
                            <p className="text-sm font-bold text-slate-500 tracking-tight uppercase mt-0.5">{item.position}</p>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                            {dateParser(item.startDate)} — {item.isWorkingHere ? 'PRESENT' : dateParser(item.endDate)}
                        </p>
                    </div>
                    <div className="text-[13px] leading-relaxed text-slate-600 prose prose-sm max-w-none prose-p:my-1 prose-li:my-0.5">
                        <HTMLRenderer htmlString={item.summary} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export const SkillsSection = ({ title, list, titleColor }: any) => {
    return (
        <div className="mb-8 font-sans">
            <SectionTitle label={title} color={titleColor} />
            <div className="flex flex-wrap gap-2">
                {list.map((item: any, index: number) => (
                    <span
                        key={index}
                        className="px-2.5 py-1 bg-white text-slate-600 text-[10px] font-black uppercase tracking-wider rounded border border-slate-200 hover:border-slate-400 transition-colors shadow-sm"
                    >
                        {item.name}
                    </span>
                ))}
            </div>
        </div>
    );
};
