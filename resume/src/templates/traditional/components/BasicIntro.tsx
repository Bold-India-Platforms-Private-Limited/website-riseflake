import { IBasics } from '@/stores/index.interface';
import styled from '@emotion/styled';
import { useThemes } from '@/stores/themes';

const IntroWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
`;

const Name = styled.h1<{ titleColor?: string }>`
  font-size: 34px;
  font-weight: 800;
  color: ${(p) => p.titleColor || '#1a1a1a'};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1.05;
`;

const Headline = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

export default function BasicIntro({ basics }: { basics: IBasics }) {
  const theme = useThemes((s) => s.selectedTheme);

  return (
    <IntroWrapper>
      <Name titleColor={theme.titleColor}>{basics.name}</Name>
      {basics.label && <Headline>{basics.label}</Headline>}
    </IntroWrapper>
  );
}
