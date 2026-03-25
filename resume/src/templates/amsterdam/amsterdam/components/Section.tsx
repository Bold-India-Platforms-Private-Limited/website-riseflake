import React from 'react';
import styled from '@emotion/styled';

const Wrapper = styled.section`
  margin-bottom: 8px; /* 🔽 reduced */
  break-inside: avoid; /* 🔥 print fix */
  page-break-inside: avoid; /* 🔥 print fix */

  &:last-child {
    margin-bottom: 0;
  }
`;

const Title = styled.h2<{ color?: string }>`
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin: 0;
  color: ${(p) => p.color || '#000'};
`;

const Line = styled.div<{ color?: string }>`
  height: 1px;
  width: 100%;
  margin: 4px 0 6px; /* 🔽 tighter */
  background: ${(p) => p.color || '#000'};
`;

export function Section({
  title,
  children,
  titleColor,
}: {
  title: string;
  children: React.ReactNode;
  titleColor?: string;
}) {
  if (!children) return null;

  return (
    <Wrapper>
      <Title color={titleColor}>{title}</Title>
      <Line color={titleColor} />
      {children}
    </Wrapper>
  );
}
