import { ISkillItem } from '@/stores/skill.interface';
import styled from '@emotion/styled';

const SkillsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px 10px;
  margin-top: 5px;
`;

const SkillText = styled.span`
  font-size: 11.5px;
  font-weight: 700;
  color: #1a1a1a;
  border-bottom: 2px solid #27345c;
  padding-bottom: 1px;
  line-height: 1.2;
  white-space: nowrap;
`;

export default function UnratedSkills({ items = [] }: { items: ISkillItem[] }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <SkillsWrapper>
      {items.map((skill) => (
        <SkillText key={skill.name}>{skill.name}</SkillText>
      ))}
    </SkillsWrapper>
  );
}
