import { ISkillItem } from '@/stores/skill.interface';
import styled from '@emotion/styled';

const RatedSkillsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SkillRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SkillName = styled.span`
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  color: #1a1a1a;
  min-width: 60px;
`;

const LevelLabel = styled.span`
  font-size: 10.5px;
  color: #666;
  margin-right: 10px;
  flex: 1;
  text-align: right;
  font-style: italic;
`;

const DotsWrapper = styled.div`
  display: flex;
  gap: 4px;
`;

const Dot = styled.div<{ active: boolean }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: ${(props) => (props.active ? '#27345c' : '#e2e8f0')};
`;

export default function RatedSkills({ items }: { items: ISkillItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <RatedSkillsContainer>
      {items.map(({ name, level }) => {
        const totalDots = 5;
        const activeDots = Math.round((level / 100) * totalDots);

        const getLevelLabel = (lvl: number) => {
          if (lvl >= 100) return 'Native';
          if (lvl >= 80) return 'Advanced';
          if (lvl >= 60) return 'Proficient';
          if (lvl >= 40) return 'Intermediate';
          return 'Beginner';
        };

        return (
          <SkillRow key={name}>
            <SkillName>{name}</SkillName>
            <LevelLabel>{getLevelLabel(level)}</LevelLabel>
            <DotsWrapper>
              {[...Array(totalDots)].map((_, i) => (
                <Dot key={i} active={i < activeDots} />
              ))}
            </DotsWrapper>
          </SkillRow>
        );
      })}
    </RatedSkillsContainer>
  );
}
