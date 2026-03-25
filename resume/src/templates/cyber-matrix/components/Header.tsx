import { ProfilePhoto } from '@/modules/builder/resume/components/ProfilePhoto';
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
        <div className="flex flex-col mb-6 border-b border-slate-100 pb-4">
            <div className="flex justify-between items-start gap-8">
                <div className="flex-1 min-w-0">
                    <ProfileName name={name} color={themeColor} />
                    <h2 className="text-xl font-bold text-slate-400 mb-4 tracking-tight uppercase leading-tight">{label}</h2>

                    <div className="flex flex-wrap gap-x-8 gap-y-3 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <span className="text-slate-300">Email /</span> {email}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-300">Phone /</span> {phone}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-300">Location /</span> {city}
                        </div>
                    </div>
                </div>

                <div className="flex-shrink-0 flex flex-col items-center gap-4">
                    <div className="relative group">
                        <div className="absolute -inset-2 bg-slate-100 rounded-full scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300" />
                        <ProfilePhoto src={image} setPhoto={setImage} height="130px" width="130px" />
                    </div>
                    <div className="flex gap-2">
                        {profiles.map((profile: any) => {
                            const Icon = socialIcons.get(profile.network);
                            if (!Icon || !profile.url) return null;
                            return (
                                <a
                                    key={profile.network}
                                    href={profile.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 transition-colors hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900"
                                >
                                    <Icon className="h-4 w-4" />
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
