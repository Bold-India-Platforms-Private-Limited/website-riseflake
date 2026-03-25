import { ISkillItem } from '@/stores/skill.interface';
import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Language = styled.div`
  font-size: 11.5px;
  font-weight: 500;
  color: #1f2937;
`;

export default function RatedSkills({ items }: { items: ISkillItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <Container>
      {items.map((item) => (
        <Language key={item.name}>{item.name}</Language>
      ))}
    </Container>
  );
}
