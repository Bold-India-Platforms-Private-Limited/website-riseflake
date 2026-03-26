import { ProfilePhoto } from '@/modules/builder/resume/components/ProfilePhoto';
import { withBasePath } from '@/utils/withBasePath';
import { socialIcons } from 'src/helpers/icons';
import { ProfileName } from '../atoms';

export const Header = ({
    name,
    label,
    email,
    phone,
    city,
    image,
    profiles,
    themeColor,
    setImage,
}: any) => {
    return (
        <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4 gap-10">
            <div className="flex-1 min-w-0">
                <ProfileName name={name} color={themeColor} />
                <h2 className="text-2xl font-bold text-slate-300 mb-2 tracking-tight uppercase leading-tight">{label}</h2>

                <div className="flex flex-wrap gap-x-8 gap-y-2 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-300">LOC /</span> {city}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-slate-300">TEL /</span> {phone}
                    </div>
                    <div className="flex items-center gap-2 underline decoration-slate-200 decoration-2 underline-offset-4 pointer-events-none">
                        <span className="text-slate-300">EML /</span> {email}
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-8">
                    {profiles.map((profile: any) => {
                        const Icon = socialIcons.get(profile.network);
                        if (!Icon || !profile.url) return null;
                        return (
                            <a
                                key={profile.network}
                                href={profile.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-slate-900 transition-colors tracking-widest uppercase"
                            >
                                <Icon className="h-4 w-4" style={{ color: themeColor }} />
                                {profile.network}
                            </a>
                        );
                    })}
                </div>
            </div>

            {image && (
                <div className="flex-shrink-0 relative group">
                    <div className="absolute -inset-2 bg-slate-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                    <ProfilePhoto src={withBasePath(image)} setPhoto={setImage} height="140px" width="140px" />
                </div>
            )}
        </div>
    );
};
