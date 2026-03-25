import { ISkillItem } from '@/stores/skill.interface';
import styled from '@emotion/styled';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 24px; /* 🔥 horizontal spacing */
  row-gap: 8px; /* 🔥 vertical spacing */
  font-size: 11.5px;
  color: #4b5563;
`;

const Item = styled.div`
  line-height: 1.35;
`;

export default function UnratedSkills({ items }: { items: ISkillItem[] }) {
  if (!items?.length) return null;

  return (
    <Grid>
      {items.map((s, i) => (
        <Item key={`${s.name}-${i}`}>{s.name}</Item>
      ))}
    </Grid>
  );
}
