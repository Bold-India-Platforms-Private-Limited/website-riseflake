import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const AchievementsWrapper = styled.div`
  color: white;

  .achievements-content {
    font-size: 11px;
    line-height: 1.3;
    opacity: 0.9;
  }

  ul {
    list-style: none !important;
    padding: 0 !important;
    margin: 0;
  }

  li {
    position: relative;
    padding-left: 22px;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 0.5px solid rgba(255, 255, 255, 0.1);
    list-style-type: none !important;

    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    &::before {
      content: '🏆';
      position: absolute;
      left: 0;
      top: 0;
      font-size: 12px;
      filter: grayscale(100%) brightness(2);
    }
  }

  strong,
  b {
    display: block;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 2px;
    color: white;
    letter-spacing: 0.2px;
  }
`;

export default function Achievements({ data }: { data: string }) {
  if (!data || data.trim() === '') return null;

  return (
    <AchievementsWrapper>
      <div className="achievements-content">
        <HTMLRenderer htmlString={data} />
      </div>
    </AchievementsWrapper>
  );
}
