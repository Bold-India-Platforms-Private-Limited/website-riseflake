import React from 'react';
import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';
import styled from '@emotion/styled';

const InvolvementItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const InvolvementTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #1a3c7d;
  line-height: 1.2;
  margin: 0;
  text-transform: none;
`;

const SummaryWrapper = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 4px;
  line-height: 1.4;

  ul {
    list-style-type: disc;
    margin-left: 15px;
    margin-top: 5px;
  }
`;

export default function Involvement({ items = [] }: { items: any[] }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <div className="flex flex-col">
      {items.map((item, i) => (
        <InvolvementItemContainer key={i}>
          <InvolvementTitle>{item.name}</InvolvementTitle>
          {item.summary && (
            <SummaryWrapper>
              <HTMLRenderer htmlString={item.summary} />
            </SummaryWrapper>
          )}
        </InvolvementItemContainer>
      ))}
    </div>
  );
}
