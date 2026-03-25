import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const Wrapper = styled.div`
  font-size: 11.5px;
  color: #374151;

  ul {
    margin: 0;
    padding-left: 16px;
  }

  li {
    margin-bottom: 4px;
  }

  p {
    margin: 0;
  }
`;

export default function Involvement({ data }: { data: string }) {
  if (!data || data.trim() === '' || data === '<p><br></p>') return null;

  return (
    <Wrapper>
      <HTMLRenderer htmlString={data} />
    </Wrapper>
  );
}
