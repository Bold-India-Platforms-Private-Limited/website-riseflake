import { IBasics } from '@/stores/index.interface';
import styled from '@emotion/styled';
import { useThemes } from '@/stores/themes';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
`;

const Left = styled.div``;

const Name = styled.h1<{ color: string }>`
  font-size: 26px;
  font-weight: 800;
  margin: 0;
  color: ${(p) => p.color};
`;

const Role = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #4b5563;
  margin-top: 4px;
`;

const Right = styled.div`
  text-align: right;
  font-size: 11.5px;
  color: #4b5563;
  line-height: 1.5;

  a {
    color: inherit;
    text-decoration: none;
  }

  a:hover {
    text-decoration: none;
  }
`;

/* helpers */
const cleanUrl = (url?: string) => (url ? url.replace(/^https?:\/\//, '') : '');

export default function BasicInfo({ basics }: { basics: IBasics }) {
  const theme = useThemes((s) => s.selectedTheme);
  if (!basics?.name) return null;

  return (
    <Wrapper>
      <Left>
        <Name color={theme.titleColor}>{basics.name}</Name>
        {basics.label && <Role>{basics.label}</Role>}
      </Left>

      <Right>
        {basics.location && <div>{basics.location.city}</div>}

        {basics.email && (
          <div>
            <a href={`mailto:${basics.email}`}>{basics.email}</a>
          </div>
        )}

        {basics.url && (
          <div>
            <a href={basics.url} target="_blank" rel="noopener noreferrer">
              {cleanUrl(basics.url)}
            </a>
          </div>
        )}
      </Right>
    </Wrapper>
  );
}
