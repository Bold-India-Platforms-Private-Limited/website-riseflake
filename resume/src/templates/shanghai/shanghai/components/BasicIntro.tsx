import styled from '@emotion/styled';
import { IBasics } from '@/stores/index.interface';
import { useThemes } from '@/stores/themes';

const Bar = styled.div<{ bg: string }>`
  background: ${(p) => p.bg};
  padding: 18px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Name = styled.h1`
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  color: #ffffff;
`;

const Right = styled.div`
  font-size: 12px;
  color: #ffffff;
`;

const joinDot = (arr: (string | undefined)[]) => arr.filter(Boolean).join(' · ');

export default function BasicIntro({ basics }: { basics: IBasics }) {
  const theme = useThemes((s) => s.selectedTheme);
  if (!basics?.name) return null;

  return (
    <Bar bg={theme.titleColor}>
      <Name>{basics.name}</Name>
      <Right>{joinDot([basics.location?.city, basics.email, basics.phone])}</Right>
    </Bar>
  );
}
