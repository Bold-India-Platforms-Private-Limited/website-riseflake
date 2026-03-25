import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';
import React from 'react';
import { FaRobot, FaUsers, FaTableTennis, FaPlane } from 'react-icons/fa';

const InterestsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const InterestEntry = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px dotted #ccc;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const IconWrapper = styled.div`
  font-size: 14px;
  margin-top: 3px;
  color: #27345c;
  flex-shrink: 0;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h4`
  font-weight: 700;
  font-size: 12.5px;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.2;
`;

const SummaryWrapper = styled.div`
  font-size: 11px;
  color: #555;
  margin-top: 2px;
  line-height: 1.4;

  p {
    margin: 0;
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
          <Content>
            <Title>{item.name || item.title || 'Interest'}</Title>
            <SummaryWrapper>
              <HTMLRenderer htmlString={item.summary} />
            </SummaryWrapper>
          </Content>
        </InterestEntry>
      ))}
    </InterestsContainer>
  );
}
