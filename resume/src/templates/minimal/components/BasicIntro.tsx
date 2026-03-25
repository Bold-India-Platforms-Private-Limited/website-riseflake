import { IBasics } from '@/stores/index.interface';
import styled from '@emotion/styled';
import { useThemes } from '@/stores/themes';
import { ProfileImage } from '@/helpers/common/components/ProfileImage';

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IntroWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Name = styled.h1<{ nameColor: string }>`
  font-size: 28px;
  font-weight: 800;
  color: ${(props) => props.nameColor}; /* This will change with theme */
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1.5px;
`;

const Label = styled.div`
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  color: #374151; /* Hardcoded dark grey for the Job Title */
  letter-spacing: 1px;
`;

const ContactWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  column-gap: 18px;
  row-gap: 6px;
  margin-top: 8px;
  font-size: 10.5px;
  color: #4b5563; /* Hardcoded grey for contact info */

  span,
  a {
    display: flex;
    align-items: center;
    gap: 5px;
    color: inherit;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

export default function BasicIntro({ basics }: { basics: IBasics }) {
  const activeTheme = useThemes((state) => state.selectedTheme);

  const linkedinProfile = basics.profiles?.find((p) => p.network.toLowerCase() === 'linkedin');
  const linkedinUrl = linkedinProfile?.url || '';

  const getCorrectUrl = (url: string) => (url.startsWith('http') ? url : `https://${url}`);

  return (
    <HeaderWrapper>
      {basics.image && (
        <div>
          <ProfileImage src={basics.image} height="90px" width="90px" />
        </div>
      )}

      <IntroWrapper>
        <Name nameColor={activeTheme.titleColor}>{basics.name}</Name>
        <Label>{basics.label}</Label>

        <ContactWrapper>
          {basics.email && <a href={`mailto:${basics.email}`}>✉️ {basics.email}</a>}

          {basics.phone && <a href={`tel:${basics.phone.replace(/\s/g, '')}`}>📞 {basics.phone}</a>}

          {basics.location?.city && (
            <span>
              📍 {basics.location.city}
              {basics.location.region ? `, ${basics.location.region}` : ''}
            </span>
          )}

          {linkedinUrl && (
            <a href={getCorrectUrl(linkedinUrl)} target="_blank" rel="noreferrer">
              🔗 LinkedIn
            </a>
          )}
        </ContactWrapper>
      </IntroWrapper>
    </HeaderWrapper>
  );
}
