import { IBasics } from '@/stores/index.interface';
import styled from '@emotion/styled';

const IntroContainer = styled.div`
  text-align: center;
  margin-bottom: 22px;
`;

const Name = styled.h1`
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin: 0;
  text-transform: uppercase;
`;

const Label = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-top: 4px;
`;

const LongDivider = styled.div`
  width: 140px;
  height: 2px;
  background: #27345c;
  margin: 10px auto 12px;
`;

const ContactBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  color: #555;

  a {
    color: inherit;
    text-decoration: none;
    font-weight: 400; /* values normal */
  }
`;

const ContactRow = styled.div`
  display: flex;
  gap: 4px;
`;

const LabelText = styled.span`
  font-weight: 700; /* 🔥 LABEL BOLD */
  color: #374151;
`;

const ValueText = styled.span`
  font-weight: 400; /* value normal */
`;

const SmallDivider = styled.div`
  width: 40px;
  height: 2px;
  background: #27345c;
  margin: 10px auto 0;
`;

export default function BasicIntro({ basics }: { basics: IBasics }) {
  return (
    <IntroContainer>
      {/* NAME */}
      <Name>{basics.name}</Name>

      {/* PROFESSION */}
      {basics.label && <Label>{basics.label}</Label>}

      {/* LONG CENTER LINE */}
      <LongDivider />

      {/* CONTACT DETAILS */}
      <ContactBlock>
        {basics.email && (
          <ContactRow>
            <LabelText>Email :</LabelText>
            <a href={`mailto:${basics.email}`}>{basics.email}</a>
          </ContactRow>
        )}

        {basics.phone && (
          <ContactRow>
            <LabelText>Phone :</LabelText>
            <a href={`tel:${basics.phone}`}>{basics.phone}</a>
          </ContactRow>
        )}

        {basics.location?.city && (
          <ContactRow>
            <LabelText>Location :</LabelText>
            <ValueText>{basics.location.city}</ValueText>
          </ContactRow>
        )}

        {basics.url && (
          <ContactRow>
            <LabelText>Website :</LabelText>
            <a
              href={basics.url.startsWith('http') ? basics.url : `https://${basics.url}`}
              target="_blank"
              rel="noreferrer"
            >
              {basics.url.replace(/^https?:\/\//, '')}
            </a>
          </ContactRow>
        )}
      </ContactBlock>

      {/* SMALL CENTER LINE */}
      <SmallDivider />
    </IntroContainer>
  );
}
