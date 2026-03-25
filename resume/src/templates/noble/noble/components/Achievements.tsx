import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const Wrap = styled.div`
  font-size: 12px;
  line-height: 1.35;
  color: #1f2937;

  p,
  li,
  ul,
  span,
  strong,
  b {
    color: #1f2937 !important;
  }

  ul {
    padding-left: 14px;
    margin: 0;
  }

  li {
    margin-bottom: 2px;

    &:last-child {
      margin-bottom: 0; /* ✅ end gap removed */
    }
  }
`;

export default function Achievements({ data }: { data: string }) {
  if (!data || data.trim() === '' || data === '<p><br></p>') return null;

  return (
    <Wrap>
      <HTMLRenderer htmlString={data} />
    </Wrap>
  );
}
