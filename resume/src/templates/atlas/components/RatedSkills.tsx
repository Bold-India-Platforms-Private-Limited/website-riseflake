import { ISkillItem } from '@/stores/skill.interface';
import styled from '@emotion/styled';

/* ================= CONTAINER ================= */

const RatedSkillsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

/* ================= ROW ================= */

const SkillRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  align-items: center;
`;

/* ================= NAME ================= */

const SkillName = styled.span`
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  color: #111827;
  min-width: 70px;
`;

/* ================= LEVEL TEXT ================= */

const LevelLabel = styled.span`
  font-size: 10.5px;
  color: #6b7280;
  text-align: right;
  font-style: italic;
`;

/* ================= DOTS ================= */

const DotsWrapper = styled.div`
  display: flex;
  gap: 4px;
`;

const Dot = styled.span<{ active: boolean }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: ${(p) => (p.active ? '#1f2937' : '#e5e7eb')};
`;

/* ================= COMPONENT ================= */

export default function RatedSkills({ items }: { items: ISkillItem[] }) {
  if (!items || items.length === 0) return null;

  const getLevelLabel = (lvl: number) => {
    if (lvl >= 90) return 'Native';
    if (lvl >= 75) return 'Advanced';
    if (lvl >= 60) return 'Proficient';
    if (lvl >= 40) return 'Intermediate';
    return 'Beginner';
  };

  return (
    <RatedSkillsContainer>
      {items.map(({ name, level }) => {
        const totalDots = 5;
        const activeDots = Math.round((level / 100) * totalDots);

        return (
          <SkillRow key={name}>
            <SkillName>{name}</SkillName>

            <LevelLabel>{getLevelLabel(level)}</LevelLabel>

            <DotsWrapper>
              {Array.from({ length: totalDots }).map((_, i) => (
                <Dot key={i} active={i < activeDots} />
              ))}
            </DotsWrapper>
          </SkillRow>
        );
      })}
    </RatedSkillsContainer>
  );
}
