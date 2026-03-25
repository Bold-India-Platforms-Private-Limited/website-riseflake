import { ISkillItem } from '@/stores/skill.interface';
import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  line-height: 1.6;
`;

const Skill = styled.span`
  font-size: 11.5px;
  font-weight: 500;
  color: #1f2937;
`;

type Props = {
  items?: ISkillItem[] | ISkillItem | any;
};

export default function UnratedSkills({ items }: Props) {
  // ✅ normalize to array
  const safeItems: ISkillItem[] = Array.isArray(items) ? items : items ? [items] : [];

  if (safeItems.length === 0) return null;

  return (
    <Container>
      {safeItems.map((item, index) => (
        <Skill key={`${item?.name ?? 'skill'}-${index}`}>{item?.name}</Skill>
      ))}
    </Container>
  );
}
