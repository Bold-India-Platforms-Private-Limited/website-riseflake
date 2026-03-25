import { IBasics } from '@/stores/index.interface';
import styled from '@emotion/styled';

const IntroWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Name = styled.h1`
  font-size: 30px;
  font-weight: 800;
  color: white;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Label = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: white;
  margin: 0;
  letter-spacing: 0.5px;
`;

const ContactWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  column-gap: 15px;
  row-gap: 4px;
  align-items: center;
  margin-top: 6px;
  font-size: 11.5px;
  font-weight: 500;
  position: relative;
  z-index: 50;

  span,
  a {
    display: flex;
    align-items: center;
    gap: 4px;
    color: white;
    text-decoration: none;
    opacity: 0.9;
    /* Ensures the link captures the click */
    pointer-events: auto !important;
    cursor: pointer !important;
    position: relative;
    z-index: 60;
  }

  a:hover {
    opacity: 1;
    text-decoration: underline;
  }

  .icon {
    font-size: 13px;
    opacity: 0.8;
  }
`;

export default function BasicIntro({ basics }: { basics: IBasics }) {
  const linkedinProfile = basics.profiles?.find((p) => p.network === 'linkedin');
  const linkedinUrl = linkedinProfile?.url || '';
  const getCorrectUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  return (
    <IntroWrapper>
      <Name>{basics.name}</Name>
      <Label>{basics.label}</Label>

      <ContactWrapper>
        {basics.email && (
          <a href={`mailto:${basics.email.trim()}`}>
            <span className="icon">✉️</span> {basics.email}
          </a>
        )}

        {linkedinUrl && (
          <a href={getCorrectUrl(linkedinUrl)} target="_blank" rel="noopener noreferrer">
            <span className="icon">🔗</span> LinkedIn
          </a>
        )}

        {basics.location?.city && (
          <span>
            <span className="icon">📍</span> {basics.location.city} {basics.location.region}
          </span>
        )}

        {basics.phone && (
          <a href={`tel:${basics.phone.replace(/\s/g, '')}`}>
            <span className="icon">📞</span> {basics.phone}
          </a>
        )}
      </ContactWrapper>
    </IntroWrapper>
  );
}
