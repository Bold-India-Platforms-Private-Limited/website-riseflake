import styled from '@emotion/styled';
import React from 'react';

const ExpertiseWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  column-gap: 8px;
  row-gap: 4px;
  color: #e0f2f1;
  font-size: 11.5px;
  line-height: 1.3;
  margin-top: 3px;
`;

const SkillName = styled.span`
  letter-spacing: 0.1px;
`;

const Dot = styled.span`
  color: rgba(255, 255, 255, 0.35);
  font-weight: bold;
  align-self: center;
`;

export default function UnratedSkills({ items }: { items: any[] }) {
  if (!items || items.length === 0) return null;

  return (
    <ExpertiseWrapper>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <SkillName>{item.name}</SkillName>
          {i < items.length - 1 && <Dot> • </Dot>}
        </React.Fragment>
      ))}
    </ExpertiseWrapper>
  );
}
