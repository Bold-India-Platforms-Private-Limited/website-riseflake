import { ISkillItem } from '@/stores/skill.interface';
import styled from '@emotion/styled';

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
`;

export default function Languages({ items }: { items: ISkillItem[] }) {
  if (!items?.length) return null;

  return (
    <List>
      {items.map((l) => (
        <div key={l.name}>
          {l.name} – {l.level >= 75 ? 'Fluent' : 'Intermediate'}
        </div>
      ))}
    </List>
  );
}
