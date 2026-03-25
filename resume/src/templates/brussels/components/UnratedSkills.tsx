import { ISkillItem } from '@/stores/skill.interface';
import styled from '@emotion/styled';

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Item = styled.div`
  font-size: 12px;
`;

export default function UnratedSkills({ items = [] }: { items: ISkillItem[] }) {
  if (!items.length) return null;

  return (
    <List>
      {items.map((s) => (
        <Item key={s.name}>{s.name}</Item>
      ))}
    </List>
  );
}
