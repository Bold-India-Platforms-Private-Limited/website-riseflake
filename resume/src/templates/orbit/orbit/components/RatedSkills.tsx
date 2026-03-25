import styled from '@emotion/styled';
import { ISkillItem } from '@/stores/skill.interface';

const List = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  align-items: center; /* ⬅️ CENTER CONTENT */
  gap: 12px;
`;

const Item = styled.div`
  text-align: center; /* ⬅️ text center */
`;

const Name = styled.div`
  font-size: 12px;
  font-weight: 400;
`;

const Line = styled.div`
  height: 4px;
  width: 70px;
  background: #000;
  margin: 4px auto 0; /* ⬅️ line center */
`;

export default function RatedSkills({ items }: { items: ISkillItem[] }) {
  if (!items?.length) return null;

  return (
    <List>
      {items.map((s) => (
        <Item key={s.name}>
          <Name>{s.name}</Name>
          <Line />
        </Item>
      ))}
    </List>
  );
}
