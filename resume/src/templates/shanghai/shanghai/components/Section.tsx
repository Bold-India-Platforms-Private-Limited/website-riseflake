import React from 'react';
import styled from '@emotion/styled';

const Wrapper = styled.section`
  margin-top: 18px; /* 🔥 section separation */
`;

const Title = styled.div<{ color?: string }>`
  font-size: 12.5px;
  font-weight: 800;
  letter-spacing: 0.12em;
  margin-bottom: 6px; /* 🔥 gap after heading */
  color: ${(p) => p.color || '#111'};
`;

export default function Section({
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
      {children}
    </Wrapper>
  );
}
