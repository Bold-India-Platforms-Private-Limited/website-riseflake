import React from 'react';
import styled from '@emotion/styled';

const LangGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; /* Compact 2-column layout */
  gap: 10px 20px;
  margin-top: 5px;
`;

const ProgressBarBase = styled.div`
  width: 100%;
  height: 7px;
  background-color: #f1f5f9;
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ width: string }>`
  height: 100%;
  background-color: #00bcd4; /* Teal/Cyan color */
  width: ${(props) => props.width};
  /* Stripe pattern */
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
  background-size: 10px 10px;
  transition: width 0.4s ease-in-out;
`;

export default function Languages({ items = [] }: { items: any[] }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  const getWidth = (level: any) => {
    const numericLevel = parseInt(level);
    if (!isNaN(numericLevel)) return `${numericLevel}%`;

    const l = String(level || '').toLowerCase();
    if (l.includes('native') || l.includes('fluent')) return '100%';
    if (l.includes('proficient')) return '85%';
    if (l.includes('advanced')) return '70%';
    return '40%';
  };

  return (
    <LangGrid>
      {items.map((lang, i) => (
        <div key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>
              {lang.name}
            </span>
            <span style={{ fontSize: '10px', color: '#666', fontStyle: 'italic' }}>
              {lang.level}
            </span>
          </div>
          <ProgressBarBase>
            <ProgressFill width={getWidth(lang.level)} />
          </ProgressBarBase>
        </div>
      ))}
    </LangGrid>
  );
}
