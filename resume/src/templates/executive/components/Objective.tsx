import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const ObjectiveWrapper = styled.div`
  font-size: 12.5px;
  line-height: 1.4;
  color: #333;
  text-align: justify;

  p {
    margin: 0;

    margin-bottom: 8px;
  }

  p:last-child {
    margin-bottom: 0;
  }
`;

export const Objective = ({ objective }: { objective: string }) => {
  if (!objective || objective.trim() === '') return null;
  return (
    <ObjectiveWrapper>
      <HTMLRenderer htmlString={objective} />
    </ObjectiveWrapper>
  );
};
