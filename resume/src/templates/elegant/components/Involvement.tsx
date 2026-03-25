import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const Wrapper = styled.div`
  ul {
    list-style: none !important;
    padding: 0 !important;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 10px 30px;
  }

  li {
    position: relative;
    padding-left: 15px;
    font-size: 12px;
    color: #444;
    line-height: 1.4;

    &::before {
      content: '●';
      position: absolute;
      left: 0;
      top: 0;
      color: #ccc;
      font-size: 8px;
    }
  }

  p {
    margin: 0;
  }
`;

export default function Involvement({ data }: { data: string }) {
  if (!data || data.trim() === '') return null;
  return (
    <Wrapper>
      <HTMLRenderer htmlString={data} />
    </Wrapper>
  );
}
