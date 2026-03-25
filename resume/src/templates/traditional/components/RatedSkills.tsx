import { ISkillItem } from '@/stores/skill.interface';
import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 8px;
`;

const Name = styled.span`
  font-size: 11.5px;
  font-weight: 700;
  color: #1a1a1a;
`;

const Level = styled.span`
  font-size: 10.5px;
  color: #6b7280;
  text-align: right;
`;

export default function RatedSkills({ items = [] }: { items: ISkillItem[] }) {
  if (!items.length) return null;

  const label = (lvl: number) => {
    if (lvl >= 90) return 'Native';
    if (lvl >= 75) return 'Advanced';
    if (lvl >= 55) return 'Intermediate';
    return 'Basic';
  };

  return (
    <Container>
      {items.map((s) => (
        <Row key={s.name}>
          <Name>{s.name}</Name>
          <div />
          <Level>{label(s.level)}</Level>
        </Row>
      ))}
    </Container>
  );
}
