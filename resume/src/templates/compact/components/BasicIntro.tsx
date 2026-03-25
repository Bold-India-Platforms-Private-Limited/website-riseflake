import { IBasics } from '@/stores/index.interface';
import styled from '@emotion/styled';

const IntroContainer = styled.div`
  position: relative;
  margin-bottom: 12px;
  padding-bottom: 0px;
`;

const Name = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0;
  letter-spacing: -0.5px;
  text-transform: uppercase;
`;

const Label = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #27345c;
  margin-top: 2px;
  padding-bottom: 4px;
`;

const ContactWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-top: 6px;
  font-size: 11px;
  color: #555;
  span,
  a {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #555;
    text-decoration: none;
    white-space: nowrap;

    &:hover {
      color: #27345c;
    }
  }
`;

export default function BasicIntro({ basics }: { basics: IBasics }) {
  return (
    <IntroContainer>
      <Name>{basics.name}</Name>
      <Label>{basics.label}</Label>

      <ContactWrapper>
        {basics.email && (
          <a href={`mailto:${basics.email}`} className="contact-link">
            ✉️ {basics.email}
          </a>
        )}

        {basics.phone && <span>📞 {basics.phone}</span>}

        {basics.url && (
          <a href={basics.url} target="_blank" rel="noreferrer">
            🔗 {basics.url.replace(/^https?:\/\/(www\.)?/, '')}
          </a>
        )}

        {basics.location?.city && (
          <span>
            📍 {basics.location.city} {basics.location.region}
          </span>
        )}
      </ContactWrapper>
    </IntroContainer>
  );
}
