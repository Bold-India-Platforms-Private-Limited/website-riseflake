import { ISkillItem } from '@/stores/skill.interface';
import styled from '@emotion/styled';

const UnratedSkillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px 8px;
  line-height: 1.4;
`;

const SkillItemWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4b5563;
  font-size: 11.5px;
  font-weight: 500;
`;

const SeparatorDot = styled.span`
  color: #cbd5e1;
  font-weight: bold;
`;

export default function UnratedSkills({ items }: { items: ISkillItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <UnratedSkillsContainer>
      {items.map(({ name }, index) => (
        <SkillItemWrapper key={name}>
          <span>{name}</span>
          {index < items.length - 1 && <SeparatorDot>•</SeparatorDot>}
        </SkillItemWrapper>
      ))}
    </UnratedSkillsContainer>
  );
}
