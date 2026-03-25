import { ISkillItem } from '@/stores/skill.interface';
import styled from '@emotion/styled';

const SkillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px 8px;
  margin-top: 5px;
`;

const SkillTag = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SkillName = styled.span`
  font-size: 11.5px;
  font-weight: 700;
  color: #1a1a1a;
  background-color: transparent;
  border-bottom: 2px solid #27345c;
  padding-bottom: 1px;
  line-height: 1.2;
  white-space: nowrap;
`;

const SkillLevel = styled.span`
  font-size: 9px;
  text-transform: uppercase;
  color: #888;
  font-weight: 800;
  margin-top: 2px;
  letter-spacing: 0.5px;
`;

export default function RatedSkills({ items = [] }: { items: ISkillItem[] }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <SkillsContainer>
      {items.map((skill) => (
        <SkillTag key={skill.name}>
          <SkillName>{skill.name}</SkillName>
          <SkillLevel>
            {skill.level >= 80 ? 'Expert' : skill.level >= 50 ? 'Inter' : 'Beg'}
          </SkillLevel>
        </SkillTag>
      ))}
    </SkillsContainer>
  );
}
