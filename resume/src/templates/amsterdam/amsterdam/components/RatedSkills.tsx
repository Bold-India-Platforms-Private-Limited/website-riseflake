import { ISkillItem } from '@/stores/skill.interface';
import styled from '@emotion/styled';

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: #1f2937;
`;

export default function RatedSkills({ items }: { items: ISkillItem[] }) {
  if (!items?.length) return null;
  return (
    <List>
      {items.map((s) => (
        <div key={s.name}>{s.name}</div>
      ))}
    </List>
  );
}
