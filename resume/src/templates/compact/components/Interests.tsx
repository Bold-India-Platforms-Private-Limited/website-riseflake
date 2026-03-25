import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const InterestsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const InterestWrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;

  .interest-html-content {
    font-size: 11px;
    color: #555;
    line-height: 1.4;
    strong,
    b {
      display: block;
      font-size: 12px;
      color: #27345c;
      font-weight: 700;
      margin-bottom: 2px;
    }

    ul {
      list-style-type: disc;
      padding-left: 18px;
      margin: 0;
    }

    li {
      margin-bottom: 4px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    p {
      margin: 0;
    }
  }
`;

export default function Interests({ data }: { data: string }) {
  if (!data || data.trim() === '' || data === '<p><br></p>') return null;

  return (
    <InterestsContainer>
      <InterestWrapper>
        <div className="interest-html-content">
          <HTMLRenderer htmlString={data} />
        </div>
      </InterestWrapper>
    </InterestsContainer>
  );
}
