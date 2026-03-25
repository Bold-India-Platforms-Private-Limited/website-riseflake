import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const AchievementContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const AchievementItem = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;

  .achievement-content {
    font-size: 11px;
    line-height: 1.4;
    color: #444;

    strong,
    b {
      font-size: 12px;
      color: #27345c;
      font-weight: 700;
    }

    ul {
      list-style-type: disc;
      padding-left: 18px;
      margin: 0;
    }

    li {
      margin-bottom: 6px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    p {
      margin: 0;
    }
  }
`;

export default function Achievements({ data }: { data: string }) {
  if (!data || data.trim() === '' || data === '<p><br></p>') return null;

  return (
    <AchievementContainer>
      <AchievementItem>
        <div className="achievement-content">
          <HTMLRenderer htmlString={data} />
        </div>
      </AchievementItem>
    </AchievementContainer>
  );
}
