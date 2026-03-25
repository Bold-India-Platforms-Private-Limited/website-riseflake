import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const Text = styled.div`
  font-size: 12px;
  color: #374151;
`;

export default function Volunteering({ data }: { data: string }) {
  if (!data) return null;
  return (
    <Text>
      <HTMLRenderer htmlString={data} />
    </Text>
  );
}
