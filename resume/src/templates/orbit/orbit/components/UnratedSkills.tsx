import styled from '@emotion/styled';
import { ISkillItem } from '@/stores/skill.interface';

const List = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  align-items: center; /* ⬅️ CENTER */
  gap: 8px;
`;

const Item = styled.div`
  font-size: 12px;
  text-align: center;
`;

export default function UnratedSkills({ items }: { items: ISkillItem[] }) {
  if (!items?.length) return null;

  return (
    <List>
      {items.map((l) => (
        <Item key={l.name}>{l.name}</Item>
      ))}
    </List>
  );
}
