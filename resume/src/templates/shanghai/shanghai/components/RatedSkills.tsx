import { ISkillItem } from '@/stores/skill.interface';
import styled from '@emotion/styled';

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 11.5px;
`;

const levelLabel = (v?: number) => {
  if (!v) return '';
  if (v >= 90) return 'Native';
  if (v >= 75) return 'Advanced';
  if (v >= 55) return 'Intermediate';
  return 'Basic';
};

export default function RatedSkills({ items }: { items: ISkillItem[] }) {
  if (!items?.length) return null;

  return (
    <>
      {items.map((s, i) => (
        <Row key={i}>
          <span>{s.name}</span>
          <span>{levelLabel(s.level)}</span>
        </Row>
      ))}
    </>
  );
}
