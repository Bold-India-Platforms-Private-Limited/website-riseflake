import { ISkillItem } from '@/stores/skill.interface';
import styled from '@emotion/styled';

const SkillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px 12px;
`;

const SkillText = styled.span`
  font-size: 11.5px;
  font-weight: 700;
  color: #27345c;
  border-bottom: 1.5px solid #cbd5e1;
  padding-bottom: 1px;
  white-space: nowrap;
  display: inline-block;
`;

export default function UnratedSkills({ items = [] }: { items: ISkillItem[] }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <SkillsContainer>
      {items.map((skill, index) => (
        <SkillText key={index}>{skill.name}</SkillText>
      ))}
    </SkillsContainer>
  );
}
