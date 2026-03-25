import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const SummaryText = styled.div`
  font-size: 11.5px;
  line-height: 1.45;
  color: #4b5563;
  text-align: justify;

  p {
    margin: 0;
  }
`;

export default function AboutMe({ summary }: { summary: string }) {
  if (!summary || summary.trim() === '' || summary === '<p><br></p>') return null;

  return (
    <SummaryText>
      <HTMLRenderer htmlString={summary} />
    </SummaryText>
  );
}
