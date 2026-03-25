// import { IBasics } from '@/stores/index.interface';
// import styled from '@emotion/styled';
// import { useThemes } from '@/stores/themes';

// const IntroContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 4px;
//   margin-bottom: 18px;
// `;

// const Name = styled.h1<{ titleColor?: string }>`
//   font-family: 'Playfair Display', serif;
//   font-size: 30px;
//   font-weight: 700;
//   color: ${(props) => props.titleColor || '#1a1a1a'};
//   margin: 0;
//   text-transform: uppercase;
//   letter-spacing: 1px;
//   transition: color 0.3s ease;
// `;

// const Headline = styled.div<{ titleColor?: string }>`
//   font-family: 'Inter', sans-serif;
//   font-size: 13px;
//   font-weight: 600;
//   color: ${(props) => props.titleColor || '#00796b'};
//   display: flex;
//   flex-wrap: wrap;
//   gap: 6px;
//   transition: color 0.3s ease;

//   span:not(:last-child)::after {
//     content: '|';
//     margin-left: 6px;
//     /* Uses the theme color for the pipe separator with some transparency */
//     color: ${(props) => props.titleColor || '#00796b'};
//     opacity: 0.4;
//   }
// `;

// const ContactRow = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   column-gap: 12px;
//   row-gap: 4px;
//   margin-top: 4px;
//   font-size: 11.5px;
//   color: #666;

//   span,
//   a {
//     display: flex;
//     align-items: center;
//     gap: 3px;
//     text-decoration: none;
//     color: inherit;
//   }
// `;

// export default function BasicIntro({ basics }: { basics: IBasics }) {
//   const activeTheme = useThemes((state) => state.selectedTheme);

//   return (
//     <IntroContainer>
//       <Name titleColor={activeTheme.titleColor}>{basics.name}</Name>

//       <Headline titleColor={activeTheme.titleColor}>
//         {basics.label.split('|').map((part, index) => (
//           <span key={index}>{part.trim()}</span>
//         ))}
//       </Headline>

//       <ContactRow>
//         {basics.email && (
//           <a href={`mailto:${basics.email}`}>
//             <span style={{ opacity: 0.6 }}>@</span> {basics.email}
//           </a>
//         )}

//         {basics.url && (
//           <a href={basics.url} target="_blank" rel="noreferrer">
//             <span style={{ opacity: 0.6 }}>🔗</span> LinkedIn
//           </a>
//         )}

//         {basics.location?.city && (
//           <span>
//             <span style={{ opacity: 0.6 }}>📍</span> {basics.location.city},{' '}
//             {basics.location.region}
//           </span>
//         )}

//         {basics.phone && (
//           <a href={`tel:${basics.phone}`}>
//             <span style={{ opacity: 0.6 }}>📞</span> {basics.phone}
//           </a>
//         )}
//       </ContactRow>
//     </IntroContainer>
//   );
// }

import { IBasics } from '@/stores/index.interface';
import styled from '@emotion/styled';
import { useThemes } from '@/stores/themes';

const IntroContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 18px;
`;

const Name = styled.h1<{ titleColor?: string }>`
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-weight: 700;
  color: ${(props) => props.titleColor || '#1a1a1a'};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: color 0.3s ease;
`;

const Headline = styled.div<{ titleColor?: string }>`
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: ${(props) => props.titleColor || '#00796b'};
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  transition: color 0.3s ease;

  span:not(:last-child)::after {
    content: '|';
    margin-left: 6px;
    color: ${(props) => props.titleColor || '#00796b'};
    opacity: 0.4;
  }
`;

const ContactRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  column-gap: 12px;
  row-gap: 4px;
  margin-top: 4px;
  font-size: 11.5px;
  color: #666;

  span,
  a {
    display: flex;
    align-items: center;
    gap: 3px;
    text-decoration: none;
    color: inherit;
  }
`;

export default function BasicIntro({ basics }: { basics: IBasics }) {
  const activeTheme = useThemes((state) => state.selectedTheme);
  const linkedinProfile = basics.profiles?.find(
    (profile) => profile.network?.toLowerCase() === 'linkedin'
  );

  return (
    <IntroContainer>
      <Name titleColor={activeTheme.titleColor}>{basics.name}</Name>

      <Headline titleColor={activeTheme.titleColor}>
        {basics.label.split('|').map((part, index) => (
          <span key={index}>{part.trim()}</span>
        ))}
      </Headline>

      <ContactRow>
        {basics.email && <a href={`mailto:${basics.email}`}>✉️ {basics.email}</a>}

        {linkedinProfile?.url && (
          <a href={linkedinProfile.url} target="_blank" rel="noreferrer">
            <span style={{ opacity: 0.6 }}>🔗</span> LinkedIn
          </a>
        )}

        {basics.location?.city && (
          <span>
            <span style={{ opacity: 0.6 }}>📍</span> {basics.location.city} {basics.location.region}
          </span>
        )}

        {basics.phone && (
          <a href={`tel:${basics.phone}`}>
            <span style={{ opacity: 0.6 }}>📞</span> {basics.phone}
          </a>
        )}
      </ContactRow>
    </IntroContainer>
  );
}
