import styled from '@emotion/styled';
import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';

const Text = styled.div`
  font-size: 12px;
  line-height: 1.5;
  color: #111;

  p {
    margin: 0;
  }
`;

export default function AboutMe({ summary }: { summary: string }) {
  if (!summary || summary === '<p><br></p>') return null;
  return (
    <Text>
      <HTMLRenderer htmlString={summary} />
    </Text>
  );
}
