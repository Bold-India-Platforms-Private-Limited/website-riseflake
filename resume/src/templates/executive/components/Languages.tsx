import React from 'react';
import styled from '@emotion/styled';

const LangContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 30px;
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
  margin-bottom: 2px;
`;

const Name = styled.div`
  font-weight: 700;
  font-size: 13px;
  color: #1a1a1a;
`;

const Level = styled.div`
  font-size: 11px;
  color: #666;
  font-style: italic;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background-color: #e5e7eb;
  border-radius: 1px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ width: string }>`
  height: 100%;
  width: ${(props) => props.width};
  background-color: #27345c;

  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 10px 10px;
`;

export default function Languages({ items = [] }: { items: any[] }) {
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
              <ProgressFill width={getWidth(rawLevel)} />
            </ProgressBar>
          </LangItem>
        );
      })}
    </LangContainer>
  );
}
