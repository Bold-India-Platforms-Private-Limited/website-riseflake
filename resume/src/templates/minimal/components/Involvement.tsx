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
  gap: 12px;
`;

const InvolvementEntry = styled.div`
  display: flex;
  flex-direction: column;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Title = styled.h4`
  font-weight: 700;
  font-size: 11.5px;
  color: inherit;
  margin: 0;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const SummaryWrapper = styled.div`
  font-size: 10.5px;
  color: inherit;
  margin-top: 3px;
  line-height: 1.4;

  p {
    margin: 0;
  }

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

export default function Involvement({ items = [] }: { items: InvolvementItem[] }) {
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <InvolvementContainer>
      {items.map((item, i) => (
        <InvolvementEntry key={i}>
          <Title>{item.name}</Title>
          {item.summary && item.summary !== '<p></p>' && (
            <SummaryWrapper>
              <HTMLRenderer htmlString={item.summary} />
            </SummaryWrapper>
          )}
        </InvolvementEntry>
      ))}
    </InvolvementContainer>
  );
}
