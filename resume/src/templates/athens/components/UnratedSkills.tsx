import { ISkillItem } from '@/stores/skill.interface';
import styled from '@emotion/styled';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 clean columns */
  gap: 6px 18px;
  font-size: 11.5px;
  color: #4b5563;
  line-height: 1.35;
`;

const SkillItem = styled.div`
  position: relative;
  padding-left: 12px;

  &::before {
    content: '•';
    position: absolute;
    left: 0;
    top: 0.15em;
    font-size: 10px; /* 👈 smaller dot */
    color: #111827;
  }
`;

export default function UnratedSkills({ items = [] }: { items: ISkillItem[] }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <Grid>
      {items.map((s, index) => (
        <SkillItem key={`${s.name}-${index}`}>{s.name}</SkillItem>
      ))}
    </Grid>
  );
}
