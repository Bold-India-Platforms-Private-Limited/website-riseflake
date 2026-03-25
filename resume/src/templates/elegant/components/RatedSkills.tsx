import styled from '@emotion/styled';
import React from 'react';

const SkillsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  column-gap: 6px;
  row-gap: 4px;
  color: #e0f2f1;
  font-size: 12px;
  line-height: 1.4;
  margin-top: 2px;
`;

const SkillItem = styled.span`
  font-weight: 400;
  letter-spacing: 0.2px;
`;

const Dot = styled.span`
  color: rgba(255, 255, 255, 0.4);
  font-size: 10px;
  align-self: center;
`;

export default function Skills({ items }: { items: any[] }) {
  if (!items || items.length === 0) return null;

  return (
    <SkillsWrapper>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <SkillItem>{item.name}</SkillItem>
          {i < items.length - 1 && <Dot> • </Dot>}
        </React.Fragment>
      ))}
    </SkillsWrapper>
  );
}
