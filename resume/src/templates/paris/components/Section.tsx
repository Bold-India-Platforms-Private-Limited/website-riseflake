import styled from '@emotion/styled';
import React from 'react';

const Wrapper = styled.section`
  margin-bottom: 18px;
`;

const Title = styled.h2<{ color?: string }>`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin: 0 0 8px 0;
  color: ${(p) => p.color || '#000'};
`;

const Content = styled.div`
  color: inherit; /* 🔥 content will NOT take heading color */
`;

export function Section({
  title,
  titleColor,
  children,
}: {
  title: string;
  titleColor?: string;
  children: React.ReactNode;
}) {
  if (!children) return null;

  return (
    <Wrapper>
      <Title color={titleColor}>{title}</Title>
      <Content>{children}</Content>
    </Wrapper>
  );
}
