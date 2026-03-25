import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const Wrapper = styled.div`
  font-size: 11.5px;
  color: #4b5563;
  line-height: 1.5;

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    padding-left: 14px;
    position: relative;
    margin-bottom: 4px;

    &::before {
      content: '–';
      position: absolute;
      left: 0;
      color: #9ca3af;
    }
  }

  strong,
  b {
    font-weight: 700;
    color: #111;
  }

  p {
    margin: 0;
  }
`;

export default function Interests({ data }: { data: string }) {
  if (!data || data.trim() === '' || data === '<p><br></p>') return null;

  return (
    <Wrapper>
      <HTMLRenderer htmlString={data} />
    </Wrapper>
  );
}
