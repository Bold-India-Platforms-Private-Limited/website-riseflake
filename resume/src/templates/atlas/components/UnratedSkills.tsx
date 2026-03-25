import { ISkillItem } from '@/stores/skill.interface';
import styled from '@emotion/styled';

/* ================= CONTAINER ================= */

const UnratedSkillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px 10px;
  font-size: 11.5px;
  line-height: 1.6;
`;

/* ================= ITEM ================= */

const SkillItem = styled.span`
  color: #374151;
  font-weight: 500;
  white-space: nowrap;
`;

/* ================= SEPARATOR ================= */

const Separator = styled.span`
  color: #cbd5e1;
  margin: 0 2px;
`;

/* ================= COMPONENT ================= */

export default function UnratedSkills({ items }: { items: ISkillItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <UnratedSkillsContainer>
      {items.map(({ name }, index) => (
        <span key={name}>
          <SkillItem>{name}</SkillItem>
          {index < items.length - 1 && <Separator>•</Separator>}
        </span>
      ))}
    </UnratedSkillsContainer>
  );
}
