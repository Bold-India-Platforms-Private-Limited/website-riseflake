import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const Text = styled.div`
  margin-top: 6px;
  font-size: 11.5px;
  line-height: 1.45;
  color: #4b5563;

  p {
    margin: 0;
  }
`;

export default function AboutMe({ summary }: { summary?: string }) {
  if (!summary || summary === '<p><br></p>') return null;

  return (
    <Text>
      <HTMLRenderer htmlString={summary} />
    </Text>
  );
}
