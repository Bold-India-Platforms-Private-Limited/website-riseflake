import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const Container = styled.div`
  font-size: 11.5px;
  color: #374151;
  line-height: 1.5;

  ul {
    padding-left: 18px;
    margin: 6px 0 0;
  }

  li {
    margin-bottom: 6px;
  }

  p {
    margin: 0;
  }
`;

export default function Achievements({ data }: { data: any }) {
  // 🔥 HARD GUARD
  if (typeof data !== 'string' || data.trim() === '' || data === '<p><br></p>') {
    return null;
  }

  return (
    <Container>
      <HTMLRenderer htmlString={data} />
    </Container>
  );
}
