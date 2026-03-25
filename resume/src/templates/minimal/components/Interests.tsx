import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';
import React from 'react';
import { FaRobot, FaUsers, FaTableTennis, FaPlane } from 'react-icons/fa';

const InterestsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InterestEntry = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;

  &:last-child {
    margin-bottom: 0;
  }
`;

const IconWrapper = styled.div`
  font-size: 12px;
  margin-top: 3px;
  /* Stays neutral font color, not the theme heading color */
  color: inherit;
  opacity: 0.7;
  flex-shrink: 0;
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h4`
  font-weight: 700;
  font-size: 11.5px;
  color: inherit;
  margin: 0;
  line-height: 1.2;
`;

const SummaryWrapper = styled.div`
  font-size: 10.5px;
  color: inherit;
  margin-top: 2px;
  line-height: 1.4;

  p {
    margin: 0;
  }

  /* Standard Minimal Template Bullet Protection */
  ul,
  ol {
    margin-left: 16px;
    margin-top: 4px;
    color: inherit;
  }

  li {
    margin-bottom: 2px;
    &::marker {
      color: inherit;
    }
  }
`;

export default function Interests({ items = [] }: { items: any[] }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  const icons = [
    <FaRobot key="robot" />,
    <FaUsers key="users" />,
    <FaTableTennis key="sports" />,
    <FaPlane key="travel" />,
  ];

  return (
    <InterestsContainer>
      {items.map((item, i) => (
        <InterestEntry key={i}>
          <IconWrapper>{icons[i % icons.length]}</IconWrapper>
          <ContentArea>
            <Title>{item.name || item.title || 'Interest'}</Title>
            {item.summary && item.summary !== '<p></p>' && (
              <SummaryWrapper>
                <HTMLRenderer htmlString={item.summary} />
              </SummaryWrapper>
            )}
          </ContentArea>
        </InterestEntry>
      ))}
    </InterestsContainer>
  );
}
