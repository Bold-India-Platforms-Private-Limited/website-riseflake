import styled from '@emotion/styled';
import { ISkillItem } from '@/stores/skill.interface';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* ✅ 4 columns */
  column-gap: 28px;
  row-gap: 12px;
  font-size: 11.5px;
  color: #000;
`;

const SkillCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SkillName = styled.span`
  font-weight: 600;
`;

const SkillLevel = styled.span`
  font-size: 10.5px;
  color: #6b7280;
`;

/* number → label */
function getSkillLevel(value?: number) {
  if (value === undefined || value === null) return '';
  if (value <= 30) return 'Beginner';
  if (value <= 70) return 'Intermediate';
  return 'Expert';
}

interface Props {
  skills: {
    technologies?: ISkillItem[];
    frameworks?: ISkillItem[];
    libraries?: ISkillItem[];
    tools?: ISkillItem[];
  };
}

export default function Skills({ skills }: Props) {
  const allSkills = [
    ...(skills.technologies || []),
    ...(skills.frameworks || []),
    ...(skills.libraries || []),
    ...(skills.tools || []),
  ];

  if (!allSkills.length) return null;

  /* ✅ 4 columns × 3 rows = 12 skills */
  const visibleSkills = allSkills.slice(0, 12);

  return (
    <Grid>
      {visibleSkills.map((skill) => (
        <SkillCard key={skill.name}>
          <SkillName>{skill.name}</SkillName>
          <SkillLevel>{getSkillLevel(skill.level)}</SkillLevel>
        </SkillCard>
      ))}
    </Grid>
  );
}
