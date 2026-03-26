'use client';

import { BsGlobe } from 'react-icons/bs';
import { ProfileContact } from '../atoms/ProfileContact';
import { ProfilePhoto } from '@/modules/builder/resume/components/ProfilePhoto';
import { ProfileName } from '../atoms/ProfileName';
import { SectionSubtitle } from '../atoms/SectionSubtitle';
import { IProfiles } from 'src/stores/basic.interface';
import { socialIcons } from 'src/helpers/icons';
import { useMemo } from 'react';
import { withBasePath } from '@/utils/withBasePath';

function SocialIcons({ profiles, color }: { profiles: IProfiles[]; color: string }) {
  return (
    <div className="social-icons flex">
      {profiles.map((profile) => {
        const Icon = socialIcons.get(profile.network);
        if (!Icon || !profile.url) return null;
        return (
          <a
            key={profile.network}
            href={profile.url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2"
          >
            <Icon className="h-5 w-5 bg-white" style={{ color }} />
          </a>
        );
      })}
    </div>
  );
}

export const BasicIntro = ({
  name,
  label,
  url,
  email,
  phone,
  city,
  image,
  setImage,
  profiles = [],
  themeColor,
}: {
  name: string;
  label: string;
  url: string;
  email: string;
  phone: string;
  city: string;
  image: string;
  setImage: (url: string) => void;
  profiles?: IProfiles[];
  themeColor: string;
}) => {
  const isProfileLinkAvailable = useMemo(
    () => !!profiles?.some((profile) => profile.url) && !image,
    [profiles, image]
  );

  return (
    <div
      className={`flex justify-between ${
        isProfileLinkAvailable ? 'items-end' : 'items-center'
      } p-2`}
    >
      <div>
        <ProfileName name={name} />
        <SectionSubtitle label={label} />
        <div className="flex gap-3">
          <ProfileContact text={phone} />
          <ProfileContact text={email} />
          <ProfileContact text={city} />
          {url && (
            <div className="flex gap-2 ml-2 items-center">
              <BsGlobe />
              <ProfileContact text={url} />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-end gap-2">
        <ProfilePhoto
          key={image}
          src={image}
          setPhoto={setImage}
          height="100px"
          width="100px"
        />

        {isProfileLinkAvailable && <SocialIcons profiles={profiles} color={themeColor} />}
      </div>
    </div>
  );
};
