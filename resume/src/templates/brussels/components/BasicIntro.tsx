import { IBasics } from '@/stores/index.interface';
import styled from '@emotion/styled';
import { useThemes } from '@/stores/themes';

const Wrapper = styled.div`
  margin-bottom: 18px;
`;

const Name = styled.h1<{ color: string }>`
  font-size: 34px;
  font-weight: 800;
  margin: 0;
  color: ${(p) => p.color};
`;

const Role = styled.div`
  font-size: 18px;
  font-weight: 500;
  margin-top: 2px;
  color: #374151;
`;

export default function BasicIntro({ basics }: { basics: IBasics }) {
  const theme = useThemes((s) => s.selectedTheme);

  return (
    <Wrapper>
      <Name color={theme.titleColor}>{basics.name}</Name>
      {basics.label && <Role>{basics.label}</Role>}
    </Wrapper>
  );
}
