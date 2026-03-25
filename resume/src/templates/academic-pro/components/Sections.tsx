import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import { dateParser } from '@/helpers/utils';
import { SectionTitle } from '../atoms';

export const InfoSection = ({ title, items, titleColor, type }: any) => {
    return (
        <div className="mb-10 font-sans">
            <SectionTitle label={title} color={titleColor} />
            {items.map((item: any, index: number) => (
                <div key={index} className="mb-6 last:mb-0">
                    <div className="flex justify-between items-baseline mb-2">
                        <h4 className="text-xl font-bold text-slate-900 leading-tight">
                            {type === 'education' ? item.institution : item.name}
                        </h4>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                            {dateParser(item.startDate)} — {item.isWorkingHere ? 'PRESENT' : dateParser(item.endDate)}
                        </span>
                    </div>

                    <div className="flex justify-between items-baseline text-sm mb-3">
                        <p className="font-bold text-slate-500 uppercase tracking-tight">
                            {type === 'education' ? `${item.studyType} / ${item.area}` : item.position}
                        </p>
                        {type === 'education' && item.score && (
                            <span className="text-slate-400 font-black text-[10px] uppercase tracking-wider">GPA: {item.score}</span>
                        )}
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
        <div className="mb-10 font-sans">
            <SectionTitle label={title} color={titleColor} />
            <div className="flex flex-wrap gap-x-8 gap-y-3">
                {list.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 group">
                        <div className="w-1.5 h-1.5 rounded-full border border-slate-300 transition-colors group-hover:bg-slate-900 group-hover:border-slate-900" style={{ borderColor: titleColor }} />
                        <span className="text-slate-700 text-[11px] font-black uppercase tracking-widest">{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
