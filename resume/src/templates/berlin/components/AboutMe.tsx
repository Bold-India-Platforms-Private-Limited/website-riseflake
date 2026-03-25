import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const SummaryWrapper = styled.div`
  font-size: 11.5px;
  line-height: 1.6;
  color: #4b5563;
  text-align: justify;

  p {
    margin: 0;
  }
`;

export default function AboutMe({ summary }: { summary: string }) {
  if (!summary || summary === '<p><br></p>') return null;

  return (
    <SummaryWrapper>
      <HTMLRenderer htmlString={summary} />
    </SummaryWrapper>
  );
}
