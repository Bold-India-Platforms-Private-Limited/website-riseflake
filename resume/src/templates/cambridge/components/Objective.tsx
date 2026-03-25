import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const Text = styled.div`
  font-size: 12px;
  line-height: 1.5;
  color: #374151;
`;

export default function Objective({ objective }: { objective: string }) {
  if (!objective || objective === '<p><br></p>') return null;

  return (
    <Text>
      <HTMLRenderer htmlString={objective} />
    </Text>
  );
}
