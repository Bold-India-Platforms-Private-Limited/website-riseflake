import React from 'react';
import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const AchievementsWrapper = styled.div`
  font-size: 11px; /* Matches executive sidebar density */
  color: #555;
  line-height: 1.4;

  ul {
    list-style-type: disc !important;
    padding-left: 18px !important;
    margin: 0 !important;
  }

  li {
    margin-bottom: 6px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  b,
  strong {
    color: #1a1a1a;
    font-weight: 700;
  }
`;

export default function Achievements({ data }: { data: string }) {
  if (!data || data === '<p><br></p>' || data.length < 5) return null;

  return (
    <AchievementsWrapper>
      <HTMLRenderer htmlString={data} />
    </AchievementsWrapper>
  );
}
