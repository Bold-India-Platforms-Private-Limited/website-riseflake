import React, { useContext } from 'react';
import styled from '@emotion/styled';
import { StateContext } from '@/modules/builder/resume/ResumeLayout';

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Bar = styled.div`
  height: 6px;
  background: #e5e7eb;
`;

const Fill = styled.div<{ w: string; c: string }>`
  height: 100%;
  width: ${(p) => p.w};
  background: ${(p) => p.c};
`;

export default function Languages({ items = [] }: { items: any[] }) {
  const ctx = useContext(StateContext);
  const color = ctx?.metadata?.templateMeta?.themeColor;

  const getW = (l: any) => {
    const n = parseInt(l);
    if (!isNaN(n)) return `${n}%`;
    if (String(l).toLowerCase().includes('native')) return '100%';
    if (String(l).toLowerCase().includes('fluent')) return '80%';
    return '60%';
  };

  if (!items.length) return null;

  return (
    <List>
      {items.map((l, i) => (
        <div key={i}>
          <div style={{ fontSize: '11px', fontWeight: 600 }}>{l.name}</div>
          <Bar>
            <Fill w={getW(l.level)} c={color} />
          </Bar>
        </div>
      ))}
    </List>
  );
}
