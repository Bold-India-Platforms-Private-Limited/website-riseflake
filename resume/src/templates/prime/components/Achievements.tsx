import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const AchievementsWrapper = styled.div`
  .achievements-content {
    font-size: 11px;
    line-height: 1.35;
    color: #4b5563;
  }

  ul {
    list-style: none !important;
    padding: 0 !important;
    margin: 2px 0;
    display: flex;
    flex-direction: column;
    gap: 3px; /* 🔥 reduced from 4 */
  }

  li {
    position: relative;
    padding-left: 14px;
    list-style-type: none !important;
    margin-bottom: 0; /* 🔥 removed extra space */

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 4px; /* 🔥 moved up by 1px */
      width: 5px;
      height: 5px;
      background-color: #27345c;
      border-radius: 50%;
    }
  }

  strong,
  b {
    display: block;
    font-size: 11.5px;
    color: #1a1a1a;
    font-weight: 700;
    margin-bottom: 1px;
    line-height: 1.2;
  }

  p {
    margin: 0;
  }
`;

export default function Achievements({ data }: { data: string }) {
  if (!data || data.trim() === '' || data === '<p><br></p>') return null;

  return (
    <AchievementsWrapper>
      <div className="achievements-content">
        <HTMLRenderer htmlString={data} />
      </div>
    </AchievementsWrapper>
  );
}
