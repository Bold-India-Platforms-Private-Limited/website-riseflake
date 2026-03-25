import React from 'react';
import styled from '@emotion/styled';
import { useThemes } from '@/stores/themes';

const LangContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 5px;
`;

const LangItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
`;

const Name = styled.div`
  font-weight: 700;
  font-size: 11.5px;
  color: inherit;
`;

const Level = styled.div`
  font-size: 10px;
  color: inherit;
  opacity: 0.7;
  font-style: italic;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: #f3f4f6;
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ width: string; accentColor: string }>`
  height: 100%;
  width: ${(props) => props.width};
  background-color: ${(props) => props.accentColor};
  transition: width 0.5s ease-in-out;
`;

export default function Languages({ items = [] }: { items: any[] }) {
  const activeTheme = useThemes((state) => state.selectedTheme);
  const validItems = Array.isArray(items) ? items : [];

  if (validItems.length === 0) return null;

  const getWidth = (level: any) => {
    if (typeof level === 'number') {
      return `${Math.min(Math.max(level, 0), 100)}%`;
    }

    const l = String(level || '').toLowerCase();
    if (l.includes('native') || l.includes('fluent')) return '100%';
    if (l.includes('advanced')) return '80%';
    if (l.includes('intermediate')) return '50%';
    if (l && !isNaN(Number(l))) return `${l}%`;

    return '30%';
  };

  return (
    <LangContainer>
      {validItems.map((lang, i) => {
        const name = lang.name || lang.language || 'Unknown';
        const rawLevel = lang.level ?? lang.fluency;

        return (
          <LangItem key={i}>
            <LabelRow>
              <Name>{name}</Name>
              <Level>{typeof rawLevel === 'number' ? `${rawLevel}%` : rawLevel || 'Basic'}</Level>
            </LabelRow>

            <ProgressBar>
              <ProgressFill width={getWidth(rawLevel)} accentColor={activeTheme.highlighterColor} />
            </ProgressBar>
          </LangItem>
        );
      })}
    </LangContainer>
  );
}
