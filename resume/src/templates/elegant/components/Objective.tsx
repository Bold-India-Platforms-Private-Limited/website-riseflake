import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const SummaryWrapper = styled.div`
  margin-top: 2px;

  .summary-content {
    font-size: 12.5px;
    line-height: 1.4;
    color: #444;
    text-align: justify;
    letter-spacing: 0.1px;
  }

  p {
    margin: 0;
    margin-bottom: 6px;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export const Objective = ({ objective }: { objective: string }) => {
  if (!objective || objective.trim() === '') return null;

  return (
    <SummaryWrapper>
      <div className="summary-content">
        <HTMLRenderer htmlString={objective} />
      </div>
    </SummaryWrapper>
  );
};
