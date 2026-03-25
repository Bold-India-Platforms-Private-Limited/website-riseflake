import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const SummaryContainer = styled.div`
  margin-top: 2px;
`;

const SummaryText = styled.div`
  font-size: 11.5px; /* Slightly smaller to match minimal aesthetic */
  line-height: 1.5;
  /* color: inherit ensures it uses the fontColor from ResumeContainer */
  /* and doesn't turn green/pink like the headings */
  color: inherit;
  text-align: justify;

  p {
    margin: 0;
    margin-bottom: 6px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  /* Resetting potential nested list colors to ensure bullets stay neutral */
  ul,
  ol {
    color: inherit;
    margin-left: 18px;
  }

  li {
    margin-bottom: 4px;
    &::marker {
      color: inherit;
    }
  }
`;

export default function AboutMe({ summary }: { summary: string }) {
  if (!summary || summary.trim() === '' || summary === '<p></p>') return null;

  return (
    <SummaryContainer>
      <SummaryText>
        <HTMLRenderer htmlString={summary} />
      </SummaryText>
    </SummaryContainer>
  );
}
