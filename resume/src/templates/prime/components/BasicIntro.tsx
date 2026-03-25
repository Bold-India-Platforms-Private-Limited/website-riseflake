import { IBasics } from '@/stores/index.interface';
import styled from '@emotion/styled';
import { useThemes } from '@/stores/themes';

const IntroWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 8px;
`;

const Name = styled.h1<{ titleColor?: string }>`
  font-size: 32px;
  font-weight: 800;
  color: ${(props) => props.titleColor || '#1a1a1a'};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  line-height: 1.18; /* 🔥 FINAL */
`;

const HeadlineBadge = styled.div<{ titleColor?: string }>`
  background-color: ${(props) => (props.titleColor ? `${props.titleColor}26` : '#e8f5e9')};
  color: ${(props) => props.titleColor || '#2e7d32'};
  padding: 4px 12px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 12.5px;
  display: inline-block;
  align-self: flex-start;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export default function BasicIntro({ basics }: { basics: IBasics }) {
  const activeTheme = useThemes((state) => state.selectedTheme);

  return (
    <IntroWrapper>
      <Name titleColor={activeTheme.titleColor}>{basics.name}</Name>
      {basics.label && (
        <HeadlineBadge titleColor={activeTheme.titleColor}>{basics.label}</HeadlineBadge>
      )}
    </IntroWrapper>
  );
}
