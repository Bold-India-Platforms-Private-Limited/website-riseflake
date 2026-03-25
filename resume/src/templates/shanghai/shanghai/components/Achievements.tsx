import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const Wrapper = styled.div`
  font-size: 11.5px;
  line-height: 1.45;
  color: #4b5563;

  ul {
    padding-left: 16px;
    margin: 2px 0 0;
  }

  li {
    margin-bottom: 2px;
  }
`;

export default function Achievements({ data }: { data: string }) {
  if (!data || data === '<p><br></p>') return null;

  return (
    <Wrapper>
      <HTMLRenderer htmlString={data} />
    </Wrapper>
  );
}
