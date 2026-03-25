import React from 'react';
import styled from '@emotion/styled';
import { HTMLRenderer } from '@/helpers/common/components/HTMLRenderer';

interface InvolvementItem {
  name: string;
  summary: string;
}

const InvolvementContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const InvolvementEntry = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px dotted #ccc;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const Title = styled.h4`
  font-weight: 700;
  font-size: 12.5px;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SummaryWrapper = styled.div`
  font-size: 11px;
  color: #555;
  margin-top: 3px;
  line-height: 1.4;

  p {
    margin: 0;
  }
`;

export default function Involvement({ items = [] }: { items: InvolvementItem[] }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <InvolvementContainer>
      {items.map((item, i) => (
        <InvolvementEntry key={i}>
          <Title>{item.name}</Title>
          {item.summary && (
            <SummaryWrapper>
              <HTMLRenderer htmlString={item.summary} />
            </SummaryWrapper>
          )}
        </InvolvementEntry>
      ))}
    </InvolvementContainer>
  );
}
