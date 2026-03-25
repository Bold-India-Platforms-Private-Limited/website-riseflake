import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

interface AboutMeProps {
  summary: string;
}

const SummaryWrapper = styled.div`
  line-height: 1.45;
  color: #374151;
  text-align: justify;
  p {
    margin: 0;
  }
`;

export default function AboutMe({ summary }: AboutMeProps) {
  if (!summary || summary === '<p><br></p>') return null;

  return (
    <SummaryWrapper>
      <HTMLRenderer htmlString={summary} />
    </SummaryWrapper>
  );
}
