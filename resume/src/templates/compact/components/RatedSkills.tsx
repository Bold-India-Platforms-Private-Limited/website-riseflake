import { ISkillItem } from '@/stores/skill.interface';
import styled from '@emotion/styled';

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px 25px;
`;

const SkillWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const SkillName = styled.span`
  font-size: 11.5px;
  font-weight: 700;
  color: #27345c;
  padding-bottom: 2px;
  border-bottom: 1.5px solid #cbd5e1;
  display: inline-block;
  width: 100%;
`;

export default function RatedSkills({ items = [] }: { items: ISkillItem[] }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <SkillsGrid>
      {items.map((skill, i) => (
        <SkillWrapper key={i}>
          <SkillName>{skill.name}</SkillName>
        </SkillWrapper>
      ))}
    </SkillsGrid>
  );
}
