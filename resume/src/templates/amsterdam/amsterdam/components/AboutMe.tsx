import styled from '@emotion/styled';
import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';

const Text = styled.div`
  font-size: 12px;
  line-height: 1.4;
  color: #1f2937;

  p {
    margin: 0;
  }
`;

export default function AboutMe({ summary }: { summary: string }) {
  if (!summary) return null;
  return (
    <Text>
      <HTMLRenderer htmlString={summary} />
    </Text>
  );
}
