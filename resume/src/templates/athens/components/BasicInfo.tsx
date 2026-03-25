import { IBasics } from '@/stores/index.interface';
import styled from '@emotion/styled';
import { useThemes } from '@/stores/themes';

/* ================= STYLES ================= */

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  margin-bottom: 10px;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Right = styled.div`
  text-align: right;
  font-size: 11.5px;
  color: #4b5563;
  line-height: 1.4;

  a {
    color: inherit;
    text-decoration: none;
  }

  a:hover {
    text-decoration: none;
  }
`;

const Name = styled.h1<{ color: string }>`
  font-size: 30px;
  font-weight: 800;
  margin: 0;
  letter-spacing: 0.4px;
  color: ${(p) => p.color};
`;

const Role = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #4b5563;
`;

/* ================= HELPERS ================= */

const toTitleCase = (value?: string) =>
  value
    ? value
        .toLowerCase()
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    : '';

const cleanUrl = (url?: string) => (url ? url.replace(/^https?:\/\//, '').replace(/\/$/, '') : '');

const formatLocation = (location?: { city?: string; region?: string; countryCode?: string }) =>
  [location?.city, location?.region, location?.countryCode].filter(Boolean).join(', ');

/* ================= COMPONENT ================= */

export default function BasicInfo({ basics }: { basics: IBasics }) {
  const theme = useThemes((s) => s.selectedTheme);

  if (!basics?.name) return null;

  return (
    <Wrapper>
      {/* LEFT */}
      <Left>
        <Name color={theme.titleColor}>{toTitleCase(basics.name)}</Name>
        {basics.label && <Role>{basics.label}</Role>}
      </Left>

      {/* RIGHT */}
      <Right>
        {basics.email && (
          <>
            <a href={`mailto:${basics.email}`}>{basics.email}</a>
          </>
        )}

        {basics.email && (basics.location || basics.url) && ' | '}

        {basics.location && formatLocation(basics.location)}

        {basics.location && basics.url && ' | '}

        {basics.url && (
          <a href={basics.url} target="_blank" rel="noopener noreferrer">
            {cleanUrl(basics.url)}
          </a>
        )}
      </Right>
    </Wrapper>
  );
}
