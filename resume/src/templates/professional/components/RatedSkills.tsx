import { ISkillItem } from '@/stores/skill.interface';
import styled from '@emotion/styled';

const SkillContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* COMPACT: Reduced gap for A4 density */
  gap: 8px;
`;

const SkillRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SkillHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

const SkillName = styled.p`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: #1a1a1a;
  margin: 0;
`;

const LevelLabel = styled.span`
  font-size: 10px;
  color: #666;
  font-style: italic;
`;

const ProgressBarBase = styled.div`
  width: 100%;
  height: 6px;
  background-color: #f1f5f9;
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ width: number }>`
  height: 100%;
  /* COLOR: Using the teal/cyan from your references */
  background-color: #00bcd4;
  width: ${(props) => props.width}%;
  /* STRIPE PATTERN: Recreates the consistent visual style */
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 10px 10px;
  transition: width 0.4s ease-in-out;
`;

export default function RatedSkills({ items }: { items: ISkillItem[] }) {
  // Guard against empty arrays or undefined props
  if (!items || items.length === 0) return null;

  const getLevelLabel = (lvl: number) => {
    if (lvl >= 100) return 'Native / Expert';
    if (lvl >= 80) return 'Advanced';
    if (lvl >= 60) return 'Proficient';
    if (lvl >= 40) return 'Intermediate';
    return 'Beginner';
  };

  return (
    <SkillContainer>
      {items.map(({ name, level }) => (
        <SkillRow key={name}>
          <SkillHeader>
            <SkillName>{name}</SkillName>
            <LevelLabel>{getLevelLabel(level)}</LevelLabel>
          </SkillHeader>
          <ProgressBarBase>
            <ProgressFill width={level} />
          </ProgressBarBase>
        </SkillRow>
      ))}
    </SkillContainer>
  );
}
