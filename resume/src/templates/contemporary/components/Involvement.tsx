import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const InvolvementWrapper = styled.div`
  .involvement-content {
    font-size: 11px;
    line-height: 1.4;
    color: #4b5563;
  }
  ul {
    list-style: none !important;
    padding: 0 !important;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  li {
    position: relative;
    padding-left: 15px;
    margin-bottom: 2px;
    list-style-type: none !important;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 4px;
      width: 6px;
      height: 6px;
      background-color: #27345c;
      border-radius: 50%;
    }
  }

  strong,
  b {
    display: block;
    font-size: 12px;
    color: #1a1a1a;
    font-weight: 700;
    margin-bottom: 1px;
    line-height: 1.2;
  }

  p {
    margin: 0;
  }
`;

export default function Involvement({ data }: { data: string }) {
  if (!data || data.trim() === '' || data === '<p><br></p>') return null;

  return (
    <InvolvementWrapper>
      <div className="involvement-content">
        <HTMLRenderer htmlString={data} />
      </div>
    </InvolvementWrapper>
  );
}
