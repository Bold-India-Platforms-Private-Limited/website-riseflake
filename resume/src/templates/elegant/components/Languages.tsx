import React from 'react';
import styled from '@emotion/styled';
import { useThemes } from '@/stores/themes';

const LangGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 25px;
  margin-top: 4px;
`;

const ProgressBarBase = styled.div`
  width: 100%;
  height: 8px;
  background-color: #f1f1f1;
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ width: string; accentColor?: string }>`
  height: 100%;
  background-color: ${(props) => props.accentColor || '#00bcd4'};
  width: ${(props) => props.width};
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.2) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.2) 75%,
    transparent 75%,
    transparent
  );
  background-size: 12px 12px;
  transition: all 0.3s ease;
`;

export default function Languages({ items = [] }: { items: any[] }) {
  const activeTheme = useThemes((state) => state.selectedTheme);

  if (!Array.isArray(items) || items.length === 0) return null;

  const getWidth = (level: any) => {
    const numericLevel = parseInt(level);
    if (!isNaN(numericLevel)) return `${numericLevel}%`;
    const l = String(level || '').toLowerCase();
    if (l.includes('native')) return '100%';
    if (l.includes('proficient')) return '85%';
    if (l.includes('advanced')) return '70%';
    return '50%';
  };

  return (
    <LangGrid>
      {items.map((lang, i) => (
        <div key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>
              {lang.name}
            </span>
            <span style={{ fontSize: '10px', color: '#888', fontStyle: 'italic' }}>
              {lang.level}
            </span>
          </div>
          <ProgressBarBase>
            <ProgressFill width={getWidth(lang.level)} accentColor={activeTheme.highlighterColor} />
          </ProgressBarBase>
        </div>
      ))}
    </LangGrid>
  );
}
