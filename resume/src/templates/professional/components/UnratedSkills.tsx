import { ISkillItem } from '@/stores/skill.interface';
import styled from '@emotion/styled';

const SkillsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  /* COMPACT: Reduced gap to maximize vertical space */
  gap: 6px;
  margin-top: 5px;
`;

const SkillBadge = styled.span`
  /* COMPACT: Scaled down from 12px to 10.5px */
  font-size: 10.5px;
  font-weight: 600;
  color: #4b5563;
  background-color: #f8fafc;
  /* BORDER: Matches the subtle professional look of the template */
  border: 1px solid #e2e8f0;
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    background-color: #eef2ff;
    border-color: #00bcd4; /* Accent color from your languages bar */
  }
`;

export default function UnratedSkills({ items }: { items: ISkillItem[] }) {
  // Defensive check for data availability
  if (!items || items.length === 0) return null;

  return (
    <SkillsWrapper>
      {items.map((skill) => (
        <SkillBadge key={skill.name}>{skill.name}</SkillBadge>
      ))}
    </SkillsWrapper>
  );
}
