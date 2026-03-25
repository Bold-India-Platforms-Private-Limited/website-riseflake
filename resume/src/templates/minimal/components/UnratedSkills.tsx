import { ISkillItem } from '@/stores/skill.interface';
import styled from '@emotion/styled';
import { useThemes } from '@/stores/themes';

const SkillsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  margin-top: 5px;
`;

const SkillText = styled.span<{ accentColor: string }>`
  font-size: 11px;
  font-weight: 700;
  color: inherit;
  border-bottom: 1px solid ${(props) => props.accentColor};
  padding-bottom: 1px;
  line-height: 1.2;
  white-space: nowrap;
`;

export default function UnratedSkills({ items = [] }: { items: ISkillItem[] }) {
  const activeTheme = useThemes((state) => state.selectedTheme);

  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <SkillsWrapper>
      {items.map((skill, index) => (
        <SkillText key={index} accentColor={activeTheme.highlighterColor}>
          {skill.name}
        </SkillText>
      ))}
    </SkillsWrapper>
  );
}
