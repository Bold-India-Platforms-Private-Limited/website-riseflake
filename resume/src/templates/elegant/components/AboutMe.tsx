import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const SummaryContainer = styled.div`
  margin-top: 2px;
`;

const SummaryText = styled.div`
  font-size: 12.5px;
  line-height: 1.4;
  color: #444;
  text-align: justify;

  p {
    margin-bottom: 6px;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export default function AboutMe({ summary }: { summary: string }) {
  if (!summary) return null;

  return (
    <SummaryContainer>
      <SummaryText>
        <HTMLRenderer htmlString={summary} />
      </SummaryText>
    </SummaryContainer>
  );
}
