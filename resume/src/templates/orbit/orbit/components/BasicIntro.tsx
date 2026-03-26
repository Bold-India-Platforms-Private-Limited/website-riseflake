import { IBasics } from '@/stores/index.interface';
import styled from '@emotion/styled';
import { useThemes } from '@/stores/themes';
import { withBasePath } from '@/utils/withBasePath';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 18px 0 16px; /* ⬅️ height kam */
`;

const Image = styled.img`
  width: 90px; /* ⬅️ chhota */
  height: 90px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 8px;
`;

const Name = styled.h1<{ color: string }>`
  font-size: 24px;
  font-weight: 800;
  margin: 0;
  color: ${(p) => p.color};
`;

const Role = styled.div`
  font-size: 13px;
  color: #374151;
  margin-top: 2px;
`;

const Info = styled.div`
  font-size: 12px;
  color: #111;
  margin-top: 4px;
`;

export default function BasicIntro({ basics }: { basics: IBasics }) {
  const theme = useThemes((s) => s.selectedTheme);

  return (
    <Wrapper>
      {basics.image && <Image src={withBasePath(basics.image)} alt={'Profile'} />}
      <Name color={theme.titleColor}>{basics.name}</Name>
      {basics.label && <Role>{basics.label}</Role>}
      {basics.location?.city && <Info>📍 {basics.location.city}</Info>}
      {basics.phone && <Info>📞 {basics.phone}</Info>}
    </Wrapper>
  );
}
