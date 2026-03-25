import { IBasics } from '@/stores/index.interface';
import styled from '@emotion/styled';
import { useThemes } from '@/stores/themes';

const Wrapper = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
`;

const Image = styled.img`
  width: 96px;
  height: 96px;
  object-fit: cover;
  border-radius: 6px;
`;

const Text = styled.div``;

const Name = styled.h1<{ color: string }>`
  font-size: 26px;
  font-weight: 800;
  margin: 0;
  color: ${(p) => p.color};
`;

const Role = styled.div<{ color: string }>`
  font-size: 14px;
  font-weight: 500;
  margin-top: 2px;
  color: ${(p) => p.color};
`;

const Info = styled.div`
  font-size: 12px;
  margin-top: 4px;
  color: #111827;
`;

export default function BasicIntro({ basics }: { basics: IBasics }) {
  const theme = useThemes((s) => s.selectedTheme);

  return (
    <Wrapper>
      {basics.image && <Image src={basics.image} alt={'Profile'} />}
      <Text>
        <Name color={theme.titleColor}>{basics.name}</Name>
        {basics.label && <Role color={theme.titleColor}>{basics.label}</Role>}
        <Info>
          {basics.location?.city} · {basics.email} · {basics.phone}
        </Info>
      </Text>
    </Wrapper>
  );
}
