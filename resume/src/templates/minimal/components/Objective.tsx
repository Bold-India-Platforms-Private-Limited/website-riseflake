import React from 'react';
import styled from '@emotion/styled';
import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';

const ObjectiveContainer = styled.div`
  margin-top: 2px;
`;

const ObjectiveText = styled.div`
  font-size: 11px;
  line-height: 1.5;
  color: inherit;
  text-align: justify;

  p {
    margin: 0;
  }
`;

export const Objective = ({ objective }: { objective: string }) => {
  if (!objective || objective.trim() === '' || objective === '<p></p>') {
    return null;
  }

  return (
    <ObjectiveContainer>
      <ObjectiveText>
        <HTMLRenderer htmlString={objective} />
      </ObjectiveText>
    </ObjectiveContainer>
  );
};
