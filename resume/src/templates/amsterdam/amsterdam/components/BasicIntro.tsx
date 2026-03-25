import { IBasics } from '@/stores/index.interface';
import styled from '@emotion/styled';
import { useThemes } from '@/stores/themes';

const Wrapper = styled.div`
  width: 100%;
  position: relative;
  padding: 36px 0;
`;

/* 🔥 EXACT SAME WIDTH AS LEFT COLUMN (30%) */
const LeftBg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 30%; /* ✅ SAME AS BODY LEFT */
  height: 100%;
  background: #f3f4f6;
`;

/* center container */
const Center = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`;

/* name box */
const Box = styled.div`
  background: #ffffff;
  padding: 34px 88px;
  border: 2px solid #111827;
  min-width: 520px;
  text-align: center;
`;

/* name */
const Name = styled.h1<{ color?: string }>`
  margin: 0;
  font-size: 40px;
  font-weight: 800;
  color: ${(p) => p.color || '#000'};
`;

/* role */
const Role = styled.div<{ color?: string }>`
  margin-top: 8px;
  font-size: 15px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${(p) => p.color || '#111827'};
`;

export default function BasicIntro({ basics }: { basics: IBasics }) {
  const theme = useThemes((s) => s.selectedTheme);

  return (
    <Wrapper>
      <LeftBg />
      <Center>
        <Box>
          <Name color={theme.titleColor}>{basics.name}</Name>
          {basics.label && <Role color={theme.titleColor}>{basics.label}</Role>}
        </Box>
      </Center>
    </Wrapper>
  );
}
