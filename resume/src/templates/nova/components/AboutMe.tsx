import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const Text = styled.div`
  font-size: 11.5px;
  line-height: 1.45;
  color: #374151;
  margin-bottom: 10px;

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
