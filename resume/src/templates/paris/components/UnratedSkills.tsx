import styled from '@emotion/styled';

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Item = styled.div`
  font-size: 12px;
  color: #111827;
`;

const Line = styled.div`
  height: 1px;
  background: #cbd5e1;
  margin-top: 6px;
`;

export default function UnratedSkills({ items = [] }: { items: any[] }) {
  if (!items.length) return null;

  return (
    <List>
      {items.map((s, i) => (
        <Item key={i}>
          {s.name}
          <Line />
        </Item>
      ))}
    </List>
  );
}
