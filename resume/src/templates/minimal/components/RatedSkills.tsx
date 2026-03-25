import { ISkillItem } from '@/stores/skill.interface';
import styled from '@emotion/styled';
import { useThemes } from '@/stores/themes';

const SkillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 10px;
  margin-top: 5px;
`;

const SkillTag = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const SkillName = styled.span<{ accentColor: string }>`
  font-size: 11px;
  font-weight: 700;
  /* Remains neutral font color */
  color: inherit;
  background-color: transparent;
  /* Only the underline uses the theme color */
  border-bottom: 1.5px solid ${(props) => props.accentColor};
  padding-bottom: 1px;
  line-height: 1.2;
  white-space: nowrap;
`;

const SkillLevel = styled.span`
  font-size: 8.5px;
  text-transform: uppercase;
  /* inherit ensures it doesn't turn pink/green */
  color: inherit;
  opacity: 0.6;
  font-weight: 700;
  margin-top: 2px;
  letter-spacing: 0.05em;
`;

export default function RatedSkills({ items = [] }: { items: ISkillItem[] }) {
  const activeTheme = useThemes((state) => state.selectedTheme);

  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <SkillsContainer>
      {items.map((skill, index) => (
        <SkillTag key={index}>
          <SkillName accentColor={activeTheme.highlighterColor}>{skill.name}</SkillName>
          {skill.level !== undefined && (
            <SkillLevel>
              {skill.level >= 80 ? 'Expert' : skill.level >= 50 ? 'Intermediate' : 'Beginner'}
            </SkillLevel>
          )}
        </SkillTag>
      ))}
    </SkillsContainer>
  );
}
