import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const SummaryWrapper = styled.div`
  margin-top: 2px;

  .summary-content {
    font-size: 11.5px;
    line-height: 1.4;
    color: #4b5563;
    text-align: justify;
  }

  p {
    margin: 0;
  }
`;

export const Objective = ({ objective }: { objective: string }) => {
  if (!objective || objective.trim() === '' || objective === '<p><br></p>') return null;

  return (
    <SummaryWrapper>
      <div className="summary-content">
        <HTMLRenderer htmlString={objective} />
      </div>
    </SummaryWrapper>
  );
};
